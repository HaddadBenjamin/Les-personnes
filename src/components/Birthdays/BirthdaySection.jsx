import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import Highcharts from 'highcharts';
import * as HighchartsReactModule from 'highcharts-react-official';
const ChartComponent = HighchartsReactModule.default?.default || HighchartsReactModule.default || HighchartsReactModule;
import { getDaysUntil, formatDateFr } from '../../utils/dateUtils';

export function BirthdaySection({ data, onAdd, onDelete }) {
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState(''); // MM-DD

  // Defensive check for chart data
  const monthNames = ['Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  const distribution = data.reduce((acc, b) => {
    if (b.date && b.date.includes('-')) {
      const month = parseInt(b.date.split('-')[0]) - 1;
      acc[month] = (acc[month] || 0) + 1;
    }
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

      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <ChartComponent highcharts={Highcharts} options={chartOptions} />
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
