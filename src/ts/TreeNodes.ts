/**
 * The tree node module defines a simple tree structure that 
 * can be used by multiple systems for simple dependency management.
 */
module TreeNodes {
    /**
     * Simple interface that classes can implement to "hydrate"
     * themselves from json.
     */
    export interface Loadable {
        load(input:any):void;
    }

    /**
     * Nodes that can require, or be required by other nodes
     */
    export interface DependencyNode extends Loadable {
        id:string;
        requiresId:string;
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

}