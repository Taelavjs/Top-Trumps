const deckSize = 52;
var deck = [];
var playerOneDeck = [];
var playerTwoDeck = [];
var playerCount = 2;
var players = [playerOneDeck, playerTwoDeck];

// Objects

class card {
  constructor(name, speed, strength, intelligence, visibility) {
    this.name = name;
    this.speed = speed;
    this.strength = strength;
    this.intelligence = intelligence;
    this.visibility = visibility;
  }
}

// LS

const passToLocalStorage = (key, item) => localStorage.setItem(key, JSON.stringify(item));
const clearFromLocalStorage = (key) => localStorage.removeItem(key);
const randomVal = (maxValue, minValue) => Math.floor(Math.random() * maxValue) + minValue;

// functions

const createDeck = () => {
  for(let i=0; i < deckSize; i++){
    let maxStatLevel = 10;
    let minStatLevel = 1;
    var speed = randomVal(maxStatLevel, minStatLevel);
    var strength = randomVal(maxStatLevel, minStatLevel);
    var intelligence = randomVal(maxStatLevel, minStatLevel);
    var visibility = randomVal(maxStatLevel, minStatLevel);

    const playingCard = new card('abe', speed, strength, intelligence, visibility);
    deck[i] = playingCard;
    passToLocalStorage('deck', deck);
    createPlayersDeck(playingCard, i);
  }
}

const createPlayersDeck = (playingCard, i) => {
  playerDeckSize = (deckSize / playerCount) >> 0;
  switch(isEven(i)){
    case true:
      playerOneDeck.push(playingCard);
      break;
    case false:
      playerTwoDeck.push(playingCard);
      break;
  }
  if(i == deckSize - 1){
    passToLocalStorage('playerOneDeck', JSON.stringify(playerOneDeck));
    passToLocalStorage('playerTwoDeck', JSON.stringify(playerTwoDeck));
  }
}

const createNames = () => {
  fetch(`https://randomuser.me/api/?results=52`)
  .then( (res) => res.text())
  .then( (data) => {
    data = JSON.parse(data);
    const listOfNames = data.results;
    var i = 0;
    listOfNames.forEach( () => {
      lastName = data.results[i].name.last;
      firstName = data.results[i].name.first;
      fullName = `${firstName} ${lastName}`;
      deck[i].name = fullName;
      i++;
    })
    displayCardData(playerOneDeck, playerTwoDeck);
  })
    .catch( (err) => console.log(err));
}

const tradeCards = () => {

}

var names = document.querySelectorAll('.name'),
    strengths = document.querySelectorAll('.strength'),
    speeds = document.querySelectorAll('.speed'),
    intelligences = document.querySelectorAll('.intelligence'),
    visibilitys = document.querySelectorAll('.visibility'),
    displayedCard = document.querySelectorAll('.card'),
    winningBoard = document.querySelector('.winArea');



const displayCardData = (playerOneDeck, playerTwoDeck) => {
  if(playerOneDeck.length === 0 || playerTwoDeck === 0){

  }  
    for(let i = 0; i < playerCount; i++){
      switch(isEven(i)){
        case true:
          let name = playerOneDeck[0].name;
          let strength = playerOneDeck[0].strength;
          let speed = playerOneDeck[0].speed;
          let intelligence = playerOneDeck[0].intelligence;
          let visibility = playerOneDeck[0].visibility;
          names[i].innerHTML = `${name}`;
          strengths[i].innerHTML = `<span class="title">Strength</span>  <span class="value">${strength}</span>`;
          speeds[i].innerHTML = `<span class="title">Speed</span>  <span class="value">${speed}</span>`;
          intelligences[i].innerHTML = `<span class="title">Intelligence</span>  <span class="value">${intelligence}</span>`;
          visibilitys[i].innerHTML = `<span class="title">Visibility</span>  <span class="value">${visibility}</span>`;

          break;
        case false:
          let name2 = playerTwoDeck[0].name;
          let strength2 = playerTwoDeck[0].strength;
          let speed2 = playerTwoDeck[0].speed;
          let intelligence2 = playerTwoDeck[0].intelligence;
          let visibility2 = playerTwoDeck[0].visibility;
          names[i].innerHTML = `${name2}`;
          strengths[i].innerHTML = `<span class="title">Strength</span>  <span class="value">${strength2}</span>`;
          speeds[i].innerHTML = `<span class="title">Speed</span>  <span class="value">${speed2}</span>`;
          intelligences[i].innerHTML = `<span class="title">Intelligence</span>  <span class="value">${intelligence2}</span>`;
          visibilitys[i].innerHTML = `<span class="title">Visibility</span>  <span class="value">${visibility2}</span>`;
          break;
      }
    }
}


const test = e => {
  classList = e.target.classList;
  switch(classList == 'title'){
    case true:
      parentElem = e.target.parentElement;
      const chosenValue = parentElem.children[1].innerHTML;
      const stat = parentElem.classList[1];
      const opponent = document.querySelectorAll(`.${stat}`);
      const oppValue = opponent[1].children[1].innerHTML;
      compareValues(chosenValue, oppValue);
      break;
    case false: 
      break;
  }
}

const compareValues = (valPlayerOne, valPlayerTwo) => {
  let whoWon;
  if(valPlayerOne-1 > valPlayerTwo-1){
    failSound('fonts/sound/victory.wav');
    whoWon = 'playerOne';
  } else {
    if(valPlayerOne === valPlayerTwo){
      failSound('fonts/sound/susp.wav');
      whoWon = 'draw';
    } else {
      whoWon = 'playerTwo';
      failSound('fonts/sound/failure.wav');
    }
  }
  exchangeCards(whoWon);
}
  




const exchangeCards = (whoWon) => {
  switch(whoWon){
    case 'playerOne':
      passCardToWinner(playerOneDeck, playerTwoDeck);
      resultAnimation('spin', 'vibrate');
      break;
    case 'playerTwo':
      passCardToWinner(playerTwoDeck, playerOneDeck);
      resultAnimation('vibrate', 'spin');
      break;
    case 'draw':

    break;
  }
}

const passCardToWinner = (winner, loser) => {
  const cardToBeExchanged =  loser.splice(0, 1);
  winner.push(cardToBeExchanged[0]);
  const winningCard = winner.splice(0, 1);
  winner.push(winningCard[0]);
  winningScreen();
}

const winningScreen = () => {
  if(playerOneDeck.length === 0 || playerTwoDeck === 0){
    switch(playerOneDeck.length === deckSize){
      case true:
        wonMsg = 'Player One Wins';
        winningBoard.classList.add('victoryBanner');
        winningBoard.innerHTML = wonMsg;
        break;
      case false: 
        const wonMsg = 'Player TWO Wins'
        winningBoard.classList.add('victoryBanner');
        winningBoard.innerHTML = wonMsg;
        break;
    }
  } else {
    displayCardData(playerOneDeck, playerTwoDeck);
  }
}


const isEven = (n) => n % 2 == 0;

const failSound = (url) => {
  fetch(url)
  .then( res => res.url)
  .then( src => {
    var song = new Audio();
    song = new Audio(src);
    song.volume = 0.2;
    song.play();
  })
  .catch( err => console.log(err));
}

const resultAnimation = (classNameW, classNameL) => {
  displayedCard[0].classList.add(classNameW);
  displayedCard[1].classList.add(classNameL);
  setTimeout(() => {
    displayedCard[0].classList.remove(classNameW);
    displayedCard[1].classList.remove(classNameL);
  }, 1000);
}


// Scope
createNames();
createDeck();
document.addEventListener('click', test);