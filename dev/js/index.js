import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import * as searchView from './views/Search_view';

/*
* Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/

const state = {};

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

        // Search for the recipes
        await state.search.getResults();

        // Render results on UI
        clearLoader();
        searchView.getResults(state.search.result);
    }
}

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