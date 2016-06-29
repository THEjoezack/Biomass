// Define our playing screen
Game.Screen.playScreen = {
    _player: null,
    _gameEnded: false,
    _subScreen: null,
    enter: function() {
        // Create a map based on our size parameters
        var width = 100;
        var height = 48;
        var depth = 6;
        // Create our map from the tiles and player
        this._player = new Game.Entity(Game.PlayerTemplate);
        var tiles = new Game.Builder(width, height, depth).getTiles();
        var map = new Game.Map.Cave(tiles, this._player);
        // Start the map's engine
        map.getEngine().start();
    },
    exit: function() { console.log("Exited play screen."); },
    render: function(display) {
        // Render subscreen if there is one
        if (this._subScreen) {
            this._subScreen.render(display);
            return;
        }

        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();

        // Render the tiles
        this.renderTiles(display);

        // Get the messages in the player's queue and render them
        var messages = this._player.getMessages();
        var messageY = 0;
        for (var i = 0; i < messages.length; i++) {
            // Draw each message, adding the number of lines
            messageY += display.drawText(
                0, 
                messageY,
                '%c{white}%b{black}' + messages[i]
            );
        }
        // Render player stats
        var stats = '%c{white}%b{black}';
        stats += vsprintf('HP: %d/%d L: %d XP: %d', 
            [this._player.getHp(), this._player.getMaxHp(),
             this._player.getLevel(), this._player.getExperience()]);
        display.drawText(0, screenHeight, stats);
        // Render hunger state
        var hungerState = this._player.getHungerState();
        display.drawText(screenWidth - hungerState.length, screenHeight, hungerState);
    },
    getScreenOffsets: function() {
        // Make sure we still have enough space to fit an entire game screen
        var topLeftX = Math.max(0, this._player.getX() - (Game.getScreenWidth() / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._player.getMap().getWidth() -
            Game.getScreenWidth());
        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (Game.getScreenHeight() / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._player.getMap().getHeight() - Game.getScreenHeight());
        return {
            x: topLeftX,
            y: topLeftY
        };
    },
    renderTiles: function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        var offsets = this.getScreenOffsets();
        var topLeftX = offsets.x;
        var topLeftY = offsets.y;
        // This object will keep track of all visible map cells
        var visibleCells = {};
        // Store this._player.getMap() and player's z to prevent losing it in callbacks
        var map = this._player.getMap();
        var currentDepth = this._player.getZ();
        // Find all visible cells and update the object
        map.getFov(currentDepth).compute(
            this._player.getX(), this._player.getY(), 
            this._player.getSightRadius(), 
            function(x, y, radius, visibility) {
                visibleCells[x + "," + y] = true;
                // Mark cell as explored
                map.setExplored(x, y, currentDepth, true);
            });
        // Render the explored map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                if (map.isExplored(x, y, currentDepth)) {
                    // Fetch the glyph for the tile and render it to the screen
                    // at the offset position.
                    var glyph = map.getTile(x, y, currentDepth);
                    var foreground = glyph.getForeground();
                    // If we are at a cell that is in the field of vision, we need
                    // to check if there are items or entities.
                    if (visibleCells[x + ',' + y]) {
                        // Check for items first, since we want to draw entities
                        // over items.
                        var items = map.getItemsAt(x, y, currentDepth);
                        // If we have items, we want to render the top most item
                        if (items) {
                            glyph = items[items.length - 1];
                        }
                        // Check if we have an entity at the position
                        if (map.getEntityAt(x, y, currentDepth)) {
                            glyph = map.getEntityAt(x, y, currentDepth);
                        }
                        // Update the foreground color in case our glyph changed
                        foreground = glyph.getForeground();
                    } else {
                        // Since the tile was previously explored but is not 
                        // visible, we want to change the foreground color to
                        // dark gray.
                        foreground = 'darkGray';
                    }
                    display.draw(
                        x - topLeftX,
                        y - topLeftY,
                        glyph.getChar(), 
                        foreground, 
                        glyph.getBackground());
                }
            }
        }
    },
    handleInput: function(inputType, inputData) {
        // If the game is over, enter will bring the user to the losing screen.
        if (this._gameEnded) {
            if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
            // Return to make sure the user can't still play
            return;
        }
        // Handle subscreen input if there is one
        if (this._subScreen) {
            this._subScreen.handleInput(inputType, inputData);
            return;
        }
        if (inputType === 'keydown') {
            // Movement
            if (inputData.keyCode === ROT.VK_LEFT) {
                this.move(-1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.move(1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.move(0, -1, 0);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.move(0, 1, 0);
            } else if (inputData.keyCode === ROT.VK_I) {
                // Show the inventory screen
                this.showItemsSubScreen(Game.Screen.inventoryScreen, this._player.getItems(),
                    'You are not carrying anything.');
                return;
            } else if (inputData.keyCode === ROT.VK_D) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.dropScreen, this._player.getItems(),
                    'You have nothing to drop.');
                return;
            } else if (inputData.keyCode === ROT.VK_E) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.eatScreen, this._player.getItems(),
                   'You have nothing to eat.');
                return;
            } else if (inputData.keyCode === ROT.VK_W) {
                if (inputData.shiftKey) {
                    // Show the wear screen
                    this.showItemsSubScreen(Game.Screen.wearScreen, this._player.getItems(),
                        'You have nothing to wear.');
                } else {
                    // Show the wield screen
                    this.showItemsSubScreen(Game.Screen.wieldScreen, this._player.getItems(),
                        'You have nothing to wield.');
                }
                return;
            } else if (inputData.keyCode === ROT.VK_X) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.examineScreen, this._player.getItems(),
                   'You have nothing to examine.');
                return;
            } else if (inputData.keyCode === ROT.VK_COMMA) {
                var items = this._player.getMap().getItemsAt(this._player.getX(), 
                    this._player.getY(), this._player.getZ());
                // If there is only one item, directly pick it up
                if (items && items.length === 1) {
                    var item = items[0];
                    if (this._player.pickupItems([0])) {
                        Game.sendMessage(this._player, "You pick up %s.", [item.describeA()]);
                    } else {
                        Game.sendMessage(this._player, "Your inventory is full! Nothing was picked up.");
                    }
                } else {
                    this.showItemsSubScreen(Game.Screen.pickupScreen, items,
                        'There is nothing here to pick up.');
                } 
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._player.getMap().getEngine().unlock();
        } else if (inputType === 'keypress') {
            var keyChar = String.fromCharCode(inputData.charCode);
            if (keyChar === '>') {
                this.move(0, 0, 1);
            } else if (keyChar === '<') {
                this.move(0, 0, -1);
            } else if (keyChar === ';') {
                // Setup the look screen.
                var offsets = this.getScreenOffsets();
                Game.Screen.lookScreen.setup(this._player,
                    this._player.getX(), this._player.getY(),
                    offsets.x, offsets.y);
                this.setSubScreen(Game.Screen.lookScreen);
                return; 
            } else if (keyChar === '?') {
                // Setup the look screen.
                this.setSubScreen(Game.Screen.helpScreen);
                return;
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._player.getMap().getEngine().unlock();
        } 
    },
    move: function(dX, dY, dZ) {
        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        var newZ = this._player.getZ() + dZ;
        // Try to move to the new cell
        this._player.tryMove(newX, newY, newZ, this._player.getMap());
    },
    setGameEnded: function(gameEnded) {
        this._gameEnded = gameEnded;
    },
    setSubScreen: function(subScreen) {
        this._subScreen = subScreen;
        // Refresh screen on changing the subscreen
        Game.refresh();
    },
    showItemsSubScreen: function(subScreen, items, emptyMessage) {
        if (items && subScreen.setup(this._player, items) > 0) {
            this.setSubScreen(subScreen);
        } else {
            Game.sendMessage(this._player, emptyMessage);
            Game.refresh();
        }
    }
};