import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Cake, 
  Contact, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle,
  ChevronRight,
  Briefcase,
  Plane,
  Edit2
} from 'lucide-react'
import { 
  initialPersonnel, 
  initialBirthdays, 
  initialContacts 
} from './data/initialData'
import { useLocalStorage } from './hooks/useLocalStorage'

// --- Constants ---
const TABS = [
  { id: 'personnel', label: 'Personnel', icon: User },
  { id: 'anniversaires', label: 'Anniversaires', icon: Cake },
  { id: 'contacts', label: 'Contacts', icon: Contact },
]

// --- Helper Functions ---
const getDaysUntil = (dateStr) => {
  const [month, day] = dateStr.split('-').map(Number);
  const today = new Date();
  const currentYear = today.getFullYear();
  let nextDate = new Date(currentYear, month - 1, day);
  
  if (nextDate < today && nextDate.toLocaleDateString() !== today.toLocaleDateString()) {
    nextDate.setFullYear(currentYear + 1);
  }
  
  const diffTime = nextDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const formatDate = (dateStr) => {
  const [month, day] = dateStr.split('-').map(Number);
  const months = ['Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  return `${day} ${months[month - 1]}`;
}

// --- Main App Component ---
function App() {
  const [activeTab, setActiveTab] = useState('personnel');
  
  // Data State with Persistence
  const [personnel, setPersonnel] = useLocalStorage('les-gens-personnel', initialPersonnel);
  const [birthdays, setBirthdays] = useLocalStorage('les-gens-anniversaires', initialBirthdays);
  const [contacts, setContacts] = useLocalStorage('les-gens-contacts', initialContacts);

  // Sorting Birthdays
  const sortedBirthdays = useMemo(() => {
    return [...birthdays].sort((a, b) => {
      const daysA = getDaysUntil(a.date);
      const daysB = getDaysUntil(b.date);
      return daysA - daysB;
    });
  }, [birthdays]);

  // Sorting Contacts by Role
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => a.role.localeCompare(b.role));
  }, [contacts]);

  // --- CRUD Actions ---
  
  // Personnel Actions
  const toggleChecklistItem = (checklistId, itemId) => {
    const updated = personnel.map(checklist => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: checklist.items.map(item => 
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        };
      }
      return checklist;
    });
    setPersonnel(updated);
  }

  const addChecklistItem = (checklistId, text) => {
    if (!text.trim()) return;
    const updated = personnel.map(ch => {
      if (ch.id === checklistId) {
        return {
          ...ch,
          items: [...ch.items, { id: Date.now().toString(), text, checked: false }]
        };
      }
      return ch;
    });
    setPersonnel(updated);
  }

  const deleteChecklistItem = (checklistId, itemId) => {
    const updated = personnel.map(ch => {
      if (ch.id === checklistId) {
        return {
          ...ch,
          items: ch.items.filter(i => i.id !== itemId)
        };
      }
      return ch;
    });
    setPersonnel(updated);
  }

  const addChecklistSection = (title) => {
    if (!title.trim()) return;
    setPersonnel([...personnel, { id: Date.now().toString(), title, items: [] }]);
  }

  const deleteChecklistSection = (id) => {
    setPersonnel(personnel.filter(ch => ch.id !== id));
  }

  // Birthday Actions
  const addBirthday = (name, date) => {
    if (!name.trim() || !date.trim()) return;
    setBirthdays([...birthdays, { id: Date.now().toString(), name, date }]);
  }

  const deleteBirthday = (id) => {
    setBirthdays(birthdays.filter(b => b.id !== id));
  }

  // Contact Actions
  const addContact = (contact) => {
    setContacts([...contacts, { ...contact, id: Date.now().toString() }]);
  }

  const deleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  }

  return (
    <div className="app-container">
      <header>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Les gens
        </motion.h1>
        <p style={{ color: 'var(--text-muted)' }}>Organisation personnelle & Entourage</p>
      </header>

      <nav className="tabs-nav">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`tab-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon size={18} />
              {label}
            </div>
          </button>
        ))}
      </nav>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'personnel' && (
              <PersonnelSection 
                data={personnel} 
                onToggle={toggleChecklistItem} 
                onAdd={addChecklistItem}
                onDelete={deleteChecklistItem}
                onAddSection={addChecklistSection}
                onDeleteSection={deleteChecklistSection}
              />
            )}
            {activeTab === 'anniversaires' && (
              <BirthdaySection 
                data={sortedBirthdays} 
                onAdd={addBirthday}
                onDelete={deleteBirthday}
              />
            )}
            {activeTab === 'contacts' && (
              <ContactSection 
                data={sortedContacts} 
                onAdd={addContact}
                onDelete={deleteContact}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

// --- Personnel Section Components ---
function PersonnelSection({ data, onToggle, onAdd, onDelete, onAddSection, onDeleteSection }) {
  const [newSectionTitle, setNewSectionTitle] = useState('');

  return (
    <div className="section-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Checklists</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Nouvelle section..." 
            className="glass-panel" 
            style={{ width: '200px', border: '1px solid var(--surface-border)', color: 'white' }}
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
          />
          <button className="btn-primary" onClick={() => { onAddSection(newSectionTitle); setNewSectionTitle(''); }}>
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {data.map(checklist => (
          <ChecklistCard 
            key={checklist.id} 
            checklist={checklist} 
            onToggle={onToggle} 
            onAdd={onAdd}
            onDelete={onDelete}
            onDeleteSection={onDeleteSection}
          />
        ))}
      </div>
    </div>
  )
}

function ChecklistCard({ checklist, onToggle, onAdd, onDelete, onDeleteSection }) {
  const [newItem, setNewItem] = useState('');

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
          onKeyDown={(e) => e.key === 'Enter' && (onAdd(checklist.id, newItem), setNewItem(''))}
        />
        <button className="btn-primary" onClick={() => { onAdd(checklist.id, newItem); setNewItem(''); }}>
          <Plus size={18} />
        </button>
      </div>
    </motion.div>
  )
}

// --- Birthday Section Components ---
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

function BirthdaySection({ data, onAdd, onDelete }) {
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState(''); // MM-DD

  // Prepare chart data
  const monthNames = ['Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  const distribution = data.reduce((acc, b) => {
    const month = parseInt(b.date.split('-')[0]) - 1;
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const chartOptions = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 250
    },
    title: { text: null },
    tooltip: { pointFormat: '{point.y} anniversaires' },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: { enabled: false },
        showInLegend: true,
        borderWidth: 0
      }
    },
    legend: {
      itemStyle: { color: '#94a3b8' },
      itemHoverStyle: { color: '#f8fafc' }
    },
    series: [{
      name: 'Mois',
      colorByPoint: true,
      data: Object.entries(distribution).map(([monthIdx, count]) => ({
        name: monthNames[monthIdx],
        y: count
      }))
    }],
    credits: { enabled: false }
  };

  return (
    <div className="section-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Prochains Anniversaires</h2>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
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
          />
          <button className="btn-primary" onClick={() => { onAdd(newName, newDate); setNewName(''); setNewDate(''); }}>
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
                    {daysLeft === 0 ? "C'est aujourd'hui !" : 
                     daysLeft === 1 ? "Demain !" : 
                     `Dans ${daysLeft} jours`}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="birthday-date">{formatDate(person.date)}</span>
                <button className="btn-ghost" onClick={() => onDelete(person.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// --- Contact Section Components ---
function ContactSection({ data, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', role: '', address: '', details: '' });

  return (
    <div className="section-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Répertoire</h2>
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
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => { onAdd(newContact); setShowForm(false); setNewContact({ name: '', role: '', address: '', details: '' }); }}>
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
            <div className="contact-role">{contact.role}</div>
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
  )
}

export default App
