let DELAY = 500; // delay in ms for some visual effects
let gameRunning = false;
let highScore = currentScore = 0;
let timeRemaining = 60;
let deck, cards; // globals hehe
function deal() { // general purpose set up function
    let numbers = [1, 2, 3];
    let shadings = ["solid", "striped", "open"]
    let colors = ["red", "blue", "purple"]
    let shapes = ["diamond", "squiggle", "oval"]
    deck = numbers.flatMap(a=>shadings.flatMap(b=>colors.flatMap(c=>shapes.map(d=>({number:a,shading:b,color:c,shape:d}))))); // make deck
    deck.forEach((_,i,a)=>{let j = Math.floor(Math.random() * (a.length - i) + i); [a[i],a[j]] = [a[j],a[i]];}); // shuffle deck
    cards = Array(12).fill(0).map((_,i)=>document.getElementById(`checkbox${i+1}`)); // get cards
    cards.forEach(card => card.cardValue = deck.pop()); // deal a value from the deck to each card
    updateImages();
}
deal();

function updateImages() { // updates card images to match values
    for (let i = 1; i <= 12; i++) {
        let img = document.getElementById(`checkbox${i}_img`);
        let {number, shading, color, shape} = cards[i - 1].cardValue;
        let imgName = `images/${number}-${shading}-${color}-${shape}.svg`
        console.log(imgName);
        img.src = imgName;
        //img.src = "images/1-solid-red-rectangle.svg";
    }
}

function updateScores() {
    highScore = currentScore > highScore ? currentScore : highScore;
    document.getElementById("currentScore").textContent = `Current Score: ${currentScore}`;
    document.getElementById("highScore").textContent = `High Score: ${highScore}`;
}

function checkSet(arr) { // given an array of three objects from the deck, checks if they form a set
    console.log(arr);
    return arr.length != 3 ? false : ["number", "shading", "color", "shape"].every(feature => (new Set(arr.map(card => card[feature]))).size != 2);
}

let card; // for debugging purposes
function handler(checkbox) { // fires when a card is clicked
    if (checkbox.checked) {
        console.log(checkbox.cardValue);
        if (cards.filter(card => card.checked).length == 3) {
            let selectedCards = cards.filter(card => card.checked).map(card => card.cardValue);
            let isSet = checkSet(selectedCards);
            if (isSet) {
                console.log("Set!");
                document.getElementById("setBanner").hidden = false; // show banner
                setTimeout(() => {
                    if (gameRunning) {
                        deal(); // setup deck, cards, and images again
                        currentScore++;
                        updateScores();
                    }
                    document.getElementById("setBanner").hidden = true; // hide banner
                }, DELAY);
            } else {
                console.log("Not a Set!");
            }
            setTimeout(() => cards.forEach(card=>card.checked=false), DELAY); // deselect all cards
        }
    }
    card = checkbox;
}

function start() {
    document.getElementById("startBanner").hidden = false;
    setTimeout(() => document.getElementById("startBanner").hidden = true, DELAY);
    gameRunning = true;
    currentScore = 0;
    timeRemaining = 60;
    document.getElementById("timer").textContent = `Time Remaining: ${timeRemaining}s`;
    deal();
    const timeinterval = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer").textContent = `Time Remaining: ${timeRemaining}s`;
        if (timeRemaining <= 0) {
            gameRunning = false;
            document.getElementById("timeBanner").hidden = false;
            setTimeout(() => document.getElementById("timeBanner").hidden = true, DELAY);
            clearInterval(timeinterval);
        }
    },1000);
}