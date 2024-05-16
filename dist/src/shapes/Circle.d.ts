import Shape from './Shape';
import { ShapeType } from '../typings/Enums';
import { CircleConfig } from '../typings/Interfaces';
import Vector from '../utils/Vector';
/** A specific geometric shape which represents a circle. */
export default class Circle extends Shape {
    type: ShapeType;
    /** The bounds of the shape for the collision manager. */
    get bounds(): {
        min: Vector;
        max: Vector;
        dimensions: Vector;
    };
    private _radius;
    /** The radius of the circle. */
    get radius(): number;
    set radius(value: number);
    /** The hitbox of the circle. */
    get hitbox(): Vector;
    /** The moment of inertia of the circle. */
    get inertia(): number;
    constructor(info: CircleConfig);
    /** Circles cannot rotate. Editing the angular velocity will deform the hitbox. */
    rotate(): void;
    /** Renders the circle. */
    render(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Circle.d.ts.map