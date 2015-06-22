
var mazeLength = 4.0;
var mazeWidth = 3.0;
//1 is no wall
//0 is wall
//-1 is out of bounds
function MazeUnit() {
	this.west = 1;
	this.east = 1;
	this.south = 1;
	this.north = 1;
	// this.combined = [this.north, this.west, this.south, this.east];
}


var visualizeMaze = function(maze) {
	for (var i = 0; i < mazeLength; i++) {
		var mazeLine1 = "";
		var mazeLine2 = "";
		var mazeLine3 = "";
		for (var j = 0; j < mazeWidth; j++) {
			northPassage = " ";
			westPassage = " ";
			southPassage = " ";
			eastPassage = " ";
			if (maze[i][j].north == 1)
				northPassage = "X";
			if (maze[i][j].west == 1)
				westPassage = "X";
			if (maze[i][j].south == 1)
				southPassage = "X";
			if (maze[i][j].east == 1)
				eastPassage = "X";
			mazeLine1 += "   " + northPassage + "   ";
			mazeLine2 += " " + westPassage + " O " + eastPassage + " ";
			mazeLine3 += "   " + southPassage + "   ";
		}
		console.log(mazeLine1);
		console.log(mazeLine2);
		console.log(mazeLine3);
	}
}


function initializeMazeNoWalls(mazeLength, mazeWidth) {
	var maze = [];
	for (var i = 0; i < mazeLength; i++) {
		var mazeColumn = [];
		for (var j = 0; j < mazeWidth; j++) {
			mazeColumn.push(new MazeUnit());
		}
		maze.push(mazeColumn);
	}

	for (var i = 0; i < mazeLength; i++) {
		maze[i][0].west = -1;
		maze[i][mazeWidth - 1].east = -1;
	}

	for (var i = 0; i < mazeWidth; i++) {
		maze[0][i].north = -1;
		maze[mazeLength - 1][i].south = -1;
	}

	return maze;
}
function recursiveDivision(maze) {
	mazeLength = maze.length;
	mazeWidth = maze[0].length;

	numVerticalWalls = mazeWidth - 1;
	numHorizWalls = mazeLength - 1;

	var chosenWall = Math.floor(Math.random() * numVerticalWalls);
	var chosenEntrance = Math.floor(Math.random() * mazeLength);

	console.log(chosenWall);
	console.log(chosenEntrance);
	// console.log(mazeLength);
	// console.log(mazeWidth);

	for (var i = 0; i < mazeLength; i++) {
		maze[i][chosenWall].east = 0;
		maze[i][chosenWall + 1].west = 0;
	}

	// maze[chosenEntrance][chosenWall].east = 1;
	// maze[chosenEntrance][chosenWall + 1].west = 1;

	var thing1 = maze[chosenEntrance][chosenWall];
	var thing2 = maze[chosenEntrance][chosenWall + 1];

	thing1.east = 1;
	thing2.west = 1;

	return maze;
}


console.log("init");
var maze = initializeMazeNoWalls(mazeLength, mazeWidth);
recursiveDivision(maze);
visualizeMaze(maze);