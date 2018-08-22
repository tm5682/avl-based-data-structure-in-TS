import { AVLTree } from './AVLTree.class';
import { lineprint, preOrderPrint, batchInsert } from './Testutils.functions';
import { ETraversalMethods } from './Util.interface';

lineprint('Construction AVL tree: ');
const t = new AVLTree();
lineprint(t === null ? "Could not construct!" : "Constructed!\n");
const inputs = [43, 18, 22, 9, 21];
lineprint('Inserting: ' + inputs.toString() + "\t== ");
lineprint(batchInsert(t, inputs) ? 'Inserted!\n' : "Could not insert!\n");
t.traverse(ETraversalMethods.PreOrder, (n) => {
    console.log(n);
});
//lineprint("Tree height: " + t.findHeight(t.getRoot()) + "\n");
//lineprint("Tree height(root): " + t.findRootHeight(t.getRoot()) + "\n");
//lineprint('PreOrder: ');
//preOrderPrint(t);
console.log();

