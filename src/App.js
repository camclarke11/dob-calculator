// App.js

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [dob, setDob] = useState('');
  const [elapsed, setElapsed] = useState({
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
    calculated: false, // Flag to track if calculation has been performed
  });

  const calculateTimeElapsed = useCallback(() => {
    const dobDate = new Date(dob);
    const now = new Date();
    const difference = now - dobDate;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24)).toLocaleString();
      const hours = Math.floor(difference / (1000 * 60 * 60)).toLocaleString();
      const minutes = Math.floor(difference / (1000 * 60)).toLocaleString();
      const seconds = Math.floor(difference / 1000).toLocaleString();

      setElapsed({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        calculated: true, // Set calculated flag to true
      });
    } else {
      setElapsed({
        days: 'Please enter a valid past date.',
        hours: '',
        minutes: '',
        seconds: '',
        calculated: false, // Set calculated flag to false
      });
    }
  }, [dob]); // Added dob as dependency

  useEffect(() => {
    let timer; // Variable to store the interval timer

    // Start the interval timer only if calculation has been performed
    if (elapsed.calculated) {
      timer = setInterval(() => {
        calculateTimeElapsed();
      }, 1000);
    }

    // Clean up the interval timer when component unmounts or when calculation is clicked again
    return () => clearInterval(timer);
  }, [elapsed.calculated, calculateTimeElapsed]); // Re-run effect when calculation status changes or calculateTimeElapsed changes

  const handleCalculateClick = () => {
    calculateTimeElapsed();
    const button = document.getElementById('calculate-button');
    button.classList.add('button-clicked');
    setTimeout(() => {
      button.classList.remove('button-clicked');
    }, 300); // Remove the class after the animation duration
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { currentTarget: el, clientX: x, clientY: y } = e;
      const { top: t, left: l, width: w, height: h } = el.getBoundingClientRect();
      el.style.setProperty('--posX',  x-l-w/2);
      el.style.setProperty('--posY',  y-t-h/2);
    };
    
    document.body.addEventListener("pointermove", handleMouseMove);
    
    return () => {
      document.body.removeEventListener("pointermove", handleMouseMove);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <button id="calculate-button" onClick={handleCalculateClick}>Calculate</button>
        <p>You have been alive for:</p>
        {elapsed.calculated && (
          <>
            <p>{elapsed.days} days</p>
            <p>or</p>
            <p>{elapsed.hours} hours</p>
            <p>or</p>
            <p>{elapsed.minutes} minutes</p>
            <p>or</p>
            <p>{elapsed.seconds} seconds</p>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
