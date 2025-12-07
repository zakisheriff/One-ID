-- One ID - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EMAIL ADDRESSES TABLE
-- ============================================
CREATE TABLE email_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT UNIQUE NOT NULL,
  mail_tm_id TEXT,
  mail_tm_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_email_addresses_address ON email_addresses(address);
CREATE INDEX idx_email_addresses_expires_at ON email_addresses(expires_at);
CREATE INDEX idx_email_addresses_deleted ON email_addresses(deleted) WHERE deleted = FALSE;

-- ============================================
-- EMAIL MESSAGES TABLE
-- ============================================
CREATE TABLE email_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT NOT NULL REFERENCES email_addresses(address) ON DELETE CASCADE,
  remote_id TEXT,
  from_address TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  text_body TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_messages_address ON email_messages(address);
CREATE INDEX idx_email_messages_timestamp ON email_messages(timestamp DESC);

-- ============================================
-- PHONE NUMBERS TABLE
-- ============================================
CREATE TABLE phone_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_phone_numbers_number ON phone_numbers(number);
CREATE INDEX idx_phone_numbers_deleted ON phone_numbers(deleted) WHERE deleted = FALSE;

-- ============================================
-- SMS MESSAGES TABLE
-- ============================================
CREATE TABLE sms_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT NOT NULL REFERENCES phone_numbers(number) ON DELETE CASCADE,
  from_sender TEXT NOT NULL,
  body TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_sms_messages_number ON sms_messages(number);
CREATE INDEX idx_sms_messages_timestamp ON sms_messages(timestamp DESC);

-- ============================================
-- VIRTUAL CARDS TABLE
-- ============================================
CREATE TABLE virtual_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_number TEXT NOT NULL,
  expiry TEXT NOT NULL,
  cvv TEXT NOT NULL,
  holder TEXT NOT NULL,
  card_limit DECIMAL DEFAULT 5000,
  locked BOOLEAN DEFAULT FALSE,
  stripe_id TEXT,
  is_real BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_virtual_cards_deleted ON virtual_cards(deleted) WHERE deleted = FALSE;

-- ============================================
-- CARD TRANSACTIONS TABLE
-- ============================================
CREATE TABLE card_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES virtual_cards(id) ON DELETE CASCADE,
  merchant TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'approved',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_card_transactions_card_id ON card_transactions(card_id);
CREATE INDEX idx_card_transactions_timestamp ON card_transactions(timestamp DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE email_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_transactions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for service role (backend API)
-- These policies allow the service role key to do anything
CREATE POLICY "Service role can do anything on email_addresses"
  ON email_addresses FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on email_messages"
  ON email_messages FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on phone_numbers"
  ON phone_numbers FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on sms_messages"
  ON sms_messages FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on virtual_cards"
  ON virtual_cards FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on card_transactions"
  ON card_transactions FOR ALL
  USING (auth.role() = 'service_role');

-- Allow anonymous users to read all data (for frontend)
-- This is safe because all data is temporary and not sensitive
CREATE POLICY "Anyone can read email_addresses"
  ON email_addresses FOR SELECT
  USING (deleted = FALSE);

CREATE POLICY "Anyone can read email_messages"
  ON email_messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read phone_numbers"
  ON phone_numbers FOR SELECT
  USING (deleted = FALSE);

CREATE POLICY "Anyone can read sms_messages"
  ON sms_messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read virtual_cards"
  ON virtual_cards FOR SELECT
  USING (deleted = FALSE);

CREATE POLICY "Anyone can read card_transactions"
  ON card_transactions FOR SELECT
  USING (true);

-- ============================================
-- CLEANUP FUNCTION
-- ============================================

-- Function to delete expired data
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Delete expired email addresses and their messages (cascade)
  DELETE FROM email_addresses
  WHERE expires_at < NOW() OR deleted = TRUE;

  -- Delete expired phone numbers and their messages (cascade)
  DELETE FROM phone_numbers
  WHERE expires_at < NOW() OR deleted = TRUE;

  -- Delete expired cards and their transactions (cascade)
  DELETE FROM virtual_cards
  WHERE expires_at < NOW() OR deleted = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- REALTIME SETUP
-- ============================================

-- Enable Realtime for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE email_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE sms_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE card_transactions;
