import { useState, useEffect } from "react";
import ContinueBlack from "../components/buttons/ContinueBlack";
import styles from "./PhotoFilters.module.css";

import australia from "../assets/bg_images/australia.png";
import coastal from "../assets/bg_images/coastal.png";
import danish from "../assets/bg_images/danish.png";
import mountains from "../assets/bg_images/mountains.png";
import safari from "../assets/bg_images/safari.png";
import winter from "../assets/bg_images/winter.png";
import museumLogo from "../assets/museum_logo.png";
import { supabase } from "../supabaseClient";

const PhotoFilters = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const quote = localStorage.getItem('renderedQuote');
  const [selectedBg, setSelectedBg] = useState(0);

  useEffect(() => {
    const fetchPhoto = async () => {
      let ticketNumber = localStorage.getItem('ticket_number');
      if (ticketNumber) ticketNumber = parseInt(ticketNumber, 10);
      if (ticketNumber && !isNaN(ticketNumber)) {
        const { data, error } = await supabase
          .from('ticket_table')
          .select('images')
          .eq('ticket_number', ticketNumber)
          .single();
        if (!error && data && Array.isArray(data.images) && data.images.length > 0) {
          setPhoto(data.images[data.images.length - 1]); // Use the latest image
        }
      }
      setLoading(false);
    };
    fetchPhoto();
  }, []);

  const backgroundImages = [
    { image: winter, color: "#439FE0" },
    { image: safari, color: "#F17D10" },
    { image: coastal, color: "#DCA10D" },
    { image: australia, color: "#F23F3A" },
    { image: mountains, color: "#6A9E21" },
    { image: danish, color: "#6A9E21" },
  ];

  const selected = selectedBg !== null ? backgroundImages[selectedBg] : null;

  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundImage: selected ? `url(${selected.image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background 0.3s ease",
      }}
    >
      <div className={styles.cardWrapper}>
        {loading ? (
          <p>Loading image...</p>
        ) : (
          <img src={photo} alt="User Photo" />
        )}
        <h2
          className={styles.title}
          style={{ color: selected ? selected.color : "#000" }}
        >
          The Protagonist
        </h2>
        <p className={styles.quote}>{quote}</p>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <h3>Core Values</h3>
            <ul>
              <li>Empathy</li>
              <li>Enthusiasm</li>
              <li>Positivity</li>
            </ul>
          </div>
          <div className={styles.content}>
            <h3>Time in Booths</h3>
            <p>20 min 37 sec.</p>
          </div>
        </div>
        <div className={styles.logoWrapper}>
          <img src={museumLogo} alt="museum logo" />
          <p>#intothespotlight</p>
        </div>
      </div>

      {/* Background Selectors */}
      <div className={styles.bgSelectorsWrapper}>
        {backgroundImages.map((bg, index) => (
          <div
            key={index}
            className={styles.backgroundSelector}
            style={{
              backgroundImage: `url(${bg.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: selectedBg === index ? "3px solid #FFFFFF" : "3px solid rgb(124, 124, 124)",
            }}
            onClick={() => setSelectedBg(index)}
          />
        ))}
      </div>

      <ContinueBlack />
    </div>
  );
};

export default PhotoFilters;
