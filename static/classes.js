const BASE_URL = "http://127.0.0.1:5000"

/**
 * Class for sending requests to server and holding user data (score, words)
 */
class User {

    constructor() {
        this.words = [];
        this.score = 0;
    }

    async submitWord(word) {
        // if the word has already been guessed, return with 'already-submitted' response
        if (this.words.indexOf(word) != -1) {
            return 'already-submitted'
        }

        // send GET request to sever with the user's guess
        const response = await axios.get(`${BASE_URL}/guess`, {params : {guess : word}});

        // retrieve result from response
        const result = response.data.result;

        // if the word was accepted, add to user's words and increase score based on length of submitted word
        if (result === 'ok') {
            this.words.push(word);
            this.score += word.length
        }

        return (result);
    }

    async sendTimeout() {
        // sned POST request to server with user's score
        const response = await axios.post(`${BASE_URL}/timeout`, {score: this.score})
        
        // retrieve html template from server
        const html = response.data
        
        return html
    }
}

