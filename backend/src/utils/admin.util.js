import { client } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

/* This utility function responsible for generating a friendly-unique username for each user. 
 * Main requirement is to generate a friendly-unique username for each user 
 * If we failed for this case we have to generate a fallback username which is less friendly
*/
export const generateUsername = async (name) => {
    console.log(name);
    const base = name.toLowerCase().replace(/\s+/g, "");
    let username = base ;
    let suffix = 0;
    let MAX_ATTEMPTS = 20;

    let existingUser = await client.user.findUnique({
        where: { username }
    });
    if (!existingUser) return username;

    while (suffix < MAX_ATTEMPTS) {
        suffix++;
        username = `${base}${suffix}`;

        existingUser = await client.user.findUnique({
            where: { username }
        });
        if (!existingUser) return username;
    }

    console.warn(`Could not generate friendly username for ${name}`);

    const uniqueId = uuidv4().substring(0 , 6);
    const fallbackUsername = `${base}${uniqueId}`;

    existingUser = await client.user.findUnique({
        where: { username: fallbackUsername }
    });

    if (!existingUser) {
        return fallbackUsername;
    } else {
        const randomSuffix = Math.random().toString(36).substring(2 , 7);
        return `${fallbackUsername}${randomSuffix}`;
    }
}

export const generatePassword = () => {
    const chars = {
        lower: "abcdefghijklmnopqrstuvwxyz",
        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
    };

    let password = "";
    password += chars.lower[Math.floor(Math.random() * chars.lower.length)];
    password += chars.upper[Math.floor(Math.random() * chars.upper.length)];    
    password += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
    password += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];
    
    const allChars = chars.lower + chars.upper + chars.numbers + chars.symbols;

    for (let i = 0; i < 4; i++) {
       password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split('').sort(() => 0.5 - Math.random()).join('');
}