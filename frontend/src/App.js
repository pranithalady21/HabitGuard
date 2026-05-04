import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';
import './App.css';

function App() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchHabits(); }, []);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/habits`);
      const result = await response.json();
      if (result.success) setHabits(result.data);
      else setError(result.message);
    } catch (err) {
      setError('Backend is waking up, please wait 30 seconds and try again...');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/habits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newHabit.trim() })
      });
      const result = await response.json();
      if (result.success) {
        setHabits([result.data, ...habits]);
        setNewHabit('');
      }
    } catch (err) { setError('Backend is waking up, please wait 30 seconds and try again...'); }
  };

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/habits/${id}/complete`, { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        setHabits(habits.map(h => h._id === id ? result.data : h));
      }
    } catch (err) { setError('Failed to complete habit.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/habits/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setHabits(habits.filter(h => h._id !== id));
      }
    } catch (err) { setError('Failed to delete habit.'); }
  };

  const startEdit = (habit) => {
    setEditingId(habit._id);
    setEditTitle(habit.title);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle })
      });
      const result = await response.json();
      if (result.success) {
        setHabits(habits.map(h => h._id === id ? { ...h, title: editTitle } : h));
        setEditingId(null);
      }
    } catch (err) { setError('Failed to update habit.'); }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-container">
          <span className="logo-icon">✨</span>
          <h1>HabitGuard</h1>
        </div>
        <p className="subtitle">Your Smart Habit Companion</p>
      </header>
      
      {error && <div className="error-banner"><span>⚠️</span> {error}</div>}

      <div className="input-section">
        <form onSubmit={handleAddHabit} className="add-form">
          <input 
            type="text" 
            placeholder="What habit do you want to build today?" 
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            className="habit-input"
          />
          <button type="submit" className="add-btn" disabled={!newHabit.trim()}>Add Habit</button>
        </form>
      </div>

      <div className="habits-grid">
        {isLoading ? (
          <div className="loading-state"><div className="spinner"></div><p>Analyzing habits...</p></div>
        ) : habits.length === 0 ? (
          <div className="empty-state"><h3>Your journey begins here</h3><p>Add a habit above to start!</p></div>
        ) : (
          habits.map(habit => (
            <div key={habit._id} className={`habit-card ${habit.isCompletedToday ? 'completed' : ''}`}>
              <div className="habit-header">
                {editingId === habit._id ? (
                  <div className="edit-mode">
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="edit-input" />
                    <button onClick={() => handleUpdate(habit._id)} className="save-btn">Save</button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn">X</button>
                  </div>
                ) : (
                  <h3 className="habit-title">{habit.title}</h3>
                )}
                <div className="streak-badge">🔥 {habit.streak} day streak</div>
              </div>

              <div className="suggestion-box">{habit.suggestion}</div>

              {habit.warnings && (
                <div className="warning-box">⚠️ {habit.warnings.join(", ")}</div>
              )}

              {/* Activity Log (History Tracking) */}
              {habit.datesCompleted.length > 0 && (
                <div className="activity-log">
                  <strong>Recent Activity:</strong>
                  <ul>
                    {habit.datesCompleted.slice(-3).reverse().map((date, i) => (
                      <li key={i}>Completed at {formatTime(date)} on {new Date(date).toLocaleDateString()}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="card-actions">
                <button 
                  onClick={() => handleComplete(habit._id)}
                  className={`complete-btn ${habit.isCompletedToday ? 'done' : ''}`}
                  disabled={habit.isCompletedToday}
                >
                  {habit.isCompletedToday ? '✅ Done Today' : '🚀 Mark Done'}
                </button>
                <div className="secondary-actions">
                  <button onClick={() => startEdit(habit)} className="icon-btn">Edit</button>
                  <button onClick={() => handleDelete(habit._id)} className="icon-btn delete">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
