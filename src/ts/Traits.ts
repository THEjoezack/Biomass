/**
 * The trait module defines classes related to abilities that the
 * characters can acquire to enhance or add new abilities. 
 */
module Traits {
    /**
     * Simple interface that classes can implement to "hydrate"
     * themselves from json.
     */
    interface Loadable {
        load(input:any):void;
    }

    /**
     * Represents abilities that can be added together to enhance
     * character abilities.
     * TODO: Might need to move somewhere better?
     */
    export class CumulativeEffect implements Loadable {
        description:string;
        percentage:number;
        maxHp:string;
        defense:string;
        defenseType:string;
        damage:string;
        damageType:string;
        on:string;
        constructor(input?:any) {
            if(input != null) {
                this.load(input);
            }
        }
        load(input:any):void {
            this.description = input.description;
            this.percentage = input.percentage;
            this.maxHp = input.maxHp;
            this.defense = input.defense;
            this.defenseType = input.defenseType;
            this.damage = input.damage;
            this.damageType = input.damageType;
            this.on = input.on;
        }
    }

    /**
     * Traits represent passive or active abilities that can be
     * acquired by a character.
     */
    export class Trait implements Loadable {
        id: string;
        name: string;
        cost: number;
        effects: Array<CumulativeEffect>;
        replacesId: string;
        requiresId: string;
        constructor(input?:any) {
            if(input != null) {
                this.load(input);
            } else {
                this.effects = new Array<CumulativeEffect>();
            }
        }
        load(input:any):void {
            this.id = input.id;
            this.name = input.name;
            this.cost = input.cost;
            this.replacesId = input.replacesId;
            this.requiresId = input.requiresId;
            let effects = new Array<CumulativeEffect>();
            if(input.effects != null) {
                for (let inputEffect of input.effects) {
                    let effect = new CumulativeEffect(inputEffect);
                    effects.push(effect);
                }
            }
            this.effects = effects;
        }
    }

    /**
     * Simple interface that allows for strongly typed closures for traversals
     */
    interface TraitNodeTraversalAction {
        (node:TraitNode):boolean;
    }

    /**
     * Represents the trait tree.
     */
    export class TraitNode implements Loadable {
        node: Trait;
        children: Array<TraitNode>;
        constructor(node?:Trait,children?:Array<TraitNode>) {
            this.node = node || new Trait();
            this.children = children || new Array<TraitNode>();
        }
        
        /**
         * Clones node, ignoring children
         * Returns true if the node was added.
         */
        shallowCopy():TraitNode {
            var clone = new Trait();
            clone.load(this.node);
            
            var root = new TraitNode();
            root.node = clone;
            return root;
        }

        /**
         * Add a node to the appropriate spot in the hierarchy, assuming the requiresId is met.
         * Returns true if the node was added.
         */
        add(child:TraitNode):boolean {
            let itemAdded = false;
            this.traverse(
                function(node:TraitNode):boolean {
                    if(child.node.requiresId == null || node.node.id == child.node.requiresId) {
                        node.children.push(child);
                        itemAdded = true;
                        return true;
                    }
                    return false;
                }
            );
            return itemAdded;
        }

        /**
         * Returns (the first, though there shouldn't be duplicates) TraitNode for a given id.
         * Returns null if none found.
         */
        findById(id:string, children?:Array<TraitNode>):TraitNode {
            let result:TraitNode = null;
            this.traverse(
                function(node:TraitNode):boolean {
                    if(node.node.id == id) {
                        result = node;
                        return true;
                    }
                    return false;
                }
            );
            return result;
        }

        /**
         * Turn a tree into an array, depth first. Returns a clone
         */
        flatten():Array<TraitNode> {
            let result = new Array<TraitNode>();
            this.traverse(
                function(node:TraitNode):boolean {
                    if(node.node.id) {
                        result.push(node);
                    }
                    return false;
                }
            );
            return result;
        }

        /**
         * Traverse the tree performing the action for each node
         * (including the root). If the action returns "true"
         * then the execution will stop.
         * Returns true if condition is action returns true, false otherwise.
         */
        traverse(action:TraitNodeTraversalAction, node?:TraitNode):boolean {
            let root = node || this;
            let rootResult = action(root);

            if(rootResult) {
                return true;
            }

            for(let c of root.children) {
                let result = this.traverse(action, c);
                if(result) {
                    return true;
                }
            }

            return false;
        }

        load(input:any):void {
            // TODO: Validation? dupe / missing dependencies?
            this.children = new Array<TraitNode>();
            if(input.traits) {
                let traits = new Array<Trait>();
                for (let inputTrait of input.traits) {
                    let trait = new Trait();
                    trait.load(inputTrait);
                    
                    let traitNode = new TraitNode();
                    traitNode.node = trait;

                    if(traitNode.node.requiresId == null) {
                        this.children.push(traitNode);
                    } else {
                        let parentNode = this.findById(traitNode.node.requiresId);
                        if(parentNode == null) {
                            throw "parentNode not found for id:" + traitNode.node.requiresId;
                        }
                        parentNode.children.push(traitNode);
                    }
                }
            }
        }
    }

    /**
     * Compares TraitNode to each other
     */
    export class TraitNodeComparator {
        /**
         * Finds items that either have no requirements or the requirements have been met in another (optional tree)
         */
        getPurchasableTraits(source:TraitNode,previouslySelected?:TraitNode):Array<TraitNode> {
            let selected = previouslySelected || new TraitNode();
            let result = new Array<TraitNode>();

            // flatten the source
            let flattenedSource = source.flatten();

            // loop through and look for items that are NOT already selected
            // and either have no requirements, or have their requirements fulfilled
            for(var i = 0; i < flattenedSource.length; i++) {
                let sourceNode = flattenedSource[i];
                let sourceTrait = sourceNode.node;
                let sourceId = sourceTrait.id;
                let selectedNode = selected.findById(sourceId);

                if(selectedNode) {
                    // trait has already been selected
                    // do nothing
                } else if (sourceTrait.requiresId == null) {
                    // has no requirements, automatically available
                    result.push(sourceNode);
                } else if(selected.findById(sourceTrait.requiresId)) {
                    result.push(sourceNode);
                } else {
                    // no match!
                }
            }

            return result;
        }

    }
}