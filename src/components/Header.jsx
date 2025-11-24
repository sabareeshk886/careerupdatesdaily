import React from 'react';

const Header = ({ searchTerm, setSearchTerm }) => {
    return (
        <header className="header glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="logo">
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>
                    CAREERUPDATES <span className="text-gradient">DAILY</span>
                </h1>
            </div>
            <div className="search-bar" style={{ flex: 1, maxWidth: '500px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Search jobs by title, company, or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        paddingLeft: '2.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        background: 'rgba(15, 23, 42, 0.6)',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: 'var(--text-secondary)' }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
        </header>
    );
};

export default Header;
