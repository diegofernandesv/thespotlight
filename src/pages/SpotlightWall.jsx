import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import styles from "./SpotlightWall.module.css";

const PLACEHOLDER_PORTRAITS = [
  {
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "I stand up for Clean air & water because small actions create big ripples."
  },
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "Endangered species matter to me because a balanced planet benefits everyone."
  },
  {
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    quote: "The world needs more Awareness because it drives positive change."
  },
  {
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    quote: "Forests matter to me because they support our well-being."
  },
  {
    image: "https://randomuser.me/api/portraits/men/51.jpg",
    quote: "The world needs more Empathy because we protect what we understand."
  },
  {
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote: "Coral reefs matter to me because they hold solutions for the future."
  },
  {
    image: "https://randomuser.me/api/portraits/men/61.jpg",
    quote: "Biodiversity matters to me because we learn from nature's resilience."
  },
  {
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    quote: "The world needs more Curiosity because nature thrives when we care."
  },
  {
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    quote: "I stand up for Wildlife protection because the planet gives, we must give back."
  },
  {
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    quote: "I stand up for Clean air & water because small actions create big ripples."
  },
  {
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    quote: "The world needs more Empathy because we protect what we understand."
  },
  {
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    quote: "I stand up for Clean air & water because small actions create big ripples."
  },
  {
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    quote: "Forests matter to me because they support our well-being."
  },
  {
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    quote: "The world needs more Awareness because it drives positive change."
  },
  {
    image: "https://randomuser.me/api/portraits/women/34.jpg",
    quote: "Coral reefs matter to me because they hold solutions for the future."
  },
  {
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    quote: "Biodiversity matters to me because we learn from nature's resilience."
  },
  {
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    quote: "The world needs more Curiosity because nature thrives when we care."
  },
  {
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    quote: "I stand up for Wildlife protection because the planet gives, we must give back."
  },
  {
    image: "https://randomuser.me/api/portraits/women/51.jpg",
    quote: "I stand up for Clean air & water because small actions create big ripples."
  },
  {
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    quote: "The world needs more Empathy because we protect what we understand."
  },
  // ...add more as needed
];

const NUM_COLUMNS = 7;
const NUM_ROWS = 6; // adjust as needed for your wall height
const TOTAL_CARDS = NUM_COLUMNS * NUM_ROWS;

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

      let realEntries = [];
      if (!error && data) {
        realEntries = data
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

      // Fill up to TOTAL_CARDS with placeholders
      let allEntries = [...realEntries];
      let placeholderIndex = 0;
      while (allEntries.length < TOTAL_CARDS) {
        allEntries.push(PLACEHOLDER_PORTRAITS[placeholderIndex % PLACEHOLDER_PORTRAITS.length]);
        placeholderIndex++;
      }
      setEntries(allEntries);
    };
    fetchEntries();
  }, []);

  // Arrange entries into columns for column-major order
  const columns = Array.from({ length: NUM_COLUMNS }, (_, colIdx) =>
    entries.filter((_, idx) => idx % NUM_COLUMNS === colIdx)
  );

  return (
    <div className={styles.wallGrid} style={{ gridTemplateColumns: `repeat(${NUM_COLUMNS}, 1fr)` }}>
      {columns.map((col, colIdx) => (
        <div key={colIdx} className={styles.wallColumn}>
          {col.map((entry, rowIdx) => (
            <div key={rowIdx} className={styles.wallCard}>
              <img src={entry.image} alt="Spotlight" className={styles.wallImage} />
              <p className={styles.wallQuote}>{entry.quote}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SpotlightWall; 