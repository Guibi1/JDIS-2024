import { MoveAction, ShootAction, SaveAction, SwitchWeaponAction, BladeRotateAction, Weapon } from '../core/action.js';
import { Consts } from '../core/constants.js';
/**
 * (fr) Cette classe représente votre bot. Vous pouvez y définir des attributs et des méthodes qui
 *      seront conservées entre chaque appel de la méthode `on_tick`.
 * 
 * (en) This class represents your bot. You can define attributes and methods in it that will be kept 
 *      between each call of the `on_tick` method.
 */
class MyBot {
    constructor() {
        this.name = 'Isabella';
        this.state = null;
    }


    /**
     * (fr) Cette méthode est appelée à chaque tick de jeu. Vous pouvez y définir 
     *      le comportement de voter bot. Elle doit retourner une liste d'actions 
     *      qui sera exécutée par le serveur.
     *  
     *      Liste des actions possibles:
     *      - MoveAction({x, y})        Permet de diriger son bot, il ira a vitesse
     *                                  constante jusqu'à ce point.
     * 
     *      - ShootAction({x, y})       Si vous avez le canon comme arme, cela va tirer
     *                                  à la coordonnée donnée.
     * 
     *      - SaveAction([...])         Permet de storer 100 octets dans le serveur. Lors
     *                                  de votre reconnection, ces données vous seront
     *                                  redonnées par le serveur.
     * 
     *      - SwitchWeaponAction(id)    Permet de changer d'arme. Par défaut, votre bot
     *                                  n'est pas armé, voici vos choix:
     *                                      Weapon.None
     *                                      Weapon.Gun
     *                                      Weapon.Blade
     *   
     *      - BladeRotateAction(rad)    Si vous avez la lame comme arme, vous pouver mettre votre arme
     *                                  à la rotation donnée en radian.
     *
     * 
    
     * @param {Model.GameState} game_state 
     * @returns{Model.Actions}
     */
    on_tick(game_state) {
        console.log(`Current tick: ${game_state.tick}`);

        return [
            new MoveAction({ x: 10.0, y: 11.34 }),
            new ShootAction({ x: 11.2222, y: 13.547 }),
            new SwitchWeaponAction(Weapon.Blade),
            new SaveAction( new TextEncoder().encode("Hello, world!"))
        ];
    }


    /**
     * (fr) Cette méthode est appelée une seule fois au début de la partie. Vous pouvez y définir des
     *      actions à effectuer au début de la partie.
     * 
     * (en) This method is called once at the beginning of the game. You can define actions to be 
     *      performed at the beginning of the game.
     * 
     * @param {Model.MapState} state (fr) L'état de la carte
     *                               (en) The state of the map.
     * @returns None
     */
    on_start(state) {
        this.state = state;
    }


    /**
     * (fr) Cette méthode est appelée une seule fois à la fin de la partie. Vous pouvez y définir des actions
     *      à effectuer à la fin de la partie.
     * 
     * (en) This method is called once at the end of the game. You can define actions to be performed 
     *      at the end of the game.
     * 
     * @returns None
     */
    on_end() {

    }
};

export { MyBot };