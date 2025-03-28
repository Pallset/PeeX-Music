const animasiTeksElement = document.querySelector('.animasi-teks');
const teksAnimasi = "PeeX - Music";
let indexTeks = 0;
let intervalTeks;

function ketikTeks() {
    animasiTeksElement.textContent = teksAnimasi.substring(0, indexTeks);
    indexTeks++;
    if (indexTeks > teksAnimasi.length) {
        clearInterval(intervalTeks);
        setTimeout(() => {
            indexTeks = 0;
            setTimeout(mulaiAnimasiTeks, 4000);
        }, 0);
    }
}

function mulaiAnimasiTeks() {
    animasiTeksElement.classList.add('typing-effect');
    intervalTeks = setInterval(ketikTeks, 100);
}

function resetAnimasiTeks() {
    clearInterval(intervalTeks);
    animasiTeksElement.textContent = '';
    animasiTeksElement.classList.remove('typing-effect');
    indexTeks = 0;
    setTimeout(mulaiAnimasiTeks, 100);
setTimeout(mulaiAnimasiTeks, 1000); 

const dokumentasiSection = document.getElementById('dokumentasi');
const tryNowSection = document.getElementById('try-now');
const tryNowButton = document.getElementById('try-now-button');
const searchMusicSection = document.getElementById('search-music');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const nowPlayingPopup = document.getElementById('now-playing-popup');
const nowPlayingText = document.getElementById('now-playing-text');
const musicPlayerSection = document.getElementById('music-player');
const audioPlayer = document.getElementById('audio-player');
const playerThumbnail = document.getElementById('player-thumbnail');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerDuration = document.getElementById('player-duration');
const lyricsButton = document.getElementById('lyrics-button');
const lyricsContainer = document.getElementById('lyrics-container');
const lyricsTitle = document.getElementById('lyrics-title');
const lyricsContent = document.getElementById('lyrics-content');
const playPauseButton = document.getElementById('play-pause-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const currentTimeDisplay = document.getElementById('current-time-display');

let currentTrackUrl = null;
let isPlaying = false;
let searchResultsArray = [];
let currentTrackIndex = -1;
let currentTrackInfo = null;

console.log('tryNowButton element:', tryNowButton);

if (tryNowButton) {
    tryNowButton.addEventListener('click', () => {
        console.log('Tombol Try Now diklik!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            if (tryNowSection) {
                tryNowSection.classList.add('hidden');
                console.log('tryNowSection disembunyikan.');
            } else {
                console.error('tryNowSection tidak ditemukan!');
            }
            if (searchMusicSection) {
                searchMusicSection.classList.remove('hidden');
                searchInput.focus();
                console.log('searchMusicSection ditampilkan dan input difokuskan.');
            } else {
                console.error('searchMusicSection tidak ditemukan!');
            }
        }, 500);
    });
} else {
    console.error('Tombol Try Now tidak ditemukan!');
}

