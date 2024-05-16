"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const Vector_1 = require("../utils/Vector");
/** The 'body' for all elements. */
class Body {
    get speed() {
        return this._speed;
    }
    set speed(speed) {
        this._speed = speed;
    }
    get velocity() {
        return this.shape.velocity;
    }
    set velocity(velocity) {
        this.shape.velocity = velocity;
    }
    set moveAngle(angle) {
        this.acceleration.x += Math.cos(angle);
        this.acceleration.y -= Math.sin(angle);
        this.acceleration.normalize().scale(this.speed);
        this.velocity.add(this.acceleration);
    }
    constructor(shape) {
        // Is alive
        this.live = true;
        this._speed = 1;
        this.acceleration = new Vector_1.Vector(0, 0);
        /** The plugins of the body. */
        this.plugins = [];
        this.shape = shape;
        this.shape.body = this;
    }
    collisioned(other) {
        for (const plugin of [...this.system.plugins, ...this.plugins]) {
            plugin.bodyCollisioned(this, other);
        }
    }
    update() {
        this.shape.update();
        this.acceleration.scale(0); // Reset acceleration.
    }
    render(context) {
        this.shape.render(context);
    }
}
exports.Body = Body;
//# sourceMappingURL=Body.js.map