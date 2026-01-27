varying float vAlpha;
varying vec3 vColor;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uBeatPulse;
uniform float uDreamy;

void main() {
    vec2 uv = gl_PointCoord;
    float dist = length(uv - vec2(0.5));

    if (dist > 0.5) discard;

    // Soft glow particle
    float strength = 1.0 - dist * 2.0;
    strength = pow(strength, 1.5);

    // Sharp core
    float core = smoothstep(0.3, 0.0, dist);

    // Color mix based on highs
    float energy = clamp(vColor.x + vColor.y + vColor.z, 0.0, 1.4);
    float quiet = 1.0 - clamp(energy * 0.8, 0.0, 1.0);
    float mix_factor = clamp(vColor.z * 2.4 + vColor.x * 0.8 - quiet * 0.3, 0.0, 1.0);
    vec3 base = mix(uColor1, uColor2, mix_factor);
    vec3 color = base * (1.05 + vColor.z * 0.8 + vColor.x * 0.35);

    // White hot core
    float pulse = smoothstep(0.0, 1.0, uBeatPulse);
    color += base * (0.22 + pulse * 0.35) * core;

    // Bass warmth
    color += vColor.x * 0.55;

    // Mid brightness
    color += vColor.y * 0.25;

    // Dreamy wash + silence glow
    color = mix(color, mix(uColor1, uColor2, 0.55), quiet * (0.2 + uDreamy * 0.25));
    color = mix(color, base, pulse * 0.25);

    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma), color, 1.35);
    color = clamp(color, 0.0, 1.2);

    float alpha = strength * vAlpha * (1.0 + pulse * 0.25);

    gl_FragColor = vec4(color, alpha);
}
