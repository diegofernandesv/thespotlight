import ourNatureVideo from '../assets/ournature2.mov';
import { useRef, useState } from 'react';

export default function Video() {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setPlaying(true);
            } else {
                videoRef.current.pause();
                setPlaying(false);
            }
        }
    };

    return (
        <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', background: '#000', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}
            onClick={handlePlayPause}
        >
            <video
                ref={videoRef}
                src={ourNatureVideo}
                controls={playing}
                style={{ maxWidth: '820px', maxHeight: '1180px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
                playsInline
            >
                Sorry, your browser does not support embedded videos.
            </video>
            {!playing && (
                <button
                    onClick={e => { e.stopPropagation(); handlePlayPause(); }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(255,255,255,0.92)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 100,
                        height: 100,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                        zIndex: 2
                    }}
                >
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="30" fill="#fff" fillOpacity="0.85"/>
                        <polygon points="24,18 46,30 24,42" fill="#171B1C" />
                    </svg>
                </button>
            )}
        </div>
    );
}