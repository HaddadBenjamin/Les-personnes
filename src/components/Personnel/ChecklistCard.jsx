import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plane, Trash2, CheckCircle2, Plus } from 'lucide-react';

export function ChecklistCard({ checklist, onToggle, onAdd, onDelete, onDeleteSection }) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(checklist.id, newItem.trim());
      setNewItem('');
    }
  };

  return (
    <motion.div className="card" layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {checklist.id === 'work-checklist' ? <Briefcase size={20} color="#818cf8"/> : 
           checklist.id === 'travel-checklist' ? <Plane size={20} color="#f43f5e"/> : 
           <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />}
          {checklist.title}
        </h3>
        <button className="btn-ghost" onClick={() => onDeleteSection(checklist.id)}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="items-list" style={{ marginBottom: '1rem' }}>
        {checklist.items.map(item => (
          <motion.div key={item.id} className="checklist-item" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div 
              className={`checkbox ${item.checked ? 'checked' : ''}`} 
              onClick={() => onToggle(checklist.id, item.id)}
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
            <button className="btn-ghost" style={{ border: 'none', padding: '4px' }} onClick={() => onDelete(checklist.id, item.id)}>
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          placeholder="Ajouter un élément..." 
          className="glass-panel" 
          style={{ flex: 1, border: '1px solid var(--surface-border)', color: 'white', padding: '0.5rem' }}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={18} />
        </button>
      </div>
    </motion.div>
  );
}
