module Types where

import Math (cos, sin)
import Prelude ((*), (+), (-), (/))


-- Define 3D and 2D Point objects
newtype Point3D = Point3D
  { x :: Number
  , y :: Number
  , z :: Number
  }

newtype Angle3D = Angle3D
  { qx :: Number
  , qy :: Number
  , qz :: Number
  }

newtype Point2D = Point2D
  { x :: Number
  , y :: Number
  }

newtype PointList = PointList
  { values :: Array Point2D
  }

-- Define cube object
newtype Cube = Cube
  { cX :: Number
  , cY :: Number
  , cZ :: Number
  , angX :: Number
  , angY :: Number
  , angZ :: Number
  , size :: Number
  }

--Convert 3D points to 2D points
project :: Point3D -> Angle3D -> Point2D
project (Point3D { x, y, z }) (Angle3D { qx, qy, qz }) =
  let xRotQz = x * (cos qz) + y * (sin qz)
      yRotQz = y * (cos qz) - x * (sin qz)
      yRotQzQx = yRotQz * (cos qx) + z * (sin qx)
      zRotQzQx = z * (cos qx) - yRotQz * (sin qx)
      xRotQzQxQy = xRotQz * (cos qy) + zRotQzQx * (sin qy)
  in
    Point2D { x: xRotQzQxQy, y: yRotQzQx }

--Convert 3D Cube to 2D coordinate ( using diagonal as reference to plot the cube)
getCubeCorners :: Cube -> PointList
getCubeCorners (Cube myCube) = do
	let half = myCube.size / 2.0
	let v1 = project (Point3D { x: myCube.cX - half, y: myCube.cY - half, z: myCube.cZ - half }) (Angle3D {qx: myCube.angX, qy: myCube.angY, qz: myCube.angZ })
	let v2 = project (Point3D { x: myCube.cX - half, y: myCube.cY + half, z: myCube.cZ - half }) (Angle3D {qx: myCube.angX, qy: myCube.angY, qz: myCube.angZ })
	let v3 = project (Point3D { x: myCube.cX - half, y: myCube.cY - half, z: myCube.cZ + half }) (Angle3D {qx: myCube.angX, qy: myCube.angY, qz: myCube.angZ })
	let v4 = project (Point3D { x: myCube.cX - half, y: myCube.cY + half, z: myCube.cZ + half }) (Angle3D {qx: myCube.angX, qy: myCube.angY, qz: myCube.angZ })
	let v5 = project (Point3D { x: myCube.cX + half, y: myCube.cY - half, z: myCube.cZ - half }) (Angle3D {qx: myCube.angX, qy: myCube.angY, qz: myCube.angZ })
	let v6 = project (Point3D { x: myCube.cX + half, y: myCube.cY + half, z: myCube.cZ - half }) (Angle3D {qx: myCube.angX, qy: myCube.angY, qz: myCube.angZ })
	let v7 = project (Point3D { x: myCube.cX + half, y: myCube.cY - half, z: myCube.cZ + half }) (Angle3D {qx: myCube.angX, qy: myCube.angY, qz: myCube.angZ })
	let v8 = project (Point3D { x: myCube.cX + half, y: myCube.cY + half, z: myCube.cZ + half }) (Angle3D {qx: myCube.angX, qy: myCube.angY, qz: myCube.angZ })
	PointList { values: [v1, v2, v3, v4, v5, v6, v7, v8] }	


