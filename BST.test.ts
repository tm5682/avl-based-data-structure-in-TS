import { BST } from './BST.class';
import { ETraversalMethods } from './Util.interface';

const lineprint = (txt: string) => process.stdout.write(txt),
    preOrderPrint = () => {
        process.stdout.write('Traversing Pre Order:  ');
        b.traverse(ETraversalMethods.PreOrder, n => process.stdout.write(n.val + ' '));
    };

let b = new BST();
b.add(5);
b.add(2);
b.add(-4);
b.add(3);
b.add(12);
b.add(21);
b.add(9);
b.add(19);
b.add(25);
preOrderPrint();
//console.log();
//lineprint('Searching for -4: ');
//lineprint(b.search(-4).val.toString());
//console.log();
lineprint('Removing 12: ' + (!!b.remove(21) ? 'Removed' : 'Not removed'));
console.log();
preOrderPrint();
console.log();
lineprint('Clean test: ');
b.clean();
lineprint(b.clean() ? "Clean successfully!" : "Could not clean");
console.log();
lineprint("Checking explicitly: " + (!!!b.getRoot() ? "Cleaned!" : "Err!"));
console.log();

