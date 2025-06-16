import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Continue from '../componentsf/buttons/Continue';
import ProgressBar from '../componentsf/ProgressBar';
import styles from './Wrapped.module.css';

// Import exhibition images
import africa from '../assets/africa.png';
import ourNature from '../assets/ournature.png';
import oops from '../assets/oops.png';
import globalBackyard from '../assets/globalbackyard.png';

const Wrapped = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalStairs, setTotalStairs] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExhibitionData = async () => {
      try {
        // Get only the most recent ticket
        const { data: ticketData, error } = await supabase
          .from('ticket_table')
          .select('exhibition_id')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (ticketData && ticketData.length > 0) {
          console.log('Raw ticket data:', ticketData[0]); // Debug log
          
          // Get the exhibition_id from the single ticket
          const exhibitionId = ticketData[0].exhibition_id;
          
          // Set the exhibitions array to include both Our Nature and Final Booth
          setExhibitions(['Our Nature', 'Final Booth']);

          // Here you would normally fetch the actual animal count, distance, and stairs data
          // For now using placeholder data
          setTotalAnimals(48);
          setTotalDistance(400);
          setTotalStairs(94);
        }
      } catch (error) {
        console.error('Error fetching exhibition data:', error);
      }
    };

    fetchExhibitionData();
  }, []);

  const getExhibitionImage = (exhibitionId) => {
    switch (exhibitionId) {
      case 'Africa':
        return africa;
      case 'Our Nature':
        return ourNature;
      case 'Oops':
        return oops;
      case 'Global Backyard':
        return globalBackyard;
      case 'Final Booth':
        return globalBackyard;
      default:
        return null;
    }
  };  return (
    <div className={styles.container}>
      <div className={styles.progressBarContainer}>
        <ProgressBar totalSteps={4} currentStep={1} />
      </div>
      <div className={styles.exhibitionsGrid}>
        {exhibitions.map((exhibition, index) => (
          <div key={index} className={styles.exhibitionCard}>
            <img
              src={getExhibitionImage(exhibition)}
              alt={exhibition}
              className={styles.exhibitionImage}
            />
            <p className={styles.exhibitionName}>{exhibition}</p>
          </div>
        ))}
      </div>

      <h1 className={styles.title}>
        You have visited {exhibitions.length} <br /> different exhibitions
      </h1>

      <div className={styles.statsContainer}>
        <p className={styles.stat}>
          You spotted {totalAnimals} unique animals.
        </p>
        <p className={styles.stat}>
          Walked {totalDistance} metres and used {totalStairs} stairs
        </p>
        <p className={styles.note}>
          (if you didn't use the elevator)
        </p>
      </div>

      <Continue onClick={() => navigate('/final-booth/question-view')}>
        Continue
      </Continue>
    </div>
  );
};

export default Wrapped;