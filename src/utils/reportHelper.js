export const getValidityInfo = (count) => {
  if (count >= 3) {
    return {
      status: 'high',
      label: 'Validitas Tinggi',
      badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      markerColor: '#10b981',
    }
  }

  if (count === 2) {
    return {
      status: 'medium',
      label: 'Validitas Sedang',
      badgeStyle: 'bg-amber-100 text-amber-800 border-amber-200',
      markerColor: '#f59e0b',
    }
  }

  return {
    status: 'low',
    label: 'Validitas Rendah',
    badgeStyle: 'bg-rose-100 text-rose-800 border-rose-200',
    markerColor: '#f43f5e',
  }
}
