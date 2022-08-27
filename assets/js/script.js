async function getResults(search) {
  console.log('getting results');
  let searchResults = await fetchSongSearchResults(search);
  console.log('results');
  console.log(searchResults);

  return searchResults;
}


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
    .catch(err => console.log(err))

}


getResults('bikes');