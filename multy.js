const axios = require('axios');

async function getLyrics(title) {
    try {
        const response = await axios.post(
            'https://multiy.web.id/lyrics/search',
            { judul: title },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Origin': 'https://multiy.web.id',
                    'Referer': 'https://multiy.web.id/lyrics',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            }
        );

        const result = response.data;

        if (result?.hasilLirik?.lyrics) {
            return {
                title: title,
                lyrics: result.hasilLirik.lyrics.trim(),
                source: result.hasilLirik.source || null
            };
        } else {
            throw new Error("Lirik tidak ditemukan atau format respons salah.");
        }
    } catch (err) {
        throw new Error('Gagal ambil lirik Multy: ' + err.message);
    }
}

module.exports = {
    getLyrics
};
