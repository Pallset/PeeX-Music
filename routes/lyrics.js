const express = require('express');
const router = express.Router();
const { getLyrics } = require('../multy');
const { scrapeLyrics } = require('../azlyrics');

router.get('/', async (req, res) => {
    const song = req.query.song;
    const band = req.query.band || 'unknown';

    if (!song) {
        return res.json({ status: false, error: 'Judul lagu wajib diisi.' });
    }

    try {
        const multyResult = await getLyrics(song);
        if (multyResult && multyResult.lyrics) {
            return res.json({
                status: true,
                source: 'multy',
                lyrics: multyResult.lyrics,
                title: multyResult.title
            });
        }
    } catch (err) {
        console.log('[Multy Error]', err.message);
    }

    try {
        const azLyrics = await scrapeLyrics(band, song);
        if (azLyrics && typeof azLyrics === 'string' && !azLyrics.toLowerCase().includes('tidak ditemukan')) {
            return res.json({
                status: true,
                source: 'azlyrics',
                lyrics: azLyrics,
                title: song
            });
        }

        return res.json({ status: false, error: 'Lirik tidak ditemukan di kedua sumber.' });
    } catch (err) {
        return res.json({ status: false, error: 'Gagal ambil lirik AZLyrics: ' + err.message });
    }
});

module.exports = router;
