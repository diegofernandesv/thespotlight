import React, { useEffect, useState } from 'react';
import styles from './Wrapped.module.css';
import Continue from '../componentsf/buttons/Continue';
import { supabase } from '../supabaseClient';
import ProgressBar from '../componentsf/ProgressBar';

// Dummy function for ChatGPT text generation (replace with real API call)
async function generateSummaryText(answers) {
  return `Through your journey today, you've shown a curious mind, an open heart, and a thoughtful connection to the world around you. Each choice you made — from embracing randomness to reflecting on nature’s rhythms — reveals how you see yourself as part of something larger. You care about the balance between learning and feeling, between global challenges and personal responsibility.`;
}

const Wrapped3 = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnswersAndGenerateText = async () => {
      let ticketNumber = localStorage.getItem('ticket_number');
      if (ticketNumber) ticketNumber = parseInt(ticketNumber, 10);
      if (!ticketNumber || isNaN(ticketNumber)) {
        setSummary('Could not find your ticket.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('ticket_table')
        .select('answers')
        .eq('ticket_number', ticketNumber)
        .single();

      if (error || !data) {
        setSummary('Could not load your answers.');
        setLoading(false);
        return;
      }

      const text = await generateSummaryText(data.answers);
      setSummary(text);
      setLoading(false);
    };

    fetchAnswersAndGenerateText();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.progressBarContainer}>
        <ProgressBar totalSteps={3} currentStep={3} />
      </div>
      <div className={styles.title3}>And this...</div>
      <div className={styles.textBox}>
        {loading ? 'Loading...' : summary}
      </div>
      <div className={styles.continueButton3}>
        <Continue onClick={() => window.location.href = '/thespotlight/photoOption'}>Continue</Continue>
      </div>
    </div>
  );
};

export default Wrapped3;

