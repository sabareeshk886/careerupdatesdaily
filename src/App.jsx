import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import JobCard from './components/JobCard';
import JobDetails from './components/JobDetails';
import { fetchJobs } from './services/api';


function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      const fetchedJobs = await fetchJobs();
      setJobs(fetchedJobs);
      setLoading(false);

      // Check for deep link
      const params = new URLSearchParams(window.location.search);
      const jobUrl = params.get('jobUrl');
      if (jobUrl) {
        const jobToOpen = fetchedJobs.find(job => job.applyUrl === jobUrl);
        if (jobToOpen) {
          setSelectedJob(jobToOpen);
        }
      }
    };

    loadJobs();
  }, []);

  // Extract unique categories and group them
  const categories = useMemo(() => {
    const uniqueCategories = new Set(jobs.map(job => job.category).filter(Boolean));
    // You could add logic here to group them if needed, e.g., "HR" -> ["HR Intern", "HR Manager"]
    // For now, we'll list the unique search terms as requested, potentially cleaning them up
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        (job.title || '').toLowerCase().includes(term) ||
        (job.company || '').toLowerCase().includes(term) ||
        (job.description || '').toLowerCase().includes(term);

      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [jobs, searchTerm, selectedCategory]);

  return (
    <div className="app">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="container">
        {/* Category Filters */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-color)',
                  background: selectedCategory === category ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === category ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            {selectedCategory === 'All' ? 'Latest Opportunities' : `${selectedCategory} Jobs`}
            <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 'normal', marginLeft: '0.5rem' }}>
              ({filteredJobs.length})
            </span>
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '1.25rem' }}>Loading jobs...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={setSelectedJob}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '1.25rem' }}>No jobs found matching your search.</p>
          </div>
        )}
      </main>

      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}

export default App;
