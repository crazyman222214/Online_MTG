var deck = [];
var format;
var commander = [];
var graveArray = [];
var exileArray = [];
var handArray = [];
var battlefieldArray = [];
var cardsInPlay = [];
const battlefield = document.getElementById("battlefield"),
    hand = document.getElementById("hand"),
    grave = document.getElementById('graveyard'),
    exile = document.getElementById('exile'),
    commandZone = document.getElementById('commander'),
    deckDOM = document.getElementById('deck');

let zones = [hand, battlefield, grave, exile, commandZone];
let zoneArrays = [handArray, battlefieldArray, graveArray, exileArray, commander];

window.onload = (event) => {
    let jsonString = window.sessionStorage.getItem("deck");
    format = window.sessionStorage.getItem("format");
    deck = JSON.parse(jsonString);
    console.log(format);
    if (format === "Commander") {
        commander[0] = deck[deck.length-1];
        console.log(commander[0]);
        let cardDoc = generateCard();
        cardDoc.style.margin = '0px';
        commandZone.appendChild(cardDoc);
        let card = new Card(commander[0]);
        cardDoc.appendChild(card.img);
        deck.pop();
    }
    setupEvents();
    shuffle(10);
    for (let x = 0; x < 7; x++) {
        draw();
    }

}

function changeLife(value) {
    let lifeTotal = parseInt(document.getElementById('life-amt').innerText);
    switch (value) {
        case 'add':
            lifeTotal += 1;
            break;
        case 'minus':
            lifeTotal -= 1;
            break;
    }
    document.getElementById('life-amt').innerText = lifeTotal.toString();
}

function generateCard() {
    const cardDoc = document.createElement("div");
    cardDoc.addEventListener('contextmenu', (e) => {
        contextMenu(cardDoc, e)
    });
    cardDoc.className = "card";
    cardDoc.draggable = true;
    cardDoc.ondblclick = () => {
        tap(cardDoc);
    }
    cardDoc.onclick = () => {
        zoom(cardDoc);
    };
    cardDoc.ondrag = (event) => {
        cardDrag(cardDoc, event);
    }
    return cardDoc;
}

function shuffle(amt) {
     for (let x = 0; x < amt; x++) {
         for (let y = 0; y < deck.length; y++) {
             let randIndex = Math.floor(Math.random()*deck.length);
             let randCard = deck[randIndex];
             let listedCard = deck[y];
             deck[y] = randCard;
             deck[randIndex] = listedCard;
         }
     }
}

function draw() {
    let cardDoc = generateCard();
    hand.appendChild(cardDoc);
    let card = new Card(deck[0]);
    cardDoc.setAttribute('name', card.name);
    cardsInPlay[cardsInPlay.length] = card;
    handArray[handArray.length] = cardDoc;
    cardDoc.appendChild(card.img);
    deck.shift();
    updateDisplay(deckDOM, deck);
}

function updateDisplay(zone, zoneArray) {
    let zoneName = document.getElementById(zone.id + "NameDisplay");
    zoneName.innerText = (zone.id.charAt(0).toUpperCase() + zone.id.slice(1)) + ": " + zoneArray.length;
}

function zoom(card) {
    const zoomedCard = document.getElementById("zoomedCard");
    zoomedCard.src = card.firstElementChild.src;
}

function cardDrag(card, event) {
    card.id = "taskId";

}

function allowDrag(event) {
    event.preventDefault();
}

function checkArrayForCard(cardDoc) {
    let cardName = cardDoc.getAttribute('name');
    for (let x = 0; x < zoneArrays.length; x++) {
        let zone = zoneArrays[x];
        console.log(cardName);
        console.log(zone);
        console.log(zone.includes(cardDoc));
        if (zone.includes(cardDoc)) {
            console.log("found it: " + zone);
            return zoneArrays[x];
        }
    }
}

