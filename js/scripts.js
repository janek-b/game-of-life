// Back-End
function Grid(width, height, cellSize) {
  this.width = width/cellSize;
  this.height = height/cellSize;
  this.cellSize = cellSize;
  this.cells = []
  for (var x = 0; x < this.width; x++) {
    this.cells[x] = [];
    for (var y = 0; y < this.height; y++) {
      this.cells[x][y] = 0;
    };
  };
};

Grid.prototype.randomStart = function() {
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      this.cells[x][y] = Math.round(Math.random());
    };
  };
}

Grid.prototype.onGrid = function(x, y) {
  if (x >= 0 && x < this.width) {
    if (y >= 0 && y < this.height) {
      return true;
    } else {
      return false;
    };
  } else {
    return false;
  };
};

Grid.prototype.neighborCount = function(x, y) {
  var neighbors = 0;
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if ((i != 0) || (j != 0)) {
        if (this.onGrid(x+i, y+j)) {
          if (this.cells[x+i][y+j] === 1) {
            neighbors += 1;
          };
        };
      };
    };
  };
  return neighbors;
}

Grid.prototype.nextLife = function() {
  var nextLife = [];
  for (var x = 0; x < this.width; x++) {
    nextLife[x] = []
    for (var y = 0; y < this.height; y++) {
      if ((this.cells[x][y] === 1) && (this.neighborCount(x, y) >= 2 && this.neighborCount(x, y) <= 3))  {
          nextLife[x][y] = 1;
      } else if (this.neighborCount(x, y) === 3) {
          nextLife[x][y] = 1;
      } else {
        nextLife[x][y] = 0;
      };
    };
  };
  this.cells = nextLife.slice();
};

Grid.prototype.insertShape = function(shape) {
  for (var i = 0; i < shape.length; i++) {
    cell = shape[i];
    if (this.onGrid(cell[0], cell[1])) {
      this.cells[cell[0]][cell[1]] = 1;
    };
  };
};

var gliderGun = [[2,6],[2,7],[3,6],[3,7],[12,6],[12,7],[12,8],[13,5],[13,9],[14,4],[14,10],[15,4],[15,10],[16,7],[17,5],[17,9],[18,6],[18,7],[18,8],[19,7],[22,4],[22,5],[22,6],[23,4],[23,5],[23,6],[24,3],[24,7],[26,2],[26,3],[26,7],[26,8],[36,4],[36,5],[37,4],[37,5]];
var glider = [[1,1],[1,2],[2,1],[2,3],[3,1]];
var pulsar = [[1,2],[1,3],[1,4],[2,1],[2,6],[3,1],[3,6],[4,1],[4,6],[6,2],[6,3],[6,4],
[1,-2],[1,-3],[1,-4],[2,-1],[2,-6],[3,-1],[3,-6],[4,-1],[4,-6],[6,-2],[6,-3],[6,-4],
[-1,2],[-1,3],[-1,4],[-2,1],[-2,6],[-3,1],[-3,6],[-4,1],[-4,6],[-6,2],[-6,3],[-6,4],
[-1,-2],[-1,-3],[-1,-4],[-2,-1],[-2,-6],[-3,-1],[-3,-6],[-4,-1],[-4,-6],[-6,-2],[-6,-3],[-6,-4]]


// Front-End
$(function() {
  $("form#canvasForm").submit(function() {
    event.preventDefault();
    var width = parseInt($("input#width").val());
    var height = parseInt($("input#height").val());
    var cellSize = parseInt($("input#cellSize").val());
    $("#canvasCol").html("<canvas id='canvas' width='"+width+"' height='"+height+"'></canvas>");
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = cellSize / 10;
    canvas.addEventListener("mousedown", getPosition, false);

    var grid = new Grid(width, height, cellSize);

    function getPosition(event) {
      var rect = canvas.getBoundingClientRect();
      var x = Math.floor((event.clientX - rect.left)/cellSize);
      var y = Math.floor((event.clientY - rect.top)/cellSize);

      var onClick = $("input:radio[name=onClick]:checked").val();
      if (onClick === "glider") {
        var newGlider = glider.map(function(cell) {
          return [cell[0] + x, cell[1] + y];
        });
        grid.insertShape(newGlider);
      } else if (onClick === "cell") {
        var cell = [[x, y]];
        grid.insertShape(cell);
      } else if (onClick === "pulsar") {
        var newPulsar = pulsar.map(function(cell) {
          return [cell[0] + x, cell[1] + y];
        });
        grid.insertShape(newPulsar);
      };
    };

    function drawGrid() {
      ctx.clearRect(0, 0, width, height);
      for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
          if (grid.cells[x][y] === 1) {
            ctx.fillStyle = 'green';
            ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
          };
        };
      };
      for (var w = 0; w < width; w = w+cellSize) {
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(w, height);
        ctx.stroke();
      };
      for (var h = 0; h < height; h = h+cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(width, h);
        ctx.stroke();
      };
    };

    function step() {
      grid.nextLife();
      drawGrid();
    }

    var startGame;
    step();

    $("#start").click(function() {
      startGame = setInterval(step, 70);
    });

    $("#stop").click(function() {
      clearInterval(startGame);
    });

    $("#random").click(function() {
      grid.randomStart();
      step();
    });

    $("#glidergun").click(function() {
      grid.insertShape(gliderGun);
      step();
    });

  });
});
