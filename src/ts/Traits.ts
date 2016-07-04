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
        load(input:any):void {
            this.id = input.id;
            this.name = input.name;
            this.cost = input.cost;
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

    export class TraitNode {
        node: Trait;
        children: Array<Trait>;
    }
}