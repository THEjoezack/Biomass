// Define our initial start screen
Game.Screen.startScreen = {
    enter: function() {    console.log("Entered start screen."); },
    exit: function() { console.log("Exited start screen."); },
    render: function(display) {
        // Render our prompt to the screen
        display.drawText(1,1, "%c{yellow}Rogue Biomass!");
        display.drawText(1,2, "A fork of jsrogue, using Rot.js!");
        display.drawText(1,4, "Press any key to start");
    },
    handleInput: function(inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            Game.switchScreen(Game.Screen.playScreen);
        }
    }
};