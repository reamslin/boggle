$(async function() {
    const $submit = $('button')
    const $word = $('input')
    const $response = $('#response')
    const $words = $('#words')
    const $score = $('#score')
    const $time = $('#time')
    const flashTime = 3000;

    const user = new User()

    // have the word input auto focused
    $word.focus();

    let time = 60;

    // functionality for count down timer
    const timer = setInterval(async function () {
        if (time === 0){
            clearInterval(timer);
            const timeoutHtml = await user.sendTimeout()
            $('#content').html(timeoutHtml);
        } else {
            time--;
            $time.html(`${time}`);
        }
    }, 1000)

    // event handler for submitting a word
    $submit.on("click", async function(evt) {
        evt.preventDefault()

        // retrieve input, and clear
        const word = $word.val();
        $word.val('')

        // if the input is blank, ignore click
        if (word === ''){
            return
        }

        // send word to server. response = ok, not-word, not-on-board, or 'already-submitted'
        const response = await user.submitWord(word);

        // generate html based on the response
        const responseHtml = generateResponseHtml(response, word);
        $response.html(responseHtml);

        // if the word is ok, add it to the words list, and update score 
        if (response === "ok") {
            $score.html(`${user.score}`)
        };
    
    })

    /**
     * function to generate proper html depending on the response from the server
     * upon word submission
     */
    function generateResponseHtml(response, word) {
        if (response === "ok") {
            return `
            "${word}" is on the board! ${word.length} points earned!
            `;
        } else if (response === "already-submitted") {
            return `
            You already submitted "${word}"!
            `;
        } else if (response === "not-word") {
            return `
            I'm sorry, "${word}" is not in the dictionary.
            `;
        } else if (response === "not-on-board") {
            return `
            "${word}" is not on the board!
            `;
        };
    }
})