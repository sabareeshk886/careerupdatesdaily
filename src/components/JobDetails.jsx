import React from 'react';

const JobDetailsContent = ({ job, onClose }) => {
    const displaySalary = job.salary;

    return (
        <>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    zIndex: 10,
                    padding: '0.5rem',
                    lineHeight: 1,
                    borderRadius: '50%',
                    transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F7F7F7'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
                &times;
            </button>

            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.75rem', paddingRight: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{job.title}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-secondary)', flexWrap: 'wrap', fontSize: '1rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '2.5rem' }}>
                <section>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>Description</h3>
                    <div style={{
                        lineHeight: '1.75',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'pre-wrap',
                        fontSize: '1rem',
                        wordBreak: 'break-word'
                    }}>
                        {job.description
                            .replace(/\\-/g, '-')
                            .replace(/\/\//g, '')
                            .split(/(\*\*.*?\*\*)/)
                            .map((part, index) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={index} style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                    </div>
                </section>

                {job.requirements && job.requirements.length > 0 && (
                    <section>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>Requirements</h3>
                        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.75', fontSize: '1rem' }}>
                            {job.requirements.map((req, index) => (
                                <li key={index} style={{ marginBottom: '0.5rem' }}>{req}</li>
                            ))}
                        </ul>
                    </section>
                )}

                <section style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border-color)',
                    position: 'sticky',
                    bottom: '-2rem', /* Stick to bottom of scroll area */
                    background: 'white',
                    paddingBottom: '1rem',
                    marginRight: '-1rem', /* Extend background to cover padding */
                    paddingRight: '1rem',
                    marginLeft: '-1rem',
                    paddingLeft: '1rem'
                }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Salary Range</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{displaySalary}</span>
                    </div>
                    <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ textDecoration: 'none', display: 'inline-block', fontSize: '1rem' }}
                    >
                        Apply Now
                    </a>
                </section>
            </div>
        </>
    );
};

const JobDetails = ({ job, onClose, isInline = false }) => {
    if (!job && isInline) {
        return (
            <div className="glass-panel" style={{
                height: 'calc(100vh - 140px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                position: 'sticky',
                top: '100px',
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>📋</div>
                    <p style={{ fontSize: '1.1rem' }}>Select a job to view details</p>
                </div>
            </div>
        );
    }

    if (!job) return null;

    if (isInline) {
        return (
            <div
                className="glass-panel"
                style={{
                    height: 'calc(100vh - 140px)',
                    overflowY: 'auto',
                    padding: '2.5rem',
                    position: 'sticky',
                    top: '100px',
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)'
                }}
            >
                <JobDetailsContent job={job} onClose={onClose} />
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)', /* Lighter backdrop */
                backdropFilter: 'blur(4px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <div
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '2.5rem',
                    position: 'relative',
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <JobDetailsContent job={job} onClose={onClose} />
            </div>
        </div>
    );
};

export default JobDetails;
