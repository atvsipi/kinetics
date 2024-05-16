import System from '../System';
import { CollisionManager } from '../typings/Interfaces';
/** A binary space partitioning system which splits the arena into square cells.  */
export default class SpatialHashGrid implements CollisionManager {
    cells: Map<number, number[]>;
    system: System;
    cellSize: number;
    constructor(system: System, cellSize: number);
    /** Inserts an body into the grid. */
    insert(x: number, y: number, w: number, h: number, id: number): void;
    query(): void;
    /** Clears the grid. */
    clear(): void;
}
//# sourceMappingURL=SpatialHashGrid.d.ts.map