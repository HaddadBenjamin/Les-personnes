import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Cake, Contact } from 'lucide-react'

// Hooks & Data
import { useLocalStorage } from './hooks/useLocalStorage'
import { initialPersonnel, initialBirthdays, initialContacts } from './data/initialData'
import { getDaysUntil } from './utils/dateUtils'

// Components
import { PersonnelSection } from './components/Personnel/PersonnelSection'
import { BirthdaySection } from './components/Birthdays/BirthdaySection'
import { ContactSection } from './components/Contacts/ContactSection'

const TABS = [
  { id: 'personnel', label: 'Mes Affaires', icon: User, emoji: '🎒' },
  { id: 'anniversaires', label: 'Anniversaires', icon: Cake, emoji: '🎂' },
  { id: 'contacts', label: 'Contacts', icon: Contact, emoji: '📇' },
]

function App() {
  const [activeTab, setActiveTab] = useState('personnel');
  
  // Data State with Persistence (NEVER change keys!)
  const [personnel, setPersonnel] = useLocalStorage('les-gens-personnel', initialPersonnel);
  const [birthdays, setBirthdays] = useLocalStorage('les-gens-anniversaires', initialBirthdays);
  const [contacts, setContacts] = useLocalStorage('les-gens-contacts', initialContacts);

  // Sorting Logic (computed)
  const sortedBirthdays = useMemo(() => {
    return [...birthdays].sort((a, b) => {
      const daysA = getDaysUntil(a.date);
      const daysB = getDaysUntil(b.date);
      return daysA - daysB;
    });
  }, [birthdays]);

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => (a.role || '').localeCompare(b.role || ''));
  }, [contacts]);

  // --- CRUD Handlers ---
  
  // Personnel
  const toggleChecklistItem = (checklistId, itemId) => {
    setPersonnel(personnel.map(ch => ch.id === checklistId ? {
      ...ch, items: ch.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i)
    } : ch));
  }

  const addChecklistItem = (checklistId, text) => {
    setPersonnel(personnel.map(ch => ch.id === checklistId ? {
      ...ch, items: [...ch.items, { id: Date.now().toString(), text, checked: false }]
    } : ch));
  }

  const deleteChecklistItem = (checklistId, itemId) => {
    setPersonnel(personnel.map(ch => ch.id === checklistId ? {
      ...ch, items: ch.items.filter(i => i.id !== itemId)
    } : ch));
  }

  const addChecklistSection = (title) => {
    setPersonnel([...personnel, { id: Date.now().toString(), title, items: [] }]);
  }

  const deleteChecklistSection = (id) => {
    setPersonnel(personnel.filter(ch => ch.id !== id));
  }

  // Birthdays
  const addBirthday = (name, date) => {
    setBirthdays([...birthdays, { id: Date.now().toString(), name, date }]);
  }

  const deleteBirthday = (id) => {
    setBirthdays(birthdays.filter(b => b.id !== id));
  }

  // Contacts
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Les gens ✨
        </motion.h1>
        <p style={{ color: 'var(--text-muted)' }}>Ton espace d'organisation moderne 🚀</p>
      </header>

      <nav className="tabs-nav">
        {TABS.map(({ id, label, icon: Icon, emoji }) => (
          <button
            key={id}
            className={`tab-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Icon size={18} />
              <span>{label} {emoji}</span>
            </div>
          </button>
        ))}
      </nav>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
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

export default App
