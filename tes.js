const { searchLyrics } = require('./lyrics');

(async () => {
    const lyrics = await searchLyrics("Serana");
    console.log(lyrics);
})();
