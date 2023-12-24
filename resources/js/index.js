
import contentCreate from './contentCreate.js';


const searchObj = {
  form: document.getElementById('search-form'),
  input: document.getElementById('word-search'),
  url: 'https://api.dictionaryapi.dev/api/v2/entries/en/'
};


const updateHistory = function(searchTerm) {

  history.pushState({ term: searchTerm }, `Searching ${searchTerm}`, `${window.location.pathname}?search=${searchTerm}`);

};

const homeLink = document.getElementById('home-link');
homeLink.setAttribute('href', window.location.pathname);


const cachedSearch = (function(searchObj) {

  let form = searchObj.form;
  let input = searchObj.input;
  let url = searchObj.url;

  const dataCache = [];

  function search() {

    let word = input.value;
    input.value = "";


    let cacheResult = searchCache(word);

    if(cacheResult) {
      return { success: true, data: cacheResult };
    } else {

      let searchUrl = `${url}${word}`;
      return fetchData(searchUrl);
    }
  };

  async function fetchData(fetchUrl) {

    try {
      const response = await(fetch(fetchUrl));
      if(response.ok) {
        const data = await response.json();
        if(!data) {
          throw new Error('Data not available');
        }
        pushToCache(data[0]);
        return { success: true, data: data[0] };
      } else {
        if(response.status === 404) {
          const data = await response.json();
          if(!data) {
            throw new Error('Data not available');
          }
          console.log('404: data resource not found');
          return { success: false, data: data };
        } else {
          throw new Error('There was an error with the network resource');
        }
      }
    }
    catch (error) {
      console.log("Error encountered: ", error);
    }
  };

  function pushToCache(item) {
    dataCache.push(item);
    if(dataCache.length > 19) {
      dataCache.shift();
    }
  };

  function searchCache(term) {
    for(let item of dataCache) {
      if(item.word === term) {
        return item;
      }
    }
    return null;
  }

  return {
    search,
    fetchData,
    searchCache
  };

})(searchObj);

searchObj.form.addEventListener('submit', async function(event) {

  event.preventDefault();

  const searchParent = searchObj.input.parentElement;
  if(searchObj.input.value === '') {
    searchParent.classList.add('error');
    searchObj.input.classList.add('error');
  } else {
    let word = searchObj.input.value;
    searchParent.classList.remove('error');
    searchObj.input.classList.remove('error');
    let results = await cachedSearch.search();


    let success = contentCreate.parse(results);
    updateHistory(word);
    searchObj.input.blur();

  }
});


document.body.addEventListener('click', async function(event) {

  if(event.target.classList.contains('syn-ant')) {

    event.preventDefault();

    searchObj.input.value = event.target.innerText.trim();
    let word = searchObj.input.value;
    let results = await cachedSearch.search();


    let success = contentCreate.parse(results);
    updateHistory(word);
    window.scrollTo(0, 0);

  }

});


window.addEventListener('popstate', async function(event) {

  if(event.state && event.state.term) {
    searchObj.input.value = event.state.term;
    let word = searchObj.input.value;
    let results = await cachedSearch.search();


    let success = contentCreate.parse(results);
  } else {

    location.reload();
  }

});