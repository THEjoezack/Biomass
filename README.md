mkdir RogueOS;
cd RogueOS;
npm init
npm install --save rot-js
npm install --save-dev gulp

// Gulp Dependencies
var gulp = require('gulp');

Based on...
https://github.com/ondras/rot.js
https://github.com/jokeofweek/jsrogue/

## Getting started
* npm cache clean #(if you run into anything weird)
* npm install gulp #(if you don't have it already)
* npm install #(from dir)
* gulp bower #(get ROT)
* gulp
* gulp test
* npm install -g http-server
* http-server

## TODO

### Up next...
* Traits!
  * -Load from file-
  * -Figure out which traits are selectable, given a tree-
  * Show trait screen
    * -Load traits from file-
    * Allow player to spend xp on traits
    * Traits should "add" in additional stats
  * "Digging" should be a trait!
    
### Goals
* Have fun
* Learn TypeScript!

### Core mechanics
* Evolution theme, monsters should evolve too!
* Use "biomass" as singular currency to level up, evolve, heal, buff items

## Nice to haves that I care about
* Skill tree like evolution system!
* Unlocks
* autopickup some items
* good targetting
* Not too many items
* Game should be over in an hour