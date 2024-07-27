const Weapons = { None: 0, Canon: 1, Blade: 2 } as const;

export default Weapons;
export type Weapon = (typeof Weapons)[keyof typeof Weapons];
