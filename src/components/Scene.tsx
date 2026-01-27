import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { audioManager } from '../utils/AudioManager';
import gsap from 'gsap';

import fragmentShader from '../shaders/particles.fragment.glsl?raw';
import vertexShader from '../shaders/particles.vertex.glsl?raw';

interface SceneProps {
    intensity: number;
    density: number;
    color1: string;
    color2: string;
    preset: 'default' | 'dreamy';
}

const Cloud = ({ intensity, density, color1, color2, preset }: SceneProps) => {
    const mesh = useRef<THREE.Points>(null);
    const material = useRef<THREE.ShaderMaterial>(null);
    const beatPulse = useRef(0);

    const count = 14000;

    const [positions, randoms] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const rnd = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 10 * Math.cbrt(Math.random());

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
            pos[i * 3 + 2] = r * Math.cos(phi);

            rnd[i * 3] = Math.random();
            rnd[i * 3 + 1] = Math.random();
            rnd[i * 3 + 2] = Math.random();
        }
        return [pos, rnd];
    }, []);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uHigh: { value: 0 },
        uIntensity: { value: intensity },
        uDensity: { value: density },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
        uBeatPulse: { value: 0 },
        uDreamy: { value: preset === 'dreamy' ? 1 : 0 }
    }), []);

    // Beat callback for color pulse
    useEffect(() => {
        const handleBeat = () => {
            beatPulse.current = 1;
        };
        audioManager.onBeat(handleBeat);
        return () => audioManager.offBeat(handleBeat);
    }, []);

    // Smooth color transitions
    useEffect(() => {
        if (material.current) {
            const target1 = new THREE.Color(color1);
            const target2 = new THREE.Color(color2);

            gsap.to(material.current.uniforms.uColor1.value, {
                r: target1.r, g: target1.g, b: target1.b,
                duration: 0.8, ease: 'power2.out'
            });
            gsap.to(material.current.uniforms.uColor2.value, {
                r: target2.r, g: target2.g, b: target2.b,
                duration: 0.8, ease: 'power2.out'
            });
        }
    }, [color1, color2]);

    useFrame((state) => {
        if (!material.current || !mesh.current) return;

        material.current.uniforms.uTime.value = state.clock.getElapsedTime();

        const { bass, mid, high } = audioManager.getSpectralEnergy();
        const u = material.current.uniforms;

        u.uBass.value = THREE.MathUtils.lerp(u.uBass.value, bass, 0.4);
        u.uMid.value = THREE.MathUtils.lerp(u.uMid.value, mid, 0.25);
        u.uHigh.value = THREE.MathUtils.lerp(u.uHigh.value, high, 0.2);
        u.uIntensity.value = intensity;
        u.uDensity.value = density;
        u.uDreamy.value = preset === 'dreamy' ? 1 : 0;

        // Beat pulse decay
        beatPulse.current *= 0.92;
        u.uBeatPulse.value = beatPulse.current;

        mesh.current.rotation.y += (preset === 'dreamy' ? 0.0006 : 0.0012) + mid * 0.003;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} args={[positions, 3]} />
                <bufferAttribute attach="attributes-aRandom" count={count} args={[randoms, 3]} />
            </bufferGeometry>
            <shaderMaterial
                ref={material}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={uniforms}
            />
        </points>
    );
};

export const Scene = (props: SceneProps) => {
    return (
        <Canvas
            camera={{ position: [0, 0, 32], fov: 55 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            style={{ background: '#000', position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        >
            <Cloud {...props} />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.25}
                maxPolarAngle={Math.PI / 1.6}
                minPolarAngle={Math.PI / 2.8}
                enableDamping
                dampingFactor={0.05}
            />
        </Canvas>
    );
};
