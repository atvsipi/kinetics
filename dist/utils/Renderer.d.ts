import { System } from '../System';
import { SystemRenderingConfig } from '../typings/Config';
/** The class which handles rendering of the system. */
export declare class Renderer {
    /** The system the renderer is rendering. */
    system: System;
    /** The canvas the renderer is rendering on. */
    canvas: HTMLCanvasElement;
    /** The context of the canvas. */
    context: CanvasRenderingContext2D;
    /** The info for the renderer provided by the client. */
    rendering: SystemRenderingConfig;
    /** Data about framerates. */
    framerate: {
        /** The list of the last 30 framerates. */
        fpsArr: number[];
        /** The average framerate. */
        fps: number;
        /** The delta between frames. */
        dt: number;
        /** The last time the framerate was updated. */
        lastUpdate: number;
    };
    constructor(config: SystemRenderingConfig, system: System);
    /** Configures the renderer. */
    configure(config: SystemRenderingConfig): void;
    /** Renders the system. */
    render(): void;
}
//# sourceMappingURL=Renderer.d.ts.map