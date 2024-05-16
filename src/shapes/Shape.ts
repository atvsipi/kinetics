import {Body} from '../body/Body';
import {CircleConfig, ShapeConfig, LineConfig} from '../typings/Config';
import {Colors, ShapeType, Movement} from '../typings/Enums';
import {ConfigurationError} from '../typings/Error';
import {ShapeRenderingConfig} from '../typings/Config';

import {Vector, VectorLike} from '../utils/Vector';

/** A representation of a geometric shape. */
export class Shape {
    /** The raw information of the shape. */
    protected info: ShapeConfig | CircleConfig | LineConfig;

    /** The number of ticks elapsed since the shape's spawn. */
    public tick = 0;
    /** The last tick the shape has collided with another. */
    public lastCollisionFrame = 0;

    /** The threshold for the linear and angular velocities to put the shape to sleep. */
    private sleepThreshold = -1;

    /** The geometric type of the shape. */
    public type: ShapeType = ShapeType.Generic;

    /** The vertices of the shape. */
    public vertices: Vector[];
    /** The coordinates of the shape. */
    public position!: Vector;
    /** The velocity of the shape. */
    public velocity = new Vector(0, 0);
    /** The mass of the shape. */
    public mass: number;
    /** The elasticity of the shape. */
    public elasticity: number;
    /** If the shape is static. */
    public static: boolean;
    /** The angular velocity of the shape. */
    public angularVelocity = 0;
    /** The angular speed of the shape. */
    public angularSpeed = 0;

    /** The components of the shape. */
    public components: Shape[] = [];
    /** The parent of the shape (if it is a component.) */
    public parent: Shape | null = null;

    /** The collision hooks of the shape. */
    public hooks: {
        /** The hooks to run before resolving collisions. */
        preResolve?: (shape: Shape) => void;
        /** The hooks to run after resolving collisions. */
        postResolve?: (shape: Shape) => void;
    } = {};

    /** Whether or not the shape is sleeping. */
    public get sleeping() {
        return this.tick - this.lastCollisionFrame > 5 && Math.abs(this.velocity.x) < this.sleepThreshold && Math.abs(this.velocity.y) < this.sleepThreshold && Math.abs(this.angularVelocity) < this.sleepThreshold;
    }

    /** The hitbox of the shape. */
    public get hitbox() {
        return this.bounds.max.subtract(this.bounds.min);
    }

