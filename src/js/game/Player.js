import AI_Bot from '../components/AI_Bot';
import { randomFloat } from './utils';

export default class Player {
    /**
     * 
     * @param {number} num_players Total Number of players
     * @param {Array} player_types Boolean array to indiciate whether the player is human(true) or npc(false)
     * @param {Array} key_bindings: key codes for players
     */
    constructor(game, num_players, player_types, key_bindings) {
        this.n = num_players;
        this.types = player_types;
        this.game = game;
        this.npc = [null, null];
        this.key_bindings = key_bindings;
        this.paddle_controls = {
            "up": function(p, key) {
                // set upward speed for paddle while button is pressed
                if(key === 'keyup' || key == 'stop')
                    p.setSpeed(0,0);
                else if(key == 'keydown' || key == 'move')
                    p.setSpeed(0, -Math.abs(this.game.config.speed['paddle-max']));
            }, 
            "down": function(p, key) {
                if(key === 'keyup' || key == 'stop')
                    p.setSpeed(0,0);
                else if(key == 'keydown' || key == 'move')
                    p.setSpeed(0, Math.abs(this.game.config.speed['paddle-max']));
            }
        }

        this.types.forEach((v, idx) => {
            if(v) // human
                this.initControls(idx);
            else
                this.initNPC(idx);
        });

    }

    initControls(pid) {
        const evts = ['keydown', 'keyup'];
        evts.forEach((eType) => {
            const listener = function(event) {
                const fup = this.paddle_controls.up.bind(this);
                const fdown = this.paddle_controls.down.bind(this);
                if(event.keyCode == this.key_bindings[pid]['up'])
                    fup(this.game.objects[`paddle-${pid}`], event.type);
                if(event.keyCode == this.key_bindings[pid]['down'])
                    fdown(this.game.objects[`paddle-${pid}`], event.type);
            }.bind(this);

            document.addEventListener(eType,listener);
        });
    }

    initNPC(pid) {
        const diffFactor = randomFloat(1.05, 1.4);
        let curNPC = new AI_Bot(this.game, this.game.objects.ball, this.game.objects[`paddle-${pid}`], diffFactor);
        this.npc[pid] = curNPC;
    }

    getNPCControls() {
        let controls = {
            "up": this.paddle_controls.up.bind(this),
            "down": this.paddle_controls.down.bind(this)
        };
        return controls;
    }

    resetNPC(delay=1000) {
        let resetFunc = function() {
            this.types.forEach((v,idx) => {
                if(!v)
                    this.npc[idx].reset();
            });
        }.bind(this);
        setTimeout(() => resetFunc(), delay);
    }

    isNPCPresent() {
        return this.npc[0] || this.npc[1];
    }
}