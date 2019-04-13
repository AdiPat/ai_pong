/**
 * 
 * @param {string} path - Path to sound file
 * This function requires some kind of user interaction to happen prior to calling it
 */

function playSound(path) {
    const aud = new Audio(path);
    aud.play();
}