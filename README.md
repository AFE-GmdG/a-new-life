# A new Life

Working title for a browser based game.\
[A new Life](https://life.afe-gmdg.de/)

This project is in its pre alpha concept phase - so expect a lot of changes!

## 3d Coordinate System
I like the 3d Coordinate system that is used by Blender. Blender uses a
Right-Hand-Coordinate-System, therefore I stay with this:
- Left to Right is -x to x
- Back to Front is -y to y
- Bottom to Top is -z to z

[Projection Matrix](http://www.songho.ca/opengl/gl_projectionmatrix.html)

## ToDo
### [ ] Redesign InputService
- Support for multiple Views
- Support for global events
- Support for ingame remapping
- Support for Profile load/save
### [x] Redesign ShaderProgram
- Aktuell kann pro ShaderProgramm nur je 1 (Attribut)Buffer pro im Programm
	verwendeten Attribut verwendet werden. Möchte ich mehrere Meshes mit
	demselben Programm benutzen muss immer der neue Buffer kopiert werden,
	es ist nicht möglich mehrere Buffer anzulegen und sich den gewünschten
	Buffer zum Rendern auszusuchen.
- Aktuell kann kein IndexBuffer angelegt werden, das aktuelle Beispiel
	macht dies Manuell.
- Konzeptuell sollte das erstellen der Buffer am Mesh und nicht am Programm
	hängen.
### Float2|3|4 / Matrix2x2|3x3|4x4
- [ ] Die Matheklassen (Float2|3|4, Matrix2x2|3x3|4x4) sollten die
	Möglichkeit bekommen, ohne new Berechnungsergebnisse in einer
	übergebenen Instanz abzuspeichern.
- [ ] Eventuell sollten die Bestandteile von Einzelvariablen auf
	Float32Array, Float64Array oder NumberArray umgestellt werden.
	**(Generisch?)**
### MeshCache erstellen
- [x] Ein Mesh definiert Vertices und Indices
- [x] Vertices haben Variabel viele Eigenschaften
- [x] Jedes Mesh besteht aus mindestens einem Submesh.
- [x] Jedes Submesh verweist auf genau ein Shaderprogramm. (Damit sind
	mehrere Texturen / Materialien möglich)
- [ ] Jedes Submesh verweist auf seinen eigenen Satz an Texturen. (Damit
  kann dasselbe Programm mit unterschiedlichen Texturen verwendet werden.)
- [ ] ggf. kann jedes Submesh seinen Rendertyp selbst festlegen, um z.B.
	Gitternetze und gefüllte Flächen parallel zu benutzen, möglicherweise
	nicht in der ersten Version.
- [x] ~~Mehrere Submeshes werden rein duch IndexBufferGrenzen festgelegt
	und teilen sich alle Vertices.~~
- [ ] Blender Vertex Groups müssen Teil der Vertexdefinition und
	vollständig sein. (Es müssen alle Vertices einen VertexGruppenWert
	besitzen, Lücken wie in Blender erlaubt müssen z.B. mit 0.0 aufgefüllt
	werden. Es obliegt dem Shaderprogramm, wie Vertexgruppen am Vertex
	verteilt werden.)
- [x] ~~Alle Shaderprogramme eines Meshes müssen dieselbe Vertexdefinition
	benutzen.~~ (~~Alternativ~~ könnte das Subsesh bestimmte
	Vertexbestandteile dem Shaderprogramm zuordnen - dies würde im Endeffekt
	vermutlich jedoch zu mehr Buffern mit ähnlichen / teilweise identischen
	Werten führen)
- [ ] Wie Schatten anderer Meshes berechnet werden muss ich mir erst
	angucken, vermutlich muss es Instanzbezogene Daten geben, sehr
	wahrscheinlich sind mehrere Renderpasses nötig
- [ ] In einer späteren Version können ggf. Modifier wie Array, Mirror,
	Subdevision Surface und Armature eingeführt werden.
- [x] Vermutlich muss ich ein eigenes Dateiformat entwickeln, welches meine
	Features abdeckt.
- [ ] Damit muss ich vermutlich auch einen Exporter für Blender in diesem
	Format schreiben... (Irgs: Python)
- [x] Das Dateiformat ist dann entweder JSON ~~(Vermutlich ist das aber
	Platzverschwendung) oder ein Binärdatentyp~~ und sollte asynchron geladen
	werden.

## Bugs
- Skybox Textur nutzt immer nur den Teil Oben Links der SkyboxTextur.
