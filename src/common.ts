import { randomBytes } from 'crypto';

export const generateCode = (length: number = 6): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    // Generate random bytes for better entropy
    const randomValues = randomBytes(length);

    for (let i = 0; i < length; i++) {
        // Map each byte to a character in our charset
        result += charset[randomValues[i] % charset.length];
    }

    return result;
};


export const generateRandomLetter = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
}