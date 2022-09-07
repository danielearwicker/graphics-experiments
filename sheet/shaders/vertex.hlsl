attribute vec4 a_position;

uniform int u_frame;
uniform mat4 u_matrix;

varying vec4 v_color;

void main() {

    float z = (sin((float(u_frame) * 0.05) + (a_position.x * 10.0)) +
               sin((float(u_frame) * 0.03) + (a_position.y * 10.0))) * 0.05;

    gl_Position = u_matrix * vec4(a_position.x, a_position.y, z, 1);

    float d = z+1.5;

    v_color = vec4(1.0 / d, (a_position.x + 1.0) / d, (a_position.y + 1.0) / d, 1);
}
