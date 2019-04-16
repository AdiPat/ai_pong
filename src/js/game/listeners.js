/**
 * User Interface related events
 */
export default function setupUI(game, ctx) {
    // start button
    document.querySelector('.btn-start').addEventListener('click', (e) => {
        e.target.style.zIndex = '-100';
        e.target.style.opacity = '0';
        //ctx.canvas.style.border = '1px solid lightgrey';
        game.start();
    });

    // restart button
    document.querySelector('#icon-restart').addEventListener('click', e => game.restart(game.type));

    // set game type 
    const curGameClass = `#btn-${game.type}`
    document.querySelector(curGameClass).classList.add('configs__option-selected');

    const gTypes = ['1P','2P', 'AI'];
    gTypes.forEach((typ) => {
        document.querySelector(`#btn-${typ}`).addEventListener('click', (e) => {
            // first toggle all other classes off
            gTypes.forEach((v) => {
                const className = `#btn-${v}`;
                document.querySelector(className).classList.remove('configs__option-selected');
            });

            e.target.classList.add('configs__option-selected');
            game.restart(typ);
            // resume game after restarting
            setTimeout(() => game.resume(), 300);
        });
    });

    // tune difficulty factor
    const npc_ids = [0, 1];
    for(var i in npc_ids) {
        var pid = parseInt(i)+1;
        document.querySelector(`#p${pid}-df`).addEventListener('change', (e) => {
            const elem = e.target; 
            const diffVal = parseFloat(elem.value);
            console.log(diffVal);
            game.player.setDifficultyFactorByID(i,diffVal);
        });
    }

    // tune speeds
    const speed_ids = ['ball-speed', 'paddle-speed'];
    for(var i in speed_ids) {
        document.querySelector(`#${speed_ids[i]}`).addEventListener('change', (e) => {
            const elem = e.target; 
            const diffVal = parseFloat(elem.value);
            console.log(elem.id);
            if(elem.id === 'ball-speed') {
                game.objects['ball'].boostSpeed(diffVal, true);
            }
            if(elem.id === 'paddle-speed') {
                game.objects['paddle-0'].boostSpeed(diffVal, true);
                game.objects['paddle-1'].boostSpeed(diffVal, true);
            }
        });
    }


}