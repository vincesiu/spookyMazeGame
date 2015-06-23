
var mazeLength = 6.0;
var mazeWidth = 6.0;
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
	mazeLength = maze.length;
	mazeWidth = maze[0].length;

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

	if (mazeLength == 1 || mazeWidth == 1) 
		return;

	numVerticalWalls = mazeWidth - 1;
	numHorizWalls = mazeLength - 1;

	var chosenWallVert = Math.floor(Math.random() * numVerticalWalls);

	for (var i = 0; i < mazeLength; i++) {
		maze[i][chosenWallVert].east = 0;
		maze[i][chosenWallVert + 1].west = 0;
	}

	var chosenWallHoriz= Math.floor(Math.random() * numHorizWalls);

	for (var i = 0; i < mazeWidth; i++) {
		maze[chosenWallHoriz][i].south = 0;
		maze[chosenWallHoriz + 1][i].north = 0;
	}


	var chosenEntrance1 = Math.floor(Math.random() * Math.floor(chosenWallHoriz + 1));
	var chosenEntrance2 = Math.floor(Math.random() * Math.floor(mazeLength - chosenWallHoriz - 1)) + chosenWallHoriz + 1;

	var chosenEntrance3 = Math.floor(Math.random() * Math.floor(chosenWallVert + 1));
	var chosenEntrance4 = Math.floor(Math.random() * Math.floor(mazeWidth - chosenWallVert - 1)) + chosenWallVert + 1;


	var removedEntrance = Math.floor(Math.random() * 4);

	if (removedEntrance != 0) {
		maze[chosenEntrance1][chosenWallVert].east = 1;
		maze[chosenEntrance1][chosenWallVert + 1].west = 1;
	}

	if (removedEntrance != 1) {
		maze[chosenEntrance2][chosenWallVert].east = 1;
		maze[chosenEntrance2][chosenWallVert + 1].west = 1;
	}

	if (removedEntrance != 2) {
		maze[chosenWallHoriz][chosenEntrance3].south = 1;
		maze[chosenWallHoriz + 1][chosenEntrance3].north = 1;
	}

	if (removedEntrance != 3) {
		maze[chosenWallHoriz][chosenEntrance4].south = 1;
		maze[chosenWallHoriz + 1][chosenEntrance4].north = 1;
	}


	var sectionNW = [];
	var sectionNE = [];
	var sectionSW = [];
	var sectionSE = [];

	var listMaze = [sectionNW, sectionNE, sectionSW, sectionSE, ];

	



	for (var i = 0; i < mazeLength; i++) {
		var listMazeRow = [ [], [], [], [], ];
		for (var j = 0; j < mazeWidth; j++) {
			var idxSubMaze = 0;
			if (j > chosenWallVert)
				idxSubMaze += 1;
			if (i > chosenWallHoriz)
				idxSubMaze += 2;
			// console.log("i = " + i);
			// console.log("j = " + j);
			console.log(idxSubMaze);
			listMazeRow[idxSubMaze].push(maze[i][j]);
		}
		console.log("new row");
		for (var k = 0; k < 4; k++)
			if (listMazeRow[k].length != 0)
				listMaze[k].push(listMazeRow[k]);
	}

	// console.log(listMaze[0]);

	for (var i = 0; i < 4; i++) {
		console.log("submaze " + i);
		// visualizeMaze(listMaze[i]);
		recursiveDivision(listMaze[i]);
	}



}





console.log("init");
var maze = initializeMazeNoWalls(mazeLength, mazeWidth);
recursiveDivision(maze);
console.log("did i make it");
visualizeMaze(maze);