# Challenge #170: (Easy) Blackjack Checker

[Reddit Link](http://www.reddit.com/r/dailyprogrammer/comments/29zut0/772014_challenge_170_easy_blackjack_checker/)

# Solution Submission

I gave this a crack using Typescript with the intention of being run through nodejs. The solution came together fairly easily... I felt like a vast majority of the work here ended up being parsing the input, but that's probably just my lack of exposure to nodejs's fs package.

All in all a good challenge and a nice way to get a little more Typescript/nodejs experience.

Declarations

    declare function require(name:string);

    var fs = require('fs');

    enum Card { Two = 2, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King, Ace }

    class Player {
        name:string;
        cards:Array<Card>;
    }

Parsing Logic

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

Game State Logic

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

Game running

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

# Problem 

Blackjack is a very common card game, where the primary aim is to pick up cards until your hand has a higher value than everyone else but is less than 21. This challenge will look at the outcome of the game, rather than playing the game itself.
The value of a hand is determined by the cards in it.

* Numbered cards are worth their number - eg. a 6 of Hearts is worth 6.
* Face cards (JQK) are worth 10.
* Ace can be worth 1 or 11.

The person with the highest valued hand wins, with one exception - if a person has 5 cards in their hand and it has any value 21 or less, then they win automatically. This is called a 5 card trick.
If the value of your hand is worth over 21, you are 'bust', and automatically lose.
Your challenge is, given a set of players and their hands, print who wins (or if it is a tie game.)

## Input Description

First you will be given a number, N. This is the number of players in the game.
Next, you will be given a further N lines of input. Each line contains the name of the player and the cards in their hand, like so:
Bill: Ace of Diamonds, Four of Hearts, Six of Clubs
Would have a value of 21 (or 11 if you wanted, as the Ace could be 1 or 11.)

## Output Description

Print the winning player. If two or more players won, print "Tie".

## Examples 

### Example One

Input:
```
3
Alice: Ace of Diamonds, Ten of Clubs
Bob: Three of Hearts, Six of Spades, Seven of Spades
Chris: Ten of Hearts, Three of Diamonds, Jack of Clubs
```

Output:
```
Alice has won!
```

### Example Two

Input:
```
4
Alice: Ace of Diamonds, Ten of Clubs
Bob: Three of Hearts, Six of Spades, Seven of Spades
Chris: Ten of Hearts, Three of Diamonds, Jack of Clubs
David: Two of Hearts, Three of Clubs, Three of Hearts, Five of Hearts, Six of Hearts
```

Output:
```
David has won with a 5-card trick!
```