    /** The moment of inertia of the shape. */
    public get inertia() {
        if (this.static) return 0;

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

    private _angle = 0;
    /** Gets the angle of the shape. */
    public get angle() {
        return this._angle;
    }
    /** Sets the angle of the shape. */
    public set angle(value: number) {
        if (value === this._angle || this.info.rotate === false) return;

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

    /** The unique identifier for the shape. */
    public id!: number;

    /** The body the shape is in. */
    public body!: Body;

    /** The bounds of the shape for the collision manager. */
    public get bounds() {
        let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;

        for (const vertex of this.vertices) {
            const x = vertex.x;
            const y = vertex.y;

            minX = minX > x ? x : minX;
            minY = minY > y ? y : minY;
            maxX = maxX < x ? x : maxX;
            maxY = maxY < y ? y : maxY;
        }

        if (this.position === undefined) this.position = new Vector((minX + maxX) / 2, (minY + maxY) / 2);

        return {
            min: new Vector(minX, minY),
            max: new Vector(maxX, maxY),
        };
    }

    // TODO(Altanis): Angular and linear momentum.

    /** The area of the shape. */
    public get area() {
        let area = 0;

        for (let i = 0; i < this.vertices.length; i++) area += this.vertices[i].cross(this.vertices[(i + 1) % this.vertices.length]);

        return Math.abs(area / 2);
    }

    /** The rendering options for the shape. */
    public rendering!: ShapeRenderingConfig;

    constructor(info: ShapeConfig | CircleConfig) {
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
    private initializeVertices(info: ShapeConfig | CircleConfig | LineConfig) {
        if (!info.form) throw new ConfigurationError('No form was provided for the shape.');

        let returnedVertices: Vector[] = [];

        if (info.form.components) {
            for (const component of info.form.components) {
                if (component.info.form.components) throw new ConfigurationError('Components cannot have components.');

                this.components.push(component);
                returnedVertices.push(...component.vertices);
            }
        } else if (info.form.vertices) returnedVertices = info.form.vertices;
        else if (info.form.sides) {
            const vertices: Vector[] = [];
            const radius = info.form.radius;

            if (!radius) throw new ConfigurationError('No radius was provided for the shape.');

            const angleStep = (Math.PI * 2) / info.form.sides;
            for (let i = 0; i < info.form.sides; i++) {
                const startAngle = angleStep * i + (info.form.rotation || 0);

                vertices.push(Vector.toCartesian(radius, startAngle).add(info.form.offset || {x: 0, y: 0}));
            }

            returnedVertices = vertices;
        } else throw new ConfigurationError('No form was provided for the shape.');

        return returnedVertices;
    }

    /** Configures the shape's rendering properties. */
    public configure(info: ShapeRenderingConfig) {
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
    public rotate(...directions: Movement[]) {
        for (const movement of directions) {
            switch (movement) {
                case Movement.Up:
                    this.angularVelocity += this.angularSpeed;
                    break;
                case Movement.Down:
                    this.angularVelocity -= this.angularSpeed;
                    break;
                case Movement.Left:
                    this.angularVelocity -= this.angularSpeed;
                    break;
                case Movement.Right:
                    this.angularVelocity += this.angularSpeed;
                    break;
                default:
                    console.error('[SYSTEM]: Invalid angular movement key.');
                    break;
            }
        }
    }

    /** Update the shape. */
    public update() {
        if (this.static) this.velocity.x = this.velocity.y = this.angularVelocity = 0;

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
    public updatePosition(vector: VectorLike) {
        if (this.static) return;

        const width = this.body.system.width;
        const height = this.body.system.height;

        if (width && height) {
            const halfWidth = width / 2;
            const halfHeight = height / 2;

            if (this.position.x + vector.x > halfWidth) vector.x = halfWidth - this.position.x;
            else if (this.position.x + vector.x < -halfWidth) vector.x = -halfWidth - this.position.x;
            if (this.position.y + vector.y > halfHeight) vector.y = halfHeight - this.position.y;
            else if (this.position.y + vector.y < -halfHeight) vector.y = -halfHeight - this.position.y;
        }

        this.position.add(vector);
        for (const vertex of this.vertices) vertex.add(vector);
    }

    /** Determines the stroke and fill color of the shape. */
    protected determineColors(): {stroke: Colors | string | undefined; fill: Colors | string | undefined} {
        let stroke: Colors | string | undefined = undefined;
        let fill: Colors | string | undefined = undefined;

        const shape = this;

        if (shape.rendering.strokeColor) stroke = shape.rendering.strokeColor;
        if (shape.rendering.fillColor) fill = shape.rendering.fillColor;

        if (!stroke && !fill) stroke = Colors.Black;

        return {stroke, fill};
    }

    /** Renders the shape. */
    public render(context: CanvasRenderingContext2D) {
        const {stroke, fill} = this.determineColors();

        if (this.rendering.glowIntensity) {
            context.shadowBlur = this.rendering.glowIntensity;
            context.shadowColor = (this.rendering.glowColor || stroke || fill)!;
        }

        context.beginPath();
        if (stroke) context.strokeStyle = stroke;
        if (fill) context.fillStyle = fill;
        context.lineWidth = this.rendering.strokeWidth || 1;

        if (this.components.length) {
            for (const component of this.components) {
                component.render(context);
            }
        } else {
            for (const vertex of this.vertices) {
                context.lineTo(vertex.x, -vertex.y);
            }
        }

        context.closePath();

        if (fill) context.fill();
        if (stroke) context.stroke();
    }

    /** Scales from a shape. */
    public scale(factor: number): void {
        if (factor === 0) return;

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
    public divide(divider: number) {
        if (divider === 0) return;

        this.scale(1 / divider);
    }
}
