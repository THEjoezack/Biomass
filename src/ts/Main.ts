///<reference path="Traits.ts"/>
let root = new Traits.TraitNode();
root.node = new Traits.Trait();
root.node.load({ name: 'name' });

// ew global!!
var sourceTraits = new Traits.TraitNode();

// read in the json file
// extract all items that do not have a replaces or requires
function requestListener () {
    let response = JSON.parse(this.responseText);
    sourceTraits.load(response);
}

let request = new XMLHttpRequest();
request.onload = requestListener;
request.open("get", "src/data/traits.json", true); // TODO don't pull from src

request.send();