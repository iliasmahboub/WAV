import { useState } from 'react';
import { Scene } from './components/Scene';
import { Interface } from './components/Interface';

function App() {
    const [color1, setColor1] = useState('#4c6ef5');
    const [color2, setColor2] = useState('#fa5252');
    const [preset, setPreset] = useState<'default' | 'dreamy'>('default');

    return (
        <div style={{ width: '100vw', height: 'var(--app-height, 100vh)', background: '#000', overflow: 'hidden' }}>
            <Scene intensity={1} density={1} color1={color1} color2={color2} preset={preset} />
            <Interface setColor1={setColor1} setColor2={setColor2} setPreset={setPreset} />
        </div>
    );
}

export default App;
