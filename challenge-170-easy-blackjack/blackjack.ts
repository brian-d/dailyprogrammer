declare function require(name:string);

var fs = require('fs');

enum Card { Two = 2, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King, Ace }

class Player {
    name:string;
    cards:Array<Card>;
}

// ----- Parsing Logic ----- \\

function runGame(filename:string) {
    fs.readFile(filename, 'utf8', processFile);
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

    console.log(checkGame(players));
}

function parsePlayer(line:string) {
    var player = new Player();

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

// ----- Game State Checking ----- \\

function checkGame(players:Array<Player>) {
    var fiveCardTrickWinners:Array<Player> = findFiveCardTrickWinners(players);

    if(fiveCardTrickWinners.length == 1) {
        return fiveCardTrickWinners[0].name + " has won with a 5-card trick!";
    } else if(fiveCardTrickWinners.length > 1) {
        return "Tie";
    }

    var winner:Player;
    var winnerValue:number = 0;
    var tie:boolean = false;
    for(var i:number = 0; i < players.length; i++) {
        var value = findCardsValue(players[i].cards);

        if(value > winnerValue && value <= 21) {
            tie = false;
            winnerValue = value;
            winner = players[i];
        } else if(value == winnerValue) {
            tie = true;
        }
    }

    if(!winner) {
        return "No winner"
    }

    if(tie) {
        return "Tie";
    }

    return winner.name + " has won!";
}

function findFiveCardTrickWinners(players:Array<Player>) {
    var winners:Array<Player> = [];

    for(var i:number = 0; i < players.length; i++) {
        var cards:Array<Card> = players[i].cards;

        if(cards.length === 5) {
            if(findCardsValue(cards) <= 21) {
                winners.push(players[i]);
            }
        }
    }

    return winners 
}

function findCardsValue(cards:Array<Card>) {
    var value = 0;
    var aceCount = 0;

    for(var i:number = 0; i < cards.length; i++) {
        var card:Card = cards[i];

        switch(card) {
            case Card.Jack:
            case Card.Queen:
            case Card.King:
                value += 10;
                break;
            case Card.Ace:
                value += 1;
                aceCount++;
                break;
            default:
                value += cards[i];

        }
    }

    // Process ace case. We aleady added the initial "1" so try adding the addition "10" and see if we bust.
    for(var i:number = 0; i < aceCount; i++) {
        if(value + 10 <= 21) {
            value += 10;
        }
    }

    return value;
}

runGame('example1.txt');
console.log('expected result: Alice wins');

runGame('example2.txt');
console.log('expected result: David wins (5 card trick)');

runGame('example3.txt');
console.log('expected result: Alice wins');

runGame('example4.txt');
console.log('expected result: Everyone busts (tie)');

runGame('example5.txt');
console.log('expected result: Tie');

runGame('example6.txt');
console.log('expected result: Tie');
