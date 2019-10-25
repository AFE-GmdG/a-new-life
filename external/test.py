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

print("\n\n\n");
#const position = Matrix4x4.createTranslationMatrix(1.5, -0.2, 0.6);
position = Matrix.Translation((1.5, -0.2, 0.6))
#const rotation = Matrix4x4.createRotationMatrix(new Float3(-0.1, 0.1, 1.0).normalized, 0.15);
rotation = Matrix.Rotation(0.15, 4, Vector((-0.1, 0.1, 1.0)).normalized())
#const scale = Matrix4x4.createScaleMatrix(2.0, 1.5, 0.8);
scale = Matrix.Scale(2.0, 4, (1,0,0)) @ Matrix.Scale(1.5, 4, (0,1,0)) @ Matrix.Scale(0.8, 4, (0,0,1))
#console.log(position.toString("Position"));
#console.log(rotation.toString("Rotation"));
#console.log(scale.toString("Scale"));
print("Position:\n", position)
print("Rotation:\n", rotation)
print("Scale:\n", scale)
#Matrix4x4.mul(position, rotation, res1);
#Matrix4x4.mul(res1, scale, res1);
#console.log(res1.toString("Position * Rotation * Scale"));
res1 = position @ rotation @ scale
print("Position * Rotation * Scale:\n", res1)
#const vec4 = new Float4(2.0, 1.5, -0.5, 1.0);
vec4 = Vector((2.0, 1.5, -0.5, 1.0))
print("vec4:\n", vec4)
#Matrix4x4.mul(res1, vec4, res2);
res2 = res1 @ vec4
print("PRS * Vector:\n", res2)
res2 = vec4 @ res1
print("Vector * PRS:\n", res2)

print("\n");
(dTranslation, dRotation, dScale) = res1.decompose()
print("dTranslation:\n", dTranslation)
print("dRotation:\n", dRotation);
print("dScale:\n", dScale);
