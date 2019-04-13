export default function setupListeners(game, ctx) {    
    setupUIEvents(game, ctx);
    setupMouseEvents(game, ctx);
    setupKeyEvents(game, ctx);
}

/**
 * User Interface related events
 */
function setupUIEvents(game, ctx) {
    document.querySelector('.btn-start').addEventListener('click', (e) => {
        e.target.style.zIndex = '-100';
        e.target.style.opacity = '0';
        ctx.canvas.style.border = '1px solid lightgrey';
        game.start();
    });
}

/**
 * All key events
 */
function setupKeyEvents(game, ctx, callbacks = undefined) {
    const KEY_SPACE = 32; // temp 

    document.addEventListener('keydown', (event) => {

        // TODO: no need to check each condition :P
        //callbacks[event.keyCode]();

        // check if the game has been started first
        if (event.keyCode == KEY_SPACE) {
            const menuElem = document.querySelector('.menu-box');
            
            if(!game.paused) {
                menuElem.style.zIndex = '500';
                menuElem.style.opacity = '1';
                game.pause();
                return;
            } else {
                menuElem.style.zIndex = '-10';
                menuElem.style.opacity = '0';
                game.resume();
            }
        }
    });
}

/**
 * Make mouse move paddle for testing
 */
function setupMouseEvents(game, ctx) {
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mousePos = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        // TODO: move plate
    });
}