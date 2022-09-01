// DOM Variables
let resultListEl = document.getElementById('search-results');
let searchEl = document.getElementById('search');
let searchFormEl = document.getElementById('search-form');

let isSearching = false;
var count = 5;

// --- Form Search Event: Start --- //
function searchForMusic(event) {
    event.preventDefault();

    if (isSearching) {

        return;
    }

    isSearching = true;


    let searchText = searchEl.value.trim();
    if (searchText.length > 0) {
        getSearchResults(searchText)
            .then(() => {
                isSearching = false;
            })

    }
}
// --- Form Search Event: End --- //

// --- Search Results Controller --- //
async function getSearchResults(search) {

    let searchResults = await fetchSongSearchResults(search)

    await displaySongSearchResults(searchResults);



    return searchResults;
}

// --- APIs: Start --- //
function fetchSongSearchResults(search) {

    let q = encodeURIComponent(search);
    const lyricOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4a8cf8b268msh8770afef74aa77ep128dcdjsnd6101df11545',
            'X-RapidAPI-Host': 'genius.p.rapidapi.com'
        }
    };

    let lyricsSearchAPI = `https://genius.p.rapidapi.com/search?q=${q}&page=1&per_page=${count}`;


    return fetch(lyricsSearchAPI, lyricOptions)
        .then(response => response.json())
        .then(data => data.response.hits)
        .catch(err => console.log(err));
}


function fetchSongMetaData(songId) {
    let songMetaData = {};

    const songOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4a8cf8b268msh8770afef74aa77ep128dcdjsnd6101df11545',
            'X-RapidAPI-Host': 'genius.p.rapidapi.com'
        }
    };

    let songMetaDataAPI = `https://genius.p.rapidapi.com/songs/${songId}`;

    return fetch(songMetaDataAPI, songOptions)
        .then(response => response.json())
        .then(data => data.response.song)
        .then((results) => {
            songMetaData.embed = results.embed_content;
            let mediaList = results.media;
            for (let mediaItem of mediaList) {
                if (mediaItem.provider.toLowerCase() === 'spotify') {
                    let mediaUrl = mediaItem.url.split('/');
                    let playerSongId = mediaUrl.pop() || mediaUrl.pop();
                    songMetaData.playerId = playerSongId;
                    return songMetaData;
                } else if ((mediaItem.provider.toLowerCase() === 'youtube')) {
                    songMetaData.videoId = mediaItem.url;

                }
            }
            return songMetaData;
        })
        .catch(err => console.log(err));
}
// --- APIs: End --- //

// --- Display Results: Start --- //
function displaySongSearchResults(results) {
    resultListEl.textContent = '';

    return Promise.all(results.map((result) => buildSearchCard(result)));
}


function buildSearchCard(result) {
    let songId = result.result.id;
    return fetchSongMetaData(songId).then((playerMetaData) => {
        let playerId = playerMetaData.playerId;
        let videoId = playerMetaData.videoId;

        let resultEl = document.createElement('div');
        let albumEl = document.createElement('img');
        let artistWrapperEl = document.createElement('div');
        let artistEl = document.createElement('h3');
        let songWrapperEl = document.createElement('div');
        let songEl = document.createElement('h5');

        let playBtnEl = document.createElement('button');
        let playBtnImgEl = document.createElement('img');

        artistWrapperEl.classList.add("artist");
        songWrapperEl.classList.add('song')
        resultEl.classList.add('card', 'result-card', 'flex-container');
        resultEl.setAttribute('data-song-id', result.result.id);
        resultEl.setAttribute('data-song', result.result.title_with_featured);
        resultEl.setAttribute('data-artist-id', result.result.primary_artist.id);
        resultEl.setAttribute('data-artist', result.result.primary_artist.name);
        if (playerId) {
            resultEl.setAttribute('data-player-id', playerId);
        }
        if (videoId) {
            resultEl.setAttribute('data-video-id', videoId);
        }

        albumEl.classList.add('album-cover')
        albumEl.setAttribute('src', result.result.song_art_image_thumbnail_url);
        artistEl.innerText = result.result.artist_names;
        songEl.innerText = result.result.title_with_featured;

        playBtnEl.classList.add('play-button');
        playBtnImgEl.setAttribute('src', './assets/images/Play Button.png')

        resultEl.appendChild(albumEl);
        artistWrapperEl.appendChild(artistEl);
        songWrapperEl.appendChild(songEl);
        resultEl.appendChild(artistWrapperEl);
        resultEl.appendChild(songWrapperEl);
        resultEl.appendChild(playBtnEl);
        playBtnEl.appendChild(playBtnImgEl);
        resultListEl.appendChild(resultEl);

        resultListEl.addEventListener('click', setSong);
    })
}
// --- Display Results: End --- //


// --- LocalStorage: Start --- //
// save song details for use on the lyrics page
function setSong(event) {
    event.preventDefault();

    let songDetails = {
        artist: event.target.closest('.result-card').dataset.artist,
        artistId: event.target.closest('.result-card').dataset.artistId,
        song: event.target.closest('.result-card').dataset.song,
        songId: event.target.closest('.result-card').dataset.songId,

    }

    if (event.target.closest('.result-card').dataset.playerId) {
        songDetails.playerId = event.target.closest('.result-card').dataset.playerId;
    }
    if (event.target.closest('.result-card').dataset.videoId) {
        songDetails.videoId = event.target.closest('.result-card').dataset.videoId;
    }
    localStorage.setItem('song', JSON.stringify(songDetails));
    window.location.assign('./results.html');

}
// --- LocalStorage: End --- //



searchFormEl.addEventListener('submit', searchForMusic)
// searchBtnEl.addEventListener('click', searchForMusic)

