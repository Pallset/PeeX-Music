const express = require('express');
const path = require('path');
const spotifyRoutes = require('./routes/spotify');
const downloadRoutes = require('./routes/download');
const lyricsScraper = require('./lyrics');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', spotifyRoutes);
app.use('/api', downloadRoutes);

app.get('/api/lyrics', async (req, res) => {
    const { song, band } = req.query;

    if (!song) {
        return res.status(400).json({ status: false, message: "Parameter 'song' wajib diisi!" });
    }

    console.log("Mencari lirik untuk:");
    console.log("Band:", band || "unknown");
    console.log("Song:", song);

    try {
        const lyrics = await lyricsScraper.scrapeLyrics(band, song);
        res.json({ status: true, lyrics: lyrics });
    } catch (error) {
        console.error('Gagal mencari lirik:', error);
        res.status(500).json({ status: false, message: 'Gagal mengambil lirik.' });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
