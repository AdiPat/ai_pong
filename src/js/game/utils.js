/**
 * 
 * @param {string} path - Path to sound file
 * This function requires some kind of user interaction to happen prior to calling it
 */

export function playSound(path) {
    const aud = new Audio(path);
    aud.play();
}

export function randomInt(a, b) {
    return Math.floor(Math.random() * (b-a)) + a;
}

export function randomFloat(a, b) {
    return Math.random() * (b-a) + a;
}