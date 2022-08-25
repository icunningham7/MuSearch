
var lyricKey = '77f111aa83d8330305f98fa6b13a3168';
// DOM Variables
let searchValueEl = "";



function searchForMusic() {

}


function fetchMusixMatchResults(query) {
    let q = encodeURIComponent(query);
    let resultCount = 2;
    // let lyricAPI = `https://api.musixmatch.com/ws/1.1/track.search?apikey=${lyricKey}&q=${q}&page_size=${resultCount}&page=1&s_artist_rating=desc&&s_track_rating=desc`;
    let lyricAPI = `https://thingproxy.freeboard.io/fetch/https://api.musixmatch.com/ws/1.1/track.search?apikey=${lyricKey}&q=${q}`;


    console.log(`query ${query}`);
    console.log(`q ${q}`);

    console.log(lyricAPI);
    if (q.length > 0) {
        fetch(lyricAPI, {
            
        })
            .then((response) => {
                return response;
            })
            .then((data) => {
                console.log(data);
            })

    }

}

function fetchDeezerResults() {

}



fetchMusixMatchResults('iron and wine');