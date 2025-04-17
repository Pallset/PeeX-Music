const axios = require("axios");

const client_id = "acc6302297e040aeb6e4ac1fbdfd62c3";
const client_secret = "0e8439a1280a43aba9a5bc0a16f3f009";
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const BASEURL = "https://api.fabdl.com";

async function spotifyCreds() {
    try {
        const response = await axios.post(
            TOKEN_ENDPOINT,
            "grant_type=client_credentials", {
                headers: {
                    Authorization: "Basic " + basic,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            },
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Failed to retrieve Spotify credentials:", error.message);
        throw new Error("Failed to retrieve Spotify credentials.");
    }
}

const toTime = (ms) => {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
};

async function searchSpotify(query, type = "track", limit = 10) {
    if (!query) throw new Error("Query is required");

    try {
        const token = await spotifyCreds();
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&offset=0&limit=${limit}`;

        const response = await axios.get(searchUrl, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        if (!response.data[type + "s"] || !response.data[type + "s"].items.length) {
            return [];
        }

        return response.data[type + "s"].items.map((item) => ({
            title: item.name,
            id: item.id,
            duration: toTime(item.duration_ms),
            artist: item.artists.map((artist) => artist.name).join(" & "),
            url: item.external_urls.spotify,
            cover: item.album.images[0]?.url || null,
            preview_url: item.preview_url
        }));
    } catch (error) {
        console.error("Error searching for music:", error.response ? error.response.data : error.message);
        throw new Error("Error searching for music: " + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
}

async function downloadSpotify(url) {
    if (!url) throw new Error("URL is required");

    try {
        const { data: info } = await axios.get(`${BASEURL}/spotify/get?url=${url}`);
        const { gid, id, name, image, duration_ms } = info.result;

        const { data: download } = await axios.get(`${BASEURL}/spotify/mp3-convert-task/${gid}/${id}`);

        if (download.result.download_url) {
            return {
                title: name,
                duration: toTime(duration_ms),
                cover: image,
                download: `${BASEURL}${download.result.download_url}`,
            };
        }

        throw new Error("Download URL not found");
    } catch (error) {
        console.error("Error downloading Spotify track:", error.response ? error.response.data : error.message);
        throw new Error("Error downloading Spotify track: " + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
}

module.exports = { searchSpotify, downloadSpotify };
