import Body from '../body/Body';
import { CircleConfig, ShapeConfig, LineConfig } from '../typings/Interfaces';
import { Colors, ShapeType, Movement } from '../typings/Enums';
import { ShapeRenderingConfig } from '../typings/Config';
import Vector, { VectorLike } from '../utils/Vector';
/** A representation of a geometric shape. */
export default class Shape {
    /** The raw information of the shape. */
    protected info: ShapeConfig | CircleConfig | LineConfig;
    /** The number of ticks elapsed since the shape's spawn. */
    tick: number;
    /** The last tick the shape has collided with another. */
    lastCollisionFrame: number;
    /** The threshold for the linear and angular velocities to put the shape to sleep. */
    private sleepThreshold;
    /** The geometric type of the shape. */
    type: ShapeType;
    /** The vertices of the shape. */
    vertices: Vector[];
    /** The coordinates of the shape. */
    position: Vector;
    /** The velocity of the shape. */
    velocity: Vector;
    /** The acceleration of the shape. */
    acceleration: Vector;
    /** The mass of the shape. */
    mass: number;
    /** The elasticity of the shape. */
    elasticity: number;
    /** If the shape is static. */
    static: boolean;
    /** The angular velocity of the shape. */
    angularVelocity: number;
    /** The angular speed of the shape. */
    angularSpeed: number;
    /** The components of the shape. */
    components: Shape[];
    /** The parent of the shape (if it is a component.) */
    parent: Shape | null;
    /** The collision hooks of the shape. */
    hooks: {
        /** The hooks to run before resolving collisions. */
        preResolve?: (shape: Shape) => void;
        /** The hooks to run after resolving collisions. */
        postResolve?: (shape: Shape) => void;
    };
    /** Whether or not the shape is sleeping. */
    get sleeping(): boolean;
    /** The hitbox of the shape. */
    get hitbox(): Vector;
    /** The moment of inertia of the shape. */
    get inertia(): number;
    private _angle;
    /** Gets the angle of the shape. */
    get angle(): number;
    /** Sets the angle of the shape. */
    set angle(value: number);
    /** The unique identifier for the shape. */
    id: number;
    /** The body the shape is in. */
    body: Body;
    /** The bounds of the shape for the collision manager. */
    get bounds(): {
        min: Vector;
        max: Vector;
    };
    /** The area of the shape. */
    get area(): number;
    /** The rendering options for the shape. */
    rendering: ShapeRenderingConfig;
    constructor(info: ShapeConfig | CircleConfig);
    /** Initializes the vertices of the shape. */
    private initializeVertices;
    /** Configures the shape's rendering properties. */
    configure(info: ShapeRenderingConfig): void;
    /** Rotates the shape by its angular speed. */
    rotate(...directions: Movement[]): void;
    /** Update the shape. */
    update(): void;
    /** Updates the position. */
    updatePosition(vector: VectorLike): void;
    /** Determines the stroke and fill color of the shape. */
    protected determineColors(): {
        stroke: Colors | string | undefined;
        fill: Colors | string | undefined;
    };
    /** Renders the shape. */
    render(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Shape.d.ts.map