var can;
var slider;
var message;
var maxdepth = 1;
var treenodes = 0;
var proctime, procstart;

function setup() {
    message = createP('Initializing');
    can = createCanvas(1000, 850);
    noLoop();
    slider = createSlider(0.4, 0.9, 0.65, 0.01);
    slider.position(20, 50);
}

function draw() {
    treenodes = 0;
    procstart = millis();
    background(200);
    var factor=slider.value();
    if (message) message.remove();
    message = createP('building');
    push();
    translate(width/2, height);
    branch(1, random(-0.1, 0.1), random(50,200), random(2,10), factor);
    pop();
    proctime = millis() - procstart;
    message.remove();
    message = createP('done.  Slider value = '+slider.value()+' Maxdepth = ' + numberWithCommas(maxdepth) + '. ' + numberWithCommas(treenodes) + ' nodes processed in '+numberWithCommas(proctime.toFixed(2))+' milliseconds');
}

function branch(depth, angle, len, weight, factor) {
    treenodes++;
    strokeWeight(weight);
    if (depth > maxdepth) maxdepth = depth;
    if (len < 20) {
        stroke(51, 100+random(0, 60), 0);
    } else if (len < 40) {
        stroke(51,51+random(0,60),0);
    } else {
        stroke(51,51,0);        
    }

    rotate(angle);
    line(0, 0, 0, -len);
    translate(0, -len);
    var numBranches;
    if (treenodes < 1500000) numBranches = random(1, 6); else numBranches = 1;
    if (len > 2 && depth < 40) {
        rotate(angle);
        for (var i = 1; i <= numBranches; i++) {
            push();
            angle = random(-PI/4, PI/4); 
            branch(depth++, angle, len*random(0.5,factor), weight*random(0.6,factor),factor);
            pop();
        }
    }
}

function doubleClicked() {
    saveCanvas(can, 'tree' + millis(), 'jpg');
}

function keyPressed() {
    redraw();
}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }