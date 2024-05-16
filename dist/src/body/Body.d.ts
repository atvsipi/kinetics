import Vector from '../utils/Vector';
import System from '../System';
import Shape from '../shapes/Shape';
/** The 'body' for all elements. */
export default class Body {
    system: System;
    shape: Shape;
    id: number;
    get velocity(): Vector;
    set velocity(velocity: Vector);
    constructor(shape: Shape);
    getHit(other: Body): void;
    update(): void;
    render(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Body.d.ts.map