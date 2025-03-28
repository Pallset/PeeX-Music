const express = require('express');
const router = express.Router();
const spotify = require('../spotify');

router.get('/downloadspotify', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ status: false, error: 'URL Spotify tidak boleh kosong' });
    }
    try {
        const downloadInfo = await spotify.downloadSpotify(url);
        res.json({ status: true, result: downloadInfo });
    } catch (error) {
        console.error('Error saat mendownload Spotify track:', error);
        res.status(500).json({ status: false, error: error.message });
    }
});

module.exports = router;