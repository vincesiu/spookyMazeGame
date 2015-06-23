

var canvas;
var gl;
var program;

var cullingActive = true;
var blendingActive = false;
var perspectiveActive = true; //apply false for orthogonal

//Camera Defaults
////////////////
////////////////
var FOV = 45;
var initialZOffset = -5;


//Initialization of important variables
/////////////////
/////////////////
var initCoords = [0.0, 0.0, 0.0];
var viewMatrix = translate(0, 0, initialZOffset);
var modelViewMatrix;
var projectionMatrix;


//Shader Variables
////////////////
////////////////
var modelViewMatrixLoc;
var projectionMatrixLoc;


//Rotation stuff
///////////////////////
///////////////////////

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;


function handleMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}

function handleMouseUp(event) {
  mouseDown = false;
}

function handleMouseMove(event) {
  if (!mouseDown) {
    return;
  }
  var newX = event.clientX;
  var newY = event.clientY;

  var deltaX = newX - lastMouseX;
  var deltaY = newY - lastMouseY;



  var mRotate = mult(rotate(deltaY/ 10 , 1, 0, 0) , rotate( deltaX/10 , 0, 1, 0));

  lastMouseX = newX
  lastMouseY = newY;
  viewMatrix = mult ( translate(0, 0, -initialZOffset), viewMatrix);
  viewMatrix = mult( mRotate, viewMatrix);
  viewMatrix = mult ( translate(0, 0, initialZOffset), viewMatrix);
  rotate;
}




function configureTexture( image, num_cube) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
    gl.RGB, gl.UNSIGNED_BYTE, image );
    

    // var ext = gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
    // console.log(ext);
    gl.generateMipmap( gl.TEXTURE_2D );
    // gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);


    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    return texture;
}




var numWalls = 0;
var wallWorldCoords = [];

window.onload = function init() {

    console.log("init");
    var mazeLength = 10.0;
    var mazeWidth = 10.0;
    var maze = initializeMazeNoWalls(mazeLength, mazeWidth);
    recursiveDivision(maze);
    visualizeMaze(maze);

    //Initialization of program
    //////////////
    //////////////
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );

    if ( !gl ) 
      alert( "WebGL isn't available" );

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    if (cullingActive)
      gl.enable(gl.CULL_FACE);
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    

    
    if (blendingActive) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
    }

    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    if (perspectiveActive)
      projectionMatrix = perspective(FOV, canvas.width/canvas.height, 0.1,-20);
    else
      projectionMatrix = scale(1.0, 1.0, 1.0);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

    desu = configureTexture(document.getElementById("texFloor"));
    gl.bindTexture( gl.TEXTURE_2D, desu );

    geometrySetup(gl, program);

    
    
    for (var i = 0; i < mazeLength; i++) {
      for (var j = 0; j < mazeWidth; j++) {
        var translateMatrix = translate( j, 0, i );
        var tempMatrix;
        if(maze[i][j].north != 1) {
          numWalls++;
          wallWorldCoords.push(translateMatrix);
        }
        if(maze[i][j].west != 1) {
          tempMatrix = mult(translateMatrix, rotate(90, 0, 1, 0));
          tempMatrix = mult(translate(0.0, 0.0, 1.0), tempMatrix);
          numWalls++;
          wallWorldCoords.push(tempMatrix);
        }
        if(maze[i][j].south != 1) {
          tempMatrix = mult(translateMatrix, rotate(180, 0, 1, 0));
          tempMatrix = mult(translate(1, 0, 1), tempMatrix);   
          numWalls++;
          wallWorldCoords.push(tempMatrix);
        }
        if(maze[i][j].east != 1) {
          tempMatrix = mult(translateMatrix, rotate(270, 0, 1, 0));
          tempMatrix = mult(translate(1, 0, 0), tempMatrix);
          numWalls++;
          wallWorldCoords.push(tempMatrix);
        }

      }
    }

    render();
    
  }



  var render = function(){
    requestAnimationFrame(render);
    animate();
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    
    for ( var i = 0; i < numWalls; i++) {
      modelViewMatrix = mult(viewMatrix, wallWorldCoords[i]);
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
      gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }
    geometryDraw(gl);

  }

function scale( x, y, z )
{
    if ( Array.isArray(x) && x.length == 3 ) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;

    return result;
}


//Keypress handler
/////////////////////
/////////////////////
document.onkeypress = function (event) {
    // console.log(event.key);
    switch(event.key) {
        case "w":
            viewMatrix = mult(translate(0.0, 0.0, 0.05), viewMatrix);
            break;
        case "s":
            viewMatrix = mult(translate(0.0, 0.0, -0.05), viewMatrix);
            break;
        case "a":
            viewMatrix = mult(translate(0.05, 0.0, 0.0), viewMatrix);
            break;
        case "d":
            viewMatrix = mult(translate(-0.05, 0.0, 0.0), viewMatrix);
            break;
        case "k":
            viewMatrix = mult(rotate(1.0, 0, 1, 0), viewMatrix);
            break;
        case "j":
            viewMatrix = mult(rotate(-1.0, 0, 1, 0), viewMatrix);
            break;
        default:
            break;
    }
}






