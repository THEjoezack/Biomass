Game.Screen.gainStatScreen = {
    setup: function(entity) {
        // Must be called before rendering.
        this._entity = entity;
        this._options = entity.getStatOptions();
    },
    render: function(display) {
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        display.drawText(0, 0, 'Choose a stat to increase: ');

        // Iterate through each of our options
        for (var i = 0; i < this._options.length; i++) {
            display.drawText(0, 2 + i, 
                letters.substring(i, i + 1) + ' - ' + this._options[i][0]);
        }

        // Render remaining stat points
        display.drawText(0, 4 + this._options.length,
            "Remaining points: " + this._entity.getStatPoints());   
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            // If a letter was pressed, check if it matches to a valid option.
            if (inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z) {
                // Check if it maps to a valid item by subtracting 'a' from the character
                // to know what letter of the alphabet we used.
                var index = inputData.keyCode - ROT.VK_A;
                if (this._options[index]) {
                    // Call the stat increasing function
                    this._options[index][1].call(this._entity);
                    // Decrease stat points
                    this._entity.setStatPoints(this._entity.getStatPoints() - 1);
                    // If we have no stat points left, exit the screen, else refresh
                    if (this._entity.getStatPoints() == 0) {
                        Game.Screen.playScreen.setSubScreen(undefined);
                    } else {
                        Game.refresh();
                    }
                }
            }
        }
    }
};