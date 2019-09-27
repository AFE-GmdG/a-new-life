precision mediump float;

uniform vec3 u_reverseLightDirection;
uniform sampler2D u_color;
uniform samplerCube u_cube;

varying vec2 v_texCoord;
varying vec3 v_normal;

void main() {
	vec4 color = texture2D(u_color, v_texCoord);
	vec4 cubemapColor = textureCube(u_cube, vec3(v_texCoord, 0.5));
	vec3 normal = normalize(v_normal);

	float light = dot(normal, u_reverseLightDirection);

	gl_FragColor = vec4(cubemapColor.rgb, 1.0); //vec4((color.rgb * cubemapColor.rgb) * light, 1.0);
}
