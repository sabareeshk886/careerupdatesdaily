import React from 'react';

const JobDetails = ({ job, onClose }) => {
    if (!job) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
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
                    padding: '2rem',
                    position: 'relative',
                    backgroundColor: '#1e293b' // Solid background for readability
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{job.title}</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-secondary)' }}>
                        <span style={{ fontSize: '1.1rem', color: 'var(--accent-color)' }}>{job.company}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    <section>
                        <h3 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Description</h3>
                        <div style={{ lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                            {job.description.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                            return <strong key={j} style={{ color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
                                        }
                                        return part;
                                    })}
                                    {'\n'}
                                </React.Fragment>
                            ))}
                        </div>
                    </section>

                    {job.requirements && job.requirements.length > 0 && (
                        <section>
                            <h3 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Requirements</h3>
                            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                {job.requirements.map((req, index) => (
                                    <li key={index} style={{ marginBottom: '0.5rem' }}>{req}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Salary Range</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>{job.salary}</span>
                        </div>
                        <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ textDecoration: 'none', display: 'inline-block' }}
                        >
                            Apply Now
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
