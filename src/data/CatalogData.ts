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
        audioFile: 'https://9uat0nx2pweuuf7x.public.blob.vercel-storage.com/Beats/INTRO.wav'
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
        audioFile: 'https://9uat0nx2pweuuf7x.public.blob.vercel-storage.com/Beats/DREXEL%20-%20TRAP.wav'
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
        audioFile: 'https://9uat0nx2pweuuf7x.public.blob.vercel-storage.com/Beats/ONLY%20GIRL%20-%20JERSEY.wav'
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
        audioFile: 'https://9uat0nx2pweuuf7x.public.blob.vercel-storage.com/Beats/GOD%20IS%20A%20WOMAN.wav'
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
        audioFile: 'https://9uat0nx2pweuuf7x.public.blob.vercel-storage.com/Beats/EL%20CHAPO.wav'
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
        audioFile: 'https://9uat0nx2pweuuf7x.public.blob.vercel-storage.com/Beats/SAHARA.wav'
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
        audioFile: 'https://9uat0nx2pweuuf7x.public.blob.vercel-storage.com/Beats/ALIVE%20-%20DRILL.wav'
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
        audioFile: 'https://9uat0nx2pweuuf7x.public.blob.vercel-storage.com/Beats/INTERLUDE.mp3',
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
        audioFile: 'https://9uat0nx2pweuuf7x.public.blob.vercel-storage.com/Beats/SOVIET%20CONNECTIONS.wav'
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
        audioFile: 'https://9uat0nx2pweuuf7x.public.blob.vercel-storage.com/Beats/MIRACLE%20-%20HOUSE.wav'
    }
];
