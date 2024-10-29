const bitcoin = require('bitcoinjs-lib');  // Core bitcoin library
const bip39 = require('bip39');  // For mnemonic seed generation
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32');
const axios = require('axios')

// 1. Validate if the input is a valid BIP-39 mnemonic
function validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
}

// 2. Generate a Bitcoin wallet address from the mnemonic
function generateAddress(mnemonic) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed);
    const child = root.derivePath("m/44'/0'/0'/0/0");  // Standard BTC path
    return bitcoin.payments.p2pkh({ pubkey: child.publicKey }).address;
}

// 3. Check the balance of the generated address using an API
async function checkAddressBalance(address) {
    try {
	// wait one second
	setTimeout(() => {
		console.log('checking wallet adderss...')
	}, 1000); 
        const response = await axios.get(`https://blockchain.info/rawaddr/${address}`);
        return address + ': ' + response.data.final_balance ;
    } catch (error) {
        console.error(`Error checking balance: ${error.message}`);
        return null;
    }
}

// 4. Generate all combinations of 12 words (example with subsets)
function generateCombinations(words) {
    if (words.length !== 12) throw new Error("Exactly 12 words are required.");

    const combinations = [];
    const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]); // Swap helper

    function permute(arr, index) {
	if (index > 5) return combinations;
        if (index === arr.length - 1) {
            combinations.push(arr.join(' '));
            return;
        }

        for (let i = index; i < arr.length; i++) {
            swap(arr, i, index);
            permute(arr, index + 1);
            swap(arr, i, index); // Backtrack
        }
    }

    permute(words, 0);
    return combinations;
}

// 5. Main function to run the checker
async function runChecker(words) {
    if (!validateMnemonic(words.join(' '))) {
        console.error("Invalid mnemonic!");
        return;
    }

    console.log('From mnemonic: ' + words.join(' '));	
    const address = generateAddress(words.join(' '));
    console.log(`Generated Address: ${address}`);

    const balance = await checkAddressBalance(address);
    if (balance !== null) {
        console.log(`Balance: ${balance} Satoshis`);
    } else {
        console.log("Address not found or invalid.");
    }
}

// Example usage: Replace with your 12-word mnemonic
mnemonicWords = ['coconut', 'milk', 'pink', 'cow', 'toilet', 'soap', 'shampoo', 'red', 'watermelon', 'light', 'sky', 'green'];
mnemonicWords = ['settle', 'put', 'agree', 'gap', 'blame', 'volume', 'excess', 'jewel', 'scrub', 'setup', 'donkey', 'logic']; 
mnemonicWords = ['ridge', 'left', 'spell', 'into', 'pencil', 'smile', 'pistol', 'amount', 'weapon', 'silk', 'place', 'liberty'];
mnemonicWords = ["million","vanish","rail","motion","urge","heart","castle","uncle","argue","dwarf","sun","bomb"];
const fword = mnemonicWords[0];

// Run the checker with the example mnemonic
for(i=0;i<100;i++){
  mnemonicWords = new Array(bip39.generateMnemonic());
  runChecker(mnemonicWords);
}





