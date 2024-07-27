export interface Player {
    name: string;
    color: number;
    health: number;
    pos: Point;
    dest: Point;
    current_weapon: number;
    projectiles: Projectile[];
    blade: Blade;
}

export interface Point {
    x: number;
    y: number;
}

export interface Projectile {
    id: string;
    pos: Point;
    dest: Point;
}

export interface Blade {
    start: Point;
    end: Point;
    rotation: number;
}

export interface Coin {
    id: string;
    pos: Point;
    value: number;
}

export interface MapState {
    map: number[][];
    walls: Point[][];
    size: number;
    save: Uint8Array;
}

export interface GameState {
    tick: number;
    round: number;
    players: Player[];
    coins: Coin[];
}

export type Walls = { top: boolean; left: boolean; right: boolean; bottom: boolean };
