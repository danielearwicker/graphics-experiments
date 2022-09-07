// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision highp float;

uniform vec4 u_zoom;

void main() {
    
    float sx = ((gl_FragCoord.x - float(1000)) / float(500)) - 0.5;
    float sy = ((gl_FragCoord.y - float(500)) / float(500)) - 0.5;

    float cx = (sx * u_zoom.z) + u_zoom.x + 0.386;
    float cy = (sy * u_zoom.w) + u_zoom.y + 0.199;

    float x = 0.0;
    float y = 0.0;
    int count = 0;

    for (int i = 0; i < 223; i++) {
        if (x * x + y * y > 4.0) {
            count = i;
            break;
        }

        float t = x * x - y * y + cx;
        y = 2.0 * x * y + cy;
        x = t;
    }

    float p = float(count) / 223.0;
    gl_FragColor = count == 0 ? vec4(0, 0, 0, 1) :
                   p < 0.5 ? vec4(0, p*2.0, 1.0-(p*2.0), 1) :
                   vec4(p*2.0, 1.0-(p*2.0), 0, 1);

    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    //gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
}
