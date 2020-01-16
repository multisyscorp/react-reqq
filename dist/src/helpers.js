export const helper = () => ({});
export const qs = json => {
  if (typeof json !== 'object') return '';
  return `?${Object.keys(json).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key]) || ''}`).join('&')}`;
};