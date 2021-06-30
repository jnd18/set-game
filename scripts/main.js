if (!localStorage.getItem("highScore")) localStorage.setItem("highScore", 0);
if (!localStorage.getItem("lifetimeSetCount")) localStorage.setItem("lifetimeSetCount", 0);
let DELAY = 500; // delay in ms for some visual effects
let gameRunning = false;
let currentScore = 0;
let timeRemaining = 60;
let deck, cards, setsAlreadyFound; // globals hehe
function deal() { // general purpose set up function
    let numbers = [1, 2, 3];
    let shadings = ["solid", "striped", "open"]
    let colors = ["red", "blue", "purple"]
    let shapes = ["diamond", "squiggle", "oval"]
    deck = numbers.flatMap(a=>shadings.flatMap(b=>colors.flatMap(c=>shapes.map(d=>({number:a,shading:b,color:c,shape:d}))))); // make deck
    deck.forEach((_,i,a)=>{let j = Math.floor(Math.random() * (a.length - i) + i); [a[i],a[j]] = [a[j],a[i]];}); // shuffle deck
    cards = Array(12).fill(0).map((_,i)=>document.getElementById(`checkbox${i+1}`)); // get cards
    cards.forEach(card => card.cardValue = deck.pop()); // deal a value from the deck to each card
    cards.forEach(card => card.checked=false); // deselect all cards
    updateImages();
    updateScores();
    setsAlreadyFound = [];
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
    if (parseInt(localStorage.getItem("highScore")) < currentScore) localStorage.setItem("highScore", currentScore);
    document.getElementById("currentScore").textContent = `Current Score: ${currentScore}`;
    document.getElementById("highScore").textContent = `High Score: ${localStorage.getItem("highScore")}`;
    document.getElementById("lifetimeSetCount").textContent = `Lifetime Set Count: ${localStorage.getItem("lifetimeSetCount")}`;
}

function flashBanner(message) {
    let banner = document.getElementById("banner");
    banner.innerText = message;
    banner.hidden = false;
    setTimeout(() => banner.hidden = true, DELAY);
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
            if (checkSet(selectedCards)) {
                if (setsAlreadyFound.includes(JSON.stringify(selectedCards))) {
                    flashBanner("Set Already Found!");
                } else {
                    flashBanner("Set!");
                    setsAlreadyFound.push(JSON.stringify(selectedCards)); 
                    console.log("Set!");
                    setTimeout(() => {
                        if (gameRunning) {
                            deal(); // setup deck, cards, and images again
                            currentScore++;
                        }
                        localStorage.setItem("lifetimeSetCount", parseInt(localStorage.getItem("lifetimeSetCount")) + 1);
                        updateScores();
                    }, DELAY);
                }
            } else {
                console.log("Not a Set!");
            }
            setTimeout(() => cards.forEach(card=>card.checked=false), DELAY); // deselect all cards
        }
    }
    card = checkbox;
}

function start() {
    flashBanner("Start!");
    gameRunning = true;
    currentScore = 0;
    updateScores();
    timeRemaining = 60;
    document.getElementById("timer").textContent = `Time Remaining: ${timeRemaining}s`;
    deal();
    const timeinterval = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer").textContent = `Time Remaining: ${timeRemaining}s`;
        if (timeRemaining <= 0) {
            gameRunning = false;
            flashBanner("Time!");
            clearInterval(timeinterval);
        }
    },1000);
}
