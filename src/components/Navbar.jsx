import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'community', label: 'Community' },
        { id: 'jobs', label: 'Jobs' },
        { id: 'services', label: 'Services' }
    ];

    return (
        <nav style={{
            borderBottom: '1px solid var(--border-color)',
            background: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                paddingTop: '1rem'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '1rem 0.5rem',
                            fontSize: '1rem',
                            fontWeight: activeTab === tab.id ? '600' : '500',
                            color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === tab.id ? '2px solid var(--text-primary)' : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'color 0.2s, border-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== tab.id) {
                                e.currentTarget.style.color = 'var(--text-primary)';
                                e.currentTarget.style.borderBottomColor = '#DDDDDD';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== tab.id) {
                                e.currentTarget.style.color = 'var(--text-secondary)';
                                e.currentTarget.style.borderBottomColor = 'transparent';
                            }
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
