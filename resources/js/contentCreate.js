import themeControls from "./themeControls.js";

// Begin module for creating HTML layouts & content
const contentCreate = (() => {

  const dictionaryEntry = document.querySelector('.dictionary-entry');
  const footer = document.querySelector('footer');

  function parse(data) {

    // console.dir(data.data);

    if(dictionaryEntry.innerHTML) {
      dictionaryEntry.innerHTML = '';
      if(footer.innerHTML) {
        footer.innerHTML = '';
        footer.classList.remove('footer-style');
      }
    }

    if(!data.success) {
      errorContent(data.data);
    } else {
      wordContainer(data.data);
      definitionContainers(data.data);
      footerContent(data.data);
      themeControls.loadFontElements();
      themeControls.loadFontState();
      themeControls.loadThemeElements();
      themeControls.loadThemeState();
    }

  };

  function errorContent(data) {

    dictionaryEntry.innerHTML = '<div id="error-container" class="font-primary"><p id="emoji">&#x1F615;</p><h3 id="error-title"></h3><p id="error-message" class="medium"></p></div>';

    const errorTitle = document.getElementById('error-title');
    const errorMessage = document.getElementById('error-message');

    errorTitle.innerHTML = data.title;
    errorMessage.innerHTML = `${data.message} ${data.resolution}`;

  };

  function definitionContainers(data) {

    for(let meanings of data.meanings) {

      let defContainerEl = document.createElement('div');
      defContainerEl.setAttribute('class', 'definition-container');
      defContainerEl.innerHTML = `<h2 class="language-element font-primary font-secondary bg-theme-color">${meanings.partOfSpeech}</h2><h3 class="part-of-speech font-primary">Meaning</h3><ul></ul>`;

      for(let def of meanings.definitions) {
        let defEl = document.createElement('li');
        defEl.innerHTML = `<p class="medium font-primary">${def.definition}</p>`;

        if(def.example) {
          let exEl = document.createElement('p');
          exEl.setAttribute('class', 'medium example font-primary');
          exEl.innerHTML = `"${def.example}"`;
          defEl.appendChild(exEl);
        }

        defContainerEl.children[2].appendChild(defEl);
      }

      if(meanings.synonyms.length > 0) {
        let synContainerEl = document.createElement('div');
        synContainerEl.setAttribute('class', 'syn-ant-flex');
        synContainerEl.innerHTML = '<h3 class="part-of-speech font-primary syn-ant-header">Synonyms</h3>';

        for(let syn of meanings.synonyms) {
          let linkEl = document.createElement('a');
          linkEl.setAttribute('class', 'font-primary syn-ant');
          linkEl.setAttribute('href', '#');
          linkEl.innerText = syn;
          synContainerEl.appendChild(linkEl);
        }

        defContainerEl.appendChild(synContainerEl);
      }

      if(meanings.antonyms.length > 0) {
        let antContainerEl = document.createElement('div');
        antContainerEl.setAttribute('class', 'syn-ant-flex');
        antContainerEl.innerHTML = '<h3 class="part-of-speech font-primary syn-ant-header">Antonyms</h3>';

        for(let ant of meanings.antonyms) {
          let linkEl = document.createElement('a');
          linkEl.setAttribute('class', 'font-primary syn-ant');
          linkEl.setAttribute('href', '#');
          linkEl.innerText = ant;
          antContainerEl.appendChild(linkEl);
        }

        defContainerEl.appendChild(antContainerEl);
      }

      // Append the new container to the primary dictionary entry container
      dictionaryEntry.appendChild(defContainerEl);
    }

  }

  function wordContainer(data) {

    dictionaryEntry.innerHTML = '<div class="word-container"><div class="word-container-child"><h1 id="word" class="font-primary"></h1><p id="phonetics"></p></div><div class="word-container-child"><svg id="play-button" xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g fill="#A445ED" fill-rule="evenodd"><circle cx="37.5" cy="37.5" r="37.5" opacity=".25"/><path d="M29 27v21l21-10.5z"/></g></svg></div><audio id="audio-player"><source id="audio-source" src="" type="audio/mpeg">Your browser does not support the audio element.</audio></div>';

    const wordEl = document.getElementById('word');
    const phoneticsEl = document.getElementById('phonetics');
    const audio = document.getElementById('audio-source');
    const playButton = document.getElementById('play-button');
    let audioBoolean = false;

    wordEl.innerHTML = data.word;

    if(data.phonetic) {
      phoneticsEl.innerHTML = data.phonetic;
    }
    for(let item of data.phonetics) {
      if(!phoneticsEl.innerHTML && item.text) {
        phoneticsEl.innerHTML = item.text;
      }
      if(!audioBoolean && item.audio) {
        audio.setAttribute('src', item.audio);
        audioBoolean = true;

        playButton.addEventListener('click', function() {
          const audioPlayer = document.getElementById('audio-player');

          if(audioPlayer.paused) {
            audioPlayer.play();
          } else {
            audioPlayer.pause();
          }

        });
      }
    }
    if(!audioBoolean) {
      playButton.classList.add('hidden');
    } else {
      playButton.classList.remove('hidden');
    }

  };

  function footerContent(data) {

    footer.classList.add('footer-style');
    footer.innerHTML = '<span class="link-wrapper"><p class="small font-primary">Source</p></span><p class="small"><span class="link-wrapper"><a id="source-url" class="footer-link font-primary bg-theme-color" href="" target="_blank"></a></span><span class="svg-wrapper"><svg class="new-window-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><path fill="none" stroke="#838383" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.09 3.545H2.456A1.455 1.455 0 0 0 1 5v6.545A1.455 1.455 0 0 0 2.455 13H9a1.455 1.455 0 0 0 1.455-1.455V7.91m-5.091.727 7.272-7.272m0 0H9m3.636 0V5"/></svg></span></p>';

    const source = document.getElementById('source-url');

    source.setAttribute('href', data.sourceUrls[0]);
    source.innerHTML = data.sourceUrls[0];

  };

  return {
    parse
  };

})();

export default contentCreate;