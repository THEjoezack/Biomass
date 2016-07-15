Simple roguelike expiriment to gain some experience (namely TypeScript) and have a little fun along the way.

Standing on the shoulders of greatness:
https://github.com/ondras/rot.js
https://github.com/jokeofweek/jsrogue/

Play me here: https://thejoezack.github.io/Biomass/

## Get Started developing
* npm cache clean #(if you run into anything weird)
* npm install gulp #(if you don't have it already)
* npm install #(from dir)
* gulp bower #(get ROT)
* gulp
* gulp test
* npm install -g http-server
* http-server
* go to http://localhost:8080

## Active deveopment
Developing a tree based passive trait system that will allow the player to purchase and upgrade traits using the xp ("biomass") they accumulate.

Only have place holder data in place, and there's still quite a bit to do.

Attempting to keep a focused listof

* Evolution theming (ongoing)
* Basic UI/UX improvements (ongoing)
* Passive Trait System
  * -Load from file-
  * -Figure out which traits are selectable, given a tree-
    * Trait screen
      * -Load traits from file-
      * -Traits should "add" in additional stats-
      * Allow player to spend biomass on traits
      * Buying trait shouldn't close the subscreen
      * Show that TraitGainer has a dependency on ExperienceGainer
  * View traits on character screen
  * Replacements should actually replace!
  * Dice or numeric style modifications
  * "Digging" should be a trait!
  * Add percentage to act
  * Different Damage/Resistant types

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