import axios from 'axios';

export default class Search 
{
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '5c49951f6be15ba59b5e87c4afcca549';
        try {
            const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = result.data.recipes;
        } catch (error) {
            console.log(error);
        }
    }
}