// Vercel Serverless Function - Cleanup Cron Job
const { getSupabaseClient } = require('../_lib/supabase');

module.exports = async (req, res) => {
    // Verify this is a cron request (optional security)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const supabase = getSupabaseClient();

        // Call the cleanup function
        const { error } = await supabase.rpc('cleanup_expired_data');

        if (error) {
            console.error('[Cleanup] Error:', error);
            return res.status(500).json({ error: error.message });
        }

        console.log('[Cleanup] Successfully cleaned up expired data');
        return res.status(200).json({ success: true, message: 'Cleanup completed' });
    } catch (error) {
        console.error('[Cleanup] Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
