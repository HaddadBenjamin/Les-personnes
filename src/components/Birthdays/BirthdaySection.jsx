import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { getDaysUntil, formatDateFr } from '../../utils/dateUtils';

export function BirthdaySection({ data, onAdd, onDelete }) {
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState(''); // MM-DD

  const handleAdd = () => {
    if (newName.trim() && newDate.trim()) {
      onAdd(newName.trim(), newDate.trim());
      setNewName('');
      setNewDate('');
    }
  };

  return (
    <div className="section-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>🎂 Prochains Anniversaires</h2>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Nom" 
            className="glass-panel" 
            style={{ color: 'white' }}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Date (MM-JJ)" 
            className="glass-panel" 
            style={{ color: 'white' }}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="birthday-list">
        {data.map(person => {
          const daysLeft = getDaysUntil(person.date);
          const isSoon = daysLeft <= 30;
          return (
            <motion.div 
              key={person.id} 
              className="card birthday-card" 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: isSoon ? 'var(--accent)' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  {person.name[0]}
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{person.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: isSoon ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {daysLeft === 0 ? "🎉 C'est aujourd'hui !" : 
                     daysLeft === 1 ? "🕒 Demain !" : 
                     `📅 Dans ${daysLeft} jours`}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="birthday-date">{formatDateFr(person.date)}</span>
                <button className="btn-ghost" onClick={() => onDelete(person.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}
