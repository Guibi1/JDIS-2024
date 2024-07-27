import type { Point } from "./types";
import type { Weapon } from "./weapons";

class MoveAction {
    type = "dest";
    destination!: Point;

    constructor(destination: Point) {
        if (typeof destination.x !== "number" || typeof destination.y !== "number") {
            console.error('Action "MoveTo" rejected: Expected "destination" with numeric "x" and "y" properties.');
            return;
        }

        this.destination = { x: destination.x / 30, y: destination.y / 30 };
    }
}

class ShootAction {
    type = "shoot";
    pos!: Point;

    constructor(position: Point) {
        if (typeof position.x !== "number" || typeof position.y !== "number") {
            console.error('Action "ShootAt" rejected: Expected "position" with numeric "x" and "y" properties.');
            return;
        }

        this.pos = { x: position.x / 30, y: position.y / 30 };
    }
}

class SaveAction {
    type = "save";
    data!: Uint8Array;

    constructor(data: Uint8Array) {
        if (!(data instanceof Uint8Array)) {
            console.error('Action "Store" rejected: Expected "data" to be a Uint8Array.');
            return;
        }

        this.data = data.slice(0, 100);
    }
}

class SwitchWeaponAction {
    type = "switch";
    weapon!: Weapon;

    constructor(weapon: Weapon) {
        if (typeof weapon !== "number") {
            console.error('Action "Switch" rejected: Expected "weapon" to be a number.');
            return;
        }

        this.weapon = weapon;
    }
}

class BladeRotateAction {
    type = "rotate_blade";
    rad!: number;

    constructor(rad: number) {
        if (typeof rad !== "number") {
            console.error('Action "BladeRotate" rejected: Expected "rad" to be a number');
            return;
        }

        this.rad = rad;
    }
}

export { BladeRotateAction, MoveAction, SaveAction, ShootAction, SwitchWeaponAction, type Weapon };

export type Action = MoveAction | ShootAction | SaveAction | SwitchWeaponAction | BladeRotateAction;
