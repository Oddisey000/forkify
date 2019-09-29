import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/Search_view';
import * as recipeView from './views/Recipe_view';
import * as listView from './views/List_view';
import * as likesView from './views/Likes_view';

/*
* Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/

const state = {};


//SEARCH CONTROLLER START
const controlSearch = async () => {
    // Get query from the view
    const query = searchView.getInput();

    if (query) {
        // Create new search object and add to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResultParent);

        // Checks if everithing ok and we have the function's result
        try {
            // Search for the recipes
            await state.search.getResults();

            // Render results on UI
            clearLoader();
            searchView.getResults(state.search.result);

        } catch (error) {
            console.log(error);
            clearLoader();
        }
    }
}

// Setting the page's event listeners
elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', event => {
    // Does not matter is user click text or icon of the button it will find the button
    const button = event.target.closest('.btn-inline');

    // Check which page user click, use it to redirect user to the correct page
    if (button) {
        const gotoPage = parseInt(button.dataset.goto, 10);

        // Call function and give in parameters the correct page, but clear all content before
        searchView.clearResults();
        searchView.getResults(state.search.result, gotoPage);
    }
});
//SEARCH CONTROLLER END

// RECIPE CONTROLLER START

// Receive an id from href #
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        }

        // Create a new recipe object
        state.recipe = new Recipe(id);

        // Checks if everithing ok and we have the function's result
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render the recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
            
        } catch (error) {
            console.log(error);
        }
    }
};

/*
*window.addEventListener('hashchange', controlRecipe);
// In case user load previously saved page with recipe's id in url
*window.addEventListener('load', controlRecipe);
*/

// Restore liked recipes when page loads
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore data from local storage
    state.likes.readData();
    
    // Toggle like menu button if there is likes
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    
    // Render the existing likes into the UI
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Create multi event listener
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks, event delegation matches method
elements.recipe.addEventListener('click', event => {
    
    // Select button itself or any child
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        
        // Prevent negative values to be displayed
        if (state.recipe.servings > 1) {
            
            // Decrease button was clicked
            state.recipe.updateServings('dec');
        }

    } else if (event.target.matches('.btn-increase, .btn-increase *')) {

        // Increase button was clicked
        state.recipe.updateServings('inc');
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {

        // If user click the button or any realted child - call function below
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        // Handle data to like controller
        controlLike();
    }

    // Update UI
    recipeView.updateSI(state.recipe);
});

// RECIPE CONTROLLER END

// LIST CONTROLLER START
const controlList = () => {
    
    // Create a new list if there is none yet
    if (!state.list) {
        state.list = new List();
    }

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(element => {
        const item = state.list.additem(element.count, element.unit, element.ingredient);
        
        // Passing created item to List_view.renderItem() function
        listView.renderItem(item);
    });
};

// Handling delete and update list item events, its need event delegation because required item is no currently present when page loads
elements.shopping.addEventListener('click', event => {

    // Find the closest element to place where user click, which is contain id also
    const id = event.target.closest('.shopping__item').dataset.itemid;

    // Handle delete and update list item events
    
    // Checks if user actualy click delete button, delete item has class shopping__delete
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {

        // Delete item from state
        state.list.deleteItem(id);

        // Delete item from UI
        listView.deleteItem(id);

    // Handling increasing and decreasing elements in the recipe list
    } else if (event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value, 10);

        // Update count of ingredients
        state.list.updateCount(id, value);
    }
});

// LIST CONTROLLER END

// LIKES CONTROLLER START

state.likes = new Likes();

// Toggle like menu on or of
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    
    // Create required variables
    const currentId = state.recipe.id;
    const currentTitle = state.recipe.title;
    const currentAuthor = state.recipe.author;
    const currentImg = state.recipe.img;
    
    // Construct new likes class
    if (!state.likes) {
        state.likes = new Likes();
    }
    
    // If there is NOT like
    if (!state.likes.isLiked(currentId)) {
        // Add like to state
        const newLike = state.likes.addLike(
            currentId,
            currentTitle,
            currentAuthor,
            currentImg
        );

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

        // TESTING
        console.log(state.likes);

    // If user has liked current recipe
    } else {

        // Remove like from the state
        state.likes.deleteLike(currentId);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove liked recipe from the UI
        likesView.deleteLike(currentId);

        // TESTING
        console.log(state.likes);
    }

    // Toggle like menu on or of
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};
// LIKES CONTROLLER END