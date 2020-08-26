// globals
var ns = "http://www.w3.org/2000/svg";
var wrapper = $(".svg-wrapper");
var s = $("#play");

var BOID_SIZE = 6;
var NUM_BOIDS = 200;

// todo - tmp
// var bg = document.createElementNS(ns, "rect");
// bg.setAttribute("width", wrapper.width());
// bg.setAttribute("height", wrapper.height());
// bg.setAttribute("style", "fill:rgb(0,0,0)");
// s.append(bg);

// create boids
var boids = [];

function randomColor() {
    let r = 224 + Math.floor(Math.random() * 32);
    let g = 160 + Math.floor(Math.random() * 32);
    let b = 0;
    return `fill:rgba(${r},${g},${b})`;
}

function createBoid() {
    var b = document.createElementNS(ns, "circle");
    var enc = {};

    enc.x = Math.random() * wrapper.width();
    enc.y = Math.random() * wrapper.height();
    enc.o = Math.random() * 2 * Math.PI;
    enc.leader = Math.random() < 0.1 ? true : false;
    
    b.setAttribute("cx", enc.x);
    b.setAttribute("cy", enc.y);
    b.setAttribute("r", BOID_SIZE);
    b.setAttribute("o", enc.o);
    b.setAttribute("style", randomColor()); // todo

    enc.obj = b;
    return enc;
}

for (var i = 0; i < NUM_BOIDS; i++) {
    var b = createBoid();
    boids.push(b);
    s.append(b.obj);
}

// boid update methods
function updateBoid(b) {
    b.obj.setAttribute("cx", b.x);
    b.obj.setAttribute("cy", b.y);
    if (b.y < 300) 
        b.obj.setAttribute("opacity", Math.max(0.02, (b.y - 150) / 150));
    else
        b.obj.setAttribute("opacity", 1);
}

function normalize(a) {
    var arrSum = (a) => a.reduce((x,y) => x + y ** 2, 0);
    var m = arrSum(a) ** 0.5;
    return a.map((x) => x / m);
}

function letWander(b) {
    if (!b.leader) {
        var avgnum = 0;
        var avgx = 0;
        var avgy = 0;
        var avoidnum = 0;
        var avoidx = 0;
        var avoidy = 0;
        var ox = 0;
        var oy = 0;
            
        for (var i = 0; i < boids.length; i++) {
            if (boids[i] != b) {
                var d = (boids[i].x - b.x) ** 2 + (boids[i].y - b.y) ** 2;

                if (d < 6400) {
                    avgnum += boids[i].leader * 3 + 1;
                    avgx += (boids[i].leader * 3 + 1) * boids[i].x;
                    avgy += (boids[i].leader * 3 + 1) * boids[i].y;
                    ox += (boids[i].leader * 3 + 1) * Math.cos(boids[i].o);
                    oy += (boids[i].leader * 3 + 1) * Math.sin(boids[i].o);
                }

                if (d < 900) {
                    avoidnum += 1;
                    avoidx += boids[i].x;
                    avoidy += boids[i].y;
                }
            }
        }

        var ruleCenter = [0,0], ruleAvoid = [0,0], ruleAlign = [0,0];
        
        if (avgnum)   ruleAlign  = normalize([ox, oy]);
        if (avgnum)   ruleCenter = normalize([avgx / avgnum - b.x, avgy / avgnum - b.y]);
        if (avoidnum) ruleAvoid  = normalize([b.x - avoidx / avoidnum, b.y - avoidy / avoidnum]);
        
        var dir = 
            [ruleCenter[0] * 0.04 + ruleAlign[0] * 0.05 + ruleAvoid[0] * 0.16 + Math.cos(b.o) * 1.3,
             ruleCenter[1] * 0.04 + ruleAlign[1] * 0.05 + ruleAvoid[1] * 0.16 + Math.sin(b.o) * 1.3];

        b.o = Math.atan2(dir[1], dir[0]);
    }

    var v = 2.5 + Math.random();
    b.x += Math.cos(b.o) * v;
    b.y += Math.sin(b.o) * v;
    b.o  = (b.o + Math.random() * 0.2 - 0.1 + 2 * Math.PI) % (2 * Math.PI);
    
    // wraparound
    if (b.x < -BOID_SIZE)
        b.x = wrapper.width() + BOID_SIZE;
    if (b.x > wrapper.width() + BOID_SIZE)
        b.x = -BOID_SIZE;
    if (b.y < -BOID_SIZE)
        b.y = wrapper.width() + BOID_SIZE;
    if (b.y > wrapper.height() + BOID_SIZE)
        b.y = -BOID_SIZE;

    updateBoid(b);
}

function wanderAll() {
    for (var i = 0; i < boids.length; i++)
        letWander(boids[i]);
}

var wandering = setInterval(wanderAll, 25);
