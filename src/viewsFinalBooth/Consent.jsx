import { useState } from "react";
import styles from "./Consent.module.css";
import ContinueBlack from "../components/buttons/ContinueBlack";
import DeclineBlack from "../components/buttons/DeclineBlack";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase, uploadPhotoToSupabase, updateTicketImages } from "../supabaseClient";

const Consent = () => {
    const [declined, setDeclined] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const photo = location.state?.photo;

    const handleConsent = async () => {
        let ticketNumber = localStorage.getItem('ticket_number');
        if (ticketNumber) ticketNumber = parseInt(ticketNumber, 10);
        if (ticketNumber && !isNaN(ticketNumber)) {
            // Upload photo and update images array
            if (photo) {
                const publicUrl = await uploadPhotoToSupabase(photo);
                if (publicUrl) {
                    const updated = await updateTicketImages(ticketNumber, publicUrl);
                    if (!updated) {
                        console.error('Failed to update images array for ticket', ticketNumber);
                    }
                } else {
                    console.error('Failed to upload photo to Supabase Storage');
                }
            }
            // Set consent true
            const { error } = await supabase
                .from('ticket_table')
                .update({ consent: true })
                .eq('ticket_number', ticketNumber);
            if (error) {
                console.error('Error updating consent:', error);
            } else {
                console.log('Consent updated successfully for ticket', ticketNumber);
            }
        }
        navigate("/filters");
    };

    if (declined) {
        return (
            <div className={styles.wrapper}>
                <h1>Thank you for your participation!</h1>
                <ContinueBlack onClick={() => navigate("/final-booth/start")}>Finish</ContinueBlack>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h1>Great shot! Would you like your photo and thoughts to be featured in the museum's exhibition experience?</h1>
            <p>This will display your picture as part of the exhibition experience. It will only be visible here today and won't be stored or shared elsewhere.</p>
            <div className={styles.btnWrapper}>
                <DeclineBlack onClick={() => setDeclined(true)}>No</DeclineBlack>
                <ContinueBlack onClick={handleConsent}>Yes</ContinueBlack>
            </div>
        </div>
    );
};

export default Consent;
