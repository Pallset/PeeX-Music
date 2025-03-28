const axios = require('axios');
const cheerio = require('cheerio');

async function searchLyrics(query) {
    const searchUrl = `https://search.azlyrics.com/search.php?q=${encodeURIComponent(query)}`;

    try {
        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Referer': 'https://www.azlyrics.com/',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Connection': 'keep-alive'
            }
        });

        const $ = cheerio.load(data);
        const firstResult = $('td.text-left a').first().attr('href');

        if (!firstResult) {
            return "Lirik tidak ditemukan!";
        }

        return scrapeLyrics(firstResult);
    } catch (error) {
        return "Gagal mencari lirik! Coba lagi.";
    }
}

async function scrapeLyrics(url) {
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

        return lyrics || "Lirik tidak ditemukan!";
    } catch (error) {
        return "Gagal mengambil lirik! Coba lagi.";
    }
}

module.exports = {
    searchLyrics
};
