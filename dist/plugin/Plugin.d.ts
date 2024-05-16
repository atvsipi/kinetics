import { System } from '../System';
import { Body } from '../body/Body';
import { PluginMeta } from '../typings/Interfaces';
/** Base class for plugins */
export declare class Plugin {
    meta: PluginMeta;
    constructor();
    update(system: System): void;
    bodyUpdate(body: Body): void;
    bodyCollisioned(body: Body, other: Body): void;
}
//# sourceMappingURL=Plugin.d.ts.map