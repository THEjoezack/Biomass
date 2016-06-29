Game.Screen.examineScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to examine',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return true;
    },
    ok: function(selectedItems) {
        var keys = Object.keys(selectedItems);
        if (keys.length > 0) {
            var item = selectedItems[keys[0]];
            Game.sendMessage(this._player, "It's %s (%s).", 
                [
                    item.describeA(false),
                    item.details()
                ]);
        }
        return true;
    }
});