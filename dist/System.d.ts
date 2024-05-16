import { Environment } from './typings/Enums';
import { SystemConfig } from './typings/Config';
import { CollisionManager } from './typings/Interfaces';
import { CollisionResolver } from './collision/CollisionResolver';
import { Camera } from './utils/Camera';
import { Renderer } from './utils/Renderer';
import { Body } from './body/Body';
import { EventEmitter } from './EventEmitter';
import { VectorLike } from './utils/Vector';
import { Plugin } from './plugin/Plugin';
/** The area upon which the engine is operating on. */
export declare class System extends EventEmitter {
    /** The camera viewing the system. */
    camera: Camera;
    /** The renderer rendering the system. */
    renderer: Renderer;
    /** The width of the system. */
    width: number | null;
    /** The height of the system. */
    height: number | null;
    /** The friction in the system. */
    friction: number;
    /** The gravity in the system. */
    gravity: VectorLike;
    /** The plugins of the system. */
    plugins: Plugin[];
    /** The engine which partitions the system and efficiently checks for collisions. */
    CollisionManager: CollisionManager;
    /** The engine which detects and resolves collisions. */
    CollisionResolver: CollisionResolver;
    /** The bodys in the system. */
    bodys: (Body | undefined)[];
    /** The configuration of the system. */
    config: SystemConfig;
    /** Flag for logging messages to console. */
    verbose: boolean;
    /** The amount of ticks elapsed since the start of the engine. */
    tick: number;
    /** The amount of tick cycles that occur in one second. */
    tickRate: number;
    /** The environment the system is running in. */
    environment: Environment;
    /** The performance of the system. */
    performance: {
        /** The time it takes for a world update. */
        worldUpdateRate: number;
        /** The amount of memory used, in bytes. */
        memoryUsage: number;
    };
    /** Gets the momentum of the system. */
    get momentum(): number;
    /** Gets the kinetic energy of the system. */
    get kineticEnergy(): number;
    /** Gets the next available ID. */
    private get nextId();
    constructor(config: SystemConfig);
    /** Sets the collision engine. */
    setCollisionEngine(engine: CollisionManager): void;
    update(): void;
    /** Adds an body to the system. */
    addBody(body: Body): Body;
    /** Removes an body from the system. */
    removeBody(body: Body): Body;
}
