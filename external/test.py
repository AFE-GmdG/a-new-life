import bpy
from mathutils import *
from math import *

f = bpy.data.objects['Cube']
f.matrix_local = Matrix()

#const axis = new Float3(0.1, 0.5, -0.3).normalized;
axis = Vector((0.1, 0.5, -0.3)).normalized()
#console.log(axis.toString("Rotation Axis"));
print("Rotation Axis:\n", axis)
#Matrix4x4.createRotationMatrix(axis, PI_OVER_TWO, out);
out = Matrix.Rotation(pi / 2, 4, axis)
#console.log(out.toString("Axis-Angle-Rotation-Matrix"));
print("Axis-Angle-Rotation-Matrix:\n", out)
#const q = new Quaternion(axis, PI_OVER_TWO);
q = Quaternion(axis, pi / 2)
#console.log(q.toString("Axis-Angle-Quaternion"));
print("Axis-Angle-Quaternion:\n", q)
#Matrix4x4.createRotationMatrix(q, out);
#console.log(out.toString("Quaternion-Rotation-Matrix"));

#f.matrix_local = out