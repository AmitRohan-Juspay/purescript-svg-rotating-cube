// exports.plotCordinates = function(co_ords) {
//     return function() {
//       console.log(co_ords)
//     }
// }

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


//Ref W.R.T origin ( need fix for angle)
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

var createCubeUI = function (){
      var myCube = window.global.cube || {cX : 60, cY : 60, cZ : 60, angX : 0, angY : 0, angZ : 0, size : 50 }  
      var cords= getCubeCorners(myCube) 
      // cords=cords.map(function(item){return [item.x,item.y]});

      window.global.cubeSVG = window.global.draw.polyline(cords)
        .fill('none')
        .stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' })

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

    if (!window.global) {
      window.global = {};
    }

    if (!window.global.draw) {
      window.global.draw= SVG('svgContainer').size(500, 500);    
    }

    if (!window.global.cube) {
      window.global.cube = {}  
      window.global.cube = {
        cX : 100,
        cY : 100,
        cZ : 0,
        angX : 0,
        angY : 0,
        angZ : 0,
        size : 50  
      }        
    }

    if (!window.global.cubeSVG) {
      window.global.cubeSVG=createCubeUI()
    }


    if (typeof window.MAP[id] == "undefined") {
        window.MAP[id]={}
        
    } 
    var incValue = 5 * 0.0174533;
    var cb = function(e) {
      if(id === 'buttonYMinus'){
        window.global.cube.angY -= incValue; 
        updateCubeUI()
      }
      else if(id === 'buttonYPlus'){
        window.global.cube.angY += incValue; 
        updateCubeUI()
      }
      else if(id === 'buttonXMinus'){
        window.global.cube.angX += incValue; 
        updateCubeUI()
        
      }else if(id === 'buttonXPlus'){
        window.global.cube.angX -= incValue; 
        updateCubeUI()
        
      }else if(id === 'buttonZMinus'){
        window.global.cube.angZ += incValue; 
        updateCubeUI()
        
      }else if(id === 'buttonZPlus'){
        window.global.cube.angZ -= incValue; 
        updateCubeUI()
        
      }



      sub(window.MAP[id])();
    };

    window.SUB = sub;
    elem.addEventListener("click", cb);
  }
}
