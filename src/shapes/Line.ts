import {ShapeType} from '../typings/Enums';
import {LineConfig} from '../typings/Config';
import {Vector} from '../utils/Vector';
import {Shape} from './Shape';

/** A specific geometric shape which represents a straight line boundary. */
export class Line extends Shape {
    public type = ShapeType.Line;

    /** The vector which represents the starting point of the line. */
    public start: Vector;

    /** The vector which represents the ending point of the line. */
    public end: Vector;

    /** The vector which represents a vector from the start to the end. */
    public get line() {
        return this.end.clone.subtract(this.start);
    }

    /** The vector which represents the direction of the start -> end vector. */
    public get lineDir() {
        return this.line.normalize();
    }

    /** The length of the line. */
    public get length() {
        return this.end.distance(this.start);
    }

    /** The corners of the collision detection range box. */
    public get minX() {
        return Math.min(this.start.x, this.end.x);
    }

    public get minY() {
        return Math.min(this.start.y, this.end.y);
    }

    public get maxX() {
        return Math.max(this.start.x, this.end.x);
    }

    public get maxY() {
        return Math.max(this.start.y, this.end.y);
    }

    /** The width and height of the collision detection range boxes of the line. */
    public get width() {
        return this.maxX - this.minX;
    }

    public get height() {
        return this.maxY - this.minY;
    }

    constructor(info: LineConfig) {
        super(info);

        this.start = new Vector(this.position.x, this.position.y);
        this.end = new Vector(info.endX, info.endY);
    }

    /** Renders the line. */
    public render(context: CanvasRenderingContext2D) {
        const {stroke, fill} = this.determineColors();

        if (this.rendering.glowIntensity) {
            context.shadowBlur = this.rendering.glowIntensity;
            context.shadowColor = (this.rendering.glowColor || stroke || fill)!;
        }

        context.beginPath();
        if (fill) context.fillStyle = fill;
        if (stroke) context.strokeStyle = stroke;
        context.lineWidth = this.rendering.strokeWidth || 1;
        context.moveTo(this.start.x, -this.start.y);
        context.lineTo(this.end.x, -this.end.y);
        context.closePath();

        context.stroke();

        if (fill) context.fill();
        if (stroke) context.stroke();
    }
}
