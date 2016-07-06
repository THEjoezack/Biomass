module Traits {
    interface Loadable {
        load(input:any):void;
    }

    export class CumulativeEffect implements Loadable {
        description:string;
        percentage:number;
        damage:string;
        damagetype:string;
        on:string;
        load(input:any):void {
            this.description = input.description;
            this.percentage = input.percentage;
            this.damage = input.damage;
            this.damagetype = input.damagetype;
            this.on = input.on;
        }
    }

    export class Trait implements Loadable {
        id: string;
        name: string;
        cost: number;
        effects: Array<CumulativeEffect>;
        replacesId: string;
        requiresId: string;
        constructor() {
            this.effects = new Array<CumulativeEffect>();
        }
        load(input:any):void {
            this.id = input.id;
            this.name = input.name;
            this.cost = input.cost;
            this.replacesId = input.replacesId;
            this.requiresId = input.requiresId;
            if(input.effects) {
                let effects = new Array<CumulativeEffect>();
                for (let inputEffect of input.effects) {
                    let effect = new CumulativeEffect();
                    effect.load(inputEffect);
                    effects.push(effect);
                }
                this.effects = effects;
            }
        }
    }

    export class TraitNode implements Loadable {
        node: Trait;
        children: Array<TraitNode>;
        constructor() {
            this.node = new Trait();
            this.children = new Array<TraitNode>();
        }
        // depth first search..though a breadth is probably better?
        findById(id:string):TraitNode {
            if(this.node.id == id) {
                return this;
            }
            for(let c of this.children) {
                let result = c.findById(id);
                if(result != null) {
                    return result;
                }
            }
            return null;
        }
        load(input:any):void {
            // TODO: Validation? dupe / missing dependencies?
            let children = new Array<TraitNode>();
            if(input.traits) {
                let traits = new Array<Trait>();
                for (let inputTrait of input.traits) {
                    let trait = new Trait();
                    trait.load(inputTrait);
                    
                    let traitNode = new TraitNode();
                    traitNode.node = trait;

                    if(traitNode.node.requiresId == null) {
                        children.push(traitNode);
                    }
                    else {
                        let parentNode = findById(traitNode.node.requiresId);
                        parentNode.children.push(parentNode);
                    }
                }
            }
            this.children = children;
        }
    }
}