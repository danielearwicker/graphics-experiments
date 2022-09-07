import { Particle2D } from "./Particle2D";
import { Polar2D } from "./Polar2D";
import { Spring2D } from "./Spring2D";
import { Vector2D } from "./Vector2D";

export function bonesModel() {

    const particles: Particle2D[] = [];
    const springs: Spring2D[] = [];

    // const byCoord: { [coord: string]: { a: Particle2D, b: Particle2D, c: Particle2D, d: Particle2D } } = {};
    // const cellKey = (x: number, y: number) => `${x}-${y}`;

    // const scale = 1800 / particleCount;
    // const piff = 0.30;
    // const poff = 0.20;
    // const paff = 0.60;

    // for (let x = 0; x < particleCount; x++) {
    //     for (let y = 0; y < particleCount; y++) {
    //         const centre = new Vector2D(
    //             ((x - particleCount/2) * scale),
    //             ((y - particleCount/2) * (scale * paff))
    //         );

    //         const a = new Particle2D(
    //             centre.add(new Vector2D(-scale * piff, 0)),
    //             new Vector2D(0, 0)
    //         );

    //         const b = new Particle2D(
    //             centre.add(new Vector2D(-scale * poff, -scale * piff)),
    //             new Vector2D(0, 0)
    //         );

    //         const c = new Particle2D(
    //             centre.add(new Vector2D(scale * poff, -scale * piff)),
    //             new Vector2D(0, 0)
    //         );

    //         const d = new Particle2D(
    //             centre.add(new Vector2D(scale * piff, 0)),
    //             new Vector2D(0, 0)
    //         );

    //         particles.push(a, b, c, d);
    //         byCoord[cellKey(x, y)] = {a, b, c, d};

    //         const pairs: [Particle2D, Particle2D][] = [
    //             [a, b],
    //             [b, c],
    //             [c, d]
    //         ];

    //         if (x > 0) {                
    //             pairs.push([a, byCoord[cellKey(x - 1, y)].d]);
    //         }

    //         if (y > 0) {                
    //              pairs.push([b, byCoord[cellKey(x, y - 1)].a]);
    //              pairs.push([c, byCoord[cellKey(x, y - 1)].d]);
    //         }

    //         // if(x > 0 && y > 0) {
    //         //     pairs.push([a, byCoord[pairKey(x - 1, y - 1)].b]);
    //         // }

    //         // if (y > 0) {
    //         //     pairedWith.push(byCoord[particleKey(x, y - 1)]);
    //         // }

    //         for (const [a, b] of pairs) {
    //              const separation = a.position.subtract(b.position).polar.radius;
    //              springs.push(new Spring2D(a, b, separation));        
    //         }
    //     }
    // }

    // const byCoord: { [coord: string]: Particle2D } = {};
    // const particleKey = (x: number, y: number) => `${x}-${y}`;

    // for (let x = 0; x < particleCount; x++) {
    //     for (let y = 0; y < particleCount; y++) {
    //         const p = new Particle2D(
    //             new Vector2D(
    //                 ((x - particleCount/2) * 150) + (Math.random() * 20), 
    //                 ((y - particleCount/2) * 150) + (Math.random() * 20)),
    //             new Vector2D(0, 0)
    //         );

    //         particles.push(p);
    //         byCoord[particleKey(x, y)] = p;

    //         const pairedWith: Particle2D[] = [];

    //         if (x > 0) {
    //             pairedWith.push(byCoord[particleKey(x - 1, y)]);
    //         }

    //         if (y > 0) {
    //             pairedWith.push(byCoord[particleKey(x, y - 1)]);
    //         }

    //         for (const o of pairedWith) {
    //             const separation = p.position.subtract(o.position).polar.radius;
    //             springs.push(new Spring2D(p, o, separation));        
    //         }
    //     }
    // }

    // for (let n = 0; n < particleCount; n++) {
    //     particles.push(new Particle2D(
    //         new Vector2D(
    //             ((n - particleCount/2) * 20) + (Math.random() * 100), 
    //             ((n - particleCount/2) * 20) + (Math.random() * 100)),
    //         new Vector2D(0, 0)
    //     ));

    //     if (n > 0) {
    //         const separation = particles[n].position.subtract(particles[n-1].position).polar.radius;
    //         springs.push(new Spring2D(particles[n], particles[n-1], separation));        
    //     }
    // }

    const spaceSize = 1000;
    const particleCount = 5;
    
    for (let n = 0; n < particleCount; n++)  {
        particles.push(new Particle2D(
            new Vector2D(
                (Math.random() * spaceSize) - (spaceSize/2), 
                (Math.random() * spaceSize) - (spaceSize/2)),
            new Vector2D(0, 0)
            //new Vector2D((Math.random() * 10) - 5, (Math.random() * 10) - 5)
        ));
    }

    for (let n = 0; n < particleCount - 1; n++) {
        for (let m = n + 1; m < particleCount; m++) {
            const separation = particles[n].position.subtract(particles[m].position).polar.radius;
            springs.push(new Spring2D(particles[n], particles[m], separation));        
        }
    }

    let mouseOffset: Vector2D | undefined;
    let mouseLast: Vector2D | undefined;
    let mouseDown = false;
    let dragging: Particle2D | undefined;

    function onMouseLeave() {
        mouseOffset = undefined;
    }

    function onMouseMove(e: MouseEvent) {
        mouseOffset = new Vector2D(e.offsetX, e.offsetY);
    }

    function onMouseDown() {
        mouseDown = true;
    }

    function onMouseUp() {
        mouseDown = false;
    }

    let init = true;

    function render(ctx: CanvasRenderingContext2D) {

        if (init) {
            init = false;

            ctx.canvas.addEventListener("mousemove", onMouseMove);
            ctx.canvas.addEventListener("mouseleave", onMouseLeave);
            ctx.canvas.addEventListener("mousedown", onMouseDown);
            ctx.canvas.addEventListener("mouseup", onMouseUp);
        }

        const dpr = window.devicePixelRatio || 1;
        
        const mouse = mouseOffset ? new Vector2D(
            (mouseOffset.x * dpr) - ctx.canvas.width / 2,
            (mouseOffset.y * dpr) - ctx.canvas.height / 2) : undefined;
        
        const mouseVelocity = mouseLast ? mouse?.subtract(mouseLast) : undefined;

        if (!mouseDown) {
            dragging = undefined;
        }

        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

        ctx.strokeStyle = "green";
        
        for (const s of springs) {
            const separation = s.particle1.position.subtract(s.particle2.position).polar;
            const stretch = separation.radius - s.length;

            // ctx.lineWidth = Math.min(10, Math.max(1, 6 - (stretch / 50)));
            // ctx.beginPath();
            // ctx.moveTo(s.particle1.position.x, s.particle1.position.y);
            // ctx.lineTo(s.particle2.position.x, s.particle2.position.y);
            // ctx.stroke();

            const force = new Polar2D(separation.angle, stretch * 0.01).vector;
            s.particle1.velocity = s.particle1.velocity.subtract(force);
            s.particle2.velocity = s.particle2.velocity.add(force);
        }
        
        ctx.lineWidth = 1;

        const particleSize = 10;

        for (const p of particles) {
            
            const hovering = (mouse && mouse.subtract(p.position).polar.radius < (particleSize * 2)) 
                            || p == dragging;

            ctx.beginPath();
            ctx.ellipse(p.position.x, p.position.y, particleSize, particleSize, 0, Math.PI*2, 0);

            if (hovering) {
                ctx.fillStyle = "red";
            } else {
                ctx.fillStyle = "darkcyan";
            }

            ctx.fill();

            ctx.strokeStyle = "cyan";
            ctx.stroke();

            p.move();

            p.velocity = p.velocity.multiply(0.99);

            if (!dragging && mouseDown && hovering) {
                dragging = p;
            }
        }

        if (dragging && mouse) {
            //dragging.position = mouse;
            dragging.velocity = dragging.velocity.add(mouseVelocity);
        }

        ctx.restore();

        mouseLast = mouse;
    }

    return { render };
}
