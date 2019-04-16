/**
 * 
 * @param {string} path - Path to sound file
 * This function requires some kind of user interaction to happen prior to calling it
 */

var audio_lock = false;

export function playSound(path) {
    if(!audio_lock) {
        audio_lock = true;
        const aud = new Audio(path);
        aud.play();
        setTimeout(() => { audio_lock = false }, 50);
    }   
}

export function randomInt(a, b) {
    return Math.floor(Math.random() * (b-a)) + a;
}

export function randomFloat(a, b) {
    return Math.random() * (b-a) + a;
}

export function random(numList) {
    const idx = randomInt(0, numList.length);
    return numList[idx];
}

export function randomDir() {
    return random([-1,1]);
}

export function getSign(val) {
    return (val / Math.abs(val));
}