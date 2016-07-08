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
        damage:string;
        damagetype:string;
        on:string;
        constructor(input?:any) {
            if(input != null) {
                this.load(input);
            }
        }
        load(input:any):void {
            this.description = input.description;
            this.percentage = input.percentage;
            this.damage = input.damage;
            this.damagetype = input.damagetype;
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
         * Returns (the first, though there shouldn't be duplicates) TraitNode for a given id.
         * Returns null if none found.
         */
        findById(id:string, children?:Array<TraitNode>):TraitNode {
            let result:TraitNode = null;
            this.depthFirst(
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
         * Do a depth search travelersal of the tree performing the 
         * action for each node (including the root). If the action returns "true"
         * then the execution will stop.
         * Returns true if condition is action returns true, false otherwise.
         */
        depthFirst(action:TraitNodeTraversalAction, node?:TraitNode):boolean {
            let root = node || this;
            let rootResult = action(root);

            if(rootResult) {
                return true;
            }

            for(let c of root.children) {
                let result = this.depthFirst(action, c);
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
            // assuming that the trees do NOT have a similar structure

            // flatten each tree
            // loop through (oh no! n*n) and find all in source that have no requirements

            return result;
        }

        /**
         * Turn a tree into an area, depth first
         */
        flatten(source:TraitNode):Array<TraitNode> {
            let result = new Array<TraitNode>();
            return result;
        }
    }
}