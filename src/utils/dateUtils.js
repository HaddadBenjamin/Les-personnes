export const getDaysUntil = (dateStr) => {
  if (!dateStr || !dateStr.includes('-')) return 999;
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

export const formatDateFr = (dateStr) => {
  if (!dateStr || !dateStr.includes('-')) return 'Date invalide';
  const [month, day] = dateStr.split('-').map(Number);
  const months = ['Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  return `${day} ${months[month - 1]}`;
}
