import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { audioManager } from '../utils/AudioManager';
import { CATALOG } from '../data/CatalogData';
import gsap from 'gsap';

interface InterfaceProps {
    setColor1: (val: string) => void;
    setColor2: (val: string) => void;
    setPreset: (val: 'default' | 'dreamy') => void;
}

interface UserTrack {
    id: string;
    title: string;
    subtitle: string;
    bpm?: string;
    year?: string;
    audioFile: string;
    objectUrl: string;
}

type TrackSource = 'catalog' | 'user';
type LoadTrackOptions = { silent?: boolean; deferPlay?: boolean; restart?: boolean };

interface FontStyles {
    main: CSSProperties;
    mono: CSSProperties;
}

interface TopBarProps {
    activeSource: TrackSource;
    userTracksLength: number;
    currentBeatIndex: number;
    userIndex: number;
    font: FontStyles;
    onLoadCatalog: (index: number) => void;
    onLoadUser: (index: number) => void;
    onToggleColors: () => void;
    onUploadClick: () => void;
}

const HudTopBar = ({ activeSource, userTracksLength, currentBeatIndex, userIndex, font, onLoadCatalog, onLoadUser, onToggleColors, onUploadClick }: TopBarProps) => (
    <div className="hud-topbar" style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8, pointerEvents: 'auto' }}>
        <button onClick={() => onLoadCatalog(currentBeatIndex)} style={{
            ...font.mono, background: activeSource === 'catalog' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', cursor: 'pointer'
        }}>CATALOG</button>
        <button onClick={() => { if (userTracksLength > 0) onLoadUser(userIndex); }} style={{
            ...font.mono, background: activeSource === 'user' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.2)', color: userTracksLength > 0 ? '#fff' : 'rgba(255,255,255,0.35)',
            padding: '8px 12px', cursor: userTracksLength > 0 ? 'pointer' : 'not-allowed'
        }}>UPLOADS</button>
        <button onClick={onToggleColors} style={{
            ...font.mono, background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', padding: '8px 14px', cursor: 'pointer'
        }}>COLORS</button>
        <button onClick={onUploadClick} style={{
            ...font.mono, background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', padding: '8px 14px', cursor: 'pointer'
        }}>+ YOUR OWN</button>
    </div>
);

interface ColorPanelProps {
    show: boolean;
    customColor1: string;
    customColor2: string;
    isCustomMode: boolean;
    font: FontStyles;
    onColor1: (val: string) => void;
    onColor2: (val: string) => void;
    onApply: () => void;
    onReset: () => void;
}

