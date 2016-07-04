var fs = require('fs');
var transpiled = fs.readFileSync('./dist/Traits.js','utf-8');
eval(transpiled);

describe("A trait", function() {
    it("can be loaded from a json object", function() {
        var trait = new Traits.Trait();
        trait.load({ name: 'name' });
        expect(trait.name).toEqual('name');
    });
 
    it("can have multiple effects associated with it", function () {
        var trait = new Traits.Trait();
        trait.load({
            name: 'name',
            effects: [
                {
                    description: "test 1"
                },
                {
                    description: "test 2"
                },
            ]
        });
        expect(trait.effects[0].description).toEqual('test 1');
        expect(trait.effects[1].description).toEqual('test 2');
    });
});

describe("A cumulative effect", function() {
    it("can be loaded from a json object", function() {
        var effect = new Traits.CumulativeEffect();
        effect.load({ description: 'description' });
        expect(effect.description).toEqual('description');
    });
});