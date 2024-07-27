import type { Action } from "./actions";
import { MoveAction, SaveAction, ShootAction, SwitchWeaponAction } from "./actions";
import type { Coin, GameState, MapState, Point } from "./types";
import Weapons from "./weapons";

/**
 * (fr) Cette classe représente votre bot. Vous pouvez y définir des attributs et des méthodes qui
 *      seront conservées entre chaque appel de la méthode `on_tick`.
 */
export class MyBot {
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
    on_tick(gameState: GameState): Action[] {
        console.log("🚀 ~ MyBot ~ on_tick ~ game_state:", gameState);
        console.log(`Current tick: ${gameState.tick}`);

        const isabella = gameState.players.find((p) => p.name === this.name);
        if (!isabella) {
            console.error("NO PLAYER???!?!");
            return [];
        }

        const closestCoin = gameState.coins.reduce(
            (prev, coin) => {
                const dist = distance(coin.pos, isabella.pos);
                if (dist < prev.dist) return { coin, dist };
                return prev;
            },
            { coin: gameState.coins[0], dist: Number.POSITIVE_INFINITY },
        ).coin;

        const closestPlayer = gameState.players.reduce(
            (prev, player) => {
                if (player.name === this.name) return prev;

                const dist = distance(player.pos, isabella.pos);
                if (dist < prev.dist) return { player, dist };
                return prev;
            },
            { player: gameState.players[0], dist: Number.POSITIVE_INFINITY },
        ).player;

        return [
            new MoveAction(closestCoin.pos),
            new SwitchWeaponAction(Weapons.Canon),
            new ShootAction(closestPlayer.pos),
        ];
    }

    /**
     * (fr) Cette méthode est appelée une seule fois au début de la partie. Vous pouvez y définir des
     *      actions à effectuer au début de la partie.
     */
    on_start(state: MapState) {
        console.log("🚀 ~ MyBot ~ on_start ~ state:", state);
        this.state = state;
        state.map;
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

function distance(p1: Point, p2: Point) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}
