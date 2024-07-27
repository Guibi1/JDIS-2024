import type { Action } from "./actions";
import { MoveAction, SaveAction, ShootAction, SwitchWeaponAction } from "./actions";
import type { GameState, MapState } from "./types";
import Weapons from "./weapons";

/**
 * (fr) Cette classe représente votre bot. Vous pouvez y définir des attributs et des méthodes qui
 *      seront conservées entre chaque appel de la méthode `on_tick`.
 */
class MyBot {
    private name = "Isabella";
    private state: null | MapState = null;

    constructor() {
        this.name = "Isabella";
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
     */
    on_tick(game_state: GameState): Action[] {
        console.log("🚀 ~ MyBot ~ on_tick ~ game_state:", game_state);
        console.log(`Current tick: ${game_state.tick}`);

        return [
            new MoveAction({ x: 10.0, y: 11.34 }),
            new ShootAction({ x: 11.2222, y: 13.547 }),
            new SwitchWeaponAction(Weapons.Blade),
            new SaveAction(new TextEncoder().encode("Hello, world!")),
        ];
    }

    /**
     * (fr) Cette méthode est appelée une seule fois au début de la partie. Vous pouvez y définir des
     *      actions à effectuer au début de la partie.
     */
    on_start(state: MapState) {
        console.log("🚀 ~ MyBot ~ on_start ~ state:", state);
        this.state = state;
    }

    /**
     * (fr) Cette méthode est appelée une seule fois à la fin de la partie. Vous pouvez y définir des actions
     *      à effectuer à la fin de la partie.
     */
    on_end() {
        console.log("🚀 ~ MyBot ~ on_end ~ state:", this.state);
        this.state = null;
    }
}

export { MyBot };
