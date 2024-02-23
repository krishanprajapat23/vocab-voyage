// ==================================================================
const URL_Link = "https://api.dictionaryapi.dev/api/v2/entries/en/";
let showDiv = document.getElementById("show");
let searchInput = document.getElementById("search");
let submitButton = document.getElementById("searchBtn");
let loadingImg = document.getElementById("imgWrapper");



function showResult(){
  let searchQuery = searchInput.value;
  console.log(searchQuery, 'search');
  getDataWord(searchQuery);
}

// getDataWord();
async function getDataWord(searchQuery) {
  loadingImg.classList.remove('d-none');
  try {
    const response = await fetch(`${URL_Link}${searchQuery}`);
    // network error in the 4xx–5xx range
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    // response getting....
    const words = await response.json();
    showInDom(words);
  } catch (error) {
    console.log(error);
  }
}



function showInDom(words) {
  showDiv.innerHTML = "";
  const { word, phonetic, meanings, phonetics } = words[0];
  console.log(words[0]);

  let audioSrc;
  let phoneticText;

  // checks if audio file or phonetic text are there
  phonetics?.forEach(phonetic => {
      if (!audioSrc && phonetic.audio) {
          audioSrc = phonetic.audio;
      }
      if (!phoneticText && phonetic.text) {
          phoneticText = phonetic.text;
      }
  });

  // definitions and others
  let meaningsHTML = '';
  meanings.forEach((item) => {
      let partOfSpeech = item.partOfSpeech;
      let listItemHTML = `<li><strong class="text-uppercase">${partOfSpeech}</strong>`;
      // Show synonyms
      if (item.synonyms.length > 0) {
          listItemHTML += `<span class="text-capitalize"><strong>Synonyms</strong>: ${item.synonyms.join(", ")}</span>`;
      }
      // Show antonyms
      if (item.antonyms.length > 0) {
          listItemHTML += `<span class="text-capitalize"><strong>Antonyms</strong>: ${item.antonyms.join(", ")}</span>`;
      }
      // Iterate over each definition in the "definitions" array
      item.definitions.forEach((definition) => {
          listItemHTML += `<span>- ${definition.definition}</span>`;
      });
      listItemHTML += `</li>`;
      meaningsHTML += listItemHTML;
  });

  //  template to show details of searched word
  let template = `
    <div class="heading-wrap">
      <h2 id="word" class="fw-bold">${word}</h2>
      <span id="phonetic" class="text-muted fs-6">
      ${(phonetic) ? phonetic : 
        (!phonetic) ? phoneticText : ''
      }
      </span>
      <div class="audio-player">
        <audio id="audio" class="opacity-0" src="${audioSrc ? audioSrc : ''}"></audio>
        <button id="playBtn" type="button" class="btn-lg btn border-0 ${!audioSrc ? 'd-none' : ''}"><i class="far fa-play-circle"></i></button>
      </div>
    </div>
    <div class="meaning-wrapper">
      <ul id="meaningWrapper" class="p-0 m-0 list-wrapper">
        ${meaningsHTML}
      </ul>
    </div>
  `
  showDiv.innerHTML = template;
  // console.log(showDiv.innerHtml = template)
  // checks if any audio file is there then call the fn
  audioSrc ? audioPlay() : '';
}

// =====================================================================================
// for audio play button
function audioPlay(){
  const audio = document.getElementById("audio");
  const PlayButton = document.getElementById("playBtn");
  
  function togglePlay() {
    if (audio.paused || audio.ended) {
      audio.play();
    } else {
      audio.pause();
    }
  }
  
  audio.addEventListener("click", function (e) {
    this.paused ? this.play() : this.pause();
  });
  
  PlayButton.addEventListener("click", togglePlay);
  audio.addEventListener("playing", function () {
    PlayButton.style.opacity = 0.5;
  });
  audio.addEventListener("pause", function () {
    PlayButton.style.opacity = 1;
  });
}

// =====================================================================================



// ===================== add btn event listener======
submitButton.addEventListener("click", showResult);
searchInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    e.preventDefault();
    showResult(e);
  }
});