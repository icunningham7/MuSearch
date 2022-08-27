// DOM Variables
let resultListEl = document.getElementById('results-list');
let searchEl = document.getElementById('search');
let searchFormEl = document.getElementById('search-form');
// let searchBtnEl = document.getElementById('search-button');

var count = 5;

// --- Form Search Event: Start --- //
function searchForMusic(event) {
    event.preventDefault();
    let searchText = searchEl.value.trim();
    if (searchText.length > 0) {
        getSearchResults(searchText)
            .then((list) => {
                console.log('race condition');
                console.log(list);
            })

    }
}
// --- Form Search Event: End --- //

// --- Search Results Controller
async function getSearchResults(search) {

    let searchResults = await fetchSongSearchResults(search)

    displaySongSearchResults(searchResults);


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


async function fetchSongMetaData(songId) {
    let songMetaData = {};

    const songOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4a8cf8b268msh8770afef74aa77ep128dcdjsnd6101df11545',
            'X-RapidAPI-Host': 'genius.p.rapidapi.com'
        }
    };

    let songMetaDataAPI = `https://genius.p.rapidapi.com/songs/${songId}`;

    return await fetch(songMetaDataAPI, songOptions)
        .then(response => response.json())
        .then(data => data.response.song)
        .then((results) => {
            songMetaData.embed = results.embed_content;
            let mediaList = results.media;
            console.log(mediaList);
            for (let mediaItem of mediaList) {
                if (mediaItem.provider.toLowerCase() === 'spotify') {
                    console.log(mediaItem.url);
                    let mediaUrl = mediaItem.url.split('/');
                    let playerSongId = mediaUrl.pop() || mediaUrl.pop();
                    songMetaData.playerId = playerSongId;
                    console.log(`added playerSongId: ${songMetaData.playerId}`);
                    return songMetaData;
                }
            }
            console.log(`No Spotify Id Found for ${results.full_title}`);
            return songMetaData;
        })
        .catch(err => console.log(err));
    
}
// --- APIs: End --- //



// --- Display Results: Start --- //
function displaySongSearchResults(results) {
    console.log('indisplay');
    resultListEl.textContent = '';

    results.forEach(buildSearchCard);

}


function buildSearchCard(result) {
    let songId = result.result.id;
    fetchSongMetaData(songId).then((playerMetaData) => {
        console.log('PMD');
        console.log(playerMetaData);
        let playerId = playerMetaData.playerId;

        console.log(`${playerId}`);

        let resultEl = document.createElement('div');
        let albumEl = document.createElement('img');
        let artistEl = document.createElement('h3');
        let songEl = document.createElement('p');

        resultEl.classList.add('result-card');
        resultEl.setAttribute('data-song-id', result.result.id);
        resultEl.setAttribute('data-song', result.result.title_with_featured);
        resultEl.setAttribute('data-artist-id', result.result.primary_artist.id);
        resultEl.setAttribute('data-artist', result.result.primary_artist.name);
        resultEl.setAttribute('data-player-id', playerId);


        albumEl.setAttribute('src', result.result.song_art_image_thumbnail_url);
        artistEl.innerText = result.result.artist_names;
        songEl.innerText = result.result.title_with_featured;

        resultEl.appendChild(albumEl);
        resultEl.appendChild(artistEl);
        resultEl.appendChild(songEl);
        resultListEl.appendChild(resultEl);

        resultListEl.addEventListener('click', setSong);
    })
}
// --- Display Results: End --- //


// --- LocalStorage: Start --- //
// save song details for use on the lyrics page
function setSong(event) {

    let songDetails = {
        artist: event.target.closest('.result-card').dataset.artist,
        artistId: event.target.closest('.result-card').dataset.artistId,
        song: event.target.closest('.result-card').dataset.song,
        songId: event.target.closest('.result-card').dataset.songId,
        playerId: event.target.closest('.result-card').dataset.playerId,
        
    }

    localStorage.setItem('song', JSON.stringify(songDetails));
    window.location.assign('./results.html');

}
// --- LocalStorage: End --- //



searchFormEl.addEventListener('submit', searchForMusic)
// searchBtnEl.addEventListener('click', searchForMusic)

