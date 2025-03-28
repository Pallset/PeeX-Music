const express = require('express');
const router = express.Router();
const lyricsScraper = require('../lyrics');

router.get('/lyrics', async (req, res) => {
    const { band, song } = req.query;
    if (!band || !song) {
        return res.status(400).json({ error: 'Nama band dan lagu harus diberikan' });
    }
    try {
        const lyrics = await lyricsScraper.scrapeLyrics(band, song);
        res.json({ status: true, lyrics });
    } catch (error) {
        console.error('Error scraping lyrics:', error);
        res.status(500).json({ status: false, error: error.message });
    }
});

module.exports = router;