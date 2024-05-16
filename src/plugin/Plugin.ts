import {System} from '../System';
import {Body} from '../body/Body';

import {PluginMeta} from '../typings/Interfaces';

/** Base class for plugins */
export class Plugin {
    public meta: PluginMeta = {
        name: 'Plugin',
        version: '1.0.0',
    };

    constructor() {}

    public update(system: System) {}

    public bodyUpdate(body: Body) {}

    public bodyCollisioned(body: Body, other: Body) {}
}
