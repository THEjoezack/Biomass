///<reference path="Traits.ts"/>
let root = new Traits.TraitNode();
root.node = new Traits.Trait();
root.node.load({ name: 'name' });

// read in the json file
// extract all items that do not have a replaces or requires