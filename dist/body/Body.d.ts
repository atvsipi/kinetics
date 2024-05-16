import { Vector } from '../utils/Vector';
import { System } from '../System';
import { Shape } from '../shapes/Shape';
import { Plugin } from '../plugin/Plugin';
/** The 'body' for all elements. */
export declare class Body {
    system: System;
    shape: Shape;
    id: number;
    private _speed;
    acceleration: Vector;
    /** The plugins of the body. */
    plugins: Plugin[];
    get speed(): number;
    set speed(speed: number);
    get velocity(): Vector;
    set velocity(velocity: Vector);
    set moveAngle(angle: number);
    constructor(shape: Shape);
    collisioned(other: Body): void;
    update(): void;
    render(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Body.d.ts.map