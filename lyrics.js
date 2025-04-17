const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeLyrics(band, song) {
    if (!song) return "Lagu tidak boleh kosong!";

    band = band.toLowerCase().replace(/\s+/g, '');
    song = song.toLowerCase().replace(/\s+/g, '');
    const url = `https://www.azlyrics.com/lyrics/${band}/${song}.html`;

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Referer': 'https://www.azlyrics.com/',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Connection': 'keep-alive'
            }
        });

        const $ = cheerio.load(data);
        const lyrics = $('.col-xs-12.col-lg-8.text-center > div:not([class])').eq(0).text().trim();

        if (!lyrics) return "Lirik tidak ditemukan!";
        return lyrics;
    } catch (error) {
        if (error.response?.status === 404) return "Lirik tidak ditemukan!";
        return "Gagal mengambil lirik! Periksa nama band & lagu.";
    }
}

module.exports = {
    scrapeLyrics
};
