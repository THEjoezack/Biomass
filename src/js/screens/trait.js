Game.Screen.traitScreen = {
    setup: function(entity) {
        // Must be called before rendering.
        this._entity = entity;
        this._sourceTraits = sourceTraits; // TODO Global
    },
    render: function(display) {
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        display.drawText(0, 0, 'Choose a trait to purchase: ');
        var selectedTraits = this._entity.getSelectedTraits();

        var comparator = new Traits.TraitNodeComparator();
        this._options = comparator.getPurchasableTraits(this._sourceTraits,selectedTraits);

        // Iterate through each of our options
        for (var i = 0; i < this._options.length; i++) {
            display.drawText(
                0,
                2 + i, 
                letters.substring(i, i + 1) + ' - ' + this._options[i].node.id + ' (' + this._options[i].node.cost + ' biomass)'
            );
        }

        if(!this._options.length) {
            display.drawText(
                0,
                2, 
                'Nothing left to get!'
            );
        }

        // Render remaining stat points
        display.drawText(0, 4 + this._options.length,
            "Biomass: " + this._entity.getExperience());
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            // If a letter was pressed, check if it matches to a valid option.
            if (inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z) {
                // Check if it maps to a valid item by subtracting 'a' from the character
                // to know what letter of the alphabet we used.
                var index = inputData.keyCode - ROT.VK_A;
                if (this._options[index]) {
                    // TODO check if the player can afford it
                    // TODO show description
                    this._entity.addTrait(this._entity, this._options[index]);
                    // TODO decrease biomass
                    // TODO why does refresh leave?
                    Game.refresh();
                }
            }

            // If a letter was pressed, check if it matches to a valid option.
            if (inputData.keyCode >= ROT.VK_ESCAPE) {
                Game.Screen.playScreen.setSubScreen(undefined);
            }
        }
    }
};