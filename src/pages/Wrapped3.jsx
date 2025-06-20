import React, { useEffect, useState } from 'react';
import styles from './Wrapped.module.css';
import Continue from '../componentsf/buttons/Continue';
import { supabase } from '../supabaseClient';
import ProgressBar from '../componentsf/ProgressBar';

// This is Step 4: real API call
async function generateSummaryText(answers) {
  try {
    const response = await fetch('http://localhost:3001/api/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return data.summary || 'Could not generate summary.';
    } catch (jsonErr) {
      // Not valid JSON, show server error message
      return text.startsWith('The server') ? 'Server error: OpenAI API key is missing or misconfigured.' : 'Unexpected server error.';
    }
  } catch (err) {
    return 'Failed to contact summary server.';
  }
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
        <Continue onClick={() => window.location.href = '/'}>Continue</Continue>
      </div>
    </div>
  );
};

export default Wrapped3;
