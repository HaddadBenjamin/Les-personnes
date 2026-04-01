import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronRight } from 'lucide-react';

export function ContactSection({ data, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', role: '', address: '', details: '' });

  const handleAdd = () => {
    if (newContact.name.trim()) {
      onAdd({ ...newContact });
      setShowForm(false);
      setNewContact({ name: '', role: '', address: '', details: '' });
    }
  };

  return (
    <div className="section-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>📇 Répertoire</h2>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> Nouveau Contact
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="card"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input 
                type="text" placeholder="Nom" className="glass-panel" style={{ color: 'white' }}
                value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})}
              />
              <input 
                type="text" placeholder="Fonction (ex: Nounou)" className="glass-panel" style={{ color: 'white' }}
                value={newContact.role} onChange={e => setNewContact({...newContact, role: e.target.value})}
              />
              <input 
                type="text" placeholder="Adresse" className="glass-panel" style={{ color: 'white' }}
                value={newContact.address} onChange={e => setNewContact({...newContact, address: e.target.value})}
              />
            </div>
            <textarea 
              placeholder="Détails (codes, interphone...)" className="glass-panel" 
              style={{ width: '100%', minHeight: '80px', color: 'white', marginBottom: '1rem' }}
              value={newContact.details} onChange={e => setNewContact({...newContact, details: e.target.value})}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleAdd}>
                Enregistrer
              </button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {data.map(contact => (
          <motion.div key={contact.id} className="card contact-card" layout>
            <div className="contact-role" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{contact.role}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>{contact.name}</h3>
              <button className="btn-ghost" onClick={() => onDelete(contact.id)}>
                <Trash2 size={16} />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ChevronRight size={14} /> {contact.address}
            </p>
            {contact.details && (
              <div className="contact-details">
                {contact.details}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
