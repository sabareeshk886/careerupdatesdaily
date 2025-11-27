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
      const jobId = params.get('jobId');
      if (jobId) {
        const jobToOpen = fetchedJobs.find(job => job.id === jobId);
        if (jobToOpen) {
          setSelectedJob(jobToOpen);
        }
      }
    };

    loadJobs();
  }, []);

  // Update URL when selectedJob changes
  useEffect(() => {
    if (selectedJob) {
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('jobId', selectedJob.id);
      window.history.pushState({}, '', newUrl);
    } else {
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete('jobId');
      window.history.pushState({}, '', newUrl);
    }
  }, [selectedJob]);

  // Extract unique categories and group them
  const categories = useMemo(() => {
    const uniqueCategories = new Set(jobs.map(job => job.category).filter(Boolean));
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const result = jobs.filter(job => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        (job.title || '').toLowerCase().includes(term) ||
        (job.company || '').toLowerCase().includes(term) ||
        (job.description || '').toLowerCase().includes(term);

      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
    return result;
  }, [jobs, searchTerm, selectedCategory]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app" style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="container" style={{
        display: isMobile ? 'block' : 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '420px 1fr', /* Slightly wider list for better readability */
        gap: '3rem', /* Increased gap for breathability */
        alignItems: 'start',
        paddingBottom: '4rem'
      }}>
        {/* Left Column: Job List */}
        <div>
          {/* Category Filters */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {categories.slice(0, 20).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '9999px',
                    border: selectedCategory === category ? '1px solid black' : '1px solid var(--border-color)',
                    background: selectedCategory === category ? 'black' : 'white',
                    color: selectedCategory === category ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.borderColor = 'black';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }
                  }}
                >
                  {category}
                </button>
              ))}
              {categories.length > 20 && (
                <span style={{ color: 'var(--text-secondary)', alignSelf: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
                  +{categories.length - 20} more
                </span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {selectedCategory === 'All' ? 'Latest Opportunities' : `${selectedCategory} Jobs`}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {filteredJobs?.length || 0} {filteredJobs?.length === 1 ? 'job' : 'jobs'} found
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '1.25rem' }}>Loading jobs...</p>
            </div>
          ) : (filteredJobs && filteredJobs.length > 0) ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {filteredJobs.map((job) => {
                if (!job) return null;
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSelect={setSelectedJob}
                    isActive={selectedJob?.id === job.id}
                  />
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '1.25rem' }}>No jobs found matching your search.</p>
            </div>
          )}
        </div>

        {/* Right Column: Job Details (Desktop) */}
        {!isMobile && (
          <JobDetails
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            isInline={true}
          />
        )}
      </main>

      {/* Modal Job Details (Mobile) */}
      {isMobile && selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isInline={false}
        />
      )}
    </div>
  );
}

export default App;
