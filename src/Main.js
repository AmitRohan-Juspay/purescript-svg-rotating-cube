//Degree
var VELLOCITY = 5;

exports.updateCanvas = function(id) {
  return function(param) {
    return function(value) {
      return function() {
      var elem = document.querySelectorAll("." + id)[0];
      if(elem){
        switch (param) {
          case "x" : elem.style.x += value; 
                      break;
          case "y" : elem.style.y += value; 
                      break;
        }
      }
    }
    }
  }
}

var setUpCanvas = function (){

    if (!window.global) {
      window.global = {};
    }
    if (!window.global.draw) {
      window.global.draw= SVG('svgContainer').size(250, 250);    
    }

    if (!window.global.cube) {
      window.global.cube = {}  
      window.global.cube = {
        cX : 100,
        cY : 100,
        cZ : 0,
        angX : 45,
        angY : 0,
        angZ : 45,
        size : 50  
      }        
    }

    if (!window.global.cubeSVG) {
      window.global.cubeSVG=createCubeUI()
    }
}


var projectOn2D = function (x, y, z , myCube){

    x-=myCube.cX;
    y-=myCube.cY;
    z-=myCube.cZ;


    //Rotate 
    var xRotQz = x * Math.cos(myCube.angZ) + y * Math.sin(myCube.angZ),
      yRotQz = y * Math.cos(myCube.angZ) - x * Math.sin(myCube.angZ),
      yRotQzQx = yRotQz * Math.cos(myCube.angX) + z * Math.sin(myCube.angX),
      zRotQzQx = z * Math.cos(myCube.angX) - yRotQz * Math.sin(myCube.angX),
      xRotQzQxQy = xRotQz * Math.cos(myCube.angY) + zRotQzQx * Math.sin(myCube.angY)

    return [ xRotQzQxQy + myCube.cX, yRotQzQx + myCube.cX]
}

// Convert 3D Cube to 2D cprojecton ( using diagonal as reference to plot the cube)
var getCubeCorners = function (myCube){
    var half = myCube.size / 2.0
    point1 = projectOn2D (myCube.cX + half, myCube.cY - half, myCube.cZ - half, myCube),
    point2 = projectOn2D (myCube.cX + half, myCube.cY + half, myCube.cZ - half, myCube),
    point3 = projectOn2D (myCube.cX + half, myCube.cY - half, myCube.cZ + half, myCube),
    point4 = projectOn2D (myCube.cX + half, myCube.cY + half, myCube.cZ + half, myCube),
    point5 = projectOn2D (myCube.cX - half, myCube.cY - half, myCube.cZ - half, myCube),
    point6 = projectOn2D (myCube.cX - half, myCube.cY + half, myCube.cZ - half, myCube),
    point7 = projectOn2D (myCube.cX - half, myCube.cY - half, myCube.cZ + half, myCube),
    point8 = projectOn2D (myCube.cX - half, myCube.cY + half, myCube.cZ + half, myCube)
    return [point1, point2, point4, point3, point1, point5, point6, point2, point4, point8, point7, point3, point7, point5, point6, point8]
}    

var updateCubeUI = function (){
    var myCube = window.global.cube || {cX : 60, cY : 60, cZ : 60, angX : 0, angY : 0, angZ : 0, size : 50 }  
    var cords= getCubeCorners(myCube) 

    // cords=cords.map(function(item){return [item.x,item.y]});

    window.global.cubeSVG.clear()
    window.global.cubeSVG.plot(cords);
}  

var modifyCubeParameter = function (paramToModify){
    var incValue = VELLOCITY * 0.0174533;
    if(paramToModify === 'buttonYMinus'){
        window.global.cube.angY -= incValue; 
      }
      else if(paramToModify === 'buttonYPlus'){
        window.global.cube.angY += incValue; 
      }
      else if(paramToModify === 'buttonXMinus'){
        window.global.cube.angX -= incValue; 
      }else if(paramToModify === 'buttonXPlus'){
        window.global.cube.angX += incValue; 
      }else if(paramToModify === 'buttonZMinus'){
        window.global.cube.angZ -= incValue; 
      }else if(paramToModify === 'buttonZPlus'){
        window.global.cube.angZ += incValue; 
      }
}  

var createCubeUI = function (){
      var myCube = window.global.cube || {cX : 60, cY : 60, cZ : 60, angX : 0, angY : 0, angZ : 0, size : 50 }  
      var cords= getCubeCorners(myCube) 
      // cords=cords.map(function(item){return [item.x,item.y]});

      window.global.cubeSVG = window.global.draw.polyline(cords)
        .fill('none')
        .stroke({ color: '#f06', width: 2, linecap: 'round', linejoin: 'round' })
        
      window.global.cubeSVG.marker('mid', 4, 4, function(add) { 
        add.circle(4).fill('#ccc')
      })  
      return window.global.cubeSVG  
}  

exports.attachButtonEvents = function(id) {
  return function(sub) {

    var elem = document.getElementById(id+'');
    if (!window.MAP) {
      window.MAP = {};
    }

    if (typeof window.MAP[id] == "undefined") {
        window.MAP[id]={}
        
    } 

    setUpCanvas()

    
    var cb = function(e) {
      modifyCubeParameter(id);
      updateCubeUI();
      sub(window.MAP[id])();
    };

    window.SUB = sub;
    elem.addEventListener("click", cb);
  }
}

exports.attachKeyBoardEvents = function(sub) {

    setUpCanvas()

     if (!window.MAP) {
      window.MAP = {};
    }
    var id = "document"

    if (typeof window.MAP[id] == "undefined") {
        window.MAP[id]={}
        
    } 

    var cb = function(e) {

      var key = e.keyCode ? e.keyCode : e.which;

      if(key==37 || key==38 || key==39 || key==40){
        var param
        switch (key) {
          case 38 : param = "buttonXPlus"; break;
          case 40 : param = "buttonXMinus"; break; 
          case 39 : param = "buttonYPlus"; break; 
          case 37 : param = "buttonYMinus"; break;
        }
        modifyCubeParameter(param);
        updateCubeUI();
      }
      
      sub(window.MAP[id])();
    };

    window.SUB = sub;

    document.onkeydown = cb;
}
