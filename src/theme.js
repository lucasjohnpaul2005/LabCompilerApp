export const lightTheme = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  text: '#1B1F2A',
  subtext: '#5B6475',
  primary: '#4F46E5',
  onPrimary: '#FFFFFF',
  border: '#E2E6F0',
};

export const darkTheme = {
  background: '#0E1117',
  surface: '#1A1F2B',
  text: '#F2F4F8',
  subtext: '#9AA3B5',
  primary: '#818CF8',
  onPrimary: '#10131A',
  border: '#2A3142',
};

export function tierColor(tier) {
  switch (tier) {
    case 'Excellent': return '#16A34A';
    case 'Fair': return '#D97706';
    case 'Poor': return '#EA580C';
    case 'Degraded': return '#DC2626';
    default: return '#6B7280';
  }
}
