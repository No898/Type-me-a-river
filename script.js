
document.querySelector("#text-form").addEventListener("submit", function(event){
    

    // přístup k obsahu inputu
    
    const bookValue = event.target.elements.book.value
    localStorage.setItem("Book", bookValue)


    // po odeslání vymaže obsaqh políčka
    event.target.elements.book.value = ""
})
document.querySelector("#refresh").addEventListener("submit", function(event){
    

    // přístup k obsahu inputu
    
    const bookValue = event.target.elements.book.value
    localStorage.setItem("Book", bookValue)


    // po odeslání vymaže obsaqh políčka
    
})
const bookIsOut = localStorage.getItem("Book");

var texts = [bookIsOut] 

var $typeInput,
    currentText,
    currentHtml = "",
    currentWordHtml = "",
    wordProgress = 0,
    $spanArray,
    $you,
    winning = false,
    firstKeyDown = true,
    $timer,
    currentWord,
    currentCharacterCount = 0,
    relativeTime = 1,
    timerInterval,
    charProgress,
    charSpeedInterval,
    currentCharSpeed,
    storySelectText = '';

$(document).ready(function() {
    // setup
    $you = $('#you .progress');
    $typeInput = $('#typeInput');
    $timer = $('#timer');

    // Set random text
    currentText = texts[Math.floor(Math.random() * texts.length)].split(" ");

    newText();
  
    $typeInput.on('input', onKeydown);
});

function reset() {
    // Reset
    firstKeyDown = true;
    relativeTime = 1;
    wordProgress = 0;
    clearInterval(timerInterval);
    clearInterval(charSpeedInterval);
    $timer.html('0.0');
    $('#speed').text('0');
    $you.velocity({
        width: '0%'
    }, 300);

    // Clear typing input and set focus on it
    $typeInput.val('').focus();
}

function newText() {
    winning = false;
    $(document.body).removeClass('winning');

    // Make and set HTML for current text

    currentHtml = '';
    for (var i = 0; i < currentText.length; i++) {
        currentWordHtml = "";
        for (var j = 0; j < currentText[i].length; j++) {
            currentWordHtml += '<span>' + currentText[i][j] + '</span>';
        }
        currentHtml += '<span>' + currentWordHtml + '</span>';
    }
    $('#currentText').html(currentHtml);
    $spanArray = $('#currentText').children();
    $spanArray.eq(0).addClass('current');
    currentWord = currentText[wordProgress];
}

function onKeydown() {
    if (firstKeyDown) {
        updateTimer();
        charSpeed();
        firstKeyDown = false;
    }
    // counting correct characters
    currentCharacterCount = 0;
    for (var i = 0; i < $typeInput.val().length; i++) {
        if (currentWord[i] == $typeInput.val()[i]) {
            currentCharacterCount++;
        } else {
            break;
        }
    }
    $spanArray.eq(wordProgress).children().removeClass('charCorrect charWrong');
    for (var i = 0; i < currentCharacterCount; i++) {
        $spanArray.eq(wordProgress).children().eq(i).addClass('charCorrect');
    }
    for (var i = currentCharacterCount; i < $typeInput.val().length; i++) {
        $spanArray.eq(wordProgress).children().eq(i).addClass('charWrong');
    }

    // progress handler
    if (wordProgress < currentText.length) {
        if ($typeInput.val() == currentWord + " ") {
            wordProgress++;
            currentCharacterCount = 0;
            $typeInput.val("");
            $spanArray.eq(wordProgress - 1).removeClass('current').addClass('done');
            $spanArray.eq(wordProgress).addClass('current');
            $you.velocity({
                width: 100 / currentText.length * wordProgress + '%'
            }, 300);
            if (wordProgress < currentText.length) {
                currentWord = currentText[wordProgress];
            } else if (!winning) {
                winning = true;
                firstKeyDown = true;
                relativeTime = 1;
                wordProgress = 0;
                clearInterval(timerInterval);
                clearInterval(charSpeedInterval);
                $('body').addClass('winning');
            }
        }

        // Kept going after you missed the spacebar on a correct word?
        if ($typeInput.val().length > currentWord.length && currentWord.length == currentCharacterCount) {
            $spanArray.eq(wordProgress).addClass('lostInSpace');
        } else {
            $spanArray.eq(wordProgress).removeClass('lostInSpace');
        }
    }
}


// counting seconds
function updateTimer() {
    timerInterval = setInterval(function() {
        relativeTime++
        $timer.html(Math.floor(relativeTime / 10) + '.' + relativeTime % 10);
    }, 100)
}

function charSpeed() {
    charSpeedInterval = setInterval(function() {
        charProgress = 0;
        for (var i = 0; i < wordProgress; i++) {
            charProgress += currentText[i].length;
        }
        currentCharSpeed = Math.floor(charProgress / relativeTime * 600);
        $('#speed').text(currentCharSpeed);
    }, 500)
}
