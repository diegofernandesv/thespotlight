import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Continue from '../componentsf/buttons/Continue';
import ProgressBar from '../componentsf/ProgressBar';
import styles from './Wrapped.module.css';
import { supabase } from '../supabaseClient';
import wrapped2 from '../assets/wrapped2.png';

const Wrapped2 = () => {
  const [timeSpent, setTimeSpent] = useState({ minutes: 0, seconds: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimeSpent = async () => {
      // Get ticket number from localStorage
      const ticketNumber = localStorage.getItem('ticket_number');
      if (!ticketNumber) {
        console.warn('No ticket number found in localStorage.');
        return;
      }
      const { data, error } = await supabase
        .from('ticket_table')
        .select('answers')
        .eq('ticket_number', ticketNumber)
        .single();

      if (error) {
        console.error('Error fetching ticket:', error);
        return;
      }

      const answers = data.answers;

      if (answers?.Q1?.timestamp && answers?.Q12?.timestamp) {
        const start = new Date(answers.Q1.timestamp);
        const end = new Date(answers.Q12.timestamp);

        const durationMs = end - start;
        const durationSec = Math.floor(durationMs / 1000);
        const minutes = Math.floor(durationSec / 60);
        const seconds = durationSec % 60;

        setTimeSpent({ minutes, seconds });
      } else {
        console.warn('Timestamps for Q1 or Q12 are missing.');
      }
    };

    fetchTimeSpent();
  }, []);

  // Helper to get percentage based on time spent
  const getPercent = () => {
    const totalSeconds = timeSpent.minutes * 60 + timeSpent.seconds;
    if (totalSeconds >= 600) return 99;
    if (totalSeconds >= 180) return 70;
    if (totalSeconds >= 90) return 50;
    // Interpolate between 0 and 90s: 0% to 49%
    if (totalSeconds < 90) return Math.floor((totalSeconds / 90) * 49);
    // Interpolate between 90s and 180s: 50% to 69%
    if (totalSeconds < 180) return 50 + Math.floor(((totalSeconds - 90) / 90) * 19);
    // Interpolate between 180s and 600s: 70% to 98%
    return 70 + Math.floor(((totalSeconds - 180) / 420) * 29);
  };

  return (
    <div className={styles.container} style={{
      backgroundImage: `url(${wrapped2})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}>
      <div className={styles.progressBarContainer}>
        <ProgressBar totalSteps={3} currentStep={2} />
      </div>
    <div className ={styles.textContainer}>
      <h1 className={`${styles.title2} ${styles.blueGradient}`}>
        You spent {timeSpent.minutes} min {timeSpent.seconds} sec <br />
        reflecting in the <br />Spotlight booth.
      </h1>
      <p className={styles.stat2}>
        {`That's more time than ${getPercent()}% of visitors.`}
      </p>
      </div>
      <Continue onClick={() => navigate('/wrapped3')}>Continue</Continue>
    </div>
    
  );
};

export default Wrapped2;

