import {System, Vector, VectorLike, Body, Movement, Polygon, Colors, Plugin} from '../src/Index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const fps = document.getElementById('fps') as HTMLSpanElement;
const momentum = document.getElementById('momentum') as HTMLSpanElement;
const kineticEnergy = document.getElementById('ke') as HTMLSpanElement;
const worldUpdateRate = document.getElementById('tickRate') as HTMLSpanElement;
const memoryUsage = document.getElementById('memoryUsage') as HTMLSpanElement;

const cellSize = 2 ** 6;
const system = new System({
    tickRate: 60,
    friction: 0.1,
    verbose: true,
    gravity: new Vector(0, 0),
    collisionInfo: {
        cellSize: Math.log2(cellSize),
    },
    camera: {
        zoom: 2,
    },
    dimensions: new Vector(500, 500),
    render: {
        canvas,
        background: '#191919',
        gridColor: '#333',
        gridWidth: 0.5,
        gridSize: 20,
    },
});

class TestBody extends Body {
    public keys: Set<Movement> = new Set();

    constructor(offset: VectorLike, strokeColor: string = Colors.DarkBlue, fillColor: string = Colors.Blue) {
        super(
            new Polygon({
                form: {
                    offset,
                    sides: 6,
                    radius: 10,
                },
                mass: 10,
                speed: 1,
                elasticity: 1,
                angularSpeed: 1,
                render: {
                    strokeColor,
                    fillColor,
                    strokeWidth: 0.5,
                },
                static: false,
            }),
        );

        this.speed = 0.5;
    }

    public collisioned(other: Body) {
        console.log('hit!', other);
    }

    /** Moves the entity by its linear speed. */
    public move(...directions: Movement[]) {
        for (const movement of directions) {
            switch (movement) {
                case Movement.Up:
                    this.acceleration.y += this.speed;
                    break;
                case Movement.Down:
                    this.acceleration.y -= this.speed;
                    break;
                case Movement.Left:
                    this.acceleration.x -= this.speed;
                    break;
                case Movement.Right:
                    this.acceleration.x += this.speed;
                    break;
                default:
                    console.error('[SYSTEM]: Invalid movement key.');
                    break;
            }
        }

        this.acceleration.normalize().scale(this.speed);
        this.velocity.add(this.acceleration); // Apply acceleration.
    }

    public update() {
        super.update();

        this.move(...this.keys.values());
    }
}

const car = new TestBody({x: 0, y: 0});
system.addBody(car);
system.addBody(new TestBody({x: 20, y: 20}, Colors.Purple, Colors.Pink));

document.addEventListener('keydown', function ({key, code}) {
    switch (key) {
        case 'ArrowUp':
            car.keys.add(Movement.Up);
            break;
        case 'ArrowDown':
            car.keys.add(Movement.Down);
            break;
        case 'ArrowLeft':
            car.keys.add(Movement.Left);
            break;
        case 'ArrowRight':
            car.keys.add(Movement.Right);
            break;
    }
    switch (code) {
        case 'KeyW':
            car.keys.add(Movement.Up);
            break;
        case 'KeyS':
            car.keys.add(Movement.Down);
            break;
        case 'KeyA':
            car.keys.add(Movement.Left);
            break;
        case 'KeyD':
            car.keys.add(Movement.Right);
            break;
    }
});
document.addEventListener('keyup', function ({key, code}) {
    switch (key) {
        case 'ArrowUp':
            car.keys.delete(Movement.Up);
            break;
        case 'ArrowDown':
            car.keys.delete(Movement.Down);
            break;
        case 'ArrowLeft':
            car.keys.delete(Movement.Left);
            break;
        case 'ArrowRight':
            car.keys.delete(Movement.Right);
            break;
    }
    switch (code) {
        case 'KeyW':
            car.keys.delete(Movement.Up);
            break;
        case 'KeyS':
            car.keys.delete(Movement.Down);
            break;
        case 'KeyA':
            car.keys.delete(Movement.Left);
            break;
        case 'KeyD':
            car.keys.delete(Movement.Right);
            break;
    }
});

canvas.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        const angle = Math.atan2(touchY - canvas.height / 2, touchX - canvas.width / 2);
        car.moveAngle = angle;

        e.preventDefault();
    },
    {passive: false},
);

document.addEventListener('touchend', (e) => (car.acceleration = new Vector(0, 0)));

let isDragging = false;

document.addEventListener('mousedown', (e) => ((isDragging = true), e.preventDefault()));
document.addEventListener('mouseup', (e) => ((isDragging = false), e.preventDefault()));

document.addEventListener(
    'mousemove',
    (e: MouseEvent) => {
        if (isDragging) {
            const touchX = e.x;
            const touchY = e.y;

            const angle = Math.atan2(touchY - canvas.height / 2, touchX - canvas.width / 2);
            car.moveAngle = angle;
        }

        e.preventDefault();
    },
    {passive: false},
);

document.addEventListener('wheel', function ({deltaY}) {
    system.camera.zoom += deltaY * 0.001;
});

system.camera.setCenterBody(car);

(function render() {
    system.renderer.render();

    fps.innerText = system.renderer.framerate.fps.toFixed(2);
    momentum.innerText = system.momentum.toFixed(2);
    kineticEnergy.innerText = system.kineticEnergy.toFixed(2);
    worldUpdateRate.innerText = `${(1000 / (system.performance.worldUpdateRate || 1e-4)).toFixed(1)} hZ (${system.performance.worldUpdateRate.toFixed(2)} ms)`;
    memoryUsage.innerText = `${system.performance.memoryUsage.toFixed(2)} MB`;

    requestAnimationFrame(render);
})();
