Game.Screen.craftingScreen = {
    setup: function(entity) {
        // Must be called before rendering.
        this._entity = entity;
        this._sourceTraits = sourceTraits; // TODO Global
    },
    render: function(display) {
        this._display = display;
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        display.drawText(0, 0, 'Choose an item to craft: ');

        var selectedTraits = this._entity.getSelectedTraits();
        this._options = this._sourceTraits.getFreeNodes(selectedTraits);

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

            var effects = option.effects;
            for (var j = 0; j < effects.length; j++) {
                lineIndex += 1;
                display.drawText(
                    0,
                    lineIndex, 
                    '\t   ' + effects[j].description
                );
            }
            lineIndex += 1;

        }

        if(!this._options.length) {
            display.drawText(
                0,
                2, 
                'Nothing left to get!'
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
                    var result = this._entity.addTrait(this._entity, this._options[index]);
                    if(result) {
                        Game.refresh();
                    } else {
                        this._display.drawText(
                            0,
                            this._lineIndex + 1, 
                            '%c{yellow}You can\'t afford that yet!'
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