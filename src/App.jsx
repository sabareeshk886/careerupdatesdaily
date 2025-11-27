import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Jobs from './components/Jobs';
import Community from './components/Community';
import Services from './components/Services';

function App() {
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    // Check for deep link on mount
    const params = new URLSearchParams(window.location.search);
    if (params.get('jobId')) {
      setActiveTab('jobs');
    }
  }, []);

  return (
    <div className="app" style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'jobs' && <Jobs />}
      {activeTab === 'community' && <Community />}
      {activeTab === 'services' && <Services />}
    </div>
  );
}

export default App;
