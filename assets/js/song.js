// DOM Variables
let playerContainerEl = document.getElementById('song-player');
let lyricsContainerEl = document.getElementById('song-lyrics');
let lyricsEmbedEl = document.querySelector('.lyrics-embed');
let lyricsEmbedScriptEl = document.getElementById('lyrics-embed-script');

console.log('embed');
console.log(playerContainerEl);
console.log(lyricsContainerEl);
console.log(lyricsEmbedEl);


// --- LocalStorage: Start --- //
// get song details from localStorage
function getSong() {
    console.log('getSong');
    return JSON.parse(localStorage.getItem('song'));
}
 // --- LocalStorage: End --- //


function displaySongLyricsData(songId) {

    postscribe('#song-lyrics', `<div id='rg_embed_link_${songId}' class='rg_embed_link' data-song-id='${songId}'>Read more on Genius</div> <script crossorigin src='//genius.com/songs/${songId}/embed.js'><\/script>`);  
}


function displaySongPlayerData(songData) {
   
    postscribe('#song-player', `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${songData}?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`);  

}

 // --- Display Song Page: Start --- //
function displaySongDetails() {
    console.log('displayingSongDetails');
    let songDetails = getSong();
    if ( songDetails.playerId) {
        displaySongPlayerData(songDetails.playerId);

    }
    if (songDetails.songId) {
        displaySongLyricsData(songDetails.songId);

    }
    if (!songDetails.playerId && !songDetails.songId) {
        console.log('There was an issue getting the song data');
    }
        
 }


 // --- Display Song Page: End --- //


displaySongDetails();