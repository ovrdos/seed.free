const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

async function generateBIP32Node() {
  try {
    // Generate a 12-word mnemonic (BIP39)
    const mnemonic = new Array(bip39.generateMnemonic());
    console.log('Mnemonic:', mnemonic.join(' ').split(' ').map((w) => w = '\"'+w+'\"').join(','));
    exit
    // Convert mnemonic to seed
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Generate the BIP32 root node from the seed
    const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed);

    //#console.log('BIP32 Root Node:', root.toBase58());  // Print node in base58 format

    // Derive a Bitcoin address from the root node
    const child = root.derivePath("m/44'/0'/0'/0/0");  // Derivation path for BTC
    const { address } = bitcoin.payments.p2pkh({
      pubkey: child.publicKey,
    });

    console.log('Derived Bitcoin Address:', address);
  } catch (error) {
    console.error('Error generating BIP32 node:', error);
  }
}

generateBIP32Node();

