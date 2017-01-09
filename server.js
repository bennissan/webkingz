var express = require('express');
var cors = require('cors');
var util = require('util');
var bodyParser = require('body-parser');

var app = express();

var defaultRules =
        [
        "2: You! Tell someone to drink.",
        "3: Me! You drink.",
        "4: Floor! Last to touch the floor drinks.",
        "5: Guys! All the guys drink.",
        "6: Chicks! All the girls drink.",
        "7: Heaven! Last person to raise their hand drinks.",
        "8: Mate! Find a mate: whenever one of you drinks, you both do.",
        "9: Rhyme: Say a word, and the person to your right must say a word that rhymes. Continue around the circle, and the first person who can't think of a rhyme or says a word already said must drink.",
        "10: Categories: Say a category, and the person to your right must say something that fits in that category. Continue around the circle, and the first person who can't think of something or says something already said must drink.",
        "Jack: Never have I ever! Everyone puts up three (3) fingers. You must think of something you have never done. Continue around the circle. If you have done something someone says, put down a finger. The first people with no fingers up drink.",
        "Queen: Question Master! You are the question master until a new one is found. If you ask someone a question, they must respond in the form of a question. If they don't, they must drink.",
        "King: Make a Rule! Think of a new rule that must be followed until another King is drawn. If someone breaks the rule, they must drink.",
        "Ace: Waterfall! Each player starts drinking their beverage at the same time as the person to their left. No player can stop drinking until the player before them stops, but the person who starts may stop at any time."
        ];

var rules = defaultRules;

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.use(cors());

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/rulesdb';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

var server = app.listen(app.get('port'));
var io = require('socket.io')(server);

var players = [];

var cardIndex = 0;
var cardValues = [];
for (var i = 0; i < 52; i++) {
        cardValues.push(i);
}
shuffle(cardValues);
var faceUp = false;
var currentTurn = 0;

io.on('connection', function(socket){
        socket.on('new player', function(username) {
                players.push({username: username, id: socket.id});
                io.emit('new player', {players: players, rules: rules, cardValues: cardValues, cardIndex: cardIndex, faceUp: faceUp, currentTurn: currentTurn});
        });

        socket.on('disconnect', function() {
                var removePlayer = playerById(socket.id);
                if (!removePlayer) {
                        return;
                }
                currentTurn = (currentTurn + 1) % players.length;
                players.splice(players.indexOf(removePlayer), 1);

                io.emit('remove player', {players: players, currentTurn: currentTurn});
        }); 

        socket.on('click', function(){
                if (faceUp == false) {
                        cardIndex++;
                        faceUp = true;
                } else {
                        faceUp = false;
                        currentTurn = (currentTurn + 1) % players.length;
                }
                io.emit('click');
        });

        socket.on('reset', function() {
                shuffle(cardValues);
                cardIndex = 0;
                faceUp = false;
                currentTurn = 0;
                io.emit('reset', cardValues);
        });
});

function playerById(id) {
        for (var i = 0; i < players.length; i++) {
                if (players[i].id === id) {
                        return players[i];
                }
        }
        return false;
}

function shuffle(arr) {
        for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;      
}


app.post('/submit.json', function(request, response) {
        var newEntry = request.body;
        db.collection('rules', function(error, coll) {
                if (error) {
                        console.log("Error: " + error);
                } else if (newEntry['rule_name'] != ''){
                        newEntry.rule_name = newEntry.rule_name.replace(/[^\w\s]/gi, '');
                        for(var i = 2; i < 15; i++) {
                                var curr_rule = "rule_" + i;
                                if (newEntry[curr_rule] == "") {
                                        newEntry[curr_rule] = defaultRules[i-2];
                                } else {
                                        newEntry[curr_rule] = newEntry[curr_rule].replace(/[^\w\s]/gi, '');
                                }
                        }
                        coll.insert(newEntry, function(error, saved) {
                                if (error) {
                                        console.log("Error: " + error);
                                        response.sendStatus(500);
                                } else {
                                        response.sendStatus(200);
                                }
                        });
                } else {
                        console.log("Error: rule_name is not filled out");
                }
        });
});

app.get('/rules.json', function(request, response) {
  db.collection('rules', function(er, collection) {
    collection.find().toArray(function(err, items) {
      response.send(items);      
    });
  });
});

app.post('/selectrule.json', function(request, response) {
        rules = request.body;
        for (var i = 0; i < rules.length; i++) {
                rules[i] = rules[i].replace(/[^\w\s]/gi, '');
        }
});
