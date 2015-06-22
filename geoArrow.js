//Variables for current geometry
////////////////////
////////////////////
////////////////////

//Templates for the drawing
/////////////////////
/////////////////////
/////////////////////

var wallSize = 2.0;

var wallCoordsBuffer;
var wallCoordsVPointer;
var wallTexBuffer;
var wallTexVPointer;


var wallCoords = [
	[0.0, 0.0, 0.0, 1.0],
	[wallSize, wallSize, 0.0, 1.0],
	[0.0, wallSize, 0.0, 1.0],
	[0.0, 0.0, 0.0, 1.0],
	[wallSize, 0.0, 0.0, 1.0],
	[wallSize, wallSize, 0.0, 1.0],
];

var wallTexCoords = [
	[0.0, 0.0],
	[1.0, 1.0],
	[0.0, 1.0],
	[0.0, 0.0],
	[1.0, 0.0],
	[1.0, 1.0],
];

//Called every render call
//////////////////
//////////////////
var geometryDraw = function(gl) {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays( gl.TRIANGLES, 0, 6 );
}

//Called once in the init function
//////////////////
//////////////////
var geometrySetup = function(gl, program) {
	wallCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, wallCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(wallCoords), gl.STATIC_DRAW);
    
    wallCoordsVPointer = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( wallCoordsVPointer );
    gl.vertexAttribPointer( wallCoordsVPointer, 4, gl.FLOAT, false, 0, 0 );

    wallTexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, wallTexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(wallTexCoords), gl.STATIC_DRAW);

    wallTexVPointer = gl.getAttribLocation( program, "vTexCoord" );
    gl.enableVertexAttribArray( wallTexVPointer );
    gl.vertexAttribPointer( wallTexVPointer, 2, gl.FLOAT, false, 0, 0 );
}



// var tBuffer = gl.createBuffer();
//     gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
//     gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

//     vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
//     gl.enableVertexAttribArray( vTexCoord );
//     gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 16, 0 );

//     modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
//     projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
//     rotationTexLoc = gl.getUniformLocation(program, "rotationTex");
//     scrollOffsetLoc = gl.getUniformLocation(program, "scrollOffset");
//     currentCubeLoc = gl.getUniformLocation(program, "currentCube");


var animate = function(){
}