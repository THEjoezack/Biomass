///<reference path="TreeNodes.ts"/>

/**
 * The trait module defines classes related to abilities that the
 * characters can acquire to enhance or add new abilities. 
 */
module Traits {

    /**
     * Represents abilities that can be added together to enhance
     * character abilities.
     * TODO: Might need to move somewhere better?
     */
    export class CumulativeEffect implements TreeNodes.Loadable {
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
    export class Trait implements TreeNodes.DependencyNode {
        
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

    export class TraitNode extends TreeNodes.TreeNode<Trait> {

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
            clone.load(this);
            var root = new TraitNode;
            root.node = clone;
            return root;
        }

    }

}