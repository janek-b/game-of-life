$(function() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.addEventListener("mousedown", getPosition, false);

  var width = canvas.width;
  var height = canvas.height;
  var cellSize = 5
  var cellWidth = width/cellSize
  var cellHeight = height/cellSize

  function getPosition(event) {
    var x = event.x;
    var y = event.y;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    x = Math.floor(x/cellSize);
    y = Math.floor(y/cell);

    var newGlider = glider.map(function(cell) {
      return [cell[0] + x, cell[1] + y];
    });
    newGlider.forEach(function(cell) {
      currentLife[cell[0]][cell[1]] = 1;
    })
    drawLife(currentLife);
    console.log(x);
    console.log(y);
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

  var gliderGun = [[2,6],[2,7],[3,6],[3,7],[12,6],[12,7],[12,8],[13,5],[13,9],[14,4],[14,10],[15,4],[15,10],[16,7],[17,5],[17,9],[18,6],[18,7],[18,8],[19,7],[22,4],[22,5],[22,6],[23,4],[23,5],[23,6],[24,3],[24,7],[26,2],[26,3],[26,7],[26,8],[36,4],[36,5],[37,4],[37,5]];
  var glider = [[1,1],[1,2],[2,1],[2,3],[3,1]];

  var currentLife = [];
  var nextLife = [];

  function emptyStart(life) {
    for (var x = 0; x < cellWidth; x++) {
      life[x] = [];
      for (var y = 0; y < cellHeight; y++) {
        life[x][y] = 0;
      };
    };
  }

  function randomStart() {
    emptyStart(currentLife);
    emptyStart(nextLife);
    for (var x = 0; x < cellWidth; x++) {
      for (var y = 0; y < cellHeight; y++) {
        currentLife[x][y] = Math.round(Math.random());
      };
    };
  };

  function initializeShape(shape) {
    emptyStart(currentLife);
    emptyStart(nextLife);
    shape.forEach(function(cell) {
      currentLife[cell[0]][cell[1]] = 1;
    });
  };

  emptyStart(currentLife);
  emptyStart(nextLife);
  drawLife(currentLife);

  function onGrid(x, y) {
    if (x >= 0 && x < cellWidth) {
      if (y >= 0 && y < cellHeight) {
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
    for (var x = 0; x < cellWidth; x++) {
      for (var y = 0; y < cellHeight; y++) {
        cellLifeCycle(x, y);
      };
    };
  };

  function start() {
    calcNextLife();
    currentLife = nextLife.slice();
    emptyStart(nextLife);
    drawLife(currentLife);
  }

  var startGame;

  $("#start").click(function() {
    startGame = setInterval(start, 50);
  });

  $("#stop").click(function() {
    clearInterval(startGame);
  });

  $("#glidergun").click(function() {
    initializeShape(gliderGun);
    drawLife(currentLife);
  });

  $("#random").click(function() {
    randomStart();
    drawLife(currentLife);
  });
});
