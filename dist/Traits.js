var Traits;
(function (Traits) {
    var CumulativeEffect = (function () {
        function CumulativeEffect(input) {
            if (input != null) {
                this.load(input);
            }
        }
        CumulativeEffect.prototype.load = function (input) {
            this.description = input.description;
            this.percentage = input.percentage;
            this.maxHp = input.maxHp;
            this.sightRadius = input.sightRadius;
            this.defense = input.defense;
            this.defenseType = input.defenseType;
            this.damage = input.damage;
            this.damageType = input.damageType;
            this.on = input.on;
        };
        return CumulativeEffect;
    }());
    Traits.CumulativeEffect = CumulativeEffect;
    var Trait = (function () {
        function Trait(input) {
            if (input != null) {
                this.load(input);
            }
            else {
                this.effects = new Array();
            }
        }
        Trait.prototype.load = function (input) {
            this.id = input.id;
            this.name = input.name;
            this.cost = input.cost;
            this.replacesId = input.replacesId;
            this.requiresId = input.requiresId;
            var effects = new Array();
            if (input.effects != null) {
                for (var _i = 0, _a = input.effects; _i < _a.length; _i++) {
                    var inputEffect = _a[_i];
                    var effect = new CumulativeEffect(inputEffect);
                    effects.push(effect);
                }
            }
            this.effects = effects;
        };
        return Trait;
    }());
    Traits.Trait = Trait;
    var TraitNode = (function () {
        function TraitNode(node, children) {
            this.node = node || new Trait();
            this.children = children || new Array();
        }
        TraitNode.prototype.shallowCopy = function () {
            var clone = new Trait();
            clone.load(this.node);
            var root = new TraitNode();
            root.node = clone;
            return root;
        };
        TraitNode.prototype.add = function (child) {
            var itemAdded = false;
            this.traverse(function (node) {
                if (child.node.requiresId == null || node.node.id == child.node.requiresId) {
                    node.children.push(child);
                    itemAdded = true;
                    return true;
                }
                return false;
            });
            return itemAdded;
        };
        TraitNode.prototype.findById = function (id, children) {
            var result = null;
            this.traverse(function (node) {
                if (node.node.id == id) {
                    result = node;
                    return true;
                }
                return false;
            });
            return result;
        };
        TraitNode.prototype.flatten = function () {
            var result = new Array();
            this.traverse(function (node) {
                if (node.node.id) {
                    result.push(node);
                }
                return false;
            });
            return result;
        };
        TraitNode.prototype.traverse = function (action, node) {
            var root = node || this;
            var rootResult = action(root);
            if (rootResult) {
                return true;
            }
            for (var _i = 0, _a = root.children; _i < _a.length; _i++) {
                var c = _a[_i];
                var result = this.traverse(action, c);
                if (result) {
                    return true;
                }
            }
            return false;
        };
        TraitNode.prototype.load = function (input) {
            this.children = new Array();
            if (input.traits) {
                var traits = new Array();
                for (var _i = 0, _a = input.traits; _i < _a.length; _i++) {
                    var inputTrait = _a[_i];
                    var trait = new Trait();
                    trait.load(inputTrait);
                    var traitNode = new TraitNode();
                    traitNode.node = trait;
                    if (traitNode.node.requiresId == null) {
                        this.children.push(traitNode);
                    }
                    else {
                        var parentNode = this.findById(traitNode.node.requiresId);
                        if (parentNode == null) {
                            throw "parentNode not found for id:" + traitNode.node.requiresId;
                        }
                        parentNode.children.push(traitNode);
                    }
                }
            }
        };
        return TraitNode;
    }());
    Traits.TraitNode = TraitNode;
    var TraitNodeComparator = (function () {
        function TraitNodeComparator() {
        }
        TraitNodeComparator.prototype.getPurchasableTraits = function (source, previouslySelected) {
            var selected = previouslySelected || new TraitNode();
            var result = new Array();
            var flattenedSource = source.flatten();
            for (var i = 0; i < flattenedSource.length; i++) {
                var sourceNode = flattenedSource[i];
                var sourceTrait = sourceNode.node;
                var sourceId = sourceTrait.id;
                var selectedNode = selected.findById(sourceId);
                if (selectedNode) {
                }
                else if (sourceTrait.requiresId == null) {
                    result.push(sourceNode);
                }
                else if (selected.findById(sourceTrait.requiresId)) {
                    result.push(sourceNode);
                }
                else {
                }
            }
            return result;
        };
        return TraitNodeComparator;
    }());
    Traits.TraitNodeComparator = TraitNodeComparator;
})(Traits || (Traits = {}));
