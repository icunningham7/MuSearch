// DOM Variables
let resultListEl = document.getElementById('results-list');
let searchEl = document.getElementById('search');
let searchFormEl = document.getElementById('search-form');
let searchBtnEl = document.getElementById('search-button');

var count = 5;


function searchForMusic(event) {
    event.preventDefault();
    let searchText = searchEl.value.trim();
    if (searchText.length > 0) {
        fetchLyricsSearchResults(searchText);
        // fetchSongSearchResults(searchText);

    }
}

function fetchSongSearchResults(search) {

    console.log('in fetchSongSearchResults');

    let s = encodeURIComponent(search);
    const songOptions = {
        method: 'Get',
        headers: {
            'X-RapidAPI-Key': '4a8cf8b268msh8770afef74aa77ep128dcdjsnd6101df11545',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    let songSearchAPI = `https://spotify23.p.rapidapi.com/search/?q=${s}&type=multi&offset=${count}&limit=${count}`;

    fetch(songSearchAPI, songOptions)
        .then(response => response.json())
        .then(data => data)
        .then((results) => {
            console.log(results);
            displayLyricsSearchResults(results)
        })
        .catch(err => console.log(err));

}


function fetchLyricsSearchResults(search) {

    let q = encodeURIComponent(search);
    const lyricOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4a8cf8b268msh8770afef74aa77ep128dcdjsnd6101df11545',
            'X-RapidAPI-Host': 'genius.p.rapidapi.com'
        }
    };

    let lyricsSearchAPI = `https://genius.p.rapidapi.com/search?q=${q}&page=1&per_page=${count}`;


    fetch(lyricsSearchAPI, lyricOptions)
        .then(response => response.json())
        .then(data => data.response.hits)
        .then((results) => {
            console.log(results);
            displayLyricsSearchResults(results)
        })
        .catch(err => console.log(err));


}

function displayLyricsSearchResults(results) {
    results.forEach(result => {

        console.log(`${result.result.artist_names} \n
        ${result.result.title_with_featured} \n
        ${result.result.song_art_image_thumbnail_url}`);

        let resultEl = document.createElement('div');
        let albumEl = document.createElement('img');
        let artistEl = document.createElement('h3');
        let songEl = document.createElement('h5');

        resultEl.setAttribute('data-song-id', result.result.id)
        resultEl.setAttribute('data-artist-id', result.result.primary_artist.id)

        albumEl.setAttribute('src', result.result.song_art_image_thumbnail_url);
        artistEl.innerText = result.result.artist_names;
        songEl.innerText = result.result.title_with_featured;

        resultEl.appendChild(albumEl);
        resultEl.appendChild(artistEl);
        resultEl.appendChild(songEl);
        resultListEl.appendChild(resultEl);

    });

}

searchFormEl.addEventListener('submit', searchForMusic)
searchBtnEl.addEventListener('click', searchForMusic)

