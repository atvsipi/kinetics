"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
const Enums_1 = require("../typings/Enums");
const Vector_1 = require("../utils/Vector");
const Shape_1 = require("./Shape");
/** A specific geometric shape which represents a straight line boundary. */
class Line extends Shape_1.Shape {
    /** The vector which represents a vector from the start to the end. */
    get line() {
        return this.end.clone.subtract(this.start);
    }
    /** The vector which represents the direction of the start -> end vector. */
    get lineDir() {
        return this.line.normalize();
    }
    /** The length of the line. */
    get length() {
        return this.end.distance(this.start);
    }
    /** The corners of the collision detection range box. */
    get minX() {
        return Math.min(this.start.x, this.end.x);
    }
    get minY() {
        return Math.min(this.start.y, this.end.y);
    }
    get maxX() {
        return Math.max(this.start.x, this.end.x);
    }
    get maxY() {
        return Math.max(this.start.y, this.end.y);
    }
    /** The width and height of the collision detection range boxes of the line. */
    get width() {
        return this.maxX - this.minX;
    }
    get height() {
        return this.maxY - this.minY;
    }
    constructor(info) {
        super(info);
        this.type = Enums_1.ShapeType.Line;
        this.start = new Vector_1.Vector(this.position.x, this.position.y);
        this.end = new Vector_1.Vector(info.endX, info.endY);
    }
    /** Renders the line. */
    render(context) {
        const { stroke, fill } = this.determineColors();
        if (this.rendering.glowIntensity) {
            context.shadowBlur = this.rendering.glowIntensity;
            context.shadowColor = (this.rendering.glowColor || stroke || fill);
        }
        context.beginPath();
        if (fill)
            context.fillStyle = fill;
        if (stroke)
            context.strokeStyle = stroke;
        context.lineWidth = this.rendering.strokeWidth || 1;
        context.moveTo(this.start.x, -this.start.y);
        context.lineTo(this.end.x, -this.end.y);
        context.closePath();
        context.stroke();
        if (fill)
            context.fill();
        if (stroke)
            context.stroke();
    }
}
exports.Line = Line;
//# sourceMappingURL=Line.js.map