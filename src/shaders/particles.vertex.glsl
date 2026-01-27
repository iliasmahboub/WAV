uniform float uTime;
uniform float uBass;
uniform float uMid;
uniform float uHigh;
uniform float uIntensity;
uniform float uDensity;
uniform float uDreamy;

attribute vec3 aRandom;

varying float vAlpha;
varying vec3 vColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 curlNoise(vec3 p) {
    float e = 0.1;
    float t = uTime * 0.15 + uBass * 2.0;
    float x = snoise(p + vec3(e,0,0) + t) - snoise(p - vec3(e,0,0) + t);
    float y = snoise(p + vec3(0,e,0) + t) - snoise(p - vec3(0,e,0) + t);
    float z = snoise(p + vec3(0,0,e) + t) - snoise(p - vec3(0,0,e) + t);
    return normalize(vec3(x, y, z));
}

void main() {
    vec3 pos = position;

    // Curl noise flow
    vec3 curl = curlNoise(pos * 0.2);
    float dreamy = uDreamy;
    vec3 swirl = curl * (1.2 + uMid * (dreamy > 0.5 ? 2.2 : 3.5) + uHigh * (dreamy > 0.5 ? 1.6 : 2.5));

    // Kick shockwave - STRONG
    float kick = pow(uBass, 2.0);
    vec3 dir = normalize(pos + 0.001);
    vec3 kickOffset = dir * kick * 10.0 * (0.6 + aRandom.y * 0.8);

    // Breathing
    float breathe = sin(uTime * (dreamy > 0.5 ? 0.28 : 0.5) + aRandom.x * 6.28) * (dreamy > 0.5 ? 0.6 : 0.45);

    float hiss = snoise(vec3(uTime * (dreamy > 0.5 ? 1.4 : 2.6) + aRandom.xy * 6.0, aRandom.z * 4.0)) * uHigh * (dreamy > 0.5 ? 2.0 : 3.0);

    vec3 finalPos = pos + swirl + kickOffset * uIntensity + dir * breathe + dir * hiss;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size
    float baseSize = 20.0 * (0.4 + aRandom.z * 0.6);
    if (aRandom.x > uDensity) baseSize = 0.0;

    float sparkle = snoise(vec3(uTime * 10.0, aRandom.xy * 8.0)) * uHigh * 3.5;
    float size = baseSize * (1.0 + kick * (dreamy > 0.5 ? 1.8 : 3.0) + max(0.0, sparkle));

    gl_PointSize = size * (12.0 / -mvPosition.z);

    vAlpha = 0.8 + uHigh * 0.2;
    vColor = vec3(uBass, uMid, uHigh);
}
