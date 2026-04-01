import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

export function PersonnelSection({ data, onToggle, onAdd, onDelete, onAddSection, onDeleteSection }) {
  const [newSectionTitle, setNewSectionTitle] = useState('');
  // Set default tab to "shabiller" or the first checklist
  const [activeSubTab, setActiveSubTab] = useState('shabiller');
  const [newItem, setNewItem] = useState('');

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      onAddSection(newSectionTitle.trim());
      setNewSectionTitle('');
      setActiveSubTab('shabiller'); // switch if needed, but lets keep it simple
    }
  };

  const handleAddItem = (checklistId) => {
    if (newItem.trim()) {
      onAdd(checklistId, newItem.trim());
      setNewItem('');
    }
  };

  const currentTabId = activeSubTab === 'shabiller' ? 'shabiller' : (data.find(ch => ch.id === activeSubTab) ? activeSubTab : (data.length > 0 ? data[0].id : 'shabiller'));
  const activeChecklist = currentTabId !== 'shabiller' ? data.find(ch => ch.id === currentTabId) : null;

  return (
    <div className="section-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>📝 Thématiques Personnel</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Nouvelle thématique..." 
            className="glass-panel" 
            style={{ width: '200px', border: '1px solid var(--surface-border)', color: 'white' }}
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
          />
          <button className="btn-primary" onClick={handleAddSection}>
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="tabs-nav" style={{ justifyContent: 'flex-start', overflowX: 'auto', marginBottom: '1rem', padding: '0.5rem', background: 'transparent', border: 'none' }}>
        <button
          className={`tab-btn ${currentTabId === 'shabiller' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('shabiller')}
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
        >
          👕 S'habiller
        </button>
        {data.map(checklist => (
          <button
            key={checklist.id}
            className={`tab-btn ${currentTabId === checklist.id ? 'active' : ''}`}
            onClick={() => setActiveSubTab(checklist.id)}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
          >
            {checklist.title}
          </button>
        ))}
      </div>

      {currentTabId === 'shabiller' ? (
        <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Conseils */}
            <div className="glass-panel">
              <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Matières & Couleurs</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)' }}>⚠️</span>
                  <span><strong>Éviter le polyester</strong> : ça fait transpirer et ce n'est pas agréable au contact de la peau.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--success)' }}>✨</span>
                  <span>La <strong>couleur abricot</strong> est magnifique.</span>
                </li>
              </ul>
            </div>

            {/* Tailles Vêtements */}
            <div className="glass-panel">
              <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Mes Tailles (D'après la 1ère image)</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>👖 Pantalon</span>
                <div style={{ textAlign: 'right' }}>
                  <div><strong style={{ fontSize: '1.2rem' }}>48 FR</strong></div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Étiquette : 32</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : activeChecklist ? (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>{activeChecklist.title}</h3>
            <button className="btn-ghost" onClick={() => {
              onDeleteSection(activeChecklist.id);
            }}>
              <Trash2 size={16} /> Supprimer la thématique
            </button>
          </div>

          <div className="items-list" style={{ marginBottom: '1rem' }}>
            {activeChecklist.items.map(item => (
              <div key={item.id} className="checklist-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <div 
                  className={`checkbox ${item.checked ? 'checked' : ''}`} 
                  onClick={() => onToggle(activeChecklist.id, item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.checked && <CheckCircle2 size={14} color="white" />}
                </div>
                <span style={{ 
                  flex: 1, 
                  textDecoration: item.checked ? 'line-through' : 'none',
                  color: item.checked ? 'var(--text-muted)' : 'var(--text-main)',
                  transition: 'all 0.2s'
                }}>
                  {item.text}
                </span>
                <button className="btn-ghost" style={{ border: 'none', padding: '4px' }} onClick={() => onDelete(activeChecklist.id, item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {activeChecklist.items.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>Aucune affaire dans cette liste.</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              placeholder="Ajouter une affaire à ramener..." 
              className="glass-panel" 
              style={{ flex: 1, border: '1px solid var(--surface-border)', color: 'white', padding: '0.5rem' }}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem(activeChecklist.id)}
            />
            <button className="btn-primary" onClick={() => handleAddItem(activeChecklist.id)}>
              <Plus size={18} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
