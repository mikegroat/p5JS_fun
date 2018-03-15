function Branch(begin, dir) {
  this.begin = begin; // a cartesian vector with the x, y, and z coordinates of the beginning of the branch
  this.dir = dir.normalize();  // dir needs to be a unit vector
  this.children = [];

  this.grow = function() {

  }

  this.show = function() {
    var end = this.begin.copy();
    end.add(this.dir);
    stroke(255);
    line(this.begin.x, this.begin.y, this.begin.z, end.x, end.y, end.z);
    for (var i=0; i<this.children.length; i++) {
      this.children[i].show();
    }
  }
}