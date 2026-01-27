export interface Beat {
    id: string;
    title: string;
    subtitle: string;
    bpm: string;
    year: string;
    color1: string;
    color2: string;
    tags: string[];
    audioFile: string;
    mood?: 'dreamy' | 'default';
}

export const CATALOG: Beat[] = [
    {
        id: '001',
        title: 'INTRO',
        subtitle: 'THE BEGINNING',
        bpm: '120',
        year: '2026',
        color1: '#f8f9fa',
        color2: '#212529',
        tags: ['AMBIENT', 'CINEMATIC'],
        audioFile: '/beats/INTRO.wav'
    },
    {
        id: '002',
        title: 'DREXEL',
        subtitle: 'STREET ANTHEM',
        bpm: '145',
        year: '2026',
        color1: '#0b0f19',
        color2: '#5c7cfa',
        tags: ['TRAP', 'DARK'],
        audioFile: '/beats/DREXEL - TRAP.wav'
    },
    {
        id: '003',
        title: 'ONLY GIRL',
        subtitle: 'SUMMER VIBES',
        bpm: '140',
        year: '2026',
        color1: '#f06595',
        color2: '#12b886',
        tags: ['JERSEY', 'CLUB'],
        audioFile: '/beats/ONLY GIRL - JERSEY.wav'
    },
    {
        id: '004',
        title: 'GOD IS A WOMAN',
        subtitle: 'DIVINE ENERGY',
        bpm: '130',
        year: '2026',
        color1: '#0b1a2a',
        color2: '#f08c00',
        tags: ['TRAP', 'MELODIC'],
        audioFile: '/beats/GOD IS A WOMAN.wav'
    },
    {
        id: '005',
        title: 'EL CHAPO',
        subtitle: 'CARTEL',
        bpm: '138',
        year: '2026',
        color1: '#ffd43b',
        color2: '#c92a2a',
        tags: ['TRAP', 'LATIN'],
        audioFile: '/beats/EL CHAPO.wav'
    },
    {
        id: '006',
        title: 'SAHARA',
        subtitle: 'DESERT HEAT',
        bpm: '140',
        year: '2026',
        color1: '#fcc419',
        color2: '#8d4e1b',
        tags: ['TRAP', 'ETHNIC'],
        audioFile: '/beats/SAHARA.wav'
    },
    {
        id: '007',
        title: 'ALIVE',
        subtitle: 'RESURRECTION',
        bpm: '140',
        year: '2026',
        color1: '#0b3d2e',
        color2: '#51cf66',
        tags: ['DRILL', 'MELODIC'],
        audioFile: '/beats/ALIVE - DRILL.wav'
    },
    {
        id: '008',
        title: 'INTERLUDE',
        subtitle: 'DREAM STATE',
        bpm: '90',
        year: '2026',
        color1: '#1c2a3d',
        color2: '#9ec5ff',
        tags: ['AMBIENT', 'LO-FI'],
        audioFile: '/beats/INTERLUDE.mp3',
        mood: 'dreamy'
    },
    {
        id: '009',
        title: 'SOVIET CONNECTIONS',
        subtitle: 'EASTERN BLOC',
        bpm: '135',
        year: '2026',
        color1: '#3b0b0b',
        color2: '#dee2e6',
        tags: ['TRAP', 'CINEMATIC'],
        audioFile: '/beats/SOVIET CONNECTIONS.wav'
    },
    {
        id: '010',
        title: 'MIRACLE',
        subtitle: 'TRANSCENDENCE',
        bpm: '128',
        year: '2025',
        color1: '#0b1a20',
        color2: '#12b5d0',
        tags: ['HOUSE', 'UPLIFT'],
        audioFile: '/beats/MIRACLE - HOUSE.wav'
    }
];
