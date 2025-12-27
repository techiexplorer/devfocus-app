import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../../config/tools';
import './Home.css';

type Layout = 'grid' | 'list';

export function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [layout, setLayout] = useState<Layout>(() => (localStorage.getItem('home-layout') as Layout) || 'grid');

    useEffect(() => {
        localStorage.setItem('home-layout', layout);
    }, [layout]);

    const filteredTools = TOOLS.map(category => ({
        ...category,
        children: category.children.filter(tool =>
            tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.children.length > 0);

    return (
        <div className="home-container">
            <div className="home-controls">
                <div className="tool-search">
                    <input
                        type="text"
                        placeholder="Filter tools..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="layout-toggle">
                    <button
                        className={`toggle-btn ${layout === 'grid' ? 'active' : ''}`}
                        onClick={() => setLayout('grid')}
                        title="Grid View"
                    >
                        ⊞
                    </button>
                    <button
                        className={`toggle-btn ${layout === 'list' ? 'active' : ''}`}
                        onClick={() => setLayout('list')}
                        title="List View"
                    >
                        ≣
                    </button>
                </div>
            </div>

            {filteredTools.length > 0 ? (
                filteredTools.map(category => (
                    <section key={category.id} className="category-section">
                        <h3 className="category-title">{category.name}</h3>
                        <div className={`tool-container ${layout}`}>
                            {category.children.map(tool => (
                                <Link to={`/tool/${tool.id}`} key={tool.id} className="tool-card">
                                    <div className="tool-name">{tool.name}</div>
                                    <div className="tool-desc">{tool.description}</div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <div style={{ textAlign: 'center', color: 'var(--color-text-dim)' }}>
                    No tools found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
}
