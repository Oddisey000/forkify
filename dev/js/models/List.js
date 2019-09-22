import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    // Create ability to add the item
    additem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        // Push item into the items array
        this.items.push(item);
        return item;
    }

    // Create ability to delete the item
    deleteItem(id) {
        
        // Find index of element wich needs to be deleted from items array
        const index = this.items.findIndex(element => element.id === id);
        
        // splice(first argument position to start, second how much items to take)
        // Example [2,4,8] splice(1,2) --> return 4, original array will be [2,8]
        // Example [2,4,8] slice(1,2) --> return 4, original array will be [2,4,8]
        
        // Removing 1 element and mutate the original array
        this.items.splice(index, 1);
    }

    // Update recipes id count ability
    updateCount(id, newCount) {
        
        // Find elements inside array after user delete one and make new count
        this.items.find(element => element.id === id).count = newCount;
    }
}