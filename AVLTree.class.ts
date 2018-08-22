/*
    Adelson-Velski and Landis(AVL) Tree implementation
    --------------------------------------------------
    Author: Tahrin, Abrar
    Version: 0.0.1
    Last-Modified: 05/19/18
    
    This is an implementation of a BST with load balancing.
    It uses the methods described by AVL. After each removal and
    insertion, the entire tree is balanced in O(lgN) time complexity.
*/
import { IBinaryTree } from './BinaryTree.interface';
import { IComparator, INode, ITask } from './Node.interface';
import { ETraversalMethods, traverse } from './Util.interface';

export class AVLTree implements IBinaryTree {
    private root: INode;
    private comparator: IComparator;

    constructor(comparator?: IComparator) {
        /*
            Constructs an AVL Tree
            ----------------------
            @params   :
                      - comparator : A comparator to be used for insertion
            @modifies :
                      - initializes the root and comparator
            @returns  :
                      - the AVL instance
        */
        try {
            this.root = Object.assign({}, <INode>{val: null, parent: null, height: 0});
            this.comparator = (
                !!!comparator ? (n1: INode, n2: INode): number => {
                    // default comparator
                    return n1.val > n2.val ? -1 : n1.val < n2.val ? 1 : 0;
                } : comparator);
        } catch(err) {
            throw err;
        }
    }
    getRoot(): INode {
        /*
            @params   : none
            @modifies : none
            @returns  : the reference to the AVL root node 
        */
       return this.root;
    }
    add(val: any): void {
        if(!!!this.root.val) {
            this.root.val = val;
            return ;
        }
        if(!!!this.addVal(val, this.root)) throw new Error('Duplicates are not allowed.');
        //this.root.height += 1; //  
        // re-balance
        let balance = this.findRootHeight(this.root.left) - this.findRootHeight(this.root.right);
        if(balance >= -1 && balance <= 1) return ; // already balanced
        else {
            this.rebalance(this.root); 
            return ;
        }
    }
    addVal(val: any, node: INode): boolean {
        /*
            Adds a node to the tree and re-balances it
            ------------------------------------------
            @params   : 
                      - val  => the value to be inserted
                      - node => ref to a node
            @modifies :
                      - the BST by adding a node if, val does not already exists
            @returns  : true if inserted successfully, false if duplicate
        */
       if(node === null) return false;  
       let c = this.comparator(node, <INode>{val:val});
       if(c === 0) return false; // duplicate
       else if(c === -1) {
           if(!!!node.left) {
                node.left = Object.assign(
                    {}, <INode>{
                        val: val,
                        left: null,
                        right: null,
                        parent: null,
                        height: 0
                });
                if(!!!node.right) node.height += 1; // first increment
                if(!this.isBalanced(node)) this.rebalance(node);
                return true;
            }
            else {
                //node.height += 1; // left subtree grows
                let r1 = this.addVal(val, node.left);
                if(r1) node.height = this.findRootHeight(node);
                if(!this.isBalanced(node)) this.rebalance(node);
                return r1;
            }
        }
        else {
            if(!!!node.right) {
                node.right = Object.assign(
                    {}, <INode>{
                        val: val,
                        left: null,
                        right: null,
                        parent: null,
                        height: 0
                });
                if(!!!node.left) node.height += 1; // first increment
                if(!this.isBalanced(node)) this.rebalance(node);
                return true;
            }
            else {
                //node.height += 1; // right subtree grows
                let r2 = this.addVal(val, node.right);
                if(r2) node.height = this.findRootHeight(node);
                if(!this.isBalanced(node)) this.rebalance(node);
                return r2;
            }
        }     
    }
    search(val: any): INode|null {
        return null;
    }
    remove(val: any): boolean {
        return true;
    }
    traverse(method: ETraversalMethods, task: ITask): void {
        traverse(method, task, this.root);
    }
    clean(): boolean {
        return true;
    }

    // helpers
    private getBalanceFactor(node: INode): number {
        // @returns : diff(height(node.left), height(node.right))
        return this.findRootHeight(node.left) - this.findRootHeight(node.right);
    }
    /*findRootHeight(node): number {
        let lh = !!node ? (!!node.left ? node.left.height : 0) : 0, // ?
            rh = !!node ? (!!node.right ? node.right.height : 0) : 0; // ?
        return Math.max(lh, rh);
    }*/
    private isBalanced(node): boolean {
        let b = this.getBalanceFactor(node);
        return (-1 <= b && b <= 1) ? true : false;
    }
    private rebalance(node: INode): void { // ? Buggy! Height not working
        console.log('Rebalancing: ' + node.val);
        let b = this.findRootHeight(node.left) - this.findRootHeight(node.right);
        if(b < -1) {  
            if(!!node.right) {
                // 1. right left
                let tmp = node.val;
                node.val = node.right.left;
                node.left = Object.assign({}, <INode>{val: tmp, parent: null, height: 0});
                node.right.left = null;
            }
            else {
                // left rotation
                let tmp = node.val;
                node.val = node.right.val;
                node.left = Object.assign({}, <INode>{val:tmp, parent:null, left: Object.assign({}, node.left), right: Object.assign({}, node.right.left), height: node.height});
                node.right.left = null;
                node.right.left.parent = null;
                node.right.left.left = null;
                node.right.left.right = null;
                node.right = node.right.right;
                node.right.right.parent = null;
                node.height = this.findRootHeight(node);
                return ;
            }
        }
        else { 
            if(!!node.left) {
                // 3. left right
                let tmp = node.val;
                node.val = node.left.right.val;
                node.left.right.parent = null;
                node.right = Object.assign({}, <INode>{val: tmp, parent: null, height: 0});
                node.height = this.findRootHeight(node);
                return ;
            }
            else {
                // right rotation
                let tmp = node.val;
                node.val = node.left.val;
                node.right = Object.assign({}, <INode>{val: tmp, parent: null, height: node.height});
                node.right.left.val = node.left.right.val;
                node.left.right.val = null;
                node.left.right.parent = null;
                node.left.right.left = null;
                node.left.right.right = null;
                node.height = this.findRootHeight(node);
                return ;
            }
        }
    }
    findRootHeight(node: INode): number {
        if(!!!node) {
            return 0;
        }
        let lh = (function lhi(n, h=0){
            if(!!!n) return h;
            return lhi(n.left, h+1);
        })(node),
            rh = (function rhi(n, h=0){
                if(!!!n) return h;
                return rhi(n.right, h+1);
        })(node);
        return Math.max(lh, rh);
    }
}