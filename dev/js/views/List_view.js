import {elements} from './base';

// Function to render received item object
export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="assets/icons/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;

    // Adding newly created markup to the page
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

// Function to delete item based on its id
export const deleteItem = id => {

    // Find the item wich is need to be deleted
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) {
        item.parentElement.removeChild(item);
    }
};