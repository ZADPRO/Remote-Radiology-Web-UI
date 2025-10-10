import CryptoJS from "crypto-js";
 
/**
 * Decrypts AES-256-CBC encrypted data from Go backend.
 * @param {string[]} encryptedData - [hexIV, hexCiphertext]
 * @param {string} token - User/session token
 * @returns {any} - Decrypted object or string
 */
export function decrypt(encryptedData: any, token: any) {
    if (!Array.isArray(encryptedData) || encryptedData.length !== 2) {
        throw new Error('Invalid encrypted data format');
    }
 
    // Use the same secret as your Go ENCRYPT_API env var
    const ENCRYPT_API = import.meta.env.VITE_ENCRYPTION_KEY;
    const secret = ENCRYPT_API + token;
    const key = CryptoJS.SHA256(secret);
 
    const iv = CryptoJS.enc.Hex.parse(encryptedData[0]);
    const ciphertext = CryptoJS.enc.Hex.parse(encryptedData[1]);
 
    // Create CipherParams object
    const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext
    });
 
    const decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
 
    try {
        return JSON.parse(plaintext);
    } catch {
        return plaintext;
    }
}

export function encrypt(data: any, token: any) {
    // Use the same secret as your Go ENCRYPT_API env var
    const ENCRYPT_API = import.meta.env.VITE_ENCRYPTION_KEY; 
    const secret = ENCRYPT_API + token;
    const key = CryptoJS.SHA256(secret);
 
    // Generate random IV (16 bytes for AES)
    const iv = CryptoJS.lib.WordArray.random(16);
 
    // Convert data to JSON string
    const plainText = typeof data === "string" ? data : JSON.stringify(data);
 
    // Encrypt
    const encrypted = CryptoJS.AES.encrypt(
        plainText,
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
 
    // Return [hexIV, hexCipherText] to match Go's format
    return [iv.toString(CryptoJS.enc.Hex), encrypted.ciphertext.toString(CryptoJS.enc.Hex)];
}