///<reference path="TreeNodes.ts"/>

module Items {

    /**
     * Items represent passive or active abilities that can be
     * acquired by a character.
     */
    export class Item implements TreeNodes.DependencyNode {
        
        id: string;
        requiresId: string;
        name: string;
        cost: number;
        character: string;
        foreground: string;
        attackValue: number;
        defenseValue: number;
        wieldable: boolean;
        tags: Array<string>;

        constructor(input?:any) {
            if(input != null) {
                this.load(input);
            }
        }
        
        load(input:any):void {
            this.id = input.id;
            this.requiresId = input.requiresId;
            this.name = input.name;
            this.cost = input.cost;
            this.character = input.character;
            this.foreground = input.foreground;
            this.attackValue = input.attackValue;
            this.defenseValue = input.defenseValue;
            this.wieldable = input.wieldable;
            this.tags = this.tags;
        }
    }

    export class ItemNode extends TreeNodes.TreeNode<Item> {

        constructor(node?:Item, children?:Array<ItemNode>) {
            super(node || new Item(), children || new Array<ItemNode>());
        }

        load(input:any):void {
            // TODO: Validation? dupe / missing dependencies?
            this.children = new Array<ItemNode>();
            if(input.items) {
                for (let inputItem of input.items) {
                    let item = new Item();
                    item.load(inputItem);
                    
                    let itemNode = new ItemNode();
                    itemNode.node = item;

                    if(itemNode.node.requiresId == null) {
                        this.children.push(itemNode);
                    } else {
                        let parentNode = this.findById(itemNode.node.requiresId);
                        if(parentNode == null) {
                            throw "parentNode not found for id:" + itemNode.node.requiresId;
                        }
                        parentNode.children.push(itemNode);
                    }
                }
            }
        }

        shallowCopy():ItemNode {
            var clone = new Item();
            clone.load(this);
            var root = new ItemNode;
            root.node = clone;
            return root;
        }

    }

}