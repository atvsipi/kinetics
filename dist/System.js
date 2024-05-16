"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const Enums_1 = require("./typings/Enums");
const Error_1 = require("./typings/Error");
const SpatialHashGrid_1 = require("./collision/SpatialHashGrid");
const CollisionResolver_1 = require("./collision/CollisionResolver");
const Camera_1 = require("./utils/Camera");
const Renderer_1 = require("./utils/Renderer");
const EventEmitter_1 = require("./EventEmitter");
const Vector_1 = require("./utils/Vector");
/** The area upon which the engine is operating on. */
class System extends EventEmitter_1.EventEmitter {
    /** Gets the momentum of the system. */
    get momentum() {
        let momentum = 0;
        for (const body of this.bodys) {
            if (!body)
                continue;
            momentum += body.velocity.magnitude * body.shape.mass + Math.abs(body.shape.angularVelocity * body.shape.inertia) * body.shape.mass;
        }
        return momentum;
    }
    /** Gets the kinetic energy of the system. */
    get kineticEnergy() {
        let energy = 0;
        for (const body of this.bodys) {
            if (!body)
                continue;
            energy += 0.5 * body.shape.mass * (body.velocity.magnitude * body.velocity.magnitude);
        }
        return energy;
    }
    /** Gets the next available ID. */
    get nextId() {
        const idx = this.bodys.indexOf(undefined);
        if (idx !== -1)
            return idx;
        return this.bodys.length;
    }
    constructor(config) {
        var _a, _b;
        super();
        /** The width of the system. */
        this.width = null;
        /** The height of the system. */
        this.height = null;
        /** The friction in the system. */
        this.friction = 0.1;
        /** The gravity in the system. */
        this.gravity = new Vector_1.Vector(0, 0);
        /** The plugins of the system. */
        this.plugins = [];
        /** The engine which detects and resolves collisions. */
        this.CollisionResolver = new CollisionResolver_1.CollisionResolver();
        /** The bodys in the system. */
        this.bodys = [];
        /** Flag for logging messages to console. */
        this.verbose = false;
        /** The amount of ticks elapsed since the start of the engine. */
        this.tick = 0;
        /** The amount of tick cycles that occur in one second. */
        this.tickRate = 0;
        /** The environment the system is running in. */
        this.environment = Enums_1.Environment.Browser;
        /** The performance of the system. */
        this.performance = {
            /** The time it takes for a world update. */
            worldUpdateRate: 0,
            /** The amount of memory used, in bytes. */
            memoryUsage: 0,
        };
        this.environment = typeof window === 'undefined' ? Enums_1.Environment.Node : Enums_1.Environment.Browser;
        this.config = config;
        this.width = ((_a = config.dimensions) === null || _a === void 0 ? void 0 : _a.x) || null;
        this.height = ((_b = config.dimensions) === null || _b === void 0 ? void 0 : _b.y) || null;
        if ((this.width && !this.height) || (this.height && !this.width))
            throw new Error_1.ConfigurationError('Both dimensions must be specified for the system.');
        this.friction = config.friction || 0.1;
        this.gravity = config.gravity || new Vector_1.Vector(0, 0);
        this.plugins = config.plugins || [];
        this.camera = new Camera_1.Camera(config.camera || {}, this);
        if (config.render && config.render.canvas)
            this.renderer = new Renderer_1.Renderer(config.render, this);
        this.verbose = config.verbose || false;
        if (!config.collisionInfo)
            throw new Error_1.ConfigurationError('Collision information must be specified for the system.');
        this.CollisionManager = new SpatialHashGrid_1.SpatialHashGrid(this, config.collisionInfo.cellSize || 12);
        if (this.verbose)
            console.log('[PHYSICS]: Engine started.');
        /** Handle ticksystem. */
        if (this.environment === Enums_1.Environment.Browser) {
            requestAnimationFrame(this.update.bind(this));
            return;
        }
        this.tickRate = config.tickRate || 60;
        setInterval(this.update.bind(this), 1000 / this.tickRate);
        // if (config.useRAF) requestAnimationFrame(this.update.bind(this));
        // else {
        //     this.tickRate = config.tickRate || 60;
        //     setInterval(this.update.bind(this), 1000 / this.tickRate);
        // }
    }
    /** Sets the collision engine. */
    setCollisionEngine(engine) {
        this.CollisionManager = engine;
    }
    update() {
        var _a;
        const time = performance.now();
        this.CollisionManager.clear();
        for (const body of this.bodys) {
            if (!body)
                continue;
            if (!body.live) {
                this.bodys[body.id] = undefined;
                this.emit('bodyDelete', body);
                continue;
            }
            this.CollisionManager.insert(body.shape.bounds.min.x, body.shape.bounds.min.y, body.shape.hitbox.x, body.shape.hitbox.y, body.id);
            body.update();
        }
        this.CollisionManager.query();
        for (const plugin of this.plugins) {
            plugin.update(this);
        }
        this.tick++;
        this.performance.worldUpdateRate = performance.now() - time;
        /** @ts-ignore */
        this.performance.memoryUsage = this.environment === Enums_1.Environment.Browser ? ((_a = performance.memory) === null || _a === void 0 ? void 0 : _a.usedJSHeapSize) / 1024 / 1024 : process.memoryUsage().heapUsed / 1024 / 1024;
        if (this.environment === Enums_1.Environment.Browser)
            requestAnimationFrame(this.update.bind(this));
    }
    /** Adds an body to the system. */
    addBody(body) {
        const id = this.nextId;
        body.id = id;
        body.system = this;
        this.bodys[id] = body;
        this.emit('bodyCreate', body);
        return body;
    }
    /** Removes an body from the system. */
    removeBody(body) {
        // this.bodys[body.id] = undefined;
        if (this.bodys[body.id])
            body.live = false;
        return body;
    }
}
exports.System = System;
//# sourceMappingURL=System.js.map