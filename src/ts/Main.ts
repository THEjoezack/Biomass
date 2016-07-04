///<reference path="Traits.ts"/>
let root = new Traits.TraitNode();
root.node = new Traits.Trait();
root.node.load({ name: 'name' });

// read in the json file
// extract all items that do not have a replaces or requires
function requestListener () {
    var levels = JSON.parse(this.responseText);
    console.log(levels);
}

var request = new XMLHttpRequest();
request.onload = requestListener;
request.open("get", "src/data/traits.json", true); // TODO don't pull from src
request.send();