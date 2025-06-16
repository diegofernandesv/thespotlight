
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContinueBlack from "../components/buttons/ContinueBlack";
import WebcamParticles from "../components/WebcamParticles";
import styles from "./MainScreen.module.css";
import arrowIcon from "../assets/arrow.svg";

const MainScreen = () => {

     
    const [stage, setStage] = useState(0); // 0 = intro, 1 = after continue, 2 = after screen click
    const navigate = useNavigate();

    const handleContinue = () => {
        setStage(1);
    };

    const handleScreenClick = () => {
        if (stage === 1) {
            setStage(2);
        } else if (stage === 2) {
            navigate("/thespotlight/quiz");
        }
    };
    return (
        <div className={styles.wrapper} onClick={handleScreenClick}>
            <div className={styles.webcamWrapper}>
                <WebcamParticles />
            </div>
            <div className={styles.content}>
                 {stage === 0 && (
                    <>
                        <div className={styles.headingsWrapper}>
                            <h2>Step into the</h2>
                            <h1>SPOTLIGHT</h1>
                        </div>
                        <p>
                            Find out what matters to others like you and get a chance to
                            shine the light on things that are important to you.
                        </p>
                        <ContinueBlack onClick={handleContinue} />
                    </>
                )}

                {stage === 1 && (
                    <div className={styles.explination}>
                        <div className={styles.arrow}>
                            <img src={arrowIcon} alt="Arrow Icon" />
                        </div>
                        
                        <p className={styles.centerdText}>On your left, you’ll hear a real story — a personal reflection from someone in Denmark who has wrestled with the same issues explored in this exhibition.</p>
                    </div>
                )}

                {stage === 2 && (
                    <div className={styles.explination}>
                        <div className={styles.arrow}>
                            <img className={styles.rightArrow} src={arrowIcon} alt="Arrow Icon" />
                        </div>
                        
                        <p className={styles.centerdText}>On your right, you’ll find a quiz filled with thought-provoking questions and surprising facts. There are no right or wrong answers — just your perspective.</p>
                    </div>
                )}

                
            </div>
        </div>
    );
}
 
export default MainScreen;