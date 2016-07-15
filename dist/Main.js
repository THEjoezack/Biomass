var root = new Traits.TraitNode();
root.node = new Traits.Trait();
root.node.load({ name: 'name' });
var sourceTraits = new Traits.TraitNode();
function requestListener() {
    var response = JSON.parse(this.responseText);
    sourceTraits.load(response);
}
var request = new XMLHttpRequest();
request.onload = requestListener;
request.open("get", "src/data/traits.json", true);
request.send();
