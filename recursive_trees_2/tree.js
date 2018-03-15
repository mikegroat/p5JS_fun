var can, treeGraph, textGraph, progressGraph;
var angle, fullness, stockiness, tallness, brightness;
var angleText, fullText, stockText, tallText, brightText, drawingText;

var maxdepth = 1;
var treenodes = 0;
var maxnodes = 0;
var tree=[];
var yoffset = 15;
var redrawTree = 2;

function setup() {
    drawingText="Tree Drawing In Progress";
    can = createCanvas(1000, 850);
    textGraph = createGraphics(500, 150);
    progressGraph = createGraphics(500, 150);
    treeGraph = createGraphics(1000, 700);
    angle = createSlider(1, PI*5, 7, 0.01);
    angle.position(20, 30);
    angle.mouseReleased(redrawAll);
    fullness = createSlider(1, 8, 4, 1);
    fullness.position(20, 50);
    fullness.mouseReleased(redrawAll);
    stockiness = createSlider(0.1, 3, 1, 0.1);
    stockiness.position(20, 70);
    stockiness.mouseReleased(redrawAll);
    tallness = createSlider(0.1, 3, 1, 0.1);
    tallness.position(20, 90);
    tallness.mouseReleased(redrawAll);
    brightness = createSlider(1, 3, 1, 0.1);
    brightness.position(20, 110);
    brightness.mouseReleased(redrawAll);
    frameRate(2);
    buildTree();
}

function draw() {
    background(200);
    updateText();
    if (redrawTree == 2) { 
        progressGraph.text("Drawing in Progress... Be Patient", 100, 85);
    }
    if (redrawTree == 1) {
        console.log('tree has '+ tree.numNodes + ' nodes');
        if (tree.numNodes > 1000000) console.log('WARNING: tree is very long');
        treeGraph.clear();
        treeGraph.background(200);
        treeGraph.fill(12, 12, 12);
        treeGraph.noStroke();
        treeGraph.textSize(15);
        treeGraph.push();
        treeGraph.translate(500, 700);
        drawTree(tree);
        progressGraph.clear();
        treeGraph.pop();
        drawingText = '';
    } else if (redrawTree == 2) {
        
    }
    if (redrawTree > 0 ) redrawTree--;
    image(textGraph, 0, 0);
    image(progressGraph, 500, 0);
    image(treeGraph, 0, 150);
}

function branch(depth, anglemin, anglemax, len, weight) {
    var node = {};
    treenodes++
    if (len > 2) {
        node.depth = depth;
        node.angle = random(anglemin, anglemax);
        node.len = len;
        node.weight = weight;
        node.color = [51,51+floor((depth*4)),0];
        node.children = [];
        node.leaf = false;
        var numBranches = random(1,8);
        for (var i=0; i<numBranches; i++) {
            node.children[i]=branch(++depth, anglemin, anglemax, len*0.6, weight*0.8);
        }
    } else {
        node.depth = depth;
        node.angle = random(anglemin, anglemax);
        node.len = len;
        node.weight = weight;
        node.color = [51,51+floor((depth*4)),0];
        node.children = [];
        node.leaf = true;
    }
    return node;
}

function buildTree() {
    tree.length = 0;
    treenodes = 0;
    console.log('building new tree');
    tree = branch(1, -0.1, 0.1 , random(50,200), random(6,10));
    tree.numNodes = treenodes;
    maxnodes = treenodes;
    treenodes = 0;
}

function drawTree(section) {
    treenodes++
    if (treenodes%10000 == 0) console.log('drawing node '+treenodes+ ' of ' + maxnodes);

    treeGraph.push();
    if (section.depth == 1) treeGraph.rotate(section.angle); else treeGraph.rotate(section.angle*angle.value());
    var c = section.color;
    var sfactor = stockiness.value();
    var bfactor = brightness.value();
    treeGraph.stroke(c[0]*bfactor, c[1]*bfactor, c[2]*bfactor);
    treeGraph.strokeWeight(section.weight*sfactor);
    var tfactor = tallness.value();
    treeGraph.line(0,0,0, -section.len*tfactor);
    treeGraph.translate(0, -section.len*tfactor);
    var ffactor = fullness.value();
    var maxiters = min(section.children.length, ffactor);
    if (maxiters == 0) {
        var r = map(bfactor, 1, 3, 0, 127);
        var g = map(bfactor,1, 3, 127, 255);
        var b = map(bfactor, 1, 3, 0, 63);
        treeGraph.noStroke();
        treeGraph.fill(r,g,b);
        treeGraph.ellipse(0,-2,2,7);
    }
    for (var i=0; i<maxiters; i++) {
        var child = section.children[i];
        if (child != null) {
            drawTree(child);
        }
    }
    treeGraph.pop();
}

function updateText() {
    textGraph.clear();
    textGraph.fill(12, 12, 12);
    textGraph.noStroke();
    textGraph.textSize(15);
    angleText = textGraph.text("angle = "+angle.value(), 180, 45);
    fullText = textGraph.text('fullness = '+fullness.value(), 180, 65);
    stockText = textGraph.text('stockiness = '+stockiness.value(), 180, 85);
    tallText = textGraph.text('tallness = '+tallness.value(), 180, 105);
    brightText = textGraph.text('brightness = '+brightness.value(), 180, 125);
    textGraph.text(drawingText, 500, 85);
}

function redrawAll() {
    redrawTree = 2;
    drawingText = "Tree Draw In Progress";
    maxnodes = tree.numNodes;
    treenodes = 0;
    redraw();
}

function doubleClicked() {
    var suffix = millis();
    saveCanvas(can, 'tree' + suffix, 'jpg');
    saveJSON(tree, 'tree' + suffix + '.json');
}

function keyTyped() {
    buildTree();
    redrawTree = 2;
    drawingText = "Tree Draw In Progress";
    redraw();
}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}