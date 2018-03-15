// 
// this version of recursive trees attempts to use objects to manage all aspects of trees
// it will also do this in 3D (eventually)
//
var can;
var root;

function setup() {
    can = createCanvas(1000, 850);
    var a = createVector(0, 0, 0);
    var b = createVector(0, 0, 1);
    root = new Branch(a, b);
}

function draw() {
    background(51);
    root.show();
}

