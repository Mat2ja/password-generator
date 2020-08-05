// DOM Elements
const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const similarEl = document.getElementById('similar');
const ambiguousEl = document.getElementById('ambiguous');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');


const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
}


lengthEl.addEventListener('input', ({ target }) => {
    if (target.value.length > target.maxLength) {
        target.value = target.value.slice(0, target.maxLength)
    };
})


//! Generate event on generate button click
generateEl.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;
    const excludeSimilar = similarEl.checked;
    const excludeAmbiguous = ambiguousEl.checked;

    resultEl.innerText = generatePassword({
        lower: hasLower,
        upper: hasUpper,
        number: hasNumber,
        symbol: hasSymbol,
        excludeSimilar,
        excludeAmbiguous,
        length
    });
});

// Copy password to clipboard
clipboardEl.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    const password = resultEl.innerText;

    if (!password) return;

    textarea.value = password;
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();

    // TODO handle prompt better

    alert('Password copied to clipboard');
})

// Generate password
function generatePassword({ lower, upper, number, symbol, excludeSimilar, excludeAmbiguous, length }) {

    let generatedPassword = '';

    // counts 'true' values
    const typesCount = lower + upper + number + symbol;

    // create array of objects, filter out 'false'
    const typesArr = [{ lower }, { upper }, { number }, { symbol }]
        .filter(item => Object.values(item)[0]);

    // if none is checked
    if (typesCount === 0) {
        return '';
    }

    // reset length to max if value too large
    let max = lengthEl.max;
    let min = lengthEl.min;

    if (length > max) {
        length = max;
        lengthEl.value = length;
    } else if (length < min) {
        length = min;
        lengthEl.value = length;
    }


    for (let i = 0; i < length; i++) {
        // choose random type from the checked types
        let type = typesArr[Math.floor(Math.random() * typesArr.length)];
        // get the key of the checked value
        const funcName = Object.keys(type)[0];

        // get random charact by passing checked value as the key
        let randomChar = randomFunc[funcName]({ excludeSimilar, excludeAmbiguous });

        generatedPassword += randomChar;
    };

    console.clear();
    console.log('%cGenerated password:', 'color:salmon', generatedPassword);

    return generatedPassword;
}


// Generator functions
function getRandom({ startChar, endChar, excludeSimilar }) {
    let similarCharacters = ["i", "l", "1", "o", "0", "O"];

    let start = startChar.charCodeAt(0);
    let end = endChar.charCodeAt(0);

    let randChar = String.fromCharCode(Math.floor(Math.random() * (end - start + 1) + start));

    while (excludeSimilar && similarCharacters.includes(randChar)) {
        randChar = String.fromCharCode(Math.floor(Math.random() * (end - start + 1) + start));
    }

    return randChar;
}

function getRandomLower({ excludeSimilar }) {
    return getRandom({
        startChar: 'a',
        endChar: 'z',
        excludeSimilar
    });
}

function getRandomUpper({ excludeSimilar }) {
    return getRandom({
        startChar: 'A',
        endChar: 'Z',
        excludeSimilar
    })
}

function getRandomNumber({ excludeSimilar }) {
    return getRandom({
        startChar: '0',
        endChar: '9',
        excludeSimilar
    });
}

function getRandomSymbol({ excludeAmbiguous }) {
    const symbols = ["!", "\"", "#", "$", "%", "&", "\\", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@", "[", "]", "^", "_", "`", "{", "}", "|", "~"];
    const ambiguousCharacters = ["{", "}", "[", "]", "(", ")", "/", "\\", "'", "\"", "`", "~", ",", ";", ":", ".", "<", ">"];

    let randSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    while (excludeAmbiguous && ambiguousCharacters.includes(randSymbol)) {
        randSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    }

    return randSymbol;
}




