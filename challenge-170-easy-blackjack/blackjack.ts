declare function require(name:string);

var fs = require('fs');

enum Card { One = 1, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King, Ace }

class Player {
    name:string;
    cards:Array<Card>;
}

function processFile(err, data) {
    if (err) {
        console.log(err);
        return;
    }

    var lines:Array<string> = data.split('\n');

    var playerCount = +lines[0];

    var players:Array<Player> = [];
    for(var i:number = 0; i < playerCount; i++) {
        players.push(parsePlayer(lines[i + 1]));
    }

    checkGame(players);
}

function parsePlayer(line:string) {
    var player = new Player();

    // Maybe replace with line.substring(0, line.indexOf(' ') or something
    var nameSplit:Array<string> = line.split(':');

    player.name = nameSplit[0];

    var cardsSplit:Array<string> = nameSplit[1].split(',');

    player.cards = [];
    for(var i:number = 0; i < cardsSplit.length; i++) {
        player.cards.push(parseCard(cardsSplit[i]));
    }

    return player;
}

function parseCard(cardText:string) {
    var cardName = cardText.trim();
    cardName = cardName.substring(0, cardName.indexOf(" "));
    var cardValue : Card = Card[cardName];
    return cardValue;
}

function checkGame(players:Array<Player>) {
    console.log("Player Count: " + players.length);

    for(var i:number = 0; i < players.length; i++) {
        console.log("Player " + (i + 1) + ": " + players[i].name + " - " + players[i].cards);
    }
};

function openFile(filename:string) {
    fs.readFile(filename, 'utf8', processFile);
}

openFile('example1.txt');
