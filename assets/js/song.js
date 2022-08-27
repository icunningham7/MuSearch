// DOM Variables
let playerContainerEl = document.getElementById('song-player');
let lyricsContainerEl = document.getElementById('song-lyrics');
let lyricsEmbedEl = document.querySelector('.lyrics-embed');
let lyricsEmbedScriptEl = document.getElementById('lyrics-embed-script');

// --- LocalStorage: Start --- //
// get song details from localStorage
function getSong() {
    console.log('getSong');
    return JSON.parse(localStorage.getItem('song'));
}
// --- LocalStorage: End --- //


// --- APIs: Start --- //
function fetchSongSamples(songDetails) {
    let a = encodeURIComponent(songDetails.artist);
    let s = encodeURIComponent(songDetails.song);

    const sampledOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4a8cf8b268msh8770afef74aa77ep128dcdjsnd6101df11545',
            'X-RapidAPI-Host': 'whosampled-api.p.rapidapi.com'
        }
    };

    let songMetaDataAPI = `https://whosampled-api.p.rapidapi.com/${a}/${s}/samples`;

    return fetch(songMetaDataAPI, sampledOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            return data;
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
    console.log(embedUrl);
    postscribe('#song-player', `<iframe width="560" height="315" src="${embedUrl}" title="${songDetails.song}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);

}

// --- Display Song Page: Start --- //
function displaySongDetails() {
    let songDetails = getSong();
    console.log(songDetails);

    if (!songDetails.songId) {
        console.log('There was an issue getting the song data');
        return; //ToDo: add some error catching functionality
    }

    if (songDetails.playerId) {
        displaySongPlayer(songDetails.playerId);

    } else if (songDetails.videoId) {
        displaySongVideo(songDetails);
    }
    displaySongLyrics(songDetails.songId);

    fetchSongSamples(songDetails);
}


// --- Display Song Page: End --- //


displaySongDetails();