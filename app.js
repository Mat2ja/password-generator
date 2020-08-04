// DOM Elements
const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
}

//! Generate event on generate button click
generateEl.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
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
    let prompt = document.createElement('p');
    prompt.innerHTML = 'Password copied to clipboard';
    let container = document.querySelector('.container');
    container.insertAdjacentElement('afterend', prompt);



})

// Generate password
function generatePassword(lower, upper, number, symbol, length) {
    // 1. Init password variable
    // 2. Filter out unchecked types
    // 3. Loop over length
    // 4. Add final password to password variable and return it

    let generatedPassword = '';

    // counts 'true' values
    const typesCount = lower + upper + number + symbol;
    // filter out false
    const typesArr = [{ lower }, { upper }, { number }, { symbol }]
        .filter(item => Object.values(item)[0]);


    if (typesCount === 0) {
        return '';
    }

    // for (let i = 0; i < length; i += typesCount) {
    //     typesArr.forEach(type => {
    //         const funcName = Object.keys(type)[0];
    //         generatedPassword += randomFunc[funcName]();
    //     });
    // };
    // console.log(generatedPassword.slice(0, length));

    //* my solution; more random
    for (let i = 0; i < length; i++) {
        // choose random type from the checked types
        let type = typesArr[Math.floor(Math.random() * typesArr.length)];
        const funcName = Object.keys(type)[0];

        generatedPassword += randomFunc[funcName]();
    };
    console.clear();
    console.log('%cGenerated password:', 'color:salmon', generatedPassword,);

    return generatedPassword;
}


// Generator functions
function getRandom(minChar, maxChar) {
    let min = minChar.charCodeAt(0);
    let max = maxChar.charCodeAt(0);
    let rand = Math.floor(Math.random() * (max - min + 1) + min);
    return String.fromCharCode(rand);
}

function getRandomLower() {
    return getRandom('a', 'z');
}

function getRandomUpper() {
    return getRandom('A', 'Z');
}

function getRandomNumber() {
    return getRandom('0', '9')
}

function getRandomSymbol() {
    const symbols = ` !"#$%& '()*+,-./:;<=>?@[\\]^_\`{|}~`;
    let rand = Math.floor(Math.random() * (symbols.length) + 1);
    return symbols[rand];
}