searchInput.addEventListener('input', async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        try {
            const response = await fetch(`/api/spotifysearch?q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();

            searchResults.innerHTML = '';
            searchResultsArray = [];
            currentTrackIndex = -1;

            if (data.status && data.results && data.results.length > 0) {
                searchResultsArray = data.results;
                data.results.forEach((result, index) => {
                    const item = document.createElement('div');
                    item.classList.add('search-item');
                    const img = document.createElement('img');
                    img.src = result.cover;
                    img.alt = result.title;
                    img.onerror = () => {
                        img.src = 'placeholder-image.png';
                    };
                    const info = document.createElement('div');
                    info.innerHTML = `<h3>${result.title}</h3><p>${result.artist}</p><p>${result.duration}</p>`;
                    item.appendChild(img);
                    item.appendChild(info);
                    item.addEventListener('click', () => {
                        downloadAndPlaySong(result, index);
                    });
                    searchResults.appendChild(item);
                });
            } else {
                searchResults.innerHTML = '<p>Tidak ada hasil ditemukan.</p>';
            }
        } catch (error) {
            console.error('Gagal melakukan pencarian:', error);
            searchResults.innerHTML = '<p>Terjadi kesalahan saat mencari musik.</p>';
        }
    } else {
        searchResults.innerHTML = '';
    }
});

async function downloadAndPlaySong(track, index) {
    currentTrackIndex = index;
    currentTrackInfo = track;
    nowPlayingText.textContent = `Memuat Lagu ${track.title}...`;
    nowPlayingPopup.classList.remove('hidden');

    try {
        const downloadResponse = await fetch(`/api/downloadspotify?url=${encodeURIComponent(track.url)}`);
        const downloadData = await downloadResponse.json();

        nowPlayingPopup.classList.add('hidden');

        if (downloadData.status && downloadData.result && downloadData.result.download) {
            nowPlayingText.textContent = `Lagu ${track.title} Siap Segera Putar Sekarang`;
            nowPlayingPopup.classList.remove('hidden');
            setTimeout(() => {
                playSong(downloadData.result.title, downloadData.result.artist, downloadData.result.cover, downloadData.result.duration, downloadData.result.download, track);
            }, 2000);
        } else {
            console.error("Gagal memuat:", downloadData);
            alert("Gagal memutar lagu.");
        }
    } catch (error) {
        console.error("Error saat mengunduh dan memutar lagu:", error);
        alert("Terjadi kesalahan saat memutar lagu.");
    }
}

function playSong(title, artist, thumbnail, duration, url, trackInfo) {
    playerTitle.textContent = title;
    playerArtist.textContent = artist;
    playerThumbnail.src = thumbnail;
    playerThumbnail.alt = title;
    playerDuration.textContent = duration;
    audioPlayer.src = url;
    currentTrackUrl = url;
    audioPlayer.play();
    isPlaying = true;
    playPauseButton.textContent = '▐▐';
    searchMusicSection.classList.add('hidden');
    musicPlayerSection.classList.remove('hidden');

    currentTrackInfo = trackInfo;
    console.log('Lagu diputar:', title, 'oleh', artist, 'Info lengkap (di playSong):', currentTrackInfo);
}

playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseButton.textContent = '[  ▶︎ ]';
        isPlaying = false;
    } else {
        audioPlayer.play();
        playPauseButton.textContent = '▐▐';
        isPlaying = true;
    }
});

prevButton.addEventListener('click', () => {
    if (currentTrackIndex > 0 && searchResultsArray.length > 0) {
        currentTrackIndex--;
        downloadAndPlaySong(searchResultsArray[currentTrackIndex], currentTrackIndex);
    } else {
        alert('Tidak ada lagu sebelumnya.');
    }
});

nextButton.addEventListener('click', () => {
    if (currentTrackIndex < searchResultsArray.length - 1 && searchResultsArray.length > 0) {
        currentTrackIndex++;
        downloadAndPlaySong(searchResultsArray[currentTrackIndex], currentTrackIndex);
    } else {
        alert('Tidak ada lagu selanjutnya.');
    }
});

audioPlayer.addEventListener('timeupdate', () => {
    if (isPlaying) {
        const currentTime = formatTime(audioPlayer.currentTime);
        currentTimeDisplay.textContent = currentTime;
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

lyricsButton.addEventListener('click', async () => {
    console.log('Tombol See Lyrics diklik. currentTrackInfo (di lyricsButton):', currentTrackInfo);

    if (currentTrackInfo && currentTrackInfo.title && currentTrackInfo.artist) {
        const songTitle = currentTrackInfo.title;
        const artistName = currentTrackInfo.artist;
        const lyricsUrl = `/api/lyrics?song=${encodeURIComponent(songTitle)}&band=${encodeURIComponent(artistName)}`;
        console.log('URL permintaan lirik:', lyricsUrl);

        try {
            const response = await fetch(lyricsUrl);
            const data = await response.json();
            console.log('Respons dari API lirik:', data);

            if (data.status && data.lyrics) {
                lyricsTitle.textContent = `${songTitle} - ${artistName}`;
                lyricsContent.textContent = data.lyrics;
                lyricsContainer.classList.remove('hidden');
                lyricsContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                lyricsTitle.textContent = 'Lirik Tidak Ditemukan';
                lyricsContent.textContent = data.message || 'Maaf, lirik untuk lagu ini tidak ditemukan.';
                lyricsContainer.classList.remove('hidden');
                lyricsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Gagal mengambil lirik:', error);
            lyricsTitle.textContent = 'Gagal Mengambil Lirik';
            lyricsContent.textContent = 'Terjadi kesalahan saat mengambil lirik.';
            lyricsContainer.classList.remove('hidden');
            lyricsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        alert('Tidak ada lagu yang sedang diputar.');
    }
});

window.addEventListener('scroll', () => {
    const dokumentasiTop = dokumentasiSection.offsetTop;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    if (scrollY > dokumentasiTop - windowHeight + 200) {
        dokumentasiSection.classList.add('fade-in');
    }

    const tryNowTop = tryNowSection.offsetTop;
    if (scrollY > tryNowTop - windowHeight + 200) {
        tryNowSection.classList.add('fade-in');
    }
});