import {System} from '../System';

import {ConfigurationError} from '../typings/Error';
import {CollisionManager} from '../typings/Interfaces';

const hash = (x: number, y: number) => x + y * 0xb504;

/** A binary space partitioning system which splits the arena into square cells.  */
export class SpatialHashGrid implements CollisionManager {
    public cells: Map<number, number[]> = new Map();
    public system: System;
    public cellSize: number;

    constructor(system: System, cellSize: number) {
        if (!Number.isInteger(cellSize) || cellSize >= 32) throw new ConfigurationError('Could not initialize SpatialHashGrid: Cell size must be an integer value less than 32.');

        this.system = system;
        this.cellSize = cellSize;
    }

    /** Inserts an body into the grid. */
    public insert(x: number, y: number, w: number, h: number, id: number) {
        const startX = x >> this.cellSize;
        const startY = y >> this.cellSize;
        const endX = (x + w) >> this.cellSize;
        const endY = (y + h) >> this.cellSize;

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const key = hash(x, y);

                if (!this.cells.get(key)) this.cells.set(key, []);
                this.cells.get(key)!.push(id);
            }
        }
    }

    /* Queries the grid by iterating over every cell and performing narrowphase detection on each body. */
    public query() {
        for (const cell of this.cells.values()) {
            const length = cell.length;
            if (length < 2) continue;

            for (let i = 0; i < length; i++) {
                for (let j = i + 1; j < length; j++) {
                    const body1 = this.system.bodys[cell[i]]!;
                    const body2 = this.system.bodys[cell[j]]!;

                    if (body1.shape.sleeping && body2.shape.sleeping) continue;
                    this.system.CollisionResolver.detect(body1.shape, body2.shape);

                    for (const plugin of this.system.plugins) {
                        plugin.bodyUpdate(body1, body2);
                        plugin.bodyUpdate(body2, body1);
                    }

                    for (const plugin of body1.plugins) plugin.bodyUpdate(body1, body2);
                    for (const plugin of body2.plugins) plugin.bodyUpdate(body2, body1);
                }
            }
        }
    }

    /** Clears the grid. */
    public clear() {
        this.cells.clear();
    }
}
