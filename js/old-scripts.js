// Back-End
// initialize empty arrays for current and next life
var currentLife = [];
var nextLife = [];
emptyStart(currentLife);
emptyStart(nextLife);
// gridWidth and gridHeight need to be global variables becuase they are used throughout multiple functions. They get assigned in document load function.
var gridWidth;
var gridHeight;
// create 2 dimensional array for x, y coordinates for entire grid and set all values to 0.
// a cells state can be accessed by passing in it's x and y coordinates to life[x][y].
// a value of 0 means the cell is dead, a value of 1 means it's alive.
function emptyStart(life) {
  for (var x = 0; x < gridWidth; x++) {
    life[x] = [];
    for (var y = 0; y < gridHeight; y++) {
      life[x][y] = 0;
    };
  };
};
// checks if a given cell is within the grid.
// used when counting neighbors to avoid index error from neighbor cells that are outside of the bounds of the grid.
function onGrid(x, y) {
  if (x >= 0 && x < gridWidth) {
    if (y >= 0 && y < gridHeight) {
      return true;
    } else {
      return false;
    };
  } else {
    return false;
  };
};

function neighborCount(x, y) {
  var neighbors = 0;
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if ((i != 0) || (j != 0)) {
        if (onGrid(x+i, y+j)) {
          if (currentLife[x+i][y+j] === 1) {
            neighbors += 1;
          };
        };
      };
    };
  };
  return neighbors;
};

function processLife() {
  calcNextLife();
  currentLife = nextLife.slice();
  emptyStart(nextLife);
  // This is the main improvement:
  // to check if a cell is alive, it checks if the currentLife array has a 0 or a 1 for the cells x, y coordinates.
  // previously it was checking if a cell array [x, y] was in the currentLife array.
  // this required looping over the entire currentLife array and comparing the values in each element array to the values in the cell array the function was called with.
  // since it is now dealing with just x, y values all other functions had to be changed to accept an x and a y variable instead of a cell array element of [x, y]
  function cellLifeCycle(x, y) {
    if (currentLife[x][y] === 1) {
      if (neighborCount(x, y) >= 2 && neighborCount(x, y) <= 3) {
        nextLife[x][y] = 1;
      };
    } else {
      if (neighborCount(x, y) === 3) {
        nextLife[x][y] = 1;
      };
    };
  };

  function calcNextLife() {
    for (var x = 0; x < gridWidth; x++) {
      for (var y = 0; y < gridHeight; y++) {
        cellLifeCycle(x, y);
      };
    };
  };
  // return newly calculated life array
  return currentLife;
}


// arrays of [x, y] coordinates of live cells for shapes
var gliderGun = [[2,6],[2,7],[3,6],[3,7],[12,6],[12,7],[12,8],[13,5],[13,9],[14,4],[14,10],[15,4],[15,10],[16,7],[17,5],[17,9],[18,6],[18,7],[18,8],[19,7],[22,4],[22,5],[22,6],[23,4],[23,5],[23,6],[24,3],[24,7],[26,2],[26,3],[26,7],[26,8],[36,4],[36,5],[37,4],[37,5]];
var glider = [[1,1],[1,2],[2,1],[2,3],[3,1]];
var pulsar = [[1,2],[1,3],[1,4],[2,1],[2,6],[3,1],[3,6],[4,1],[4,6],[6,2],[6,3],[6,4],
[1,-2],[1,-3],[1,-4],[2,-1],[2,-6],[3,-1],[3,-6],[4,-1],[4,-6],[6,-2],[6,-3],[6,-4],
[-1,2],[-1,3],[-1,4],[-2,1],[-2,6],[-3,1],[-3,6],[-4,1],[-4,6],[-6,2],[-6,3],[-6,4],
[-1,-2],[-1,-3],[-1,-4],[-2,-1],[-2,-6],[-3,-1],[-3,-6],[-4,-1],[-4,-6],[-6,-2],[-6,-3],[-6,-4]]

function randomStart() {
  emptyStart(currentLife);
  emptyStart(nextLife);
  for (var x = 0; x < gridWidth; x++) {
    for (var y = 0; y < gridHeight; y++) {
      currentLife[x][y] = Math.round(Math.random());
    };
  };
};

// loop through shape array and set each cell to alive in currentLife array
function insertShape(shape) {
  shape.forEach(function(cell) {
    if (onGrid(cell[0], cell[1])) {
      currentLife[cell[0]][cell[1]] = 1;
    };
  });
};

function initializeShape(shape) {
  emptyStart(currentLife);
  emptyStart(nextLife);
  insertShape(shape);
};


// Front-End
$(function() {
  function initializeGame(cellSizeInput) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    canvas.addEventListener("mousedown", getPosition, false);

    var width = canvas.width;
    var height = canvas.height;
    var cellSize = cellSizeInput;
    var gridLineWidth = cellSize/10;
    gridWidth = width/cellSize;
    gridHeight = height/cellSize;
    ctx.lineWidth = gridLineWidth;

    function getPosition(event) {
      var rect = canvas.getBoundingClientRect();
      var x = Math.floor((event.clientX - rect.left)/cellSize);
      var y = Math.floor((event.clientY - rect.top)/cellSize);

      var onClick = $("input:radio[name=onClick]:checked").val();
      if (onClick === "glider") {
        var newGlider = glider.map(function(cell) {
          return [cell[0] + x, cell[1] + y];
        });
        insertShape(newGlider);
      } else if (onClick === "cell") {
        var cell = [[x, y]];
        insertShape(cell);
      } else if (onClick === "pulsar") {
        var newPulsar = pulsar.map(function(cell) {
          return [cell[0] + x, cell[1] + y];
        });
        insertShape(newPulsar);
      }
      drawLife(currentLife);
    }

    function drawGrid() {
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

    function drawCell(x, y) {
      ctx.fillStyle = 'green';
      ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
    };

    function drawLife(life) {
      ctx.clearRect(0, 0, width, height);
      for (var x = 0; x < life.length; x++) {
        for (var y = 0; y < life[x].length; y++) {
          if (life[x][y] === 1) {
            drawCell(x, y)
          };
        };
      };
      drawGrid();
    };

    drawLife(currentLife);

    function start() {
      drawLife(processLife());
    }

    var startGame;

    $("#start").click(function() {
      startGame = setInterval(start, 70);
    });

    $("#stop").click(function() {
      clearInterval(startGame);
    });

    $("#glidergun").click(function() {
      initializeShape(gliderGun, gridWidth, gridHeight);
      drawLife(currentLife);
    });

    $("#random").click(function() {
      randomStart(gridWidth, gridHeight);
      drawLife(currentLife);
    });

  };

  $("#canvasForm").submit(function() {
    event.preventDefault();
    var width = parseInt($("input#width").val())
    var height = parseInt($("input#height").val())
    var cellSize = parseInt($("input#cellSize").val())
    $("#canvasCol").html("<canvas id='canvas' width='"+width+"' height='"+height+"'></canvas>")
    initializeGame(cellSize);
  })
});
