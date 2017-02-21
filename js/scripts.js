$(function() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var width = canvas.width;
  var height = canvas.height;

  function drawGrid() {
    for (var w = 0; w < width; w = w+10) {
      ctx.beginPath();
      ctx.moveTo(w, 0);
      ctx.lineTo(w, height);
      ctx.stroke();
    };
    for (var h = 0; h < height; h = h+10) {
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(width, h);
      ctx.stroke();
    };
  };

  function drawCell(x, y) {
    ctx.fillStyle = 'green';
    ctx.fillRect(x*10, y*10, 10, 10);
  };

  drawGrid();

  var gliderGun = [[2,6],[2,7],[3,6],[3,7],[12,6],[12,7],[12,8],[13,5],[13,9],[14,4],[14,10],[15,4],[15,10],[16,7],[17,5],[17,9],[18,6],[18,7],[18,8],[19,7],[22,4],[22,5],[22,6],[23,4],[23,5],[23,6],[24,3],[24,7],[26,2],[26,3],[26,7],[26,8],[36,4],[36,5],[37,4],[37,5]];
  var glider = [[10,10],[10,11],[11,10],[11,12],[12,10]];
  var currentLife = gliderGun.slice();
  var nextLife = [];

  function drawLife(life) {
    ctx.clearRect(0, 0, width, height);
    life.forEach(function(cell) {
      drawCell(cell[0], cell[1]);
    });
    drawGrid();
  }

  drawLife(currentLife);

  function neighborCount(cell) {
    var neighbors = 0;
    for (var x = -1; x < 2; x++) {
      for (var y = -1; y < 2; y++) {
        if ((x === 0) && (y === 0)) {
          // console.log("double zero");
        } else {
          neighborX = cell[0]+x;
          neighborY = cell[1]+y;
          currentLife.forEach(function(cell) {
            if (cell[0] === neighborX && cell[1] === neighborY) {
              neighbors += 1;
            };
          });
        }
      }
    }
    return neighbors;
  }

  function cellLifeCycle(cell) {
    var cellAlive = false;
    currentLife.forEach(function(liveCell) {
      if (cell[0] === liveCell[0] && cell[1] === liveCell[1]) {
        if (neighborCount(cell) >= 2 && neighborCount(cell) <= 3) {
          cellAlive = true;
          nextLife.push(cell);
        }
      }
    });
    if (cellAlive === false) {
      if (neighborCount(cell) === 3) {
        nextLife.push(cell);
      };
    };
  };

  function calcNextLife() {
    for (var x = 0; x < width/10; x++) {
      for (var y = 0; y < height/10; y++) {
        var currentCell = [x, y];
        cellLifeCycle(currentCell);
      };
    };
  };

  $("#next").click(function() {
    setInterval(function() {
      calcNextLife();
      currentLife = nextLife.slice();
      nextLife = [];
      drawLife(currentLife);
    }, 50);
  });
});
