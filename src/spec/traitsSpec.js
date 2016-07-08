var fs = require('fs');
var transpiled = fs.readFileSync('./dist/Traits.js','utf-8');
eval(transpiled);

describe("A trait", function() {
    it("can be loaded from a json object", function() {
        var trait = new Traits.Trait({ name: 'name' });
        expect(trait.name).toEqual('name');
    });
 
    it("can have multiple effects associated with it", function () {
        var trait = new Traits.Trait({
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
        var effect = new Traits.CumulativeEffect({ description: 'description' });
        expect(effect.description).toEqual('description');
    });
});

describe("A trait node", function() {

    it("has children initialized by default", function() {
        var target = new Traits.TraitNode();
        expect(target.children).toEqual([]);
    });

    it("can find itself by id", function() {
        var root = new Traits.Trait({ id: 'root' });
        var target = new Traits.TraitNode(root);
        var actual = target.findById('root');
        expect(root).toEqual(actual.node);
    });

    it("can find children by id", function() {
        var root = new Traits.Trait({ id: 'root' });
        var target = new Traits.TraitNode(root);
        var child = new Traits.Trait({ id: 'child' });
        var childNode = new Traits.TraitNode(child);
        target.children.push(childNode);

        var actual = target.findById('child');
        expect(child).toEqual(actual.node);
    });

    describe("that is loaded from a json object (array)", function() {
        var sampleInput = {
            "traits": [
                {
                    "id": "topLevelNoChildren"
                },
                {
                    "id": "topLevelWithChildren"
                },
                {
                    "id": "children",
                    "requiresId": "topLevelWithChildren"
                },
            ]
        };
        it("and can have nodes with no children", function() {
            var root = new Traits.TraitNode();
            root.load(sampleInput); // blech...should probably change the constructor so it loads by default?
            var actual = root.findById('topLevelNoChildren');
            expect(actual.children.length).toBe(0);
            expect(root.children.length).toBe(2);
        });
        it("and can have nodes with children", function() {
            var root = new Traits.TraitNode();
            root.load(sampleInput); // blech...should probably change the constructor so it loads by default?
            var actual = root.findById('topLevelWithChildren');
            expect(actual).not.toBe(null);
            expect(actual.children.length).toBe(1);
        });
        it("and can find children", function() {
            var root = new Traits.TraitNode();
            root.load(sampleInput); // blech...should probably change the constructor so it loads by default?
            var actual = root.findById('children');
            expect(actual).not.toBe(null);
            expect(actual.children.length).toBe(0);
        });
        
    });

});