import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import styles from "./SpotlightWall.module.css";

const SpotlightWall = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("ticket_table")
        .select("images, quote")
        .eq("consent", true)
        .not("images", "is", null)
        .not("quote", "is", null);

      let filtered = [];
      if (!error && data) {
        filtered = data
          .filter(
            (row) =>
              Array.isArray(row.images) &&
              row.images.length > 0 &&
              row.quote &&
              row.quote.quote
          )
          .map((row) => ({
            image: row.images[row.images.length - 1],
            quote: row.quote.quote,
          }));
      }

      // If no real entries, add some random placeholders
      if (filtered.length === 0) {
        filtered = [
          {
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400&q=80",
            quote: "“I stand up for animal welfare because nature has no voice but we do.”"
          },
          {
            image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&q=80",
            quote: "“Biodiversity matters to me because every species has value.”"
          },
          {
            image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400&q=80",
            quote: "“The world needs more empathy because it builds lasting impact.”"
          },
        ];
      }

      setEntries(filtered);
    };

    fetchEntries();
  }, []);

  return (
    <div className={styles.wallGrid}>
      {entries.map((entry, idx) => (
        <div key={idx} className={styles.wallCard}>
          <img src={entry.image} alt="Spotlight" className={styles.wallImage} />
          <p className={styles.wallQuote}>{entry.quote}</p>
        </div>
      ))}
    </div>
  );
};

export default SpotlightWall; 