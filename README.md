# WebKingz
## Comp 20 Final Project
### Ben Nissan, John Moran, Theodore Cahill, and Christopher Anderson

Inspired by: [Crying Alone Together In Carm Over Cereal](https://www.facebook.com/events/1583383505304923/)

### Problem
Every college student loves Kings, but no college student likes leaving the house!
### Solution
Play Kings alone together!


### Features
We will implement the following features:
* Create a game
  * Choose custom rules
  * Invite other players
* Join a game
* Play a game
  * Each turn, a card is flipped, triggering either a built-in or custom rule
    * Built-in rules
      * Prompt on-screen interactions depending on the card flipped
    * Custom rules
      * Notify other players to do a custom task when a given card is flipped
  * Certain cards can create passive rules that persist over the course of the game!
* Server-Side data persistence with MySQL (to save personal rules, number of games completed, etc.)
* A front-end framework for easier styling and design, either Bootstrap or W3.CSS
* Sending emails (to invite people to the game)
* Push notifications (to update idle players on each turn)
* Multiplayer support and overall game design with Phaser

### Data
We will collect the following data from users:
* Email
* Geolocation
* Number of games completed
* Past rulesets created/favorite rulesets
        
### Algorithms
At this point, we do not believe that this project will require any complex algorithms or special techniques.

### Mockups
Home  
![Home](mockups/Home.png?raw=true "Home")  

Log In  
![Log In](mockups/Log In.png?raw=true "Log In")  

Sign Up  
![Sign Up](mockups/Sign Up.png?raw=true "Sign Up")  

Host Pre-Game  
![Host Pre-Game](mockups/Host Pre-Game.png?raw=true "Host Pre-Game")  

Guest Pre-Game  
![Guest Pre-Game](mockups/Guest Pre-Game.png?raw=true "Guest Pre-Game")  

Gameplay  
![Gameplay](mockups/Gameplay.png?raw=true "Gameplay")  

#Comments By Ming
* Excellent work.  I'm ashamed to admit but I've never played Kings
* This seems to be the first "straight game" project I've seen which is cool.  It seems like a turned-based game.  Anyone seen FIFA 17 Mobile?  Similar style (but boy is the game terrible).
