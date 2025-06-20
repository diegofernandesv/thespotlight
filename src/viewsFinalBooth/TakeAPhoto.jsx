import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import ContinueBlack from "../components/buttons/ContinueBlack";
import styles from "./TakeAPhoto.module.css";
import { useNavigate } from "react-router-dom";
import { supabase, uploadPhotoToSupabase, updateTicketImages } from "../supabaseClient";

const TakeAPhoto = () => {
    const webcamRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const navigate = useNavigate();
    // Load photo from localStorage on mount
    useEffect(() => {
        // No need to load from localStorage
    }, []);

    const capturePhoto = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPhoto(imageSrc);

        // UPLOAD TO SUPABASE
        const publicUrl = await uploadPhotoToSupabase(imageSrc);

        // Update images jsonb column in ticket_table
        if (publicUrl) {
            let ticketNumber = localStorage.getItem('ticket_number');
            if (ticketNumber) ticketNumber = parseInt(ticketNumber, 10);
            if (ticketNumber && !isNaN(ticketNumber)) {
                const result = await updateTicketImages(ticketNumber, publicUrl);
                console.log('updateTicketImages result:', result);
            } else {
                console.warn('No valid ticket_number found in localStorage.');
            }
        }
    };
    

    const retakePhoto = () => {
        setPhoto(null);
        localStorage.removeItem('capturedPhoto');
    }

    const startCountdown = () => {
        setIsCountingDown(true);
        setCountdown(3);
        let counter = 3;

        const interval = setInterval(() => {
            counter -= 1;
            setCountdown(counter);
            if (counter === 0) {
                clearInterval(interval);
                setIsCountingDown(false);
                capturePhoto();
            }
        }, 1000);
    };

    const videoConstraints = {
        width: 534,
        height: 667,
        facingMode: 'user',
    };

    return (
        <div className={styles.wrapper}>
           
            {!photo ? (
                <div className={styles.videoContainer}>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        videoConstraints={videoConstraints}
                        className={styles.webcamFeed}
                    />
                    {isCountingDown && (
                        <div className={styles.countdownOverlay}>
                            <span className={styles.countdownNumber}>{countdown}</span>
                        </div>
                    )}
                    {!isCountingDown && (
                        <div className={styles.buttonWrapper}>
                            <ContinueBlack onClick={startCountdown}>
                                Take a Picture
                            </ContinueBlack>
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.imageContainer}>
                    <img src={photo} alt="Captured" className={styles.imageTaken} />
                    <div className={styles.buttonWrapper}>
                        <ContinueBlack
                            onClick={retakePhoto}
                        >
                            Retake the Picture
                        </ContinueBlack>
                    </div>
                </div>
            )}
            <div className={styles.continueBtnWrapper} >
                <ContinueBlack onClick={() => navigate("/quote")} ></ContinueBlack>
            </div>
            
        </div>
    );
};

export default TakeAPhoto;
