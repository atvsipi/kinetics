import {Environment, Movement} from './typings/Enums';
import {SystemConfig} from './typings/Config';
import {ConfigurationError} from './typings/Error';
import {CollisionManager} from './typings/Interfaces';

import {SpatialHashGrid} from './collision/SpatialHashGrid';

import {CollisionResolver} from './collision/CollisionResolver';
import {Camera} from './utils/Camera';
import {Renderer} from './utils/Renderer';

import {Body} from './body/Body';

import {EventEmitter} from './EventEmitter';
import {Vector, VectorLike} from './utils/Vector';
import {Plugin} from './plugin/Plugin';

/** The area upon which the engine is operating on. */
export class System extends EventEmitter {
    /** The camera viewing the system. */
    public camera: Camera;
    /** The renderer rendering the system. */
    public renderer!: Renderer;

    /** The width of the system. */
    public width: number | null = null;
    /** The height of the system. */
    public height: number | null = null;

    /** The friction in the system. */
    public friction = 0.1;
    /** The gravity in the system. */
    public gravity: VectorLike = new Vector(0, 0);

    /** The plugins of the system. */
    public plugins: Plugin[] = [];

    /** The engine which partitions the system and efficiently checks for collisions. */
    public CollisionManager: CollisionManager;
    /** The engine which detects and resolves collisions. */
    public CollisionResolver = new CollisionResolver();

    /** The bodys in the system. */
    public bodys: (Body | undefined)[] = [];

    /** The configuration of the system. */
    public config: SystemConfig;

    /** Flag for logging messages to console. */
    public verbose = false;

    /** The amount of ticks elapsed since the start of the engine. */
    public tick = 0;
    /** The amount of tick cycles that occur in one second. */
    public tickRate = 0;

    /** The environment the system is running in. */
    public environment = Environment.Browser;
    /** The performance of the system. */
    public performance = {
        /** The time it takes for a world update. */
        worldUpdateRate: 0,
        /** The amount of memory used, in bytes. */
        memoryUsage: 0,
    };

    /** Gets the momentum of the system. */
    public get momentum() {
        let momentum = 0;

        for (const body of this.bodys) {
            if (!body) continue;
            momentum += body.velocity.magnitude * body.shape.mass + Math.abs(body.shape.angularVelocity * body.shape.inertia) * body.shape.mass;
        }

        return momentum;
    }

    /** Gets the kinetic energy of the system. */
    public get kineticEnergy() {
        let energy = 0;
        for (const body of this.bodys) {
            if (!body) continue;
            energy += 0.5 * body.shape.mass * (body.velocity.magnitude * body.velocity.magnitude);
        }

        return energy;
    }

    /** Gets the next available ID. */
    private get nextId(): number {
        const idx = this.bodys.indexOf(undefined);
        if (idx !== -1) return idx;
        return this.bodys.length;
    }

    constructor(config: SystemConfig) {
        super();

        this.environment = typeof window === 'undefined' ? Environment.Node : Environment.Browser;
        this.config = config;

        this.width = config.dimensions?.x || null;
        this.height = config.dimensions?.y || null;

        if ((this.width && !this.height) || (this.height && !this.width)) throw new ConfigurationError('Both dimensions must be specified for the system.');

        this.friction = config.friction || 0.1;
        this.gravity = config.gravity || new Vector(0, 0);
        this.plugins = config.plugins || [];

        this.camera = new Camera(config.camera || {}, this);

        if (config.render && config.render.canvas) this.renderer = new Renderer(config.render, this);

        this.verbose = config.verbose || false;

        if (!config.collisionInfo) throw new ConfigurationError('Collision information must be specified for the system.');

        this.CollisionManager = new SpatialHashGrid(this, config.collisionInfo.cellSize || 12);

        if (this.verbose) console.log('[PHYSICS]: Engine started.');

        /** Handle ticksystem. */
        if (this.environment === Environment.Browser) {
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
    public setCollisionEngine(engine: CollisionManager) {
        this.CollisionManager = engine;
    }

    public update() {
        const time = performance.now();

        this.CollisionManager.clear();

        for (const body of this.bodys) {
            if (!body) continue;

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
        this.performance.memoryUsage = this.environment === Environment.Browser ? performance.memory?.usedJSHeapSize / 1024 / 1024 : process.memoryUsage().heapUsed / 1024 / 1024;

        if (this.environment === Environment.Browser) requestAnimationFrame(this.update.bind(this));
    }

    /** Adds an body to the system. */
    public addBody(body: Body) {
        const id = this.nextId;

        body.id = id;
        body.system = this;
        this.bodys[id] = body;
        this.emit('bodyCreate', body);

        return body;
    }

    /** Removes an body from the system. */
    public removeBody(body: Body) {
        // this.bodys[body.id] = undefined;

        if (this.bodys[body.id]) body.live = false;

        return body;
    }
}
