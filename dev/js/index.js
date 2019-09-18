import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/Search_view';
import * as recipeView from './views/Recipe_view';

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
            recipeView.renderRecipe(state.recipe);
            
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
    }

    // Update UI
    recipeView.updateSI(state.recipe);
});

// RECIPE CONTROLLER END