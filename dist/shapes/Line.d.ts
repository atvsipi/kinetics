import { ShapeType } from '../typings/Enums';
import { LineConfig } from '../typings/Config';
import { Vector } from '../utils/Vector';
import { Shape } from './Shape';
/** A specific geometric shape which represents a straight line boundary. */
export declare class Line extends Shape {
    type: ShapeType;
    /** The vector which represents the starting point of the line. */
    start: Vector;
    /** The vector which represents the ending point of the line. */
    end: Vector;
    /** The vector which represents a vector from the start to the end. */
    get line(): Vector;
    /** The vector which represents the direction of the start -> end vector. */
    get lineDir(): Vector;
    /** The length of the line. */
    get length(): number;
    /** The corners of the collision detection range box. */
    get minX(): number;
    get minY(): number;
    get maxX(): number;
    get maxY(): number;
    /** The width and height of the collision detection range boxes of the line. */
    get width(): number;
    get height(): number;
    constructor(info: LineConfig);
    /** Renders the line. */
    render(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Line.d.ts.map