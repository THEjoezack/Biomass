Game.Screen.craftingScreen = {
    setup: function(entity) {
        // Must be called before rendering.
        this._entity = entity;
        this._sourceItems = sourceItems; // TODO Global
    },
    render: function(display) {
        this._display = display;
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        display.drawText(0, 0, 'Choose an item to craft: ');

        var craftedItems = null;//this._entity.getCraftableItems();
        this._options = this._sourceItems.getFreeNodes();

        // Iterate through each of our options
        var lineIndex = 2;
        for (var i = 0; i < this._options.length; i++) {
            lineIndex += 1;

            var option = this._options[i].node;

            display.drawText(
                0,
                lineIndex, 
                letters.substring(i, i + 1) + ' - ' + option.name + ' (' + option.cost + ' biomass)'
            );

            if(option.attackValue) {
                lineIndex += 1;
                display.drawText(
                    0,
                    lineIndex, 
                    '\t   +' + option.attackValue + ' Attack'
                );
            }

            if(option.defenseValue) {
                lineIndex += 1;
                display.drawText(
                    0,
                    lineIndex, 
                    '\t   +' + option.defenseValue + ' Defense'
                );
            }
            lineIndex += 1;

        }

        if(!this._options.length) {
            display.drawText(
                0,
                2, 
                'Nothing to craft!'
            );
        }

        // Render remaining stat points
        lineIndex += 2;
        display.drawText(0, lineIndex, "Biomass: " + this._entity.getExperience());
        this._lineIndex = lineIndex;
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            // If a letter was pressed, check if it matches to a valid option.
            if (inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z) {
                // Check if it maps to a valid item by subtracting 'a' from the character
                // to know what letter of the alphabet we used.
                var index = inputData.keyCode - ROT.VK_A;
                if (this._options[index]) {
                    // add to inventory
                    // todo fill in plugins?
                    // deduct cost
                    var result = false;
                    if(result) {
                        Game.refresh();
                    } else {
                        this._display.drawText(
                            0,
                            this._lineIndex + 1, 
                            '%c{yellow}You can\'t afford that right now!'
                        );
                    }
                }
            }

            // If a letter was pressed, check if it matches to a valid option.
            if (inputData.keyCode == ROT.VK_ESCAPE) {
                Game.Screen.playScreen.setSubScreen(undefined);
            }
        }
    }
};