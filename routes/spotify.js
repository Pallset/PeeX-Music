const express = require('express');
const router = express.Router();
const spotify = require('../spotify');

router.get('/spotifysearch', async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ status: false, error: 'Query tidak boleh kosong' });
    }
    try {
        const results = await spotify.searchSpotify(q);
        res.json({ status: true, results });
    } catch (error) {
        console.error('Error searching Spotify:', error);
        res.status(500).json({ status: false, error: error.message });
    }
});

module.exports = router;