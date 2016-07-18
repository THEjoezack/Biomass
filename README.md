Simple roguelike expiriment to gain some experience (namely TypeScript) and have a little fun along the way.

Standing on the shoulders of greatness:
https://github.com/ondras/rot.js
https://github.com/jokeofweek/jsrogue/

Play me here: https://thejoezack.github.io/Biomass/

### Project Goals
* Have fun
* Learn TypeScript
* Learn more about Roguelikes
* Focus on the minimum viable product!

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

### Working on
* Ability menu
 * hit "a" to show all abilities
 * selecting an ability prompts for a target
 * be able to purchase abilities through trait system?
 * be able to configure a short-cut key
 * cooldowns

#### Backlog
* Better trait integration
 * Character screen with status and traits
 * More traits!
 * What to do about the level system?
 * Evolution theming (ongoing)
 * Basic UI/UX improvements (ongoing)
 * Better trait tuning
 * Monsters should get traits too!
* Trait improvements
 * Need to show descriptions of selectable items
 * XP gain?
 * More advanced traits
  * Mutually Exclusive traits
  * Digging
  * Passive Speed
  * Passive Regeneration
  * Conditional bonus?
  * Percentage bonuses
  * Active abilities?
  * Different Damage/Resistant types
  * Replacements should actually replace items
  * Player should be alerted when they can afford a new trait? 
* Configurable keys

### Core mechanics
* Evolution theme, monsters should evolve too!
* Use "biomass" as singular currency to level up, evolve, heal, buff items

## Nice to haves that I care about
* passive trait evolution system! (in progress)
* a game should last no longer than 30 minutes
* tiles!
* unlock system 
* autopickup some items
* good targetting
* Not too many items