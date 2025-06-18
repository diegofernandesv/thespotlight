import styles from "./PhotoOption.module.css";
import ContinueBlack from "../components/buttons/ContinueBlack";
import DeclineBlack from "../components/buttons/DeclineBlack";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import img from "../assets/img_icon.svg"
import bg from "../assets/bg_images/danish.png";
import arrow from "../assets/arrow_no_tail.svg"
const PhotoOption = () => {
    const [declined, setDeclined] = useState(false);
    const navigate = useNavigate();
    if (declined) {
        return (
            <div 
                className={styles.altWrapper}
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "background 0.3s ease",
                }}
            >
                <p>Thank you for stepping into the </p>
                <h1>SPOTLIGHT</h1>
                <div 
                    className={styles.backBtn} 
                    onClick={() => navigate("/final-booth/start")}
                >
                    <img src={arrow} alt="arrow" />
                    <p>Back</p>
                </div>
                
            </div>
        );
    }
    return (
        <div className={styles.wrapper}>
            <img src={img} alt="img icon" />
            <p>Would you like to take a picture to remember this experience?</p>
            <div className={styles.btnWrapper}>
                <DeclineBlack onClick={() => setDeclined(true)}>No</DeclineBlack>
                <ContinueBlack onClick={() => navigate("/photo")}>Yes</ContinueBlack>
            </div>
        </div>
    );
}
 
export default PhotoOption;