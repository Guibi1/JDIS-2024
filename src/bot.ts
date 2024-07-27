import type { Action } from "./actions.js";
import { MoveAction, SaveAction, ShootAction, SwitchWeaponAction } from "./actions.js";
import type { Coin, GameState, MapState, Point } from "./types.js";
import Weapons from "./weapons.js";

/**
 * (fr) Cette classe représente votre bot. Vous pouvez y définir des attributs et des méthodes qui
 *      seront conservées entre chaque appel de la méthode `on_tick`.
 */
export class MyBot {
    private name = "Isabella";
    private state: null | MapState = null;
    private move: MoveAction = new MoveAction({x:0,y:0});
    private oldPos: Point ;
    private map: Walls[][];

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
        console.log("🚀 ~ MyBot ~ on_end ~ state:", this.state);
        this.state = null;
    }

    bfs(start: Point, goal: Point): Point[] {
        const queue: { pos: Point; path: Point[] }[] = [{ pos: start, path: [] }];
        const visited = new Set<string>();

        const directions = [
            { x: 0, y: -1 }, // up
            { x: 1, y: 0 }, // right
            { x: 0, y: 1 }, // down
            { x: -1, y: 0 } // left
        ];

        const inBounds = (x: number, y: number) => x >= 0 && x < 20 && y >= 0 && y < 20;
        const hashPoint = (p: Point) => `${p.x},${p.y}`;

        while (queue.length > 0) {
            const { pos, path } = queue.shift();
            if (hashPoint(pos) === hashPoint(goal)) return path;

            for (const dir of directions) {
                const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
                if (inBounds(newPos.x, newPos.y) && !visited.has(hashPoint(newPos)) && this.isPassable(pos, newPos)) {
                    visited.add(hashPoint(newPos));
                    queue.push({ pos: newPos, path: [...path, newPos] });
                }
            }
        }

        return [];
    }

    isPassable(current: Point, next: Point): boolean {
        const [dx, dy] = [next.x - current.x, next.y - current.y];
        if (dx === 1) return !this.map[current.x][current.y].right && !this.map[next.x][next.y].left;
        if (dx === -1) return !this.map[current.x][current.y].left && !this.map[next.x][next.y].right;
        if (dy === 1) return !this.map[current.x][current.y].bottom && !this.map[next.x][next.y].top;
        if (dy === -1) return !this.map[current.x][current.y].top && !this.map[next.x][next.y].bottom;
        return false;
    }
}

function distance(p1: Point, p2: Point) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

type Walls = { top: boolean; left: boolean; right: boolean; bottom: boolean };
