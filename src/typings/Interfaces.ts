import type {Shape} from '../shapes/Shape';
import type {Vector, VectorLike} from '../utils/Vector';

/** Represents the methods required in a collision manager. */
export interface CollisionManager {
    /** Inserts an shape into the collision manager. */
    insert(x: number, y: number, w: number, h: number, id: number): void;
    /** Queries the entire system, and automatically detects/resolves collisions. */
    query(): void;
    /** Clears the collision manager. */
    clear(): void;
}

export interface ShapeForm {
    // OPTION 1: Regular Polygon
    /** The number of sides of the shape. */
    sides?: number;
    /** The radius of the shape. */
    radius?: number;
    /** The rotation of the shape. */
    rotation?: number;
    /** The center offset of the shape. */
    offset?: VectorLike;

    // OPTION 2: Custom Polygon
    /** The vertices of the shape (or compounded shapes) (in clockwise order). */
    vertices?: Vector[];

    // OPTION 3: Components
    /** The components of the shape. */
    components?: Shape[];
}

export interface PluginMeta {
    name: string;
    version: string;
}
