declare function require(name:string);

var fs = require('fs');

enum Cards { One = 1, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King, Ace }

class Player {
    name:string;
    cards:Array<Cards>;

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

    var nameSplit:Array<string> = line.split(':');

    player.name = nameSplit[0];

    return player;
}

function checkGame(players:Array<Player>) {
    console.log("Player Count: " + players.length);

    for(var i:number = 0; i < players.length; i++) {
        console.log("Player " + (i + 1) + ": " + players[i].name);
    }



};

function openFile(filename:string) {
    fs.readFile(filename, 'utf8', processFile);
}

openFile('example1.txt');
