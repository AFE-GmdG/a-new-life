#define M_PI 3.14159265359
#define M_PI_360 0.00872664626

attribute vec4 a_vertexTeil1;
attribute vec4 a_vertexTeil2;

// Projection: fovy, aspectRatio oder width und height, znear, zfar = 4 oder 5 floats
// Camera: eye, at, up = 9 floats
// Modell: pos, rotation = 6 floats
// ================================
// = 19 oder 20 floats
// = mat4 + vec4
uniform mat4 u_data1;
uniform vec4 u_data2;

// Im FragmentShader habe ich bereits ein Paralleles weißes Licht der Stärke 1 = 3 floats
// Jedes weitere PunktLicht würde pos, rgb, strength = 3+3+1 = 7 floats benötigen
// uniform mat4 u_transform;

varying vec2 v_texCoord;
varying vec3 v_normal;

void main() {
	v_texCoord = vec2(a_vertexTeil1.w, a_vertexTeil2.x);
	v_normal = vec3(a_vertexTeil2.yzw);

	// Variablen aus den uniforms ausleiten
	float fovy = u_data1[0].x;
	float width = u_data1[0].y;
	float height = u_data1[0].z;
	float aspect = width / height;
	float znear = u_data1[0].w;
	float zfar = u_data1[1].x;
	vec3 eye = u_data1[1].yzw;
	vec3 at = u_data1[2].xyz;
	vec3 up = vec3(u_data1[2].w, u_data1[3].xy);
	vec3 pos = vec3(u_data1[3].zw, u_data2.x);
	vec3 rot = u_data2.yzw;

	// PerspectiveMatrix erzeugen
	float ymax = znear * tan(fovy * M_PI_360);
	float ymin = -ymax;
	float xmin = ymin * aspect;
	float xmax = ymax * aspect;
	float x = 2.0 * znear / (xmax - xmin);
	float y = 2.0 * znear / (ymax - ymin);
	float a = (xmax + xmin) / (xmax - xmin);
	float b = (ymax + ymin) / (ymax - ymin);
	float c = -(zfar + znear) / (zfar - znear);
	float d = -2.0 * zfar * znear / (zfar - znear);

	mat4 perspective = mat4(x, 0, a, 0, 0, y, b, 0, 0, 0, c, d, 0, 0, -1, 0);

	// LookAtMatrix erzeugen
	vec3 cz = normalize(eye - at);
	vec3 cx = normalize(cross(up, cz));
	vec3 cy = normalize(cross(cz, cx));
	mat4 m = mat4(cx, 0.0, cy, 0.0, cz, 0.0, 0.0, 0.0, 0.0, 1.0);
	mat4 t = mat4(1.0, 0.0, 0.0, -eye.x, 0.0, 1.0, 0.0, -eye.y, 0.0, 0.0, 1.0, -eye.z, 0.0, 0.0, 0.0, 1.0);

	mat4 lookAt = m * t;

	// ModelMatrix erzeugen
	mat4 model = mat4(1.0, 0.0, 0.0, pos.x, 0.0, 1.0, 0.0, pos.y, 0.0, 0.0, 1.0, pos.z, 0.0, 0.0, 0.0, 1.0);

	mat4 transform = perspective * lookAt * model;

	gl_Position = transform * vec4(a_vertexTeil1.xyz, 1.0);
	gl_PointSize = 3.5;
}
