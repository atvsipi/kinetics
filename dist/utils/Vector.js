"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
/** A vector in 2D space, represents a direction and magnitude simultaneously. */
class Vector {
    constructor(x, y) {
        /** The coordinates of the vector. */
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    /** Converts polar coordinates to Cartesian coordinates. */
    static toCartesian(r, theta) {
        return new Vector(r * Math.cos(theta), r * Math.sin(theta));
    }
    /** Adds to a vector. */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    /** Subtracts from a vector. */
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }
    /** Scales from a vector. */
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /** Divide from a vector. */
    divide(divider) {
        this.x /= divider;
        this.y /= divider;
        return this;
    }
    /** Normalizes the vector. */
    normalize() {
        const magnitude = this.magnitude;
        if (magnitude === 0)
            this.x = this.y = 0;
        else {
            this.x /= magnitude;
            this.y /= magnitude;
        }
        return this;
    }
    /** Gets the distance from another vector. */
    distance(vector) {
        return this.clone.subtract(vector).magnitude;
    }
    /** Gets the dot product of two vectors. */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    /** Gets the cross product of two vectors. */
    cross(vector) {
        return this.x * vector.y - this.y * vector.x;
    }
    /** Gets the projection of the current vector onto another vector. */
    project(vector) {
        if (vector.x === 0 && vector.y === 0)
            return new Vector(0, 0);
        return vector.clone.scale(this.dot(vector) / vector.magnitudeSq);
    }
    /** Creates a vector directionally orthogonal to the current vector. */
    get orthogonal() {
        return new Vector(-this.y, this.x);
    }
    /** Gets the angle of the vector from a reference point. */
    angle(reference = { x: 0, y: 0 }) {
        return Math.atan2(this.y - reference.y, this.x - reference.x);
    }
    /** Rotates the angle to a new angle. */
    rotate(angle) {
        const magnitude = this.magnitude;
        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);
        return this;
    }
    /** Gets the magnitude (length) of the vector. */
    get magnitude() {
        return Math.sqrt(this.magnitudeSq);
    }
    /** Sets the magnitude (length) of the vector. */
    set magnitude(magnitude) {
        const angle = this.angle();
        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);
    }
    /** Gets the squared magnitude of the vector. */
    get magnitudeSq() {
        return this.x * this.x + this.y * this.y;
    }
    /** Clones the vector. */
    get clone() {
        return new Vector(this.x, this.y);
    }
    /** Get the distance from two vectors. */
    static distance(a, b) {
        return Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
    }
    /** Adds to a vector. */
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }
    /** Subtract from the two vectors. */
    static subtract(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }
    /** Scales from a vector. */
    static scale(v, scalar) {
        return new Vector(v.x * scalar, v.y * scalar);
    }
    /** Divide from a vector. */
    static divide(v, divider) {
        return new Vector(v.x / divider, v.y / divider);
    }
}
exports.Vector = Vector;
//# sourceMappingURL=Vector.js.map