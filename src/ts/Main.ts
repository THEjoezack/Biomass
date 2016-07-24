///<reference path="Traits.ts"/>
///<reference path="Items.ts"/>

function loadFile(file:string, requestListener:(ev:Event) => any) {
    let request = new XMLHttpRequest();
    request.onload = requestListener;
    request.open("get", file, true);

    request.send();
}

// ew global!!
var sourceTraits = new Traits.TraitNode();
loadFile("src/data/traits.json", function():void { // TODO don't pull from src
    let response = JSON.parse(this.responseText);
    sourceTraits.load(response);
});

var sourceItems = new Items.ItemNode();
loadFile("src/data/items.json", function():void { // TODO don't pull from src
    let response = JSON.parse(this.responseText);
    sourceItems.load(response);
});