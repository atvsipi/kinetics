import Shape from '../shapes/Shape';
/** A class which performs narrowphase collision detection on entities. */
export default class CollisionResolver {
    /** Detects collisions between two entities. */
    detect(shape1: Shape, shape2: Shape): void;
    /** Detects collisions between two simple entities. */
    detectSimple(shape1: Shape, shape2: Shape): boolean;
    /** Detects collisions between a circle and a polygon. */
    private detectCirclePolygon;
    /** Detects collisions between two circles. */
    private detectCircleCircle;
    /** Projects the vertices onto the given axis. */
    private static project;
    /** Resolves the collision between two entities. */
    private resolve;
}
//# sourceMappingURL=CollisionResolver.d.ts.map