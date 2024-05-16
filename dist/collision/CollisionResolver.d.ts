import { Shape } from '../shapes/Shape';
/** A class which performs narrowphase collision detection on shapes. */
export declare class CollisionResolver {
    /** Detects collisions between two shapes. */
    detect(shape1: Shape, shape2: Shape): void;
    /** Calls the events of the two detected shapes. */
    private processDetectedShapesEvents;
    /** Detects collisions between two simple shapes. */
    detectSimple(shape1: Shape, shape2: Shape): boolean;
    /** Detects collisions between a circle and a polygon. */
    private detectCirclePolygon;
    /** Detects collisions between two circles. */
    private detectCircleCircle;
    /** Detects a collision between a circle and a line. */
    private detectCircleLine;
    /** Projects the vertices onto the given axis. */
    private static project;
    /** Resolves the collision between two entities. */
    private resolve;
}
