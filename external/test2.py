import bpy
from mathutils import *
from math import *


# http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-17-quaternions/
def fromToRotation(start, dest):
    start.normalize()
    dest.normalize()

    cosTheta = Vector.dot(start, dest)
    if cosTheta < -0.9999999:
        # special case when vectors in opposite directions:
        # here is no "ideal" rotation axis
        # So guess one; any will do as long as it's perpendicular to start
        axis = Vector.cross(Vector((0, 0, 1)), start)
        if axis.length < 0.0000001:
            # bad luck, they were parallel, try again!
            axis = Vector.cross(Vector((1, 0, 0)), start)

        return Quaternion(axis, pi)

    axis = Vector.cross(start, dest)
    s    = sqrt((1 + cosTheta) * 2)
    invs = 1 / s
    
    return Quaternion((s * 0.5, axis.x * invs, axis.y * invs, axis.z * invs))


# https://answers.unity.com/questions/819699/calculate-quaternionlookrotation-manually.html
def lookAtRotation(eye, at, up):
    forward  = Vector((0, 1, 0))
    cforward = at - eye

    if cforward == ((0, 0, 0)) or up == ((0, 0, 0)):
        return Quaternion((1, 0, 0, 0))

    up.normalize()
    cforward.normalize()

    if up != cforward:
        v = cforward + up * -Vector.dot(up, cforward)
        q = fromToRotation(forward, v)
        return fromToRotation(v, cforward) @ q

    cross    = Vector.cross(forward, cforward)

    return Quaternion((1, 0, 0, 0))


print ("==========================")
print ("\n")

eye = Vector((5, -15, 6))
at  = Vector((0, 0, 2.5))
up  = Vector((0, 0, 1))

q   = lookAtRotation(eye, at, up)
print ("q:", q)    

loc = Matrix.Translation(eye)
(raxis, rangle) = q.to_axis_angle()
rot = Matrix.Rotation(rangle, 4, raxis)
#print ("loc:\n", loc, "\nrot\n:", rot)
rotx = Matrix.Rotation(pi / 2, 4, Vector((1, 0, 0)))

c = bpy.data.objects['Camera.001']
c.matrix_local = loc @ rot @ rotx


print ("\n")

# function MyLookRotation(dir : Vector3, up : Vector3) : Quaternion {
#   if (dir == Vector3.zero) {
#     Debug.Log("Zero direction in MyLookRotation");
#     return Quaternion.identity;
#   }
#
#   if (up != dir) {
#     up.Normalize();
#     var v =  dir + up * -Vector3.Dot(up, dir);
#     var q = Quaternion.FromToRotation(Vector3.forward, v);
#     return Quaternion.FromToRotation(v, dir) * q; 
#   } else {
#     return Quaternion.FromToRotation(Vector3.forward, dir);
#   }
# }
 