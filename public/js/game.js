
(function() {
        'use strict';

        function Game() {}

        var TILE_WIDTH = 81;
        var TILE_HEIGHT = 117;

        var players = [];
        var rules =
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

        var cardIndex = 0;
        var cardValues = [];
        var faceUp = false;

        var currentTurn = 0;

        var sessionID;

        var ruleText;
        var turnText;
        var buttonText;

        var socket;
        var deck;
        var resetButton;
        var scaleRatio;

        Game.prototype = {
                preload: function() {
                        this.game.load.spritesheet('spritesheet', 'assets/spritesheet.png', 81, 117, 53);
                        this.game.load.spritesheet('button', 'assets/button.png', 600, 327);
                },

                create: function () {
                        socket = io.connect();

                        socket.on('connect', function() {
                                sessionID = socket.io.engine.id;
                                var username = prompt('Enter a username!').replace(/[^\w\s]/gi, '');
                                while (username == null) {
                                        username = prompt('Please enter a valid username').replace(/[^\w\s]/gi, '');
                                }
                                if (username != null) {
                                        socket.emit('new player', username);
                                        Push.create(username + " has joined the game!", {
                                                timeout: 3000,
                                                onClick: function() {
                                                        window.focus();
                                                        this.close();
                                                }
                                        });
                                }
                        });

                        socket.on('new player', function(data) {
                                players = data.players;
                                rules = data.rules;
                                cardValues = data.cardValues;
                                cardIndex = data.cardIndex;
                                faceUp = data.faceUp;
                                currentTurn = data.currentTurn;
                                if (players[currentTurn].id == sessionID) {
                                        deck.inputEnabled = true;
                                        turnText.setText("It's your turn!");
                                } else {
                                        deck.inputEnabled = false;
                                        turnText.setText("It's " + players[currentTurn].username + "'s turn!");
                                }
                        });

                        socket.on('remove player', function(data) {
                                players = data.players;
                                currentTurn = data.currentTurn;
                                if (players[currentTurn].id == sessionID) {
                                        deck.inputEnabled = true;
                                        turnText.setText("It's your turn!");
                                } else {
                                        deck.inputEnabled = false;
                                        turnText.setText("It's " + players[currentTurn].username + "'s turn!");
                                }
                        })

                        socket.on('click', function() {
                                if (faceUp == false) {
                                        deck.frame = cardValues[cardIndex++];
                                        faceUp = true;
                                        ruleText.setText(rules[(deck.frame) % 13]);
                                } else {
                                        deck.frame = 52;
                                        faceUp = false;
                                        ruleText.setText('');
                                        currentTurn = (currentTurn + 1) % players.length;
                                        Push.create("It's " + players[currentTurn].username + "'s turn!", {
                                                timeout: 3000,
                                                onClick: function() {
                                                        window.focus();
                                                        this.close();
                                                }
                                        });
                                }
                                if (players[currentTurn].id == sessionID) {
                                        deck.inputEnabled = true;
                                        turnText.setText("It's your turn!");
                                } else {
                                        deck.inputEnabled = false;
                                        turnText.setText("It's " + players[currentTurn].username + "'s turn!");
                                }
                                if (cardIndex > 52) {
                                        deck.inputEnabled = false;
                                        turnText.setText("Game over!  Hit RESET to start a new game of WEBKINGZ!");
                                        ruleText.setText('');
                                }
                        });

                        socket.on('reset', function(serverCardValues) {
                                cardIndex = 0;
                                cardValues = serverCardValues;
                                faceUp = false;
                                currentTurn = 0;
                                deck.frame = 52;
                                ruleText.setText('');
                                if (players[currentTurn].id == sessionID) {
                                        deck.inputEnabled = true;
                                        turnText.setText("It's your turn!");
                                } else {
                                        deck.inputEnabled = false;
                                        turnText.setText("It's " + players[currentTurn].username + "'s turn!");
                                }
                        });

                        this.game.stage.backgroundColor = "#136A02";
                        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                        this.scale.pageAlignHorizontally = true;
                        this.scale.pageAlignVertically = true;
                        this.scale.updateLayout(true);
                        scaleRatio = window.devicePixelRatio;

                        ruleText = game.add.text(game.world.centerX, game.world.centerY, "", {
                                font: "20px Arial",
                                fill: "#ffffff",
                                align: "center",
                                wordWrap: true, 
                                wordWrapWidth: 450
                        });

                        ruleText.scale.setTo(scaleRatio, scaleRatio);
                        ruleText.anchor.setTo(0.5, 0.5);

                        turnText = game.add.text(game.world.centerX, 60, "", {
                                font: "20px Arial",
                                fill: "#ffffff",
                                align: "center",
                                wordWrap: true, 
                                wordWrapWidth: 450
                        });

                        turnText.scale.setTo(scaleRatio, scaleRatio);
                        turnText.anchor.setTo(0.5, 0.5);

                        deck = this.game.add.sprite(30, 30, 'spritesheet');
                        if (faceUp == false) {
                                deck.frame = 52;
                        } else {
                                deck.frame = cardValues[cardIndex];
                        }
                        deck.events.onInputDown.add(this.doClick);
                        deck.inputEnabled = false;
                        deck.visible = true;
                        deck.scale.setTo(scaleRatio, scaleRatio);

                        resetButton = this.game.add.button(this.game.width - 120, 60, 'button', function() {
                                socket.emit('reset');
                        });
                        resetButton.scale.setTo(scaleRatio / 5, scaleRatio / 5);
                        resetButton.anchor.setTo(0.5, 0.5);

                        buttonText = game.add.text(this.game.width - 120, 60, "RESET", {
                                font: "20px Arial",
                                fill: "#ffffff",
                                align: "center",
                                wordWrap: true, 
                                wordWrapWidth: 450
                        });

                        buttonText.scale.setTo(scaleRatio, scaleRatio);
                        buttonText.anchor.setTo(0.5, 0.5);
                },

                doClick: function(deck) {
                        socket.emit('click');
                },

                update: function() {
                },

                render: function() {

        }
        };

        var game = new Phaser.Game(977 * window.devicePixelRatio, 468 * window.devicePixelRatio, Phaser.AUTO, 'game');
        game.state.add('game', Game);
        game.state.start('game');

}());