function cardDrop(event, place, cursorXPos, cursorYPos, placeArray) {
    event.preventDefault();
    let cardElement = document.getElementById("taskId");
    cardElement.style.animationDuration = "0s";

    place.append(cardElement);
    console.log(place);
    if (place !== hand) {
        cardElement.style.margin = '0px';
        cardElement.style.float = "none";
    } else {
        cardElement.style.margin = '5px';
    }
    if (place === battlefield) {
        console.log('dropping into the battlefield');
        cardElement.style.position = 'absolute';
        cardElement.style.top = (cursorYPos - 170) + 'px';
        cardElement.style.left = (cursorXPos - 40) + 'px';
    } else {
        cardElement.style.position = 'relative';
        cardElement.style.top = '0px';
        cardElement.style.left = '0px';
    }
    let zone = checkArrayForCard(cardElement);
    let index = zone.indexOf(cardElement);

    console.log(index);
    cardElement.style.zIndex = zone.length.toString();
    placeArray[placeArray.length] = zone[index];
    zone.splice(index, 1);
    console.log("Placed " + cardElement.getAttribute('name') + " successfully in " + placeArray);
    zoom(cardElement);
    cardElement.removeAttribute('id');

}

function setupEvents() {
    for (let x = 0; x < zones.length; x++) {
        zones[x].ondragover = (event) => {
            allowDrag(event);
        };
        zones[x].ondrop = (event) => {
            let xPos = event.clientX;
            let yPos = event.clientY;
            cardDrop(event, zones[x], xPos, yPos, zoneArrays[x]);
        };

    }

    grave.onmouseenter = () => {updateDisplay(grave, graveArray)};
    exile.onmouseenter = () => {updateDisplay(exile, exileArray)};
    deckDOM.onmouseenter = () => {updateDisplay(deckDOM, deck)};
}

function onSearchDeck() {
    let searchDeck = document.getElementById("searchDeck");
    let searchDeckList = document.getElementById("searchDeckList");
    searchDeck.style.visibility = "visible";
    for (let x = 0; x < deck.length; x++) {
        let listedCard = document.createElement('li');
        listedCard.className = "searchCard";
        listedCard.innerText = deck[x].split('+').join(" ");
        listedCard.draggable = true;
        searchDeckList.appendChild(listedCard);
        let cardClass = new Card(deck[x]);
        listedCard.onmouseenter = () => {searchZoom(cardClass)};
        listedCard.onclick = (event) => {
            searchPlayCard(cardClass);
            listedCard.parentElement.removeChild(listedCard);
        };
    }
}

function searchZoom(card) {
    let zoomedCard = document.getElementById('searchZoomedCard');
    console.log(card.img.src);
    zoomedCard.src = card.img.src;
}

function searchPlayCard(card) {
    let cardDo = generateCard();
    cardDoc.appendChild(card.img);
    cardDoc.setAttribute('name', card.name);
    hand.appendChild(cardDoc);
    handArray[handArray.length] = cardDoc;
    cardsInPlay[cardsInPlay.length] = card;
    let index = deck.indexOf(card.name);
    deck.splice(index, 1);
}

function searchFilter() {
    const searchFilter = document.getElementById("searchFilter");
    const deckSearch = document.getElementById("searchDeckList");
    let inputText = searchFilter.value.toLowerCase();
    for (let i = 0; i < deckSearch.childElementCount; i++) {
        console.log('wow');
        let searchCard = deckSearch.children[i];
        if (!(searchCard.innerText.toLowerCase().includes(inputText))) {
            searchCard.style.display = "none";
        } else {
            searchCard.style.display = "list-item";
        }
    }
}

function searchClose() {
    let searchDeck = document.getElementById('searchDeck');
    searchDeck.style.visibility = 'hidden';
    document.getElementById('searchDeckList').innerHTML = "";
    shuffle(10);
}

function contextMenu(cardDoc, event) {
    alert("You have Opened the Context Menu");
    event.preventDefault();

    var contextMenu = document.getElementById('contextMenu');
    console.log(event.clientX);
    contextMenu.style.left = event.clientX + 'px';
    contextMenu.style.top = cardDoc.style.top;
}

function tap(card) {
    if(!(card.style.animation === "0.75s ease 0s 1 normal forwards running tap")) {
        card.style.animation = "0.75s ease 0s 1 normal forwards running tap";

    }
    else {
        card.style.animation = "untap 0.75s forwards";
    }
}