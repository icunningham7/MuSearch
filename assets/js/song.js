// DOM Variables
let playerContainerEl = document.getElementById('song-player');
let lyricsContainerEl = document.getElementById('song-lyrics');
let lyricsEmbedEl = document.querySelector('.lyrics-embed');
let lyricsEmbedScriptEl = document.getElementById('lyrics-embed-script');

// --- LocalStorage: Start --- //
// get song details from localStorage
function getSong() {
    return JSON.parse(localStorage.getItem('song'));
}
// --- LocalStorage: End --- //


// --- APIs: Start --- //
function fetchSongPlaylist(playerId) {
    let songPlaylist = playerId;

    const sampledOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4a8cf8b268msh8770afef74aa77ep128dcdjsnd6101df11545',
            'X-RapidAPI-Host': 'spotify81.p.rapidapi.com'
        }
    };

    let songMetaDataAPI = `https://spotify81.p.rapidapi.com/seed_to_playlist?uri=spotify%3Atrack%3A${songPlaylist}`;

    return fetch(songMetaDataAPI, sampledOptions)
        .then(response => response.json())
        .then((data) => {
            console.log('data');
            console.log(data);
            let playlist = data.mediaItems[0].uri.split(':');
            let playlistId = playlist.pop() || playlist.pop();
            console.log(`added playlistId: ${playlistId}`);
            return playlistId;

        })
        .catch(err => console.log(err));

}
// --- APIs: End --- //



function displaySongLyrics(songId) {

    postscribe('#song-lyrics', `<div id='rg_embed_link_${songId}' class='rg_embed_link' data-song-id='${songId}'>Read more on Genius</div> <script crossorigin src='//genius.com/songs/${songId}/embed.js'><\/script>`);
}


function displaySongPlayer(playerId) {

    postscribe('#song-player', `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${playerId}?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`);

}

function displaySongVideo(songDetails) {
    let embedUrl = songDetails.videoId.replace('watch?v=', 'embed/');
    postscribe('#song-player', `<iframe width="560" height="315" src="${embedUrl}" title="${songDetails.song}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);

}

async function displaySongplaylist(playerId) {
    let playlistId = await fetchSongPlaylist(playerId);
    console.log('playlistID');
    console.log(playlistId);
    postscribe('#song-player', `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`);

}

// --- Display Song Page: Start --- //
function displaySongDetails() {
    let songDetails = getSong();

    if (!songDetails.songId) {
        console.log('There was an issue getting the song data');
        return; //ToDo: add some error catching functionality
    }

    if (songDetails.playerId) {
        displaySongPlayer(songDetails.playerId);
        displaySongplaylist(songDetails.playerId);

    } else if (songDetails.videoId) {
        displaySongVideo(songDetails);
    }
    displaySongLyrics(songDetails.songId);
}


// --- Display Song Page: End --- //


displaySongDetails();