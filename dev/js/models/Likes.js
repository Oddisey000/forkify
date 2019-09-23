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
        return like;
    }

    // delete like method
    deleteLike(id) {
        
        // Similar to delete object from the list
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
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
}