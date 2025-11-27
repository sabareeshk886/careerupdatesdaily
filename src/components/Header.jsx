import React from 'react';

const Header = ({ searchTerm, setSearchTerm }) => {
    return (
        <header style={{
            background: 'white',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            marginBottom: '2rem'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="logo">
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-color)', letterSpacing: '-0.5px' }}>
                        CAREERUPDATES<span style={{ color: 'var(--text-secondary)' }}>DAILY</span>
                    </h1>
                </div>
                <div className="search-bar" style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        borderRadius: '9999px',
                        padding: '0.5rem 1rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                        transition: 'box-shadow 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.08)'}
                    >
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                color: 'var(--text-primary)',
                                background: 'transparent'
                            }}
                        />
                        <div style={{
                            background: 'var(--accent-color)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '0.5rem',
                            cursor: 'pointer'
                        }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="white"
                                style={{ width: '14px', height: '14px' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
