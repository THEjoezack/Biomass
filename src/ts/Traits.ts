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

    interface DependencyNode extends Loadable {
        id:string;
        requiresId:string;
    }

    /**
     * Represents abilities that can be added together to enhance
     * character abilities.
     * TODO: Might need to move somewhere better?
     */
    export class CumulativeEffect implements Loadable {
        description:string;
        maxHp:string;
        sightRadius:string;
        defense:string;
        damage:string;
        on:string;
        constructor(input?:any) {
            if(input != null) {
                this.load(input);
            }
        }
        load(input:any):void {
            this.description = input.description;
            this.maxHp = input.maxHp;
            this.sightRadius = input.sightRadius;
            this.defense = input.defense;
            this.damage = input.damage;
            this.on = input.on;
        }
    }

    /**
     * Traits represent passive or active abilities that can be
     * acquired by a character.
     */
    export class Trait implements DependencyNode {
        
        id: string;
        name: string;
        cost: number;
        effects: Array<CumulativeEffect>;
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
    interface TreeNodeTraversalAction<T extends DependencyNode> {
        (node:TreeNode<T>):boolean;
    }


    /**
     * Simple tree.
     */
    export abstract class TreeNode<T extends DependencyNode> implements Loadable {
        node: T;
        children: Array<TreeNode<T>>;

        constructor(node:T, children?:Array<TreeNode<T>>) {
            this.node = node;
            this.children = children || new Array<TreeNode<T>>();
        }

        /**
         * Add a node to the appropriate spot in the hierarchy, assuming the requiresId is met.
         * Returns true if the node was added.
         */
        add(child:TreeNode<T>):boolean {
            let itemAdded = false;
            this.traverse(
                function(node:TreeNode<T>):boolean {
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
         * Returns (the first, though there shouldn't be duplicates) TreeNode for a given id.
         * Returns null if none found.
         */
        findById(id:string, children?:Array<TreeNode<T>>):TreeNode<T> {
            let result:TreeNode<T> = null;
            this.traverse(
                function(node:TreeNode<T>):boolean {
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
        flatten():Array<TreeNode<T>> {
            let result = new Array<TreeNode<T>>();
            this.traverse(
                function(node:TreeNode<T>):boolean {
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
        traverse(action:TreeNodeTraversalAction<T>, node?:TreeNode<T>):boolean {
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

        /**
         * Finds items that either have no requirements or the requirements have been met in another (optional tree)
         */
        getFreeNodes(selected?:TreeNode<T>):Array<TreeNode<T>> {
            let source = this;
            let result = new Array<TreeNode<T>>();

            // flatten the source
            let flattenedSource = source.flatten();

            // loop through and look for items that are NOT already selected
            // and either have no requirements, or have their requirements fulfilled
            for(var i = 0; i < flattenedSource.length; i++) {
                let sourceNode = flattenedSource[i];
                let sourceTrait = sourceNode.node;
                let sourceId = sourceTrait.id;
                let selectedNode = selected ? selected.findById(sourceId) : null;

                if(selectedNode) {
                    // trait has already been selected
                    // do nothing
                } else if (sourceTrait.requiresId == null) {
                    // has no requirements, automatically available
                    result.push(sourceNode);
                } else if(selected && selected.findById(sourceTrait.requiresId)) {
                    result.push(sourceNode);
                } else {
                    // no match!
                }
            }

            return result;
        }
        abstract load(input:any):void;
    }

    export class TraitNode extends TreeNode<Trait> {

        constructor(node?:Trait, children?:Array<TraitNode>) {
            super(node || new Trait(), children || new Array<TraitNode>());
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

        shallowCopy():TraitNode {
            var clone = new Trait();
            var root = new TraitNode;
            root.node = clone;
            return root;
        }

    }

}