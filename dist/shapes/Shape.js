"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = void 0;
const Enums_1 = require("../typings/Enums");
const Error_1 = require("../typings/Error");
const Vector_1 = require("../utils/Vector");
/** A representation of a geometric shape. */
class Shape {
    /** Whether or not the shape is sleeping. */
    get sleeping() {
        return this.tick - this.lastCollisionFrame > 5 && Math.abs(this.velocity.x) < this.sleepThreshold && Math.abs(this.velocity.y) < this.sleepThreshold && Math.abs(this.angularVelocity) < this.sleepThreshold;
    }
    /** The hitbox of the shape. */
    get hitbox() {
        return this.bounds.max.subtract(this.bounds.min);
    }
    /** The moment of inertia of the shape. */
    get inertia() {
        if (this.static)
            return 0;
        const vertices = this.vertices;
        let inertia = 0;
        for (let i = 0; i < vertices.length; i++) {
            const vertex1 = vertices[i];
            const vertex2 = vertices[(i + 1) % vertices.length];
            const term1 = vertex1.cross(vertex1) + vertex2.cross(vertex2);
            const term2 = vertex1.cross(vertex2);
            inertia += term1 + term2;
        }
        return Math.abs(inertia) / 12;
    }
    /** Gets the angle of the shape. */
    get angle() {
        return this._angle;
    }
    /** Sets the angle of the shape. */
    set angle(value) {
        if (value === this._angle || this.info.rotate === false)
            return;
        const angle = value - this._angle;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this._angle = value;
        for (let i = 0; i < this.vertices.length; i++) {
            const translatedX = this.vertices[i].x - this.position.x;
            const translatedY = this.vertices[i].y - this.position.y;
            const rotatedX = translatedX * cos - translatedY * sin;
            const rotatedY = translatedX * sin + translatedY * cos;
            this.vertices[i].x = rotatedX + this.position.x;
            this.vertices[i].y = rotatedY + this.position.y;
        }
    }
    /** The bounds of the shape for the collision manager. */
    get bounds() {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const vertex of this.vertices) {
            const x = vertex.x;
            const y = vertex.y;
            minX = minX > x ? x : minX;
            minY = minY > y ? y : minY;
            maxX = maxX < x ? x : maxX;
            maxY = maxY < y ? y : maxY;
        }
        if (this.position === undefined)
            this.position = new Vector_1.Vector((minX + maxX) / 2, (minY + maxY) / 2);
        return {
            min: new Vector_1.Vector(minX, minY),
            max: new Vector_1.Vector(maxX, maxY),
        };
    }
    // TODO(Altanis): Angular and linear momentum.
    /** The area of the shape. */
    get area() {
        let area = 0;
        for (let i = 0; i < this.vertices.length; i++)
            area += this.vertices[i].cross(this.vertices[(i + 1) % this.vertices.length]);
        return Math.abs(area / 2);
    }
    constructor(info) {
        /** The number of ticks elapsed since the shape's spawn. */
        this.tick = 0;
        /** The last tick the shape has collided with another. */
        this.lastCollisionFrame = 0;
        /** The threshold for the linear and angular velocities to put the shape to sleep. */
        this.sleepThreshold = -1;
        /** The geometric type of the shape. */
        this.type = Enums_1.ShapeType.Generic;
        /** The velocity of the shape. */
        this.velocity = new Vector_1.Vector(0, 0);
        /** The angular velocity of the shape. */
        this.angularVelocity = 0;
        /** The angular speed of the shape. */
        this.angularSpeed = 0;
        /** The components of the shape. */
        this.components = [];
        /** The parent of the shape (if it is a component.) */
        this.parent = null;
        /** The collision hooks of the shape. */
        this.hooks = {};
        this._angle = 0;
        this.info = info;
        this.vertices = this.initializeVertices(info);
        this.bounds; // Initialize the bounds.
        this.mass = info.mass;
        this.angularSpeed = info.angularSpeed || 0;
        this.elasticity = Math.max(0, info.elasticity) || 0;
        this.static = !!info.static;
        this.sleepThreshold = info.sleepThreshold || -1;
        this.configure(info.render || {});
        this.hooks = info.hooks || {};
    }
    /** Initializes the vertices of the shape. */
    initializeVertices(info) {
        if (!info.form)
            throw new Error_1.ConfigurationError('No form was provided for the shape.');
        let returnedVertices = [];
        if (info.form.components) {
            for (const component of info.form.components) {
                if (component.info.form.components)
                    throw new Error_1.ConfigurationError('Components cannot have components.');
                this.components.push(component);
                returnedVertices.push(...component.vertices);
            }
        }
        else if (info.form.vertices)
            returnedVertices = info.form.vertices;
        else if (info.form.sides) {
            const vertices = [];
            const radius = info.form.radius;
            if (!radius)
                throw new Error_1.ConfigurationError('No radius was provided for the shape.');
            const angleStep = (Math.PI * 2) / info.form.sides;
            for (let i = 0; i < info.form.sides; i++) {
                const startAngle = angleStep * i + (info.form.rotation || 0);
                vertices.push(Vector_1.Vector.toCartesian(radius, startAngle).add(info.form.offset || { x: 0, y: 0 }));
            }
            returnedVertices = vertices;
        }
        else
            throw new Error_1.ConfigurationError('No form was provided for the shape.');
        return returnedVertices;
    }
    /** Configures the shape's rendering properties. */
    configure(info) {
        this.rendering = {
            strokeColor: info.strokeColor,
            fillColor: info.fillColor,
            strokeWidth: info.strokeWidth || 1,
            glowIntensity: info.glowIntensity,
            glowColor: info.glowColor,
            hooks: info.hooks || {},
        };
    }
    /** Rotates the shape by its angular speed. */
    rotate(...directions) {
        for (const movement of directions) {
            switch (movement) {
                case Enums_1.Movement.Up:
                    this.angularVelocity += this.angularSpeed;
                    break;
                case Enums_1.Movement.Down:
                    this.angularVelocity -= this.angularSpeed;
                    break;
                case Enums_1.Movement.Left:
                    this.angularVelocity -= this.angularSpeed;
                    break;
                case Enums_1.Movement.Right:
                    this.angularVelocity += this.angularSpeed;
                    break;
                default:
                    console.error('[SYSTEM]: Invalid angular movement key.');
                    break;
            }
        }
    }
    /** Update the shape. */
    update() {
        if (this.static)
            this.velocity.x = this.velocity.y = this.angularVelocity = 0;
        /** Apply gravity. */
        if (this.body.system.gravity && !this.static) {
            this.velocity.add(this.body.system.gravity);
        }
        // if (this.sleeping) return;
        this.velocity.scale(1 - this.body.system.friction); // Apply friction.
        this.angularVelocity *= 1 - this.body.system.friction; // Apply friction.
        this.updatePosition(this.velocity); // Apply velocity.
        this.angle += this.angularVelocity / 100; // Apply angular velocity.
        this.tick++;
        this.body.system.emit('shapeUpdate', this);
    }
    /** Updates the position. */
    updatePosition(vector) {
        if (this.static)
            return;
        const width = this.body.system.width;
        const height = this.body.system.height;
        if (width && height) {
            const halfWidth = width / 2;
            const halfHeight = height / 2;
            if (this.position.x + vector.x > halfWidth)
                vector.x = halfWidth - this.position.x;
            else if (this.position.x + vector.x < -halfWidth)
                vector.x = -halfWidth - this.position.x;
            if (this.position.y + vector.y > halfHeight)
                vector.y = halfHeight - this.position.y;
            else if (this.position.y + vector.y < -halfHeight)
                vector.y = -halfHeight - this.position.y;
        }
        this.position.add(vector);
        for (const vertex of this.vertices)
            vertex.add(vector);
    }
    /** Determines the stroke and fill color of the shape. */
    determineColors() {
        let stroke = undefined;
        let fill = undefined;
        const shape = this;
        if (shape.rendering.strokeColor)
            stroke = shape.rendering.strokeColor;
        if (shape.rendering.fillColor)
            fill = shape.rendering.fillColor;
        if (!stroke && !fill)
            stroke = Enums_1.Colors.Black;
        return { stroke, fill };
    }
    /** Renders the shape. */
    render(context) {
        const { stroke, fill } = this.determineColors();
        if (this.rendering.glowIntensity) {
            context.shadowBlur = this.rendering.glowIntensity;
            context.shadowColor = (this.rendering.glowColor || stroke || fill);
        }
        context.beginPath();
        if (stroke)
            context.strokeStyle = stroke;
        if (fill)
            context.fillStyle = fill;
        context.lineWidth = this.rendering.strokeWidth || 1;
        if (this.components.length) {
            for (const component of this.components) {
                component.render(context);
            }
        }
        else {
            for (const vertex of this.vertices) {
                context.lineTo(vertex.x, -vertex.y);
            }
        }
        context.closePath();
        if (fill)
            context.fill();
        if (stroke)
            context.stroke();
    }
    /** Scales from a shape. */
    scale(factor) {
        if (factor === 0)
            return;
        for (let i = 0; i < this.vertices.length; i++) {
            const translatedX = this.vertices[i].x - this.position.x;
            const translatedY = this.vertices[i].y - this.position.y;
            const scaledX = translatedX * factor;
            const scaledY = translatedY * factor;
            this.vertices[i].x = scaledX + this.position.x;
            this.vertices[i].y = scaledY + this.position.y;
        }
    }
    /** Divide from a shape. */
    divide(divider) {
        if (divider === 0)
            return;
        this.scale(1 / divider);
    }
}
exports.Shape = Shape;
//# sourceMappingURL=Shape.js.map