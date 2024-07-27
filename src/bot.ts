import type { Action } from "./actions.js";
import { MoveAction, ShootAction } from "./actions.js";
import { Consts } from "./constants.js";
import type { GameState, MapState, Point, Walls } from "./types.js";

/**
 * (fr) Cette classe représente votre bot. Vous pouvez y définir des attributs et des méthodes qui
 *      seront conservées entre chaque appel de la méthode `on_tick`.
 */
export class MyBot {
    private name = "Isabella";
    private state: null | MapState = null;
    private move!: MoveAction;
    private oldPos!: Point;
    private map!: Walls[][];

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
        console.log(`Current tick: ${gameState.tick}`);

        const isabella = gameState.players.find((p) => p.name === this.name);
        if (!isabella) {
            console.error("NO PLAYER???!?!");
            return [];
        }

        const closestCoin = gameState.coins.reduce(
            (prev, coin) => {
                const dist = distance(coin.pos, isabella.pos);
                if (dist < prev.dist) {
                    return { coin, dist };
                }
                return prev;
            },
            { coin: gameState.coins[0], dist: Number.POSITIVE_INFINITY },
        ).coin;

        const closestPlayer = gameState.players.reduce(
            (prev, player) => {
                if (player.health <= 0) return prev;
                if (player.name === this.name) return prev;

                const dist = distance(player.pos, isabella.pos);
                if (dist < prev.dist) return { player, dist };
                return prev;
            },
            { player: gameState.players[0], dist: Number.POSITIVE_INFINITY },
        );
        console.log("🚀 ~ MyBot ~ on_tick ~ closestPlayer:", closestPlayer.player.name);

        isabella.pos.y += 1;
        if (this.oldPos === isabella.pos) {
            const cellX = isabella.pos.x / 20;
            const cellY = isabella.pos.y / 20;

            const roundedCellX = Math.floor(cellX);
            const roundedCellY = Math.floor(cellY);

            const differenceX = cellX - roundedCellX;
            const differenceY = cellY - roundedCellY;

            if (differenceX <= 0.1) {
                this.map[roundedCellX][roundedCellY].left = true;
                this.map[roundedCellX - 1][roundedCellY].right = true;
            } else if (differenceX >= 0.9) {
                this.map[roundedCellX][roundedCellY].right = true;
                this.map[roundedCellX + 1][roundedCellY].left = true;
            } else if (differenceY <= 0.1) {
                this.map[roundedCellX][roundedCellY].bottom = true;
                this.map[roundedCellX][roundedCellY - 1].top = true;
            } else if (differenceY >= 0.9) {
                this.map[roundedCellX][roundedCellY].top = true;
                this.map[roundedCellX][roundedCellY + 1].bottom = true;
            }
        } else {
            this.move = new MoveAction(isabella.pos);
        }

        this.oldPos = isabella.pos;
        return [
            this.move,
            new MoveAction(closestCoin.pos),
            // new SwitchWeaponAction(Weapons.Canon),
            new ShootAction(
                calculateInterceptionPoint(isabella.pos, closestPlayer.player.pos, closestPlayer.player.dest),
            ),
        ];
    }

    /**
     * (fr) Cette méthode est appelée une seule fois au début de la partie. Vous pouvez y définir des
     *      actions à effectuer au début de la partie.
     */
    on_start(state: MapState) {
        this.state = state;
        this.move = new MoveAction({ x: 0, y: 0 });
        state.map;

        this.map = new Array(20).map((_, x) => {
            return new Array(20).map((_, y) => {
                return { top: y === 0, left: x === 0, right: x === 19, bottom: y === 19 };
            });
        });
    }

    /**
     * (fr) Cette méthode est appelée une seule fois à la fin de la partie. Vous pouvez y définir des actions
     *      à effectuer à la fin de la partie.
     */
    on_end() {
        this.state = null;
    }
}

function distance(p1: Point, p2: Point) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

// Utility function to calculate the magnitude of a point
function hypothenuse(point: Point): number {
    return Math.sqrt(point.x * point.x + point.y * point.y);
}

// Calculate the interception point
function calculateInterceptionPoint(shooterPosition: Point, targetPosition: Point, targetDestination: Point): Point {
    const toDestination = {
        x: targetDestination.x - targetPosition.x,
        y: targetDestination.y - targetPosition.y,
    };
    const distanceToDestination = hypothenuse(toDestination);
    if (distanceToDestination === 0) return targetDestination; // Target is already at destination

    const targetVelocity = {
        x: (toDestination.x / distanceToDestination) * Consts.Player.SPEED,
        y: (toDestination.y / distanceToDestination) * Consts.Player.SPEED,
    };

    // Relative position (vector from shooter to target)
    const relativePosition = {
        x: targetPosition.x - shooterPosition.x,
        y: targetPosition.y - shooterPosition.y,
    };

    // Coefficients for the quadratic equation (a*t^2 + b*t + c = 0)
    const a = hypothenuse(targetVelocity) ** 2 - Consts.Projectile.SPEED ** 2;
    const b = 2 * (targetVelocity.x * relativePosition.x + targetVelocity.y * relativePosition.y);
    const c = hypothenuse(relativePosition) ** 2;

    // Calculate the discriminant
    const discriminant = b * b - 4 * a * c;

    // If the discriminant is negative, there's no real solution (no interception point)
    if (discriminant < 0) {
        return { x: 0, y: 0 };
    }

    // Calculate the two possible times to impact (quadratic formula)
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b + sqrtDiscriminant) / (2 * a);
    const t2 = (-b - sqrtDiscriminant) / (2 * a);

    // Choose the smallest positive time as the valid solution
    const t = t1 >= 0 && t1 < t2 ? t1 : t2;

    // If t is negative, it means the projectile cannot intercept the target in the future
    if (t < 0) {
        return { x: 0, y: 0 };
    }

    // Calculate the interception point (future position of the target)
    return {
        x: targetPosition.x + targetVelocity.x * t + Consts.Player.SIZE / 2,
        y: targetPosition.y + targetVelocity.y * t + Consts.Player.SIZE / 2,
    };
}
