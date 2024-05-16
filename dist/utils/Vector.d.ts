export interface VectorLike {
    x: number;
    y: number;
}
/** A vector in 2D space, represents a direction and magnitude simultaneously. */
export declare class Vector implements VectorLike {
    /** The coordinates of the vector. */
    x: number;
    y: number;
    constructor(x: number, y: number);
    /** Converts polar coordinates to Cartesian coordinates. */
    static toCartesian(r: number, theta: number): Vector;
    /** Adds to a vector. */
    add(vector: VectorLike): Vector;
    /** Subtracts from a vector. */
    subtract(vector: VectorLike): Vector;
    /** Scales from a vector. */
    scale(scalar: number): Vector;
    /** Divide from a vector. */
    divide(divider: number): this;
    /** Normalizes the vector. */
    normalize(): this;
    /** Gets the distance from another vector. */
    distance(vector: VectorLike): number;
    /** Gets the dot product of two vectors. */
    dot(vector: VectorLike): number;
    /** Gets the cross product of two vectors. */
    cross(vector: VectorLike): number;
    /** Gets the projection of the current vector onto another vector. */
    project(vector: Vector): Vector;
    /** Creates a vector directionally orthogonal to the current vector. */
    get orthogonal(): Vector;
    /** Gets the angle of the vector from a reference point. */
    angle(reference?: {
        x: number;
        y: number;
    }): number;
    /** Rotates the angle to a new angle. */
    rotate(angle: number): this;
    /** Gets the magnitude (length) of the vector. */
    get magnitude(): number;
    /** Sets the magnitude (length) of the vector. */
    set magnitude(magnitude: number);
    /** Gets the squared magnitude of the vector. */
    get magnitudeSq(): number;
    /** Clones the vector. */
    get clone(): Vector;
    /** Get the distance from two vectors. */
    static distance(a: VectorLike, b: VectorLike): number;
    /** Adds to a vector. */
    static add(a: VectorLike, b: VectorLike): Vector;
    /** Subtract from the two vectors. */
    static subtract(a: VectorLike, b: VectorLike): Vector;
    /** Scales from a vector. */
    static scale(v: VectorLike, scalar: number): Vector;
    /** Divide from a vector. */
    static divide(v: VectorLike, divider: number): Vector;
}
