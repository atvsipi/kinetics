"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
const Shape_1 = require("./Shape");
const Enums_1 = require("../typings/Enums");
const Error_1 = require("../typings/Error");
const Vector_1 = require("../utils/Vector");
/** A specific geometric shape which represents a circle. */
class Circle extends Shape_1.Shape {
    /** The bounds of the shape for the collision manager. */
    get bounds() {
        const vertex = this.position || this.vertices[0];
        if (this.position === undefined)
            this.position = vertex;
        return {
            min: new Vector_1.Vector(vertex.x - this.radius, vertex.y - this.radius),
            max: vertex,
            dimensions: this.hitbox,
        };
    }
    /** The radius of the circle. */
    get radius() {
        return this._radius;
    }
    set radius(value) {
        if (value <= 0)
            throw new Error_1.ConfigurationError('The radius of a circle must be greater than 0.');
        this._radius = value;
    }
    /** The hitbox of the circle. */
    get hitbox() {
        return new Vector_1.Vector(this.radius * 2, this.radius * 2);
    }
    /** The moment of inertia of the circle. */
    get inertia() {
        return this.static ? 0 : (this.mass * this.radius * this.radius) / 2;
    }
    constructor(info) {
        super(info);
        this.type = Enums_1.ShapeType.Circle;
        this._radius = 0;
        this.radius = info.radius;
    }
    /** Circles cannot rotate. Editing the angular velocity will deform the hitbox. */
    rotate() { }
    /** Renders the circle. */
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
        context.arc(this.position.x, -this.position.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
        if (fill)
            context.fill();
        if (stroke)
            context.stroke();
    }
}
exports.Circle = Circle;
//# sourceMappingURL=Circle.js.map