const deckFile = document.getElementById('deckFile');
const format = document.getElementById('format');
const submit = document.getElementById('submit');
const fileReader = new FileReader();
var deck;
var deckList = [];
var formatType;

deckFile.addEventListener('change', (event) => {
    let file = event.target.files[0]; //event.target gives a blob, so have to take the 0 term of the blob
    //console.log(file);
    fileReader.readAsText(file, "UTC-8");
    fileReader.onload = (event) => {
        deck = event.target.result;
        //console.log(deck);
        let deckArray = deck.split("\n");
        console.log(deckArray);
        for (let x = 0; x < deckArray.length; x++) {
            let cardArray = deckArray[x].split(" ");
            let numOfCards = parseInt(cardArray[0]);
            cardArray.shift();
            console.log(numOfCards);
            let cardString = cardArray.join('+');
            console.log(cardString);
            for (let y = 0; y < numOfCards; y++) {
                deckList.push(cardString);
            }
        }
        console.log(deckList);
        document.getElementById('format').style.visibility = 'visible';
    };
});

format.addEventListener('change', (event) => {
    formatType = event.target.value;
    console.log(formatType);
    document.getElementById('submit').style.visibility = 'visible';
});

submit.onclick = ((event) => {
    let location = "/Online_MTG_Node/index.html";
    let jsonString = JSON.stringify(deckList);
    window.sessionStorage.setItem("deck", jsonString);
    window.sessionStorage.setItem("format", formatType);
    window.location.replace(location);
});