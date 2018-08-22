/*
    BinarySearchTree(BST) implementation for dslabs
    -----------------------------------------------
    Author: Tahrin, Abrar
    Version: 0.0.1
    Last-Modified: 05/19/18

    A class that implements a BST without any
    load balancing. To keep the tree balanced,
    use a linear insertion method where, the 
    data entries have a total order on the set.
*/
import { INode, IComparator, ITask } from './Node.interface';
import { ETraversalMethods, traverse } from './Util.interface';
import { IBinaryTree } from './BinaryTree.interface';

export class BST implements IBinaryTree {
    private root: INode;
    private comparator: IComparator;

    constructor(comparator?: IComparator) {
        /* 
            Constructs a BST
            ----------------
            @params :
                - comparator => a comparator function that extends IComparator (optional)
        */
        this.root = Object.assign({}, <INode>{});
        this.comparator = (
            !!!comparator ? (<IComparator>(n1: INode, n2: INode): number => {
                // default comparator
                return n1.val < n2.val ? 1 : n2.val < n1.val ? -1 : 0;
            }) :
            comparator);
    }
    add(val: any): void {
        /*
            Adds a new node to the tree
            ---------------------------
            @params :
                - val => a value to be used as node value
                    Note, if a node with the same value exists,
                    the function returns null.
            @modifies :
                - the BST instance if, the value is added
            @returns :
                - nothing
        */
        if(!!!this.comparator) throw new Error('comparator is undefined');
        if(!!!this.root.val) {
            // first entry
            this.root.val = val;
            // parent pointer for root is null
            this.root.parent = null;
            return ;
        }
        this.addVal(val, this.root); 
    }
    search(val: any): INode|null {
        /*
            Search for a node with node.val == val
            --------------------------------------
            @params :
                - val : a node value
            @modifies :
                - nothing
            @returns :
                - a node with node.val == val
                - null otherwise
        */
        if(!!!this.root.val) throw new Error('BST is empty.');
        return this.searchVal(val, this.root);
    }
    traverse(method: ETraversalMethods, task: ITask): void {
        /*
            Performs a task following a traversal strategy
            ----------------------------------------------
            @params :
                - method => the traversal method to be used
                - task   => a task to be executted on each node
                
                See Node.interface.ts for details.

            @modfiies :
                - nodes in the BST
            @returns :
                - nothing
        */
       // Util fn
        traverse(method, task, this.root);
    }
    remove(val: any): boolean {
        /*
            Removes a node with node.val == val
            -----------------------------------
            @params : 
                - val => a node value
            @modifies :
                - the BST if, a node is removed
            @returns:
                - true, if a node is found and removed
                - false otherwise
        */
        if(!!!this.root.val) throw new Error('The tree is empty');
        let r = this.search(val);
        if(!!!r) return false; // not found
        if(!!r.left && !!r.right) {
            // has both children
            // 1. find min elem on right subtree of the element to be removed
            // 2. replace the value of min elem with the one to be removed (not nodes!)
            // 3. remove the min node since its a leaf
            let min: INode = this.findMin(r.right);
            let minVal = min.val;
            let tmp = r.val;
            r.val = minVal;
            min.val = tmp;
            // leaf case
            if(min.parent.left === min) min.parent.left = null;
            else if(min.parent.right === min) min.parent.right = null;
            return true;
        }
        else if(!!r.left) {
            // has only left child
            r.parent.left = r.left;
            r.parent.left.parent = r.parent;
            return true;
        }
        else if(!!r.right) {
            // has only right child
            r.parent.right = r.right;
            r.parent.right.parent = r.parent;
            return true;
        }
        else {
            // leaf
            if(r.parent.left === r) r.parent.left = null;
            else if(r.parent.right === r) r.parent.right = null;
            return true;
        }
    }
    clean(): boolean {
        /*
            Cleanup the tree node
            ---------------------
            @params   : none
            @modifies : the BST, setting all INode properties to null
            @returns  : true if successfully cleaned, false otherwise 
        */
        try{
            this.traverse(ETraversalMethods.PostOrder, (n) => {
                if(!!n.left) {
                    n.left.parent = null;
                    n.left = null;
                }
                if(!!n.right) {
                    n.right.parent = null;
                    n.right = null;
                }
                n.height = null;
                n.val = null;
            });
            this.root = null;
            return true;
        } catch(err) {
            return false;
        } 
    }
    getRoot(): INode { 
        /*
            Root node reference. Use with caution!
            --------------------------------------
            @params   : none
            @modifies : none
            @returns  : the root node 
        */
        return this.root; 
    }
    // helpers
    private addVal(val: any, node: INode): void {
        let c = this.comparator(node, <INode>{val: val});
        if(c === -1) {
            if(!!!node.left) {
                node.left = Object.assign({}, <INode>{val: val, parent: node});
                return ;
            }
            else this.addVal(val, node.left);
        }
        else if(c === 1) {
            if(!!!node.right) {
                node.right = Object.assign({}, <INode>{val: val, parent: node});
                return ;
            }
            else this.addVal(val, node.right);
        }
        else return ;
    }
    private searchVal(val: any, node: INode): INode|null {
        let c = this.comparator(node, <INode>{val: val});
        if(c === 0) return node;
        else if(c === -1) { // left
            if(!!!node.left) return null; // not found
            return this.searchVal(val, node.left);
        }
        else { // right
            if(!!!node.right) return null; // not found
            return this.searchVal(val, node.right);
        }
    }
    private findMin(node: INode): INode {
        // removal helper
        if(!!!node) throw new Error('node cannot be undefined in BST.findMin');
        if(!!!node.left) return node; // since this is the only value in the tree
        else {
            return (function fmin(n: INode): INode {
                if(!!n.left) return fmin(n.left);
                return n; // leaf
            })(node);
        }
    }
}