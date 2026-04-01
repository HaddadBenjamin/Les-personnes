import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const INITIAL_CAVE = [
  { id: 'c1', text: 'Cartons' },
  { id: 'c2', text: 'Ventilateur' },
  { id: 'c3', text: 'Sapin' },
  { id: 'c4', text: 'Guirlandes' },
  { id: 'c5', text: 'Ordinateurs et chargeurs' },
  { id: 'c6', text: '3 chaises' }
];

export function PersonnelSection({ data, onToggle, onAdd, onDelete, onAddSection, onDeleteSection }) {
  const [activeMainTab, setActiveMainTab] = useState('affaires'); // 'affaires' | 'shabiller' | 'cave'
  
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [activeChecklistId, setActiveChecklistId] = useState(data.length > 0 ? data[0].id : null);
  const [newItem, setNewItem] = useState('');

  // Cave state using local storage to persist directly
  const [caveItems, setCaveItems] = useLocalStorage('les-gens-cave', INITIAL_CAVE);
  const [newCaveItem, setNewCaveItem] = useState('');

  const handleAddCaveItem = () => {
    if (newCaveItem.trim()) {
      setCaveItems([...caveItems, { id: Date.now().toString(), text: newCaveItem.trim() }]);
      setNewCaveItem('');
    }
  };

  const handleDeleteCaveItem = (id) => {
    setCaveItems(caveItems.filter(item => item.id !== id));
  };


  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      onAddSection(newSectionTitle.trim());
      setNewSectionTitle('');
    }
  };

  const handleAddItem = (checklistId) => {
    if (newItem.trim()) {
      onAdd(checklistId, newItem.trim());
      setNewItem('');
    }
  };

  const currentChecklistId = data.find(ch => ch.id === activeChecklistId) ? activeChecklistId : (data.length > 0 ? data[0].id : null);
  const activeChecklist = data.find(ch => ch.id === currentChecklistId);

  return (
    <div className="section-container">
      {/* Navigation Principale du sous-onglet Personnel */}
      <div className="tabs-nav" style={{ marginBottom: '2rem', background: 'rgba(0,0,0,0.2)' }}>
        <button
          className={`tab-btn ${activeMainTab === 'affaires' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('affaires')}
        >
          🎒 Affaires à ramener
        </button>
        <button
          className={`tab-btn ${activeMainTab === 'shabiller' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('shabiller')}
        >
          👕 S'habiller
        </button>
        <button
          className={`tab-btn ${activeMainTab === 'cave' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('cave')}
        >
          📦 Ma Cave
        </button>
      </div>

      {activeMainTab === 'shabiller' && (
        <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
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

            <div className="glass-panel">
              <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Mes Tailles Principales</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>👖 Pantalon courant</span>
                <div style={{ textAlign: 'right' }}>
                  <div><strong style={{ fontSize: '1.2rem' }}>48 FR</strong></div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Étiquette : 32</div>
                </div>
              </div>
            </div>

            {/* Guide des tailles */}
            <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>📏 Guide des Mensurations du corps</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Taille de l'étiquette</th>
                      <th style={{ padding: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Taille EU</th>
                      <th style={{ padding: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Tour de taille (cm)</th>
                      <th style={{ padding: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Tour de hanches (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { etiquette: 30, eu: 44, taille: '74-78', hanches: '90-94' },
                      { etiquette: 31, eu: 46, taille: '78-82', hanches: '94-98' },
                      { etiquette: 32, eu: 48, taille: '82-86', hanches: '98-102', highlight: true },
                      { etiquette: 34, eu: 50, taille: '86-91', hanches: '102-107' },
                      { etiquette: 36, eu: 52, taille: '91-96', hanches: '107-112' },
                      { etiquette: 38, eu: 54, taille: '96-102', hanches: '112-118' },
                      { etiquette: 40, eu: 56, taille: '102-105', hanches: '118-121' },
                    ].map(row => (
                      <tr key={row.etiquette} style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        backgroundColor: row.highlight ? 'rgba(255, 107, 107, 0.15)' : 'transparent',
                        fontWeight: row.highlight ? 'bold' : 'normal',
                      }}>
                        <td style={{ padding: '0.8rem' }}>{row.etiquette}</td>
                        <td style={{ padding: '0.8rem' }}>{row.eu}</td>
                        <td style={{ padding: '0.8rem' }}>{row.taille}</td>
                        <td style={{ padding: '0.8rem' }}>{row.hanches}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeMainTab === 'affaires' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Listes d'affaires</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Nouvelle liste..." 
                className="glass-panel" 
                style={{ width: '180px', border: '1px solid var(--surface-border)', color: 'white', padding: '0.4rem 0.8rem' }}
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
              />
              <button className="btn-primary" onClick={handleAddSection} style={{ padding: '0.4rem 0.8rem' }}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          {data.length > 0 && (
            <div className="tabs-nav" style={{ justifyContent: 'flex-start', overflowX: 'auto', marginBottom: '1.5rem', padding: '0.5rem', background: 'transparent', border: 'none', gap: '0.5rem' }}>
              {data.map(checklist => (
                <button
                  key={checklist.id}
                  className={`tab-btn ${currentChecklistId === checklist.id ? 'active' : ''}`}
                  onClick={() => setActiveChecklistId(checklist.id)}
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap', borderRadius: '20px' }}
                >
                  {checklist.title}
                </button>
              ))}
            </div>
          )}

          {activeChecklist ? (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{activeChecklist.title}</h3>
                <button className="btn-ghost" onClick={() => {
                  onDeleteSection(activeChecklist.id);
                }}>
                  <Trash2 size={16} /> Supprimer la liste
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
          ) : (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              Créez une liste pour commencer.
            </div>
          )}
        </div>
      )}

      {activeMainTab === 'cave' && (
        <div className="card" style={{ animation: 'fadeIn 0.3s ease', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📦 Contenu de la cave
          </h3>
          
          <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {caveItems.map((item, i) => (
                <li key={item.id} style={{ 
                  padding: '0.8rem 0', 
                  borderBottom: i !== caveItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1.05rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>•</span> 
                    <span>{item.text}</span>
                  </div>
                  <button className="btn-ghost" style={{ border: 'none', padding: '4px' }} onClick={() => handleDeleteCaveItem(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
              {caveItems.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0', margin: 0 }}>La cave est vide.</p>
              )}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="Ajouter un objet dans la cave..." 
              className="glass-panel" 
              style={{ flex: 1, border: '1px solid var(--surface-border)', color: 'white', padding: '0.5rem' }}
              value={newCaveItem}
              onChange={(e) => setNewCaveItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCaveItem()}
            />
            <button className="btn-primary" onClick={handleAddCaveItem}>
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