const ColorPanel = ({ show, customColor1, customColor2, isCustomMode, font, onColor1, onColor2, onApply, onReset }: ColorPanelProps) => {
    if (!show) return null;
    return (
        <div className="hud-color-panel" style={{
            position: 'absolute', top: 65, right: 20, background: 'rgba(0,0,0,0.95)',
            border: '1px solid rgba(255,255,255,0.1)', padding: 16, width: 180, pointerEvents: 'auto'
        }}>
            <div style={{ marginBottom: 12 }}>
                <div style={{ ...font.mono, fontSize: 8, opacity: 0.4, marginBottom: 6 }}>PRIMARY</div>
                <input type="color" value={customColor1} onChange={e => onColor1(e.target.value)} style={{ width: 30, height: 30, border: 'none', cursor: 'pointer' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
                <div style={{ ...font.mono, fontSize: 8, opacity: 0.4, marginBottom: 6 }}>ACCENT</div>
                <input type="color" value={customColor2} onChange={e => onColor2(e.target.value)} style={{ width: 30, height: 30, border: 'none', cursor: 'pointer' }} />
            </div>
            <button onClick={onApply} style={{
                ...font.mono, width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', padding: 8, cursor: 'pointer', marginBottom: 6
            }}>APPLY</button>
            {isCustomMode && <button onClick={onReset} style={{
                ...font.mono, width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)', padding: 8, cursor: 'pointer'
            }}>RESET</button>}
        </div>
    );
};

interface TrackSidebarProps {
    activeSource: TrackSource;
    currentBeatIndex: number;
    userTracks: UserTrack[];
    userIndex: number;
    onLoadCatalog: (index: number) => void;
    onLoadUser: (index: number) => void;
}

const TrackSidebar = ({ activeSource, currentBeatIndex, userTracks, userIndex, onLoadCatalog, onLoadUser }: TrackSidebarProps) => (
    <div className="track-sidebar">
        <div className="track-sidebar-title">/ARCHIVE</div>
        <div className="track-sidebar-section">
            <div className="track-sidebar-folder">CATALOG</div>
            <div className="track-sidebar-list">
                {CATALOG.map((track, index) => (
                    <button
                        key={track.id}
                        onClick={() => onLoadCatalog(index)}
                        className={`track-sidebar-item ${activeSource === 'catalog' && currentBeatIndex === index ? 'is-active' : ''}`}
                    >
                        <span>{track.id}</span>
                        <span>{track.title}</span>
                    </button>
                ))}
            </div>
        </div>
        <div className="track-sidebar-section">
            <div className="track-sidebar-folder">UPLOADS</div>
            <div className="track-sidebar-list">
                {userTracks.length === 0 && (
                    <div className="track-sidebar-empty">DROP A FILE TO START</div>
                )}
                {userTracks.map((track, index) => (
                    <button
                        key={track.objectUrl}
                        onClick={() => onLoadUser(index)}
                        className={`track-sidebar-item ${activeSource === 'user' && userIndex === index ? 'is-active' : ''}`}
                    >
                        <span>U-{String(index + 1).padStart(2, '0')}</span>
                        <span>{track.title}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

interface BottomHudProps {
    progress: number;
    currentTime: number;
    duration: number;
    trackInfoRef: React.RefObject<HTMLDivElement | null>;
    bpmRef: React.RefObject<HTMLDivElement | null>;
    detectedBPM: number;
    currentTrack: UserTrack | (typeof CATALOG)[number] | undefined;
    activeSource: TrackSource;
    userIndex: number;
    currentBeatId: string;
    currentBeatIndex: number;
    userTracksLength: number;
    catalogLength: number;
    trackLabel: string;
    font: FontStyles;
    isPlaying: boolean;
    onPrev: () => void;
    onNext: () => void;
    onTogglePlay: () => void;
    onSeekPercent: (percent: number) => void;
    onSeekBy: (deltaSeconds: number) => void;
}

const formatTimecode = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const whole = Math.floor(seconds);
    const mins = Math.floor(whole / 60);
    const secs = whole % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
};

const BottomHud = ({
    progress,
    currentTime,
    duration,
    trackInfoRef,
    bpmRef,
    detectedBPM,
    currentTrack,
    activeSource,
    userIndex,
    currentBeatId,
    currentBeatIndex,
    userTracksLength,
    catalogLength,
    trackLabel,
    font,
    isPlaying,
    onPrev,
    onNext,
    onTogglePlay,
    onSeekPercent,
    onSeekBy
}: BottomHudProps) => (
    <div className="hud-bottom" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: 28,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', pointerEvents: 'auto'
    }}>
        <div className="hud-progress-shell">
            <div className="hud-progress-track" aria-hidden="true">
                <div className="hud-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <input
                className="hud-progress-input"
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={Number.isFinite(progress) ? progress : 0}
                onChange={(e) => onSeekPercent(Number(e.target.value))}
                aria-label="Seek track position"
            />
            <div className="hud-progress-meta" style={{ ...font.mono }}>
                <span>{formatTimecode(currentTime)}</span>
                <span>{formatTimecode(duration)}</span>
            </div>
        </div>

        <div className="hud-bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div ref={trackInfoRef} className="hud-track-info" style={{ flex: 1 }}>
                <div style={{ ...font.mono, fontSize: 8, opacity: 0.4, marginBottom: 6 }}>
                    NOW PLAYING / {activeSource === 'user' ? `U-${String(userIndex + 1).padStart(2, '0')}` : currentBeatId}
                </div>
                <div style={{ ...font.main, fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 300, letterSpacing: '0.03em', lineHeight: 1, marginBottom: 6 }}>
                    <span style={{ opacity: 0.25 }}>"</span>{currentTrack?.title ?? 'NO TRACK'}<span style={{ opacity: 0.25 }}>"</span>
                </div>
                <div style={{ ...font.mono, fontSize: 9, opacity: 0.4, marginBottom: 4 }}>{currentTrack?.subtitle ?? 'UPLOAD A TRACK TO START'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div ref={bpmRef} style={{
                        ...font.mono, fontSize: 11, opacity: 0.7,
                        color: detectedBPM > 0 ? '#4ade80' : 'inherit'
                    }}>
                        {detectedBPM > 0 ? `${detectedBPM} BPM` : `${currentTrack?.bpm ? `${currentTrack.bpm} BPM` : '-- BPM'}`}
                        {detectedBPM > 0 && <span style={{ fontSize: 8, marginLeft: 4, opacity: 0.5 }}>DETECTED</span>}
                    </div>
                    <div style={{ ...font.mono, fontSize: 9, opacity: 0.35 }}>{currentTrack?.year ?? '--'}</div>
                </div>
            </div>

            <div className="hud-controls" style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 6 }}>
                <button
                    onClick={onPrev}
                    style={{ ...font.mono, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 8 }}
                >
                    PREV
                </button>
                <div className="hud-transport">
                    <button
                        onClick={() => onSeekBy(-10)}
                        className="hud-transport-nudge"
                        aria-label="Rewind 10 seconds"
                        title="rewind 10s"
                    >
                        -10
                    </button>
                    <button onClick={onTogglePlay} className="hud-play-button">
                        {isPlaying ? 'PAUSE' : 'PLAY'}
                    </button>
                    <button
                        onClick={() => onSeekBy(10)}
                        className="hud-transport-nudge"
                        aria-label="Forward 10 seconds"
                        title="forward 10s"
                    >
                        +10
                    </button>
                </div>
                <button
                    onClick={onNext}
                    style={{ ...font.mono, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 8 }}
                >
                    NEXT
                </button>
            </div>

            <div className="hud-counter" style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ ...font.mono, fontSize: 8, opacity: 0.4, marginBottom: 8 }}>{trackLabel}</div>
                <div style={{ ...font.mono, fontSize: 12 }}>
                    {activeSource === 'user'
                        ? `${String(userIndex + 1).padStart(2, '0')} / ${String(userTracksLength).padStart(2, '0')}`
                        : `${String(currentBeatIndex + 1).padStart(2, '0')} / ${String(catalogLength).padStart(2, '0')}`}
                </div>
            </div>
        </div>
    </div>
);

