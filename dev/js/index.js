import { elements } from './views/base';
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

        // Search for the recipes
        await state.search.getResults();

        // Render results on UI
        searchView.getResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});