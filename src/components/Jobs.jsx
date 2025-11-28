import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './Header';
import JobCard from './JobCard';
import JobDetails from './JobDetails';
import { fetchJobs } from '../services/api';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAllCategories, setShowAllCategories] = useState(false);

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
            } else if (fetchedJobs.length > 0) {
                // Auto-select first job if no deep link
                setSelectedJob(fetchedJobs[0]);
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

    const handleJobSelect = (job) => {
        setSelectedJob(job);
    };

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

    const scrollContainerRef = useRef(null);

    const scrollCategories = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="jobs-page">
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <main className="container">
                {/* Category Filters - Moved outside grid */}
                <div style={{ marginBottom: '2rem', position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div
                        ref={scrollContainerRef}
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            overflowX: 'auto',
                            paddingBottom: '0.5rem',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            alignItems: 'center',
                            flex: 1,
                            scrollBehavior: 'smooth'
                        }}
                    >
                        {/* Hide scrollbar for Chrome/Safari/Opera */}
                        <style>
                            {`
                            div::-webkit-scrollbar { 
                                display: none; 
                            }
                        `}
                        </style>

                        {categories.map(category => (
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
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0
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
                    </div>

                    {/* Right Arrow for scrolling */}
                    <button
                        onClick={() => scrollCategories('right')}
                        style={{
                            marginLeft: '0.5rem',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            border: '1px solid var(--border-color)',
                            background: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            zIndex: 2,
                            minWidth: '40px',
                            height: '40px'
                        }}
                        aria-label="Scroll right"
                        title="Scroll right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>

                    {/* Show All Toggle (Optional, kept for compatibility if user wants it, but maybe redundant with scroll) */}
                    <button
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        style={{
                            marginLeft: '0.5rem',
                            padding: '0.6rem 0.8rem',
                            borderRadius: '50%',
                            border: '1px solid var(--border-color)',
                            background: 'white',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px'
                        }}
                        title={showAllCategories ? "Show less" : "Show all categories"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ transform: showAllCategories ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </button>
                </div>

                <div style={{
                    display: isMobile ? 'block' : 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '420px 1fr',
                    gap: '3rem',
                    alignItems: 'start',
                    paddingBottom: '4rem'
                }}>
                    {/* Left Column: Job List */}
                    <div>
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
                                            onSelect={handleJobSelect}
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
                </div>
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

export default Jobs;