export const Interface = ({ setColor1, setColor2, setPreset }: InterfaceProps) => {
    const [showIntro, setShowIntro] = useState(true);
    const [introStage, setIntroStage] = useState<'idle' | 'booting'>('idle');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
    const [userTracks, setUserTracks] = useState<UserTrack[]>([]);
    const [userIndex, setUserIndex] = useState(0);
    const [source, setSource] = useState<TrackSource>('catalog');
    const [showUI, setShowUI] = useState(true);
    const [showColorPanel, setShowColorPanel] = useState(false);
    const [customColor1, setCustomColor1] = useState('#4c6ef5');
    const [customColor2, setCustomColor2] = useState('#fa5252');
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [detectedBPM, setDetectedBPM] = useState(0);
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [showLibraryPanel, setShowLibraryPanel] = useState(true);

    const introRef = useRef<HTMLDivElement>(null);
    const introDoneRef = useRef(false);
    const introLoadedRef = useRef(false);
    const mobileInitRef = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const trackInfoRef = useRef<HTMLDivElement>(null);
    const bpmRef = useRef<HTMLDivElement>(null);

    const activeSource: TrackSource = source === 'user' && userTracks.length > 0 ? 'user' : 'catalog';
    const currentBeat = CATALOG[currentBeatIndex];
    const currentUserTrack = userTracks[userIndex];
    const currentTrack = activeSource === 'user' ? currentUserTrack : currentBeat;

    const trackLabel = useMemo(() => {
        if (activeSource === 'user') return 'YOUR LIBRARY';
        return 'CATALOGUE';
    }, [activeSource]);

    // Beat pulse effect on colors
    useEffect(() => {
        if (showIntro) return;

        const handleBeat = () => {
            // Flash the BPM display
            if (bpmRef.current) {
                gsap.fromTo(bpmRef.current,
                    { scale: 1.15, opacity: 1 },
                    { scale: 1, opacity: 0.7, duration: 0.3, ease: 'power2.out' }
                );
            }
        };

        audioManager.onBeat(handleBeat);
        return () => audioManager.offBeat(handleBeat);
    }, [showIntro]);

    // Update BPM periodically
    useEffect(() => {
        if (showIntro) return;

        const interval = setInterval(() => {
            const bpm = audioManager.getBPM();
            if (bpm > 0) setDetectedBPM(bpm);
        }, 500);

        return () => clearInterval(interval);
    }, [showIntro]);

    useEffect(() => {
        if (isPlaying) setShowUI(true);
    }, [isPlaying]);

    useEffect(() => {
        if (source === 'user' && userTracks.length === 0) {
            setSource('catalog');
        }
    }, [source, userTracks.length]);

    const loadTrack = useCallback(async (
        nextSource: TrackSource,
        index: number,
        immediateTrack?: UserTrack,
        options?: LoadTrackOptions
    ) => {
        const isCatalog = nextSource === 'catalog';
        const listLength = isCatalog ? CATALOG.length : userTracks.length;
        if (!isCatalog && listLength === 0) return;

        let nextIndex = index;
        if (nextIndex < 0) nextIndex = listLength - 1;
        if (nextIndex >= listLength) nextIndex = 0;

        const catalogBeat = isCatalog ? CATALOG[nextIndex] : null;
        const userBeat = isCatalog ? null : (immediateTrack ?? userTracks[nextIndex]);
        const beat = catalogBeat ?? userBeat;
        if (!beat) return;

        const updateTrackState = () => {
            setSource(nextSource);
            setDetectedBPM(0);
            setProgress(0);
            setCurrentTime(0);
            setDuration(0);
            if (isCatalog) {
                setCurrentBeatIndex(nextIndex);
                setPreset(catalogBeat?.mood ?? 'default');
                if (!isCustomMode) {
                    if (catalogBeat) {
                        setColor1(catalogBeat.color1);
                        setColor2(catalogBeat.color2);
                        setCustomColor1(catalogBeat.color1);
                        setCustomColor2(catalogBeat.color2);
                    }
                }
            } else {
                setUserIndex(nextIndex);
                setIsCustomMode(true);
                setPreset('default');
                setColor1(customColor1);
                setColor2(customColor2);
            }
        };

        if (trackInfoRef.current && !showIntro) {
            gsap.to(trackInfoRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.25,
                onComplete: () => {
                    updateTrackState();
                    gsap.to(trackInfoRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
                }
            });
        } else {
            updateTrackState();
        }

        if (audioRef.current) {
            const audio = audioRef.current;
            if (options?.deferPlay) {
                audio.src = beat.audioFile;
                audio.load();
                audio.currentTime = 0;
                setIsPlaying(false);
                return;
            }
            const handlePlay = async () => {
                audio.src = beat.audioFile;
                try {
                    await audioManager.initialize(audio);
                    await audioManager.resume();
                    audio.volume = 0;
                    if (options?.restart) {
                        audio.currentTime = 0;
                    }
                    await audio.play();
                    if (!options?.silent) {
                        gsap.to(audio, { volume: 1, duration: 0.5 });
                    }
                    setIsPlaying(true);
                    setShowUI(true);
                } catch (e) {
                    audio.volume = 1;
                }
            };
            gsap.to(audio, {
                volume: 0,
                duration: 0.35,
                onComplete: () => {
                    void handlePlay();
                }
            });
        }
    }, [setColor1, setColor2, isCustomMode, showIntro, userTracks]);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.crossOrigin = 'anonymous';
        }
        const audio = audioRef.current;
        const onEnded = () => {
            setCurrentTime(0);
            setProgress(0);
            if (activeSource === 'user' && userTracks.length > 0) {
                void loadTrack('user', userIndex + 1);
            } else {
                void loadTrack('catalog', currentBeatIndex + 1);
            }
        };
        const syncTime = () => {
            const nextDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
            const nextTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
            setDuration(nextDuration);
            setCurrentTime(nextTime);
            setProgress(nextDuration > 0 ? (nextTime / nextDuration) * 100 : 0);
        };
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('timeupdate', syncTime);
        audio.addEventListener('loadedmetadata', syncTime);
        audio.addEventListener('durationchange', syncTime);
        return () => {
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('timeupdate', syncTime);
            audio.removeEventListener('loadedmetadata', syncTime);
            audio.removeEventListener('durationchange', syncTime);
        };
    }, [currentBeatIndex, loadTrack, activeSource, userIndex, userTracks.length]);

    const finishIntro = useCallback(() => {
        if (introDoneRef.current) return;
        introDoneRef.current = true;
        gsap.to(introRef.current, {
            opacity: 0,
            duration: 0.6,
            onComplete: () => {
                setShowIntro(false);
                setShowUI(true);
                if (introLoadedRef.current) {
                    void loadTrack('catalog', 0, undefined, { restart: true });
                } else if (!audioManager.isPlaying()) {
                    void loadTrack('catalog', 0, undefined, { restart: true });
                }
                if (audioRef.current) {
                    gsap.to(audioRef.current, { volume: 1, duration: 0.9, ease: 'power2.out' });
                }
            }
        });
    }, [loadTrack]);

    const enterArchive = () => {
        if (introStage !== 'idle') return;
        setIntroStage('booting');
        if (introRef.current) {
            gsap.to(introRef.current, { opacity: 1, duration: 0.1 });
        }
        introLoadedRef.current = true;
        void loadTrack('catalog', 0, undefined, { deferPlay: true });
    };

    useEffect(() => {
        if (introStage !== 'booting') return;
        const timer = window.setTimeout(() => {
            finishIntro();
        }, 3000);
        return () => window.clearTimeout(timer);
    }, [introStage, finishIntro]);

    const togglePlay = async () => {
        if (!audioRef.current?.src || audioRef.current.src === window.location.href) {
            await loadTrack(activeSource, activeSource === 'user' ? userIndex : currentBeatIndex);
            return;
        }
        const playing = audioManager.toggle();
        setIsPlaying(playing);
    };

    const seekToPercent = (percent: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        const safeDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
        if (safeDuration <= 0) return;
        const clampedPercent = Math.min(100, Math.max(0, percent));
        audio.currentTime = (clampedPercent / 100) * safeDuration;
        setCurrentTime(audio.currentTime);
        setProgress(clampedPercent);
    };

    const seekBy = (deltaSeconds: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        const safeDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
        if (safeDuration <= 0) return;
        audio.currentTime = Math.min(safeDuration, Math.max(0, audio.currentTime + deltaSeconds));
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / safeDuration) * 100);
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !audioRef.current) return;

        const title = file.name.replace(/\.[^/.]+$/, '');
        const objectUrl = URL.createObjectURL(file);
        const nextIndex = userTracks.length;
        const nextTrack: UserTrack = {
            id: String(nextIndex + 1).padStart(2, '0'),
            title,
            subtitle: 'USER UPLOAD',
            bpm: '',
            year: new Date(file.lastModified).getFullYear().toString(),
            audioFile: objectUrl,
            objectUrl
        };

        setUserTracks(prev => [...prev, nextTrack]);
        setUserIndex(nextIndex);
        setSource('user');
        setIsCustomMode(true);
        setDetectedBPM(0);
        setShowUI(true);

        await loadTrack('user', nextIndex, nextTrack);
        e.currentTarget.value = '';
    };

    const font = {
        main: { fontFamily: '"IBM Plex Mono", ui-monospace, monospace' },
        mono: { fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const }
    };

    useEffect(() => {
        const media = window.matchMedia('(max-width: 720px)');
        const applyViewportState = (matches: boolean) => {
            setIsMobileViewport(matches);
            if (!matches) {
                setShowUI(true);
                setShowLibraryPanel(true);
                return;
            }
            if (!mobileInitRef.current && !showIntro) {
                setShowUI(false);
                setShowLibraryPanel(false);
                mobileInitRef.current = true;
            }
        };

        applyViewportState(media.matches);
        const onChange = (event: MediaQueryListEvent) => applyViewportState(event.matches);
        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', onChange);
            return () => media.removeEventListener('change', onChange);
        }
        media.addListener(onChange);
        return () => media.removeListener(onChange);
    }, [showIntro]);

    useEffect(() => {
        if (isCustomMode) {
            setColor1(customColor1);
            setColor2(customColor2);
        }
    }, [customColor1, customColor2, isCustomMode, setColor1, setColor2]);

    const handleCatalogButton = () => {
        if (isMobileViewport) {
            if (activeSource === 'catalog') {
                setShowLibraryPanel(prev => !prev);
                return;
            }
            setShowLibraryPanel(true);
        }
        void loadTrack('catalog', currentBeatIndex);
    };

    const handleUploadsButton = () => {
        if (userTracks.length === 0) return;
        if (isMobileViewport) {
            if (activeSource === 'user') {
                setShowLibraryPanel(prev => !prev);
                return;
            }
            setShowLibraryPanel(true);
        }
        void loadTrack('user', userIndex);
    };

    const introPortal = showIntro ? createPortal(
        <div ref={introRef} className={`intro-shell ${introStage === 'booting' ? 'is-booting' : ''}`}>
            <div className="intro-frame">
                <div className="intro-name">808ILIAS</div>
                <div className="intro-meta">BEATS 2019-2026</div>
                <button className="intro-enter" onClick={enterArchive}>
                    ENTER
                </button>
            </div>

            {introStage === 'booting' && (
                <div className="intro-terminal">
                    <div className="intro-terminal-bar">
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className="intro-terminal-body">
                        <div className="intro-terminal-line">npm start</div>
                        <div className="intro-terminal-line">booting audio system...</div>
                        <div className="intro-terminal-line">loading archive</div>
                        <div className="intro-terminal-line">launching visualizer</div>
                        <div className="intro-terminal-line intro-terminal-success">compiled in 0.7s</div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    ) : null;

    // ARCHIVE
    const hudPortal = !showIntro ? createPortal(
        <div className="hud-root" style={{ position: 'fixed', inset: 0, zIndex: 2000, color: '#fff', pointerEvents: 'none' }}>
            <div className="hud-mobile-shell">
                {/* Toggle Button - always visible */}
                <button onClick={() => setShowUI(!showUI)} className="hud-toggle" style={{
                    position: 'absolute', top: 20, left: 20, ...font.mono,
                    background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', padding: '8px 14px', cursor: 'pointer', pointerEvents: 'auto',
                    transition: 'all 0.2s'
                }}>{showUI ? 'HIDE' : 'SHOW'}</button>

                {/* Main HUD */}
                <div
                    className="hud-main"
                    style={{
                        opacity: showUI ? 1 : 0,
                        transform: showUI ? 'translateY(0)' : 'translateY(20px)',
                        pointerEvents: showUI ? 'auto' : 'none',
                        transition: 'opacity 0.2s ease, transform 0.2s ease'
                    }}
                >
                    <HudTopBar
                        activeSource={activeSource}
                        userTracksLength={userTracks.length}
                        currentBeatIndex={currentBeatIndex}
                        userIndex={userIndex}
                        font={font}
                        onLoadCatalog={() => handleCatalogButton()}
                        onLoadUser={() => handleUploadsButton()}
                        onToggleColors={() => setShowColorPanel(!showColorPanel)}
                        onUploadClick={() => fileInputRef.current?.click()}
                    />

                    <ColorPanel
                        show={showColorPanel}
                        customColor1={customColor1}
                        customColor2={customColor2}
                        isCustomMode={isCustomMode}
                        font={font}
                        onColor1={setCustomColor1}
                        onColor2={setCustomColor2}
                        onApply={() => { setColor1(customColor1); setColor2(customColor2); setIsCustomMode(true); }}
                        onReset={() => { setIsCustomMode(false); setColor1(currentBeat.color1); setColor2(currentBeat.color2); }}
                    />

                    {showLibraryPanel && (
                        <TrackSidebar
                            activeSource={activeSource}
                            currentBeatIndex={currentBeatIndex}
                            userTracks={userTracks}
                            userIndex={userIndex}
                            onLoadCatalog={(index) => {
                                if (isMobileViewport) setShowLibraryPanel(false);
                                void loadTrack('catalog', index);
                            }}
                            onLoadUser={(index) => {
                                if (isMobileViewport) setShowLibraryPanel(false);
                                void loadTrack('user', index);
                            }}
                        />
                    )}

                    <BottomHud
                        progress={progress}
                        currentTime={currentTime}
                        duration={duration}
                        trackInfoRef={trackInfoRef}
                        bpmRef={bpmRef}
                        detectedBPM={detectedBPM}
                        currentTrack={currentTrack}
                        activeSource={activeSource}
                        userIndex={userIndex}
                        currentBeatId={currentBeat?.id ?? '--'}
                        currentBeatIndex={currentBeatIndex}
                        userTracksLength={userTracks.length}
                        catalogLength={CATALOG.length}
                        trackLabel={trackLabel}
                        font={font}
                        isPlaying={isPlaying}
                        onPrev={() => void loadTrack(activeSource, activeSource === 'user' ? userIndex - 1 : currentBeatIndex - 1)}
                        onNext={() => void loadTrack(activeSource, activeSource === 'user' ? userIndex + 1 : currentBeatIndex + 1)}
                        onTogglePlay={togglePlay}
                        onSeekPercent={seekToPercent}
                        onSeekBy={seekBy}
                    />
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFile} accept="audio/*" style={{ display: 'none' }} />
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            {introPortal}
            {hudPortal}
        </>
    );
};
