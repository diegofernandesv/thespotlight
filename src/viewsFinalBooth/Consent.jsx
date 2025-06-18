import { useState } from "react";
import styles from "./Consent.module.css";
import ContinueBlack from "../components/buttons/ContinueBlack";
import DeclineBlack from "../components/buttons/DeclineBlack";
import { useNavigate } from "react-router-dom";

const Consent = () => {
    const [declined, setDeclined] = useState(false);
    const navigate = useNavigate();
    
    if (declined) {
        return (
            <div className={styles.wrapper}>
                <h1>Thank you for your participation!</h1>
                <ContinueBlack>Finish</ContinueBlack>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h1>Great shot! Would you like your photo and thoughts to be featured in the museum’s exhibition experience?</h1>
            <p>This will display your picture as part of the exhibition experience. It will only be visible here today and won’t be stored or shared elsewhere.</p>
            <div className={styles.btnWrapper}>
                <DeclineBlack onClick={() => setDeclined(true)}>No</DeclineBlack>
                <ContinueBlack onClick={() => navigate("/filters")}>Yes</ContinueBlack>
            </div>
        </div>
    );
};

export default Consent;
