// DOM Elements
const generatorEl = document.querySelector('.generator');
const resultEl = document.querySelector('.result');
const lengthEl = document.querySelector('#length');
const uppercaseEl = document.querySelector('#uppercase');
const lowercaseEl = document.querySelector('#lowercase');
const numbersEl = document.querySelector('#numbers');
const symbolsEl = document.querySelector('#symbols');
const similarEl = document.querySelector('#similar');
const ambiguousEl = document.querySelector('#ambiguous');
const generateEl = document.querySelector('.btn--generate');
const clipboardEl = document.querySelector('.btn--copy');
let tooltip = document.querySelector('.tooltiptext');
let settings = document.querySelector('.settings');
let inputElements = settings.querySelectorAll('input');

for (let inputEl of Array.from(inputElements).slice(1)) {
    // TODO bug with length input event
    inputEl.addEventListener('input', startGenerationProcess);
}

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// make sure number input is in range
lengthEl.addEventListener('input', ({ target }) => {
    if (target.value.length > target.maxLength) {
        target.value = target.value.slice(0, target.maxLength);
    };
});

// focus lenght input on TAB press
document.addEventListener('keyup', ({ keyCode }) => {
    if (keyCode === 9) {
        // TAB
        lengthEl.select()
        lengthEl.focus();
    }
});

// keyboard shortcuts
document.addEventListener('keydown', ({ keyCode }) => {
    if (keyCode === 13) {
        // ENTER
        startGenerationProcess();
    } else if (keyCode === 67 || keyCode === 27) {
        // C  or ESC (clear)
        resultEl.value = '';
    }
});

// whole password generation process
function startGenerationProcess() {
    // collect all values
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;
    const excludeSimilar = similarEl.checked;
    const excludeAmbiguous = ambiguousEl.checked;

    // send values to password generation and store to result
    resultEl.value = generatePassword({
        lower: hasLower,
        upper: hasUpper,
        number: hasNumber,
        symbol: hasSymbol,
        excludeSimilar,
        excludeAmbiguous,
        length
    });

    // get emojis that show password strength
    let emoji = '';
    let strength = resultEl.value.length;

    switch (strength) {
        case 0:
            return;
        case 1:
        case 2:
        case 3:
        case 4:
            emoji = '🤮';
            break;
        case 5:
            emoji = '😔';
            break;
        case 6:
            emoji = '😳';
            break;
        case 7:
            emoji = '🤨';
            break;
        case 8:
            emoji = '🙂';
            break;
        case 9:
            emoji = '😊';
            break;
        case 10:
            emoji = '😄';
            break;
        case 11:
            emoji = '😁';
            break;
        case 12:
            emoji = '😏';
            break;
        case 13:
            emoji = '🤤';
            break;
        case 14:
            emoji = '😜';
            break;
        case 15:
            emoji = '🤪';
            break;
        case 16:
            emoji = '🤩';
            break;
        case 17:
            emoji = '😍';
            break;
        case 18:
            emoji = '🤑';
            break;
        case 19:
            emoji = '🥳';
            break;
        case 20:
            emoji = '😎';
            break;
        default:
            emoji = '🤯';
    };

    resultEl.value = `${emoji} ${resultEl.value}`;
};

//! Generate event on generate button click
generateEl.addEventListener('click', startGenerationProcess);

// Copy password to clipboard
clipboardEl.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    const password = resultEl.value.slice(3);

    if (!password) return;

    textarea.value = password;
    document.body.append(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand('copy');
    textarea.remove();

    tooltip.innerHTML = 'Copied 👏';

    console.log('Password copied to clipboard');
});

clipboardEl.addEventListener('mouseleave', () => {
    tooltip.innerText = "Copy 📃";
});

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
    };

    // reset length to max if value too large
    let max = lengthEl.max;
    let min = lengthEl.min;

    if (length > max) {
        length = max;
        lengthEl.value = length;
    } else if (length < min) {
        length = min;
        lengthEl.value = length;
    };

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
};

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
};

function getRandomLower({ excludeSimilar }) {
    return getRandom({
        startChar: 'a',
        endChar: 'z',
        excludeSimilar
    });
};

function getRandomUpper({ excludeSimilar }) {
    return getRandom({
        startChar: 'A',
        endChar: 'Z',
        excludeSimilar
    })
};

function getRandomNumber({ excludeSimilar }) {
    return getRandom({
        startChar: '0',
        endChar: '9',
        excludeSimilar
    });
};

function getRandomSymbol({ excludeAmbiguous }) {
    const symbols = ["!", "\"", "#", "$", "%", "&", "\\", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@", "[", "]", "^", "_", "`", "{", "}", "|", "~"];
    const ambiguousCharacters = ["{", "}", "[", "]", "(", ")", "/", "\\", "'", "\"", "`", "~", ",", ";", ":", ".", "<", ">", "|"];

    let randSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    while (excludeAmbiguous && ambiguousCharacters.includes(randSymbol)) {
        randSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    }

    return randSymbol;
};
