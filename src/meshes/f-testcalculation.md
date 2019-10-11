# Testcalculation Mesh F
Das Mesh F ist 3,00m breit, 1,00m tief und 4,50m hoch. Es steht zentriert
auf der Bodenplatte, daher sind X und Y-Koordinaten teilweise Negativ,
aber die Z-Koordinaten ausschließlich Positiv.

Ich verwende das Blender-Koordinatensystem, deshalb ist Y die Tiefe und
Z die Höhe!

## Berechnung von Face Index 1
Für die Testberechnung möchte ich das Quadrag an der Vorderseite Unten
verwenden, welches dem FaceIndex 1 im erstem SubMesh entspricht.
Es nutzt die Vertices 1, 0, 4 und 5.

### Vertices (Object Space)

Nr |    x |    y |    z | Screen x/y
---|------|------|------|------------
 1 | -0.5 | -0.5 |  0.0 | 811x993
 0 | -1.5 | -0.5 |  0.0 | 513x993
 4 | -1.5 | -0.5 |  1.5 |
 5 | -0.5 | -0.5 |  1.5 |

### Mesh (World Space)
Jedes Mesh hat eine Transformmatrix.
Die Reihenfolge der Auswertung der Komponenten Position, Rotation und
Scalierung ist wichtig: Falls man zuerst verschiebt und danach rotiert
würde beim rotieren um den Ursprung die Position kreisfürmig verändert
werden, was vermutlich nicht gewünscht ist.
Die Auswertungsreihenfolge müsste demnach
1. Scale
2. Rotation
3. Translation
sein. (Matrizen werden von Rechts nach Links multipliziert), also
```
Result = T * R * S;
```
Die untransformierten Komponenten sind

 Attr  |    x |    y |    z
-------|------|------|------
 Pos   |  0.0 |  0.0 |  0.0
 Rot   |  0.0 |  0.0 |  0.0
 Scale |  1.0 |  1.0 |  1.0

und führen daher zur Identitätsmatrix.

### Camera (World Space)
Die Kamera befindet sich an Position (  0.0 | -6.0 |  1.8 ) und schaut auf
das Mesh

 Attr |    x |    y |    z
------|------|------|------
 Eye  |  0.0 | -6.0 |  1.8
 At   |  0.0 |  0.0 |  1.5
 Up   |  0.0 |  0.0 |  1.0

und führt zur CameraMatrix:
```
|  -1.000     0.000     0.000     0.000|
|   0.000     0.050     0.999     0.000|
|   0.000     0.999    -0.050     0.000|
|   0.000    -1.498     6.082     1.000|
```
