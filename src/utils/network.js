export function networkLabel(n) {
  if (n.isConnected === null) return 'Checking…';
  if (!n.isConnected) return 'Offline';
  if (n.type === 'wifi') return 'Wi-Fi';
  if (n.type === 'cellular') return 'Cellular';
  return n.type ? n.type.charAt(0).toUpperCase() + n.type.slice(1) : 'Unknown';
}

export function networkColor(label) {
  if (label === 'Offline') return '#DC2626';
  if (label === 'Wi-Fi') return '#16A34A';
  if (label === 'Cellular') return '#2563EB';
  return '#6B7280';
}
