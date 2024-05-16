import {Vector} from '../utils/Vector';
import {System} from '../System';
import {Shape} from '../shapes/Shape';
import {Plugin} from '../plugin/Plugin';

/** The 'body' for all elements. */
export class Body {
    public system!: System;
    public shape!: Shape;

    public id!: number;

    private _speed: number = 1;

    public acceleration: Vector = new Vector(0, 0);

    /** The plugins of the body. */
    public plugins: Plugin[] = [];

    public get speed(): number {
        return this._speed;
    }

    public set speed(speed: number) {
        this._speed = speed;
    }

    public get velocity() {
        return this.shape.velocity;
    }

    public set velocity(velocity: Vector) {
        this.shape.velocity = velocity;
    }

    public set moveAngle(angle: number) {
        this.acceleration.x += Math.cos(angle);
        this.acceleration.y -= Math.sin(angle);

        this.acceleration.normalize().scale(this.speed);
        this.velocity.add(this.acceleration);
    }

    constructor(shape: Shape) {
        this.shape = shape;
        this.shape.body = this;
    }

    public collisioned(other: Body) {
        for (const plugin of [...this.system.plugins, ...this.plugins]) {
            plugin.bodyCollisioned(this, other);
        }
    }

    public update() {
        this.shape.update();

        this.acceleration.scale(0); // Reset acceleration.

        for (const plugin of [...this.system.plugins, ...this.plugins]) {
            plugin.bodyUpdate(this);
        }
    }

    public render(context: CanvasRenderingContext2D) {
        this.shape.render(context);
    }
}
