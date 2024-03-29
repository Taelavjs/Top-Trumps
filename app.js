var deckSize = 52;
let deck = [];
let namesList = [];
var playerOneDeck = [];
var playerTwoDeck = [];
var playerCount = 2;
var players = [playerOneDeck, playerTwoDeck];


var names = document.querySelectorAll('.name'),
    strengths = document.querySelectorAll('.strength'),
    speeds = document.querySelectorAll('.speed'),
    intelligences = document.querySelectorAll('.intelligence'),
    visibilitys = document.querySelectorAll('.visibility'),
    displayedCard = document.querySelectorAll('.card'),
    winningBoard = document.querySelector('.winArea');


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

let passToLocalStorage = (key, item) => localStorage.setItem(key, JSON.stringify(item));
const clearFromLocalStorage = (key) => localStorage.removeItem(key);

//random value betweek min and max
const randomVal = (maxValue, minValue) => Math.floor(Math.random() * maxValue) + minValue;

// functions

//Player selects how many cards in a deck, ask API to search for this many names
const createNames = (deckSize) => {
  fetch(`https://randomuser.me/api/?results=${deckSize}`)
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
      namesList[i] = fullName;
      i++;
    })
    passToLocalStorage('deck', deck);

    displayCardData(playerOneDeck, playerTwoDeck);
  })
    .catch( (err) => console.log(err));
}

//Sets the two cards for each player on their turn. (Deals the current rounds cards to the players)
const displayCardData = (playerOneDeck, playerTwoDeck) => {  
  for(let i = 0; i < playerCount; i++){
    switch(isEven(i)){
      case true:
        // Displays top cards values
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


//
const createDeck = (deckSize) => {
  for(let i=0; i < deckSize; i++){
    let maxStatLevel = 10;
    let minStatLevel = 1;
    var speed = randomVal(maxStatLevel, minStatLevel);
    var strength = randomVal(maxStatLevel, minStatLevel);
    var intelligence = randomVal(maxStatLevel, minStatLevel);
    var visibility = randomVal(maxStatLevel, minStatLevel);

    let playingCard = new card(namesList[i], speed, strength, intelligence, visibility);
    deck[i] = playingCard;
    createPlayersDeck(playingCard, i);
  }
  createNames(deckSize);
  console.log(deck[0].name);

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
    console.log(playerOneDeck);
  }
}


//On click checks for if the player clicked an attribute. gets opponents value for comparison
const getValuesForComparison = e => {
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


//compares the two values p1 vs p2. decides a winner
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
  
//gives the lost card to the winner, moves cards to the back of their deck
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

//writes winners message
const winningScreen = () => {
  let wonMsg;
  if(playerOneDeck.length === 0 || playerTwoDeck.length === 0){
    switch(playerTwoDeck.length < playerOneDeck.length){
      case true:
        wonMsg = '<h1>Player One Wins<h1>';
        winningBoard.classList.add('victoryBanner');
        winningBoard.innerHTML = wonMsg;
        break;
      case false: 
        wonMsg = '<h1>Player TWO Wins<h1>'
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

const setDeckSize = () => {
  const errorMsg = document.querySelector('.error');
  var deck = document.getElementById('deckSize').value;
  if(deck < 3 || deck > 52 || isEven(deck) === false){
    document.getElementById('deckSize').focus();
    errorMsg.classList.remove('noDisplay');
  } else {
    errorMsg.classList.add('noDisplay');
    startUp(deck);
  }
}

function startUp(deck) {
  deckSize = deck;
  const secondCard = document.querySelector('#debug').checked;

  main = document.querySelector('.mainMenu');
  main.classList.add('slideUp');
  setTimeout(() => {
    main.classList.add('noDisplay');
    main.classList.remove('slideUp');
    main.classList.add('noDisplay');
    main.classList.remove('mainMenu');
    main.classList.add('noDisplay');
  }, 1000);
  console.log(secondCard);
  switch(secondCard == true){
    case true:

      break;
    case false:
      document.querySelector('.second').classList.remove('card');
      document.querySelector('.second').classList.remove('playerTwoCard');
      document.querySelector('.second').classList.add('noDisplay');
      break;
  }


  createDeck(deckSize);
  document.addEventListener('click', getValuesForComparison);
}

