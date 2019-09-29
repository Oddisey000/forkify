export default class Likes {
    constructor() {
        this.likes = [];
    }

    // Add like method
    addLike(id, title, author, img) {

        // Creating a like object
        const like = {
            id,
            title,
            author,
            img
        };
        
        // Push data of object like into array of likes
        this.likes.push(like);

        // Persist data in local storage
        this.persistData();

        return like;
    }

    // delete like method
    deleteLike(id) {
        
        // Similar to delete object from the list
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persist data in local storage
        this.persistData();
    }

    // Test if user already has liked element
    isLiked(id) {

        // Testing if specific element is in the array already, if user already like it
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    // Count how many likes user has
    getNumLikes() {
        return this.likes.length;
    }

    // Persist data method
    persistData() {

        // Create string from likes array, because in persist data we can only save string, add key likes
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    // Read data from local storage and convert data to array
    readData() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // If we have some likes then put it back to UI
        if (storage) this.likes = storage;
    }
}