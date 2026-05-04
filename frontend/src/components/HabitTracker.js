import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';
import './HabitTracker.css';

const HabitTracker = () => {
  // We'll use a hardcoded user ID for this example, but in a real app
  // this would come from your authentication system
  const USER_ID = 'user123';

  // --- State Variables ---
  const [habits, setHabits] = useState([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // --- 1. Fetch Habits from Backend ---
  const fetchHabits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/habits/${USER_ID}`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch habits');
      }

      setHabits(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [USER_ID]);

  // Fetch habits when the component first loads
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // --- 2. Add a New Habit ---
  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newHabitTitle,
          userId: USER_ID
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create habit');
      }

      // Add the newly created habit to our local state
      setHabits(prevHabits => [...prevHabits, result.data]);
      setNewHabitTitle(''); // Clear the input
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // --- 3. Mark a Habit as Completed ---
  const handleCompleteHabit = async (habitId) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/habits/${habitId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completionDate: new Date().toISOString()
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to complete habit');
      }

      // If the backend returns warnings (e.g. RAPID_UPDATES), we could show an alert
      if (result.warnings && result.warnings.length > 0) {
        alert(`Warning: ${result.warnings[0].message}`);
      }

      // Update the specific habit in our local state
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit._id === habitId ? result.data : habit
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="habit-tracker-container">
      <div className="habit-tracker-card glass-panel">
        <header className="tracker-header">
          <h2>My Habits</h2>
          <p>Track your daily routines</p>
        </header>

        {/* Display Error Message if any */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Form to Add New Habit */}
        <form onSubmit={handleAddHabit} className="add-habit-form">
          <input
            type="text"
            placeholder="What habit do you want to build?"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            disabled={actionLoading || isLoading}
            className="habit-input"
          />
          <button 
            type="submit" 
            disabled={!newHabitTitle.trim() || actionLoading || isLoading}
            className="add-button"
          >
            {actionLoading ? 'Adding...' : 'Add Habit'}
          </button>
        </form>

        {/* Loading State */}
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your habits...</p>
          </div>
        ) : (
          /* List of Habits */
          <div className="habits-list">
            {habits.length === 0 ? (
              <div className="empty-state">
                <p>No habits found. Start by adding one above!</p>
              </div>
            ) : (
              habits.map((habit) => (
                <div key={habit._id} className="habit-item">
                  <div className="habit-info">
                    <h3>{habit.title}</h3>
                    <span className="habit-streak">
                      Completed {habit.datesCompleted?.length || 0} times
                    </span>
                  </div>
                  <button
                    onClick={() => handleCompleteHabit(habit._id)}
                    disabled={actionLoading}
                    className="complete-button"
                  >
                    Mark Complete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
