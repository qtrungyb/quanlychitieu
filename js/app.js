// js/app.js

// HÀM TỐI ƯU HIỆU NĂNG: DEBOUNCE (Trì hoãn thực thi khi gõ phím)
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ==========================================
// 1. CẤU HÌNH GIAO DIỆN & CHART.JS
// ==========================================
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
Chart.defaults.color = '#8d99ae';

let pieChartInstance = null;
let barChartInstance = null;
let lineChartInstance = null; 
let currentPieType = 'expense'; 

const SVG_LIB = {
    'food': `<svg viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
    'transport': `<svg viewBox="0 0 24 24"><rect x="2" y="12" width="20" height="8" rx="2" ry="2"></rect><polygon points="2 12 5 7 19 7 22 12"></polygon><circle cx="6" cy="20" r="2"></circle><circle cx="18" cy="20" r="2"></circle></svg>`,
    'shopping': `<svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    'bill': `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    'sales': `<svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
    'salary': `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    'home': `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    'gift': `<svg viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`,
    'health': `<svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
    'education': `<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    'tool': `<svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    'entertainment': `<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><path d="M6 12h4"></path><path d="M8 10v4"></path><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line></svg>`,
    'sports': `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`,
    'travel': `<svg viewBox="0 0 24 24"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l7 4-3 3-3-1-2 2 4 4 2-2-1-3 3-3 4 7l1.2-.7c.4-.2.7-.6.6-1.1z"></path></svg>`,
    'family': `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    'beauty': `<svg viewBox="0 0 24 24"><path d="m4 14 6-6"></path><path d="M11.52 7.52 16.48 2.56a2.12 2.12 0 0 1 3 3l-4.96 4.96"></path><path d="m8 10-6 6"></path><path d="M2.56 16.48l4.96 4.96a2.12 2.12 0 0 0 3-3L5.56 13.48"></path><circle cx="6" cy="18" r="2"></circle><circle cx="18" cy="6" r="2"></circle></svg>`,
    'smartphone': `<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
    'heart': `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    'music': `<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
    'other': `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
};

const THEMES = {
    'theme-orange': { color: 'var(--c-orange)', bg: 'var(--bg-orange)', hex: '#ff9f43' },
    'theme-blue': { color: 'var(--c-blue)', bg: 'var(--bg-blue)', hex: '#0abde3' },
    'theme-pink': { color: 'var(--c-pink)', bg: 'var(--bg-pink)', hex: '#f368e0' },
    'theme-purple': { color: 'var(--c-purple)', bg: 'var(--bg-purple)', hex: '#5f27cd' },
    'theme-green': { color: 'var(--c-green)', bg: 'var(--bg-green)', hex: '#10ac84' },
    'theme-red': { color: 'var(--c-red)', bg: 'var(--bg-red)', hex: '#e74c3c' },
    'theme-gray': { color: 'var(--text-main)', bg: 'var(--bg-gray)', hex: '#8395a7' },
    'theme-yellow': { color: '#f1c40f', bg: '#fef9e7', hex: '#f1c40f' },
    'theme-cyan': { color: '#00cec9', bg: '#e6fbfc', hex: '#00cec9' },
    'theme-indigo': { color: '#3c40c6', bg: '#ebebfa', hex: '#3c40c6' },
    'theme-chocolate': { color: '#d35400', bg: '#faeee6', hex: '#d35400' },
    'theme-teal': { color: '#006266', bg: '#e6efef', hex: '#006266' }
};

const WALLET_THEMES = [
    { id: 'wt-blue', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }, 
    { id: 'wt-green', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }, 
    { id: 'wt-purple', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }, 
    { id: 'wt-orange', background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' }, 
    { id: 'wt-dark', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }, 
    { id: 'wt-pink', background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' }, 
    { id: 'wt-cyan', background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' }, 
    { id: 'wt-red', background: 'linear-gradient(135deg, #ed213a 0%, #93291e 100%)' }, 
    { id: 'wt-sunset', background: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)' }, 
    { id: 'wt-cherry', background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' }, 
    { id: 'wt-gold', background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)' }, 
    { id: 'wt-flare', background: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' }, 
    { id: 'wt-mango', background: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)' }, 
    { id: 'wt-kyoto', background: 'linear-gradient(135deg, #c21500 0%, #ffc500 100%)' },
    { id: 'wt-peach', background: 'linear-gradient(135deg, #ed4264 0%, #ffedbc 100%)' },
    { id: 'wt-blood-orange', background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)' },
    { id: 'wt-sun-veg', background: 'linear-gradient(135deg, #f09819 0%, #edde5d 100%)' },
    { id: 'wt-ocean', background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' }, 
    { id: 'wt-frost', background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)' }, 
    { id: 'wt-sea-blizz', background: 'linear-gradient(135deg, #1cd8d2 0%, #93edc7 100%)' }, 
    { id: 'wt-dusk', background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)' }, 
    { id: 'wt-deep-sea', background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' },
    { id: 'wt-blue-sky', background: 'linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)' },
    { id: 'wt-water', background: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)' },
    { id: 'wt-blue-raspberry', background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)' },
    { id: 'wt-clear-water', background: 'linear-gradient(135deg, #396afc 0%, #2948ff 100%)' },
    { id: 'wt-midnight', background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)' }, 
    { id: 'wt-deep-purple', background: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' }, 
    { id: 'wt-mauve', background: 'linear-gradient(135deg, #42275a 0%, #734b6d 100%)' }, 
    { id: 'wt-50-shades', background: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)' }, 
    { id: 'wt-berry', background: 'linear-gradient(135deg, #c31432 0%, #240b36 100%)' }, 
    { id: 'wt-namn', background: 'linear-gradient(135deg, #a73737 0%, #7a2828 100%)' }, 
    { id: 'wt-coal', background: 'linear-gradient(135deg, #eb5757 0%, #000000 100%)' },
    { id: 'wt-space', background: 'linear-gradient(135deg, #434343 0%, #000000 100%)' },
    { id: 'wt-royal', background: 'linear-gradient(135deg, #141517 0%, #2e2f33 100%)' },
    { id: 'wt-rose', background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' }, 
    { id: 'wt-piglet', background: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)' }, 
    { id: 'wt-bloody-mary', background: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)' },
    { id: 'wt-cotton-candy', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { id: 'wt-lavender', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
    { id: 'wt-pink-water', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { id: 'wt-milky', background: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)' },
    { id: 'wt-teal', background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' }, 
    { id: 'wt-emerald', background: 'linear-gradient(135deg, #348F50 0%, #56B4D3 100%)' }, 
    { id: 'wt-forest', background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' }, 
    { id: 'wt-lush', background: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' }, 
    { id: 'wt-green-beach', background: 'linear-gradient(135deg, #02aab0 0%, #00cdac 100%)' },
    { id: 'wt-bamboo', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { id: 'wt-cyberpunk', background: 'linear-gradient(135deg, #ff00cc 0%, #333399 100%)' },
    { id: 'wt-synthwave', background: 'linear-gradient(135deg, #b92b27 0%, #1565c0 100%)' },
    { id: 'wt-neon-blue', background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)' },
    { id: 'wt-matrix', background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
    { id: 'wt-disco', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'wt-flat-blue', background: '#3498db' },
    { id: 'wt-flat-green', background: '#2ecc71' },
    { id: 'wt-flat-purple', background: '#9b59b6' },
    { id: 'wt-flat-navy', background: '#34495e' },
    { id: 'wt-flat-orange', background: '#e67e22' },
    { id: 'wt-flat-red', background: '#e74c3c' },
    { id: 'wt-flat-teal', background: '#1abc9c' },
    { id: 'wt-svg-carbon', background: 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' viewBox=\'0 0 16 16\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h16v16H0V0zm8 8h8v8H8V8zM0 8h8v8H0V8z\' fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E"), linear-gradient(135deg, #2b2d42 0%, #1a1a24 100%)' },
    { id: 'wt-svg-stripes', background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\' fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E"), linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
    { id: 'wt-svg-circuit', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0v20h20V0H0zm10 17a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-2a5 5 0 1 0 0-10 5 5 0 0 0 0 10z\' fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E"), linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'wt-svg-gold-mesh', background: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'12\' viewBox=\'0 0 12 12\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M5 0h2v12H5V0zm-5 5h12v2H0V5z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E"), linear-gradient(135deg, #f09819 0%, #edde5d 100%)' },
    { id: 'wt-svg-honeycomb', background: 'url("data:image/svg+xml,%3Csvg width=\'28\' height=\'49\' viewBox=\'0 0 28 49\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z\'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
    { id: 'wt-svg-brushed', background: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(135deg, #2c3e50 0%, #000000 100%)' },
    { id: 'wt-svg-radar', background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\' stroke-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'10\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'20\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'30\'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
    { id: 'wt-svg-crosshatch', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M-2 22 L22 -2 M-2 -2 L22 22\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\' stroke-opacity=\'0.08\'/%3E%3C/svg%3E"), linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' },
    { id: 'wt-svg-waves', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 Q 5 5, 10 10 T 20 10\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\' stroke-opacity=\'0.15\'/%3E%3C/svg%3E"), linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { id: 'wt-svg-dots', background: 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' viewBox=\'0 0 16 16\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'1\' fill=\'%23ffffff\' fill-opacity=\'0.15\'/%3E%3C/svg%3E"), linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'wt-svg-chevron', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10l10-10 10 10M0 20l10-10 10 10\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\' stroke-opacity=\'0.1\'/%3E%3C/svg%3E"), linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' },
    { id: 'wt-svg-polygon', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 0l10 10-10 10L0 10z\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\' stroke-opacity=\'0.08\'/%3E%3C/svg%3E"), linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }
];

const APP_THEMES = [
    { id: 'bg-default', background: '' },
    { id: 'bg-solid-slate', background: '#f8fafc' },
    { id: 'bg-solid-cream', background: '#fdfbf7' },
    { id: 'bg-solid-mint', background: '#f0fdf4' },
    { id: 'bg-solid-rose', background: '#fff1f2' },
    { id: 'bg-solid-ivory', background: '#fffff0' },
    { id: 'bg-solid-charcoal', background: '#36454f' },
    { id: 'bg-solid-night', background: '#0f172a' },
    { id: 'bg-solid-navy', background: '#1e1b4b' },
    { id: 'bg-sky', background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)' },
    { id: 'bg-peach', background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' },
    { id: 'bg-mint-grad', background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)' },
    { id: 'bg-warm', background: 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)' },
    { id: 'bg-clean', background: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)' },
    { id: 'bg-pinkish', background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
    { id: 'bg-lavender', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
    { id: 'bg-cotton-candy', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { id: 'bg-lemon', background: 'linear-gradient(120deg, #f6d365 0%, #ffb142 100%)' },
    { id: 'bg-cloud', background: 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)' },
    { id: 'bg-rose-water', background: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)' },
    { id: 'bg-night-grad', background: 'linear-gradient(to right, #434343 0%, black 100%)' },
    { id: 'bg-deepsea', background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' },
    { id: 'bg-purple-dark', background: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)' },
    { id: 'bg-forest-dark', background: 'linear-gradient(to right, #134e5e, #71b280)' },
    { id: 'bg-midnight', background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)' },
    { id: 'bg-space', background: 'linear-gradient(to right, #141517, #2e2f33)' },
    { id: 'bg-obsidian', background: 'linear-gradient(to right, #000000, #434343)' },
    { id: 'bg-abyss', background: 'linear-gradient(to right, #000428, #004e92)' },
    { id: 'bg-berry-dark', background: 'linear-gradient(to right, #240b36, #c31432)' },
    { id: 'bg-dark-ocean', background: 'linear-gradient(to top, #09203f 0%, #537895 100%)' },
    { id: 'bg-void', background: 'linear-gradient(to right, #000000 0%, #1a1a1a 100%)' },
    { id: 'bg-sunset', background: 'linear-gradient(to right, #ff4e50, #f9d423)' },
    { id: 'bg-cherry', background: 'linear-gradient(to right, #eb3349, #f45c43)' },
    { id: 'bg-mango', background: 'linear-gradient(to right, #ffe259, #ffa751)' },
    { id: 'bg-fire', background: 'linear-gradient(to right, #f12711, #f5af19)' },
    { id: 'bg-blood', background: 'linear-gradient(to right, #ed213a, #93291e)' },
    { id: 'bg-flame', background: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)' },
    { id: 'bg-orange-juice', background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' },
    { id: 'bg-ocean', background: 'linear-gradient(to right, #2193b0, #6dd5ed)' },
    { id: 'bg-leaf', background: 'linear-gradient(to right, #11998e, #38ef7d)' },
    { id: 'bg-sand', background: 'linear-gradient(to right, #c9d6ff, #e2e2e2)' },
    { id: 'bg-wood', background: 'linear-gradient(to right, #603813, #b29f94)' },
    { id: 'bg-water', background: 'linear-gradient(to right, #00c9ff, #92fe9d)' },
    { id: 'bg-moss', background: 'linear-gradient(to top, #13547a 0%, #80d0c7 100%)' },
    { id: 'bg-earth', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
    { id: 'bg-stone', background: 'linear-gradient(to right, #8e9eab 0%, #eef2f3 100%)' },
    { id: 'bg-aurora', background: 'linear-gradient(45deg, #00d2ff 0%, #3a7bd5 100%)' },
    { id: 'bg-cyber', background: 'linear-gradient(45deg, #ff00cc 0%, #333399 100%)' },
    { id: 'bg-holographic', background: 'linear-gradient(45deg, #8a2387 0%, #e94057 50%, #f27121 100%)' },
    { id: 'bg-glass', background: 'linear-gradient(45deg, #a8c0ff 0%, #3f2b96 100%)' },
    { id: 'bg-dusk-grad', background: 'linear-gradient(45deg, #ffd89b 0%, #19547b 100%)' },
    { id: 'bg-twilight', background: 'linear-gradient(45deg, #ff512f 0%, #dd2476 100%)' },
    { id: 'bg-northern-lights', background: 'linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)' },
    { id: 'bg-synthwave', background: 'linear-gradient(to top, #b92b27 0%, #1565c0 100%)' },
    { id: 'bg-neon-blue', background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)' },
    { id: 'bg-miami', background: 'linear-gradient(to right, #fc4a1a, #f7b733)' },
    { id: 'bg-retro', background: 'linear-gradient(to right, #3f2b96, #a8c0ff)' },
    { id: 'bg-svg-dots', background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'2\' fill=\'%23cbd5e1\' fill-opacity=\'0.3\'/%3E%3C/svg%3E") #f8fafc' },
    { id: 'bg-svg-grid', background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z\' fill=\'%2394a3b8\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E") #f1f5f9' },
    { id: 'bg-svg-waves', background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M21.184 20c.302-4.074 2.149-7.44 5.542-10.101C30.114 7.238 34.62 5.9 40 5.9c5.22 0 9.53 1.258 12.935 3.774 3.405 2.515 5.338 5.968 5.8 10.326L60 20h40V0H0v20h21.184z\' fill=\'%2394a3b8\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E") #f8fafc' },
    { id: 'bg-svg-topography', background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2394a3b8\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") #ffffff' }
];

const DEFAULT_CATEGORIES = {
    'exp_food': { name: 'Ăn uống', type: 'expense', icon: 'food', color: 'theme-orange', order: 1 },
    'exp_transport': { name: 'Đi lại', type: 'expense', icon: 'transport', color: 'theme-blue', order: 2 },
    'exp_shopping': { name: 'Mua sắm', type: 'expense', icon: 'shopping', color: 'theme-pink', order: 3 },
    'exp_bill': { name: 'Hóa đơn', type: 'expense', icon: 'bill', color: 'theme-purple', order: 4 },
    'inc_sales': { name: 'Tiền bán hàng', type: 'income', icon: 'sales', color: 'theme-green', order: 1 },
    'inc_salary': { name: 'Tiền lương', type: 'income', icon: 'salary', color: 'theme-blue', order: 2 },
    'inc_other': { name: 'Khác', type: 'income', icon: 'other', color: 'theme-gray', order: 3 },
    'exp_other': { name: 'Khác', type: 'expense', icon: 'other', color: 'theme-gray', order: 5 }
};

const formatter = new Intl.NumberFormat('vi-VN'); 
const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

let toastTimeout;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toastMsg');
    if (!toast) return;
    toast.innerHTML = type === 'success' ? `✓ ${message}` : `⚠ ${message}`;
    toast.className = `toast show ${type}`;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

function getFormattedDate() {
    const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const todayStr = getFormattedDate();
function formatNiceDate(ymdStr) {
    if(!ymdStr) return ''; const [y, m, d] = ymdStr.split('-'); return (ymdStr === todayStr) ? `Hôm nay, ${d}/${m}/${y}` : `${d}/${m}/${y}`;
}

function getAuthErrorVN(code) {
    switch(code) {
        case 'auth/invalid-email': return 'Tên đăng nhập không hợp lệ!';
        case 'auth/wrong-password': return 'Sai mật khẩu!';
        case 'auth/user-not-found': return 'Tài khoản không tồn tại!';
        case 'auth/invalid-credential': return 'Thông tin đăng nhập không chính xác!';
        default: return 'Có lỗi xảy ra. Vui lòng thử lại!';
    }
}

// ==========================================
// 2. ĐIỀU HƯỚNG TAB (BOTTOM NAVIGATION)
// ==========================================
const tabHome = document.getElementById('tabHome');
const tabHistory = document.getElementById('tabHistory');
const tabStats = document.getElementById('tabStats');
const tabDebt = document.getElementById('tabDebt');
const tabAdmin = document.getElementById('tabAdmin');
const tabSettings = document.getElementById('tabSettings');

const homeView = document.getElementById('homeView');
const historyView = document.getElementById('historyView');
const analyticsView = document.getElementById('analyticsView');
const debtView = document.getElementById('debtView');
const adminView = document.getElementById('adminView');
const settingsView = document.getElementById('settingsView');

let userFullName = ""; 

function switchTab(tabName) {
    [tabHome, tabHistory, tabStats, tabDebt, tabAdmin, tabSettings].forEach(t => t?.classList.remove('active'));
    [homeView, historyView, analyticsView, debtView, adminView, settingsView].forEach(v => v?.classList.remove('active'));
    
    const topNavTitle = document.querySelector('.top-nav h1');
    const userMenu = document.getElementById('userMenu');
    const dropdownMenu = document.getElementById('dropdownMenu'); 

    if (tabName === 'home') {
        tabHome?.classList.add('active'); homeView?.classList.add('active');
        if (topNavTitle) topNavTitle.innerText = 'QUẢN LÝ CHI TIÊU';
        if (userMenu) userMenu.style.display = 'block'; 
    } else {
        if (userMenu) userMenu.style.display = 'none'; 
        if (dropdownMenu) dropdownMenu.classList.remove('show'); 
        
        if (tabName === 'history') {
            tabHistory?.classList.add('active'); historyView?.classList.add('active');
            if (topNavTitle) topNavTitle.innerText = 'LỊCH SỬ THU/CHI';
            
        } else if (tabName === 'stats') {
            tabStats?.classList.add('active'); analyticsView?.classList.add('active');
            if (topNavTitle) topNavTitle.innerText = 'THỐNG KÊ';
            // Chờ hiệu ứng chuyển tab hoàn tất rồi mới vẽ biểu đồ (Tránh giật lag)
            setTimeout(() => { requestAnimationFrame(() => renderCharts()); }, 50);
            
        } else if (tabName === 'debt') {
            tabDebt?.classList.add('active'); debtView?.classList.add('active');
            if (topNavTitle) topNavTitle.innerText = 'SỔ VAY & NỢ';
            if(typeof renderDebtUI === 'function') renderDebtUI();
            
        } else if (tabName === 'admin') {
            tabAdmin?.classList.add('active'); adminView?.classList.add('active');
            if (topNavTitle) topNavTitle.innerText = 'QUẢN TRỊ HỆ THỐNG';
            loadAllUsers();
            
        } else if (tabName === 'settings') {
            tabSettings?.classList.add('active'); settingsView?.classList.add('active');
            if (topNavTitle) topNavTitle.innerText = userFullName ? userFullName.toUpperCase() : 'CÀI ĐẶT';
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabHome?.addEventListener('click', () => switchTab('home'));
tabHistory?.addEventListener('click', () => switchTab('history'));
tabStats?.addEventListener('click', () => switchTab('stats'));
tabDebt?.addEventListener('click', () => switchTab('debt'));
tabAdmin?.addEventListener('click', () => switchTab('admin'));
tabSettings?.addEventListener('click', () => switchTab('settings'));

document.getElementById('btnPieExp')?.addEventListener('click', function() {
    this.classList.add('active', 'expense');
    document.getElementById('btnPieInc')?.classList.remove('active', 'income');
    currentPieType = 'expense';
    renderCharts();
});

document.getElementById('btnPieInc')?.addEventListener('click', function() {
    this.classList.add('active', 'income');
    document.getElementById('btnPieExp')?.classList.remove('active', 'expense');
    currentPieType = 'income';
    renderCharts();
});

document.getElementById('btnSettingsCatManager')?.addEventListener('click', openCatManager);
document.getElementById('btnSettingsWalletTheme')?.addEventListener('click', openWalletThemeModal);
document.getElementById('btnSettingsAppTheme')?.addEventListener('click', openAppThemeModal);
document.getElementById('btnSettingsChangePwd')?.addEventListener('click', () => { 
    document.getElementById('changePwdOverlay')?.classList.remove('hide'); 
});
document.getElementById('btnSettingsLogout')?.addEventListener('click', () => {
    if(confirm('Bạn muốn đăng xuất?')) {
        auth.signOut().then(() => { 
            if(txRef) txRef.off(); 
            if(catRef) catRef.off(); 
            applyWalletTheme('wt-blue', false);
            applyAppTheme('bg-default', false);
            localStorage.removeItem('walletTheme');
            localStorage.removeItem('appTheme');
            showToast('Đã đăng xuất'); 
            switchTab('home');
        });
    }
});
document.getElementById('btnSettingsDarkMode')?.addEventListener('click', () => {
    const newIsDark = !document.body.classList.contains('dark-theme');
    applyDarkMode(newIsDark);
    localStorage.setItem('darkMode', newIsDark);
    if (document.getElementById('analyticsView')?.classList.contains('active')) renderCharts();
});

// ==========================================
// 3. LOGIC AUTH & TẢI DỮ LIỆU ĐỘNG
// ==========================================
let transactions = [];
let categories = [];
let editingId = null; 
let selectedSheetId = null;
let editingCatId = null; 

const DATES_PER_PAGE = 3; 
let currentDateLimit = DATES_PER_PAGE;
let isBalanceHidden = true; 
let currentBalances = { total: 0, income: 0, expense: 0 };
let isFirstLoad = true;

let incSortable = null;
let expSortable = null;

window.addEventListener('DOMContentLoaded', () => {
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    
    const statsMonthPicker = document.getElementById('statsMonthPicker');
    const statsStartDate = document.getElementById('statsStartDate');
    const statsEndDate = document.getElementById('statsEndDate');

    if (statsMonthPicker) statsMonthPicker.value = `${y}-${m}`;
    if (statsStartDate) statsStartDate.value = `${y}-${m}-01`;
    if (statsEndDate) statsEndDate.value = `${y}-${m}-${d}`;
    
    function updateStatsDateUI() {
        const sVal = statsStartDate?.value;
        const eVal = statsEndDate?.value;
        const sWrapper = document.getElementById('statsStartDateWrapper');
        const eWrapper = document.getElementById('statsEndDateWrapper');

        if(sVal) {
            const [sy, sm, sd] = sVal.split('-');
            const disp = document.getElementById('statsStartDateDisplay');
            if (disp) disp.innerText = `${sd}/${sm}/${sy}`;
            sWrapper?.classList.add('active');
        } else {
            const disp = document.getElementById('statsStartDateDisplay');
            if (disp) disp.innerText = 'Từ ngày';
            sWrapper?.classList.remove('active');
        }

        if(eVal) {
            const [ey, em, ed] = eVal.split('-');
            const disp = document.getElementById('statsEndDateDisplay');
            if (disp) disp.innerText = `${ed}/${em}/${ey}`;
            eWrapper?.classList.add('active');
        } else {
            const disp = document.getElementById('statsEndDateDisplay');
            if (disp) disp.innerText = 'Đến ngày';
            eWrapper?.classList.remove('active');
        }
    }
    updateStatsDateUI();

    const btnModeRange = document.getElementById('btnModeRange');
    const btnModeMonth = document.getElementById('btnModeMonth');
    const statsFilterMode = document.getElementById('statsFilterMode');
    
    function switchStatsMode(mode) {
        if (statsFilterMode) statsFilterMode.value = mode;
        if (mode === 'range') {
            btnModeRange?.classList.add('active');
            if (btnModeRange) { btnModeRange.style.background = 'var(--primary)'; btnModeRange.style.color = 'white'; }
            btnModeMonth?.classList.remove('active');
            if (btnModeMonth) { btnModeMonth.style.background = 'var(--bg-color)'; btnModeMonth.style.color = 'var(--text-muted)'; }
            document.getElementById('statsRangeContainer')?.classList.remove('hide');
            document.getElementById('statsMonthContainer')?.classList.add('hide');
        } else {
            btnModeMonth?.classList.add('active');
            if (btnModeMonth) { btnModeMonth.style.background = 'var(--primary)'; btnModeMonth.style.color = 'white'; }
            btnModeRange?.classList.remove('active');
            if (btnModeRange) { btnModeRange.style.background = 'var(--bg-color)'; btnModeRange.style.color = 'var(--text-muted)'; }
            document.getElementById('statsMonthContainer')?.classList.remove('hide');
            document.getElementById('statsRangeContainer')?.classList.add('hide');
        }
        renderCharts();
    }

    btnModeRange?.addEventListener('click', () => switchStatsMode('range'));
    btnModeMonth?.addEventListener('click', () => switchStatsMode('month'));

    statsMonthPicker?.addEventListener('change', renderCharts);
    statsStartDate?.addEventListener('change', () => { updateStatsDateUI(); renderCharts(); });
    statsEndDate?.addEventListener('change', () => { updateStatsDateUI(); renderCharts(); });

    const savedUser = localStorage.getItem('savedUsername');
    if(savedUser) {
        const uIn = document.getElementById('usernameInput');
        const pIn = document.getElementById('passwordInput');
        const rIn = document.getElementById('rememberMe');
        if (uIn) uIn.value = savedUser;
        if (pIn) pIn.value = localStorage.getItem('savedPassword') || '';
        if (rIn) rIn.checked = true;
    }
    
    initCatFormGrids(); 
});

auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
		// Bơm mã số UID lên mặt sau của thẻ
        const uidEl = document.getElementById('cardBackUid');
        if (uidEl) uidEl.innerText = 'UID: ' + user.uid.substring(0, 8).toUpperCase();
        document.getElementById('authOverlay')?.classList.add('hide');
		document.getElementById('registerOverlay')?.classList.add('hide');
        
        const username = user.email.split('@')[0];
        const avatarImg = document.getElementById('avatarImg');
        if (avatarImg) avatarImg.src = `https://ui-avatars.com/api/?name=${username}&background=4361ee&color=fff&bold=true`;

        const userRef = db.ref(`users/${currentUser.uid}`);
        
        userRef.child('role').once('value').then(snap => {
            let userRole = snap.val();
            
            if (!userRole) {
                userRole = 'user'; 
                userRef.update({
                    email: currentUser.email,
                    role: userRole,
                    createdAt: new Date().toISOString()
                }).catch(err => console.error("Lỗi:", err));
            }

            currentUser.role = userRole;

            const tabAdminEl = document.getElementById('tabAdmin');
            if (userRole === 'admin') {
                tabAdminEl?.classList.remove('hide');
            } else {
                tabAdminEl?.classList.add('hide');
            }

            // Bơm "Member Since" ra mặt sau của thẻ Card
            userRef.child('createdAt').once('value').then(timeSnap => {
                const dateStr = timeSnap.val();
                if (dateStr) {
                    const d = new Date(dateStr);
                    const backDateEl = document.getElementById('cardBackDate');
                    if (backDateEl) backDateEl.innerText = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                }
            });
        });

        catRef = db.ref(`users/${currentUser.uid}/categories`);
        catRef.on('value', (snap) => {
            if(!snap.exists()) {
                catRef.set(DEFAULT_CATEGORIES);
            } else {
                const data = snap.val();
                categories = Object.keys(data).map(k => ({id: k, ...data[k]}));
                categories.sort((a, b) => (a.order || 0) - (b.order || 0));
                
                renderCategoryUI();
                const typeInput = document.getElementById('typeInput');
                if (typeInput) switchType(typeInput.value);
                if(transactions.length > 0) { updateUI(); renderCharts(); }
            }
        });

        txRef = db.ref(`users/${currentUser.uid}/transactions`);
        txRef.on('value', (snapshot) => {
            const data = snapshot.val();
            let loadedTransactions = [];
            if (data) {
                for (let dateKey in data) {
                    for (let txId in data[dateKey]) {
                        loadedTransactions.push({ id: Number(txId), date: dateKey, ...data[dateKey][txId] });
                    }
                }
            }
            transactions = loadedTransactions;
            updateUI();
            renderCharts(); 
        });
		// LOAD DỮ LIỆU SỔ VAY NỢ VÀ TÍNH TỔNG LÊN MÀN HÌNH CHÍNH
        db.ref(`users/${currentUser.uid}/debts`).on('value', (snap) => {
            debtsData = [];
            let totalLentPending = 0;
            let totalBorrowedPending = 0;

            if(snap.exists()) {
                const data = snap.val();
                for(let id in data) {
                    const d = { id, ...data[id] };
                    debtsData.push(d);
                    
                    // CẬP NHẬT: Tính tiền CÒN NỢ thay vì lấy nguyên cục
                    if (d.status === 'pending') {
                        const remain = d.amount - (d.paidAmount || 0);
                        if (d.type === 'lent') totalLentPending += remain;
                        if (d.type === 'borrowed') totalBorrowedPending += remain;
                    }
                }
            }
            
            currentBalances.lent = totalLentPending;
            currentBalances.borrowed = totalBorrowedPending;
            renderBalances();

            if(document.getElementById('debtView')?.classList.contains('active')) renderDebtUI();
        });
        const settingsRef = db.ref(`users/${currentUser.uid}/settings`);
        settingsRef.on('value', (snap) => {
            if (snap.exists()) {
                const settings = snap.val();
                if (settings.walletTheme) applyWalletTheme(settings.walletTheme, false);
                if (settings.appTheme) applyAppTheme(settings.appTheme, false);
            } else {
                applyWalletTheme('wt-blue', false);
                applyAppTheme('bg-default', false);
            }
            
            if (isFirstLoad) {
                document.getElementById('splashScreen')?.classList.add('hide');
                isFirstLoad = false;
            }
        });

        db.ref(`users/${currentUser.uid}/profile`).on('value', (snap) => {
            if (snap.exists()) {
                const p = snap.val();
                userFullName = p.name || "";
                const pName = document.getElementById('profileName');
                const pPhone = document.getElementById('profilePhone');
                if (pName) pName.value = userFullName;
                if (pPhone) pPhone.value = p.phone || "";
                
                let avatarName = userFullName ? userFullName : currentUser.email.split('@')[0];
                if (avatarImg) avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=4361ee&color=fff&bold=true`;
                
                const dropdownName = document.getElementById('dropdownName');
                if (currentUser.role === 'admin') {
                    if (dropdownName) dropdownName.innerText = `XIN CHÀO, ADMIN`;
                } else {
                    if (dropdownName) dropdownName.innerText = userFullName ? `XIN CHÀO, ${userFullName.toUpperCase()}` : 'XIN CHÀO';
                }
                
                if (p.avatarData && avatarImg) {
                    avatarImg.src = p.avatarData;
                }

                if(p.dob) {
                    const pDob = document.getElementById('profileDob');
                    const pDobDisp = document.getElementById('profileDobDisplay');
                    if (pDob) pDob.value = p.dob;
                    if (pDobDisp) pDobDisp.innerText = formatNiceDate(p.dob).replace('Hôm nay, ', '');
                }
            } else {
                userFullName = "";
                const dropdownName = document.getElementById('dropdownName');
                if (currentUser.role !== 'admin') {
                    if (dropdownName) dropdownName.innerText = 'XIN CHÀO';
                }
            }
            
            if (document.getElementById('settingsView')?.classList.contains('active')) {
                const topTitle = document.querySelector('.top-nav h1');
                if (topTitle) topTitle.innerText = userFullName ? userFullName.toUpperCase() : 'CÀI ĐẶT';
            }
        });
    } else {
        currentUser = null;
        document.getElementById('authOverlay')?.classList.remove('hide'); 
		document.getElementById('registerOverlay')?.classList.add('hide');
        transactions = []; categories = []; updateUI();
        
        if(pieChartInstance) pieChartInstance.destroy();
        if(barChartInstance) barChartInstance.destroy();
        
        if (isFirstLoad) {
            document.getElementById('splashScreen')?.classList.add('hide');
            isFirstLoad = false;
        }
    }
});

document.getElementById('btnLogin')?.addEventListener('click', () => {
    const username = document.getElementById('usernameInput')?.value.trim();
    const pwd = document.getElementById('passwordInput')?.value;
    const remember = document.getElementById('rememberMe')?.checked;
    if(!username || !pwd) { showToast('Vui lòng nhập đủ thông tin', 'error'); return; }

    const email = username.includes('@') ? username : `${username}@chitieu.com`;

    if(remember) {
        localStorage.setItem('savedUsername', username);
        localStorage.setItem('savedPassword', pwd);
    } else {
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
    }

    const persistence = remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
    auth.setPersistence(persistence)
        .then(() => auth.signInWithEmailAndPassword(email, pwd))
        .then(() => { showToast('Đăng nhập thành công!'); })
        .catch(err => showToast(getAuthErrorVN(err.code), 'error'));
});
// ==========================================
// TÍNH NĂNG ĐĂNG KÝ TÀI KHOẢN DÀNH CHO NGƯỜI MỚI (PUBLIC)
// ==========================================
// 1. Chuyển đổi qua lại giữa Form Đăng nhập và Đăng ký
document.getElementById('btnShowRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('authOverlay')?.classList.add('hide');
    document.getElementById('registerOverlay')?.classList.remove('hide');
});

document.getElementById('btnShowLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('registerOverlay')?.classList.add('hide');
    document.getElementById('authOverlay')?.classList.remove('hide');
});

// 2. Logic xử lý Đăng ký
document.getElementById('btnSubmitRegister')?.addEventListener('click', () => {
    const name = document.getElementById('regNameInput')?.value.trim();
    let username = document.getElementById('regUsernameInput')?.value.trim();
    const pwd = document.getElementById('regPasswordInput')?.value;

    if(!name || !username || !pwd) { showToast('Vui lòng nhập đủ thông tin', 'error'); return; }
    if(pwd.length < 6) { showToast('Mật khẩu phải từ 6 ký tự!', 'error'); return; }

    // Tự động ghim đuôi email
    let email = username.includes('@') ? username : `${username}@chitieu.com`;

    const btn = document.getElementById('btnSubmitRegister');
    if(btn) { btn.innerText = 'Đang xử lý...'; btn.disabled = true; }

    // Sử dụng app chính của Firebase vì người dùng đăng ký xong sẽ được đăng nhập tự động luôn
    auth.createUserWithEmailAndPassword(email, pwd)
        .then((userCredential) => {
            const newUid = userCredential.user.uid;
            
            // Khởi tạo Role "user" mặc định và cấu hình
            const userData = { email: email, role: 'user', createdAt: new Date().toISOString() };
            
            return db.ref(`users/${newUid}`).set(userData).then(() => {
                return db.ref(`users/${newUid}/profile`).set({ name: name });
            });
        })
        .then(() => {
            showToast('Đăng ký thành công!');
            document.getElementById('registerOverlay')?.classList.add('hide');
            // Ghi chú: Firebase sẽ tự động trigger hàm onAuthStateChanged và đăng nhập, tải dữ liệu luôn.
        })
        .catch((error) => {
            let errorMsg = getAuthErrorVN(error.code);
            if(error.code === 'auth/email-already-in-use') { errorMsg = 'Tên tài khoản này đã được sử dụng!'; }
            showToast(errorMsg || 'Lỗi khi đăng ký', 'error');
        })
        .finally(() => {
            if(btn) { 
                btn.innerHTML = 'Đăng ký <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'; 
                btn.disabled = false; 
            }
        });
});
const changePwdOverlay = document.getElementById('changePwdOverlay');

document.getElementById('btnCancelChangePwd')?.addEventListener('click', () => { 
    changePwdOverlay?.classList.add('hide'); 
    const oPwd = document.getElementById('oldPasswordInput');
    const nPwd = document.getElementById('newPasswordInput');
    const cPwd = document.getElementById('confirmNewPasswordInput');
    if (oPwd) oPwd.value = ''; 
    if (nPwd) nPwd.value = ''; 
    if (cPwd) cPwd.value = '';
});

document.getElementById('btnSubmitChangePwd')?.addEventListener('click', () => {
    const oldPwd = document.getElementById('oldPasswordInput')?.value;
    const newPwd = document.getElementById('newPasswordInput')?.value;
    const confirmNewPwd = document.getElementById('confirmNewPasswordInput')?.value;

    if(!oldPwd) { showToast('Vui lòng nhập mật khẩu hiện tại!', 'error'); return; }
    if(newPwd.length < 6) { showToast('Mật khẩu mới phải từ 6 ký tự!', 'error'); return; }
    
    if(newPwd !== confirmNewPwd) { 
        showToast('Mật khẩu nhập lại không khớp!', 'error'); 
        return; 
    }

    const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, oldPwd);
    currentUser.reauthenticateWithCredential(credential).then(() => {
        currentUser.updatePassword(newPwd).then(() => {
            showToast('Đổi mật khẩu thành công!');
            changePwdOverlay?.classList.add('hide');
            const oPwd = document.getElementById('oldPasswordInput');
            const nPwd = document.getElementById('newPasswordInput');
            const cPwd = document.getElementById('confirmNewPasswordInput');
            if (oPwd) oPwd.value = ''; 
            if (nPwd) nPwd.value = '';
            if (cPwd) cPwd.value = '';
            if(localStorage.getItem('savedUsername')) localStorage.setItem('savedPassword', newPwd);
        }).catch((error) => { showToast(getAuthErrorVN(error.code), 'error'); });
    }).catch((error) => {
        if(error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') showToast('Mật khẩu hiện tại không đúng!', 'error');
        else showToast(getAuthErrorVN(error.code), 'error');
    });
});

document.getElementById('btnToggleEye')?.addEventListener('click', () => {
    isBalanceHidden = !isBalanceHidden;
    const eyeOpen = document.getElementById('iconEyeOpen');
    const eyeClosed = document.getElementById('iconEyeClosed');
    if(isBalanceHidden) { 
        eyeOpen?.classList.add('hide'); 
        eyeClosed?.classList.remove('hide'); 
    } else { 
        eyeOpen?.classList.remove('hide'); 
        eyeClosed?.classList.add('hide'); 
    }
    renderBalances();
});

function renderBalances() {
    const tBal = document.getElementById('totalBalance');
    const tInc = document.getElementById('totalIncome');
    const tExp = document.getElementById('totalExpense');
    const tLent = document.getElementById('totalLent');
    const tBor = document.getElementById('totalBorrowed');

    if(isBalanceHidden) {
        if (tBal) tBal.innerText = '******';
        if (tInc) tInc.innerText = '******';
        if (tExp) tExp.innerText = '******';
        if (tLent) tLent.innerText = '******';
        if (tBor) tBor.innerText = '******';
    } else {
        // Thay currencyFormatter bằng formatter để không bị double ký tự 'đ'
        if (tBal) tBal.innerText = formatter.format(currentBalances.total || 0) + 'đ';
        if (tInc) tInc.innerText = '+' + formatter.format(currentBalances.income || 0) + 'đ';
        if (tExp) tExp.innerText = '-' + formatter.format(currentBalances.expense || 0) + 'đ';
        
        if (tLent) tLent.innerText = (currentBalances.lent > 0 ? '+' : '') + formatter.format(currentBalances.lent || 0) + 'đ';
        if (tBor) tBor.innerText = (currentBalances.borrowed > 0 ? '-' : '') + formatter.format(currentBalances.borrowed || 0) + 'đ';
    }

    // --- BẮT ĐẦU: CẢM BIẾN ĐỔI MÀU THẺ THEO SỐ DƯ ---
    const walletCard = document.querySelector('.wallet-card');
    if (walletCard) {
        // Xóa các trạng thái cũ trước khi kiểm tra
        walletCard.classList.remove('broke-mode', 'rich-mode');
        
        // Cập nhật trạng thái mới dựa trên Tổng số dư
        if (currentBalances.total >= 0 && currentBalances.total < 100000) {
            walletCard.classList.add('broke-mode'); // Dưới 100k -> Thẻ xám xịt
        } else if (currentBalances.total >= 10000000) {
            walletCard.classList.add('rich-mode');  // Trên 10 Triệu -> Hào quang Vàng
        }
    }
    // --- KẾT THÚC CẢM BIẾN ---
}

// ==========================================
// 4. RENDER & QUẢN LÝ DANH MỤC ĐỘNG
// ==========================================
function renderCategoryUI() {
    const scroll = document.getElementById('categoryScroll');
    if (!scroll) return;
    scroll.innerHTML = '';

    // --- THUẬT TOÁN SMART GRID: Đếm tần suất sử dụng ---
    const catFreq = {};
    // Phân tích các giao dịch để bắt đúng thói quen hiện tại
    transactions.forEach(t => {
        catFreq[t.categoryId] = (catFreq[t.categoryId] || 0) + 1;
    });

    // Tạo mảng clone và sắp xếp: Thằng nào dùng nhiều ngoi lên trước
    let smartCategories = [...categories].sort((a, b) => {
        const fA = catFreq[a.id] || 0;
        const fB = catFreq[b.id] || 0;
        if (fB !== fA) return fB - fA; // Ưu tiên tần suất
        return (a.order || 0) - (b.order || 0); // Trùng tần suất thì dựa vào cài đặt gốc
    });
    
    smartCategories.forEach(c => {
        const div = document.createElement('div');
        div.className = `cat-pill opt-${c.type} hide`;
        div.setAttribute('data-id', c.id);
        div.setAttribute('data-val', c.name);
        div.style.setProperty('--cat-color', THEMES[c.color]?.color || 'var(--primary)');
        div.style.setProperty('--cat-bg', THEMES[c.color]?.bg || '#eef2ff');
        
        // Render UI lưới: Icon nằm trên trong ô vuông, chữ nằm dưới
        div.innerHTML = `
            <div class="pill-icon" style="background: var(--cat-bg); color: var(--cat-color); width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px auto; transition: 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${SVG_LIB[c.icon].match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1] || ''}</svg>
            </div> 
            <span style="display:block; width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.name}</span>
        `;
        
        div.onclick = () => {
            // Rung phản hồi (nếu đt hỗ trợ)
            if (navigator.vibrate) navigator.vibrate(10);
            document.querySelectorAll('#categoryScroll .cat-pill').forEach(p => p.classList.remove('active'));
            div.classList.add('active');
            const catIdInput = document.getElementById('categoryIdInput');
            const catNameInput = document.getElementById('categoryNameInput');
            if (catIdInput) catIdInput.value = c.id;
            if (catNameInput) catNameInput.value = c.name;
        };
        scroll.appendChild(div);
    });

    // === CẢI TIẾN MULTI-SELECT DANH MỤC LỊCH SỬ ===
    const histCatScroll = document.getElementById('historyCategoryFilter');
    if (histCatScroll) {
        // 1. Lưu lại các danh mục đang được chọn (tránh bị reset khi update UI)
        const activePills = Array.from(histCatScroll.querySelectorAll('.cat-pill.active'));
        const currentFilters = activePills.map(p => p.getAttribute('data-filter')).filter(f => f !== '');
        
        histCatScroll.innerHTML = '<div class="cat-pill" data-filter="">Tất cả</div>';
        
        categories.forEach(c => {
            const theme = THEMES[c.color] || THEMES['theme-gray'];
            histCatScroll.innerHTML += `
                <div class="cat-pill" data-filter="${c.name}">
                    <div class="pill-icon" style="color: ${theme.color}">${SVG_LIB[c.icon] || ''}</div> ${c.name}
                </div>
            `;
        });
        
        // 2. Khôi phục trạng thái active
        const allBtn = histCatScroll.querySelector('.cat-pill[data-filter=""]');
        if (currentFilters.length === 0) {
            allBtn.classList.add('active');
        } else {
            currentFilters.forEach(f => {
                const p = histCatScroll.querySelector(`.cat-pill[data-filter="${f}"]`);
                if(p) p.classList.add('active');
            });
        }

        // 3. Xử lý logic Click chọn nhiều (Multi-select)
        histCatScroll.querySelectorAll('.cat-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const filterVal = pill.getAttribute('data-filter');
                
                if (filterVal === '') {
                    // Nếu bấm "Tất cả" -> Xóa màu mọi nút khác, chỉ bôi màu "Tất cả"
                    histCatScroll.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                } else {
                    // Nếu bấm danh mục cụ thể -> Tắt "Tất cả", Đảo trạng thái nút hiện tại
                    allBtn.classList.remove('active');
                    pill.classList.toggle('active');
                    
                    // Nếu người dùng lỡ tắt hết mọi nút -> Tự động bật lại "Tất cả"
                    const hasActive = histCatScroll.querySelector('.cat-pill.active');
                    if (!hasActive) allBtn.classList.add('active');
                }
                
                currentDateLimit = DATES_PER_PAGE;
                updateUI();
            });
        });
    }
    // ==============================================

    const incList = document.getElementById('incomeCatList');
    const expList = document.getElementById('expenseCatList');
    if (incList) incList.innerHTML = ''; 
    if (expList) expList.innerHTML = '';
    
    categories.forEach(c => {
        const theme = THEMES[c.color] || THEMES['theme-gray'];
        const svgContent = SVG_LIB[c.icon] ? SVG_LIB[c.icon].match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1] || '' : '';
        const itemHTML = `
            <div class="cat-item" data-id="${c.id}">
                <div class="cat-item-left">
                    <div class="drag-handle" title="Kéo để sắp xếp"><svg viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line></svg></div>
                    <div class="cat-item-icon" style="background-color: ${theme.bg}; color: ${theme.color}; width:32px; height:32px; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                        <svg style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgContent}</svg>
                    </div>
                    ${c.name}
                </div>
                <div class="cat-item-actions">
                    <svg onclick="openCatForm('${c.id}')" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    <svg onclick="deleteCat('${c.id}')" style="color:var(--danger)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
            </div>
        `;
        if(c.type === 'income' && incList) incList.innerHTML += itemHTML;
        else if(c.type === 'expense' && expList) expList.innerHTML += itemHTML;
    });

    initSortable();
}

function initSortable() {
    if(expSortable) expSortable.destroy();
    if(incSortable) incSortable.destroy();

    const opt = {
        handle: '.drag-handle',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function (evt) { saveCategoryOrder(evt.to.id); }
    };

    const expEl = document.getElementById('expenseCatList');
    const incEl = document.getElementById('incomeCatList');
    if (expEl) expSortable = new Sortable(expEl, opt);
    if (incEl) incSortable = new Sortable(incEl, opt);
}

function saveCategoryOrder(listId) {
    const listEl = document.getElementById(listId);
    if (!listEl) return;
    const items = listEl.querySelectorAll('.cat-item');
    const updates = {};
    
    items.forEach((item, index) => {
        const catId = item.getAttribute('data-id');
        updates[`${catId}/order`] = index;
    });

    if (Object.keys(updates).length > 0 && currentUser) {
        db.ref(`users/${currentUser.uid}/categories`).update(updates).catch(err => showToast('Lỗi lưu thứ tự', 'error'));
    }
}

function initCatFormGrids() {
    const iGrid = document.getElementById('iconGrid');
    if (iGrid) {
        iGrid.innerHTML = '';
        for(let key in SVG_LIB) {
            const div = document.createElement('div');
            div.className = 'icon-box';
            div.innerHTML = SVG_LIB[key];
            div.onclick = () => {
                document.querySelectorAll('.icon-box').forEach(el => el.classList.remove('active'));
                div.classList.add('active');
                const cIconInput = document.getElementById('catIconInput');
                if (cIconInput) cIconInput.value = key;
            };
            iGrid.appendChild(div);
        }
    }

    const cGrid = document.getElementById('colorGrid');
    if (cGrid) {
        cGrid.innerHTML = '';
        for(let key in THEMES) {
            const div = document.createElement('div');
            div.className = 'color-circle';
            div.style.backgroundColor = THEMES[key].color;
            div.onclick = () => {
                document.querySelectorAll('.color-circle').forEach(el => el.classList.remove('active'));
                div.classList.add('active');
                const cColorInput = document.getElementById('catColorInput');
                if (cColorInput) cColorInput.value = key;
            };
            cGrid.appendChild(div);
        }
    }
}

function openCatManager() {
    document.getElementById('catManagerOverlay')?.classList.add('show');
    document.getElementById('catManagerModal')?.classList.add('show');
}
window.openCatManager = openCatManager;

function closeCatManager() {
    document.getElementById('catManagerOverlay')?.classList.remove('show');
    document.getElementById('catManagerModal')?.classList.remove('show');
}
window.closeCatManager = closeCatManager;

function setCatFormType(type) {
    document.getElementById('btnCatTypeInc')?.classList.toggle('active', type === 'income');
    document.getElementById('btnCatTypeExp')?.classList.toggle('active', type === 'expense');
    const cFormType = document.getElementById('catFormTypeInput');
    if (cFormType) cFormType.value = type;
	const budgetGroup = document.getElementById('budgetLimitGroup');
    if(budgetGroup) budgetGroup.style.display = type === 'expense' ? 'block' : 'none';
}
window.setCatFormType = setCatFormType;

function openCatForm(id = null, defaultType = 'expense') {
    editingCatId = id;
    document.getElementById('catManagerOverlay')?.classList.remove('show');
    document.getElementById('catManagerModal')?.classList.remove('show');
    
    document.getElementById('catFormOverlay')?.classList.add('show');
    document.getElementById('catFormModal')?.classList.add('show');
    
    document.querySelectorAll('.icon-box, .color-circle').forEach(el => el.classList.remove('active'));

    const cFormTitle = document.getElementById('catFormTitle');
    const cNameInput = document.getElementById('catNameInput');
    const cIconInput = document.getElementById('catIconInput');
    const cColorInput = document.getElementById('catColorInput');
    const btnSaveCat = document.getElementById('btnSaveCat');

    // MỚI THÊM: Lấy element ngân sách
    const cBudgetRaw = document.getElementById('catBudgetRaw');
    const cBudgetDisplay = document.getElementById('catBudgetDisplay');

    if (id) {
        const c = categories.find(x => x.id === id);
        if (!c) return;
        if (cFormTitle) cFormTitle.innerText = 'Sửa danh mục';
        if (cNameInput) cNameInput.value = c.name;
        setCatFormType(c.type);
        if (cIconInput) cIconInput.value = c.icon;
        if (cColorInput) cColorInput.value = c.color;
        
        // MỚI THÊM: Đổ dữ liệu ngân sách cũ vào Form
        if (c.budgetLimit && cBudgetRaw && cBudgetDisplay) {
            cBudgetRaw.value = c.budgetLimit;
            cBudgetDisplay.value = formatter.format(c.budgetLimit);
        } else {
            if (cBudgetRaw) cBudgetRaw.value = '';
            if (cBudgetDisplay) cBudgetDisplay.value = '';
        }
        
        const iBox = [...document.querySelectorAll('.icon-box')].find(el => el.innerHTML === SVG_LIB[c.icon]);
        if(iBox) iBox.classList.add('active');
        const cBox = [...document.querySelectorAll('.color-circle')].find(el => el.style.backgroundColor === THEMES[c.color]?.color);
        if(cBox) cBox.classList.add('active');
        if (btnSaveCat) { btnSaveCat.innerText = 'Lưu thay đổi'; btnSaveCat.classList.add('edit-mode'); }
    } else {
        if (cFormTitle) cFormTitle.innerText = 'Thêm danh mục';
        if (cNameInput) cNameInput.value = '';
        setCatFormType(defaultType);
        if (cIconInput) cIconInput.value = '';
        if (cColorInput) cColorInput.value = '';
        
        // MỚI THÊM: Xóa trắng ô ngân sách khi thêm mới
        if (cBudgetRaw) cBudgetRaw.value = '';
        if (cBudgetDisplay) cBudgetDisplay.value = '';
        
        if (btnSaveCat) {
            btnSaveCat.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Lưu danh mục';
            btnSaveCat.classList.remove('edit-mode');
        }
    }
}
window.openCatForm = openCatForm;

function closeCatForm() {
    document.getElementById('catFormOverlay')?.classList.remove('show');
    document.getElementById('catFormModal')?.classList.remove('show');
    openCatManager(); 
}
window.closeCatForm = closeCatForm;

document.getElementById('btnSaveCat')?.addEventListener('click', () => {
    const name = document.getElementById('catNameInput')?.value.trim();
    const type = document.getElementById('catFormTypeInput')?.value;
    const icon = document.getElementById('catIconInput')?.value;
    const color = document.getElementById('catColorInput')?.value;
    
    // MỚI THÊM: Lấy giá trị ngân sách
    const budgetStr = document.getElementById('catBudgetRaw')?.value;
    const budgetLimit = budgetStr ? parseInt(budgetStr) : null;

    if(!name) { showToast('Vui lòng nhập tên danh mục!', 'error'); return; }
    if(!icon) { showToast('Vui lòng chọn 1 biểu tượng!', 'error'); return; }
    if(!color) { showToast('Vui lòng chọn 1 màu sắc!', 'error'); return; }

    if(editingCatId) {
        db.ref(`users/${currentUser.uid}/categories/${editingCatId}`).update({ name, type, icon, color, budgetLimit: budgetLimit })
          .then(() => { showToast('Đã cập nhật danh mục'); closeCatForm(); });
    } else {
        const newId = 'cat_' + Date.now();
        const newOrder = categories.filter(c => c.type === type).length;
        db.ref(`users/${currentUser.uid}/categories/${newId}`).set({ name, type, icon, color, order: newOrder, budgetLimit: budgetLimit })
          .then(() => { showToast('Đã thêm danh mục mới'); closeCatForm(); });
    }
});

function deleteCat(id) {
    if(confirm('Bạn có chắc muốn xóa danh mục này?')) {
        db.ref(`users/${currentUser.uid}/categories/${id}`).remove()
          .then(() => showToast('Đã xóa danh mục'));
    }
}
window.deleteCat = deleteCat;

// ==========================================
// 5. FORM GIAO DỊCH CƠ BẢN
// ==========================================
const dateInput = document.getElementById('dateInput');
const formDateDisplay = document.getElementById('formDateDisplay');
if (dateInput) {
    dateInput.value = todayStr; 
    if (formDateDisplay) formDateDisplay.innerText = formatNiceDate(todayStr);
    dateInput.addEventListener('change', (e) => { 
        if (formDateDisplay) formDateDisplay.innerText = formatNiceDate(e.target.value); 
    });
}

const amountInputDisplay = document.getElementById('amountInputDisplay');
const amountInputRaw = document.getElementById('amountInputRaw');

amountInputDisplay?.addEventListener('input', function() {
    let val = this.value.replace(/\D/g, '');
    if (val === '') { if (amountInputRaw) amountInputRaw.value = ''; this.value = ''; return; }
    if (amountInputRaw) amountInputRaw.value = val; 
    this.value = formatter.format(parseInt(val));
});
document.getElementById('catBudgetDisplay')?.addEventListener('input', function() {
    let val = this.value.replace(/\D/g, '');
    const raw = document.getElementById('catBudgetRaw');
    if (val === '') { if (raw) raw.value = ''; this.value = ''; return; }
    if (raw) raw.value = val; 
    this.value = formatter.format(parseInt(val));
});
document.querySelectorAll('.btn-quick').forEach(btn => {
    btn.addEventListener('click', () => {
        const addVal = parseInt(btn.getAttribute('data-val'));
        let currentRaw = amountInputRaw?.value ? parseInt(amountInputRaw.value) : 0;
        currentRaw += addVal; 
        if (amountInputRaw) amountInputRaw.value = currentRaw; 
        if (amountInputDisplay) amountInputDisplay.value = formatter.format(currentRaw);
        currentDateLimit = DATES_PER_PAGE;
        updateUI();
    });
});

// ==========================================
// THIẾT LẬP BỘ LỌC MẶC ĐỊNH KHI TẢI TRANG
// ==========================================
function setDefaultHistoryFilters() {
    // 1. Ép chọn nút "Tháng này" (Bỏ điều kiện check class active để luôn luôn ép click)
    const monthBtn = document.querySelector('.btn-quick-filter[data-range="this_month"]');
    if (monthBtn) {
        monthBtn.click(); // Luôn click để tính toán và đổ dữ liệu ngày tháng vào input ẩn
    }
    
    // 2. Ép chọn nút "Tất cả" danh mục
    const allCatBtn = document.querySelector('#historyCategoryFilter .cat-pill[data-filter=""]');
    if (allCatBtn) {
        document.querySelectorAll('#historyCategoryFilter .cat-pill').forEach(p => p.classList.remove('active'));
        allCatBtn.classList.add('active');
    }
    
    // Xóa từ khóa tìm kiếm nếu có
    const searchInp = document.getElementById('searchInput');
    if (searchInp) searchInp.value = '';
}

// Chạy hàm này một lần khi web vừa nạp xong
setTimeout(setDefaultHistoryFilters, 300);

function switchType(type) {
    document.querySelectorAll('#transactionForm .btn-toggle').forEach(b => b.classList.remove('active', 'income', 'expense'));
    document.querySelector(`#transactionForm .btn-toggle[data-type="${type}"]`)?.classList.add('active', type);
    const typeInput = document.getElementById('typeInput');
    if (typeInput) typeInput.value = type;
	// === CẢI TIẾN: ĐỔI MÀU FORM THEO NGỮ CẢNH ===
    const formCard = document.getElementById('formCard');
    if (formCard) {
        // Xóa theme cũ, đắp theme mới (theme-income hoặc theme-expense)
        formCard.classList.remove('theme-income', 'theme-expense');
        formCard.classList.add(`theme-${type}`);
        
        // Đổi luôn chữ trên nút Submit cho rõ ràng tuyệt đối
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.innerText = type === 'expense' ? 'Thêm khoản chi' : 'Thêm khoản thu';
        }
    }
    // ===========================================

    document.querySelectorAll('#categoryScroll .cat-pill[data-val]').forEach(opt => {
        if(opt.classList.contains(`opt-${type}`)) opt.classList.remove('hide');
        else opt.classList.add('hide');
    });
    
    const firstVisiblePill = document.querySelector(`#categoryScroll .cat-pill:not(.hide)`);
    if (firstVisiblePill) {
        document.querySelectorAll('#categoryScroll .cat-pill').forEach(p => p.classList.remove('active'));
        firstVisiblePill.classList.add('active');
        const catIdIn = document.getElementById('categoryIdInput');
        const catNameIn = document.getElementById('categoryNameInput');
        const catScroll = document.getElementById('categoryScroll');
        if (catIdIn) catIdIn.value = firstVisiblePill.getAttribute('data-id');
        if (catNameIn) catNameIn.value = firstVisiblePill.getAttribute('data-val');
        if (catScroll) catScroll.scrollLeft = 0;
    }
}

document.querySelectorAll('#transactionForm .btn-toggle').forEach(btn => { 
    btn.addEventListener('click', () => switchType(btn.getAttribute('data-type'))); 
});

// ==========================================
// 6. RENDER LỊCH SỬ GIAO DỊCH & LỊCH LƯỚI
// ==========================================
function getWeekRange() {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1); 
    const last = first + 6;
    return {
        start: new Date(curr.setDate(first)).toISOString().split('T')[0],
        end: new Date(curr.setDate(last)).toISOString().split('T')[0]
    };
}

// Khởi tạo Flatpickr cho bộ lọc
let histFlatpickr = null;
window.addEventListener('DOMContentLoaded', () => {
    const fpInput = document.getElementById('flatpickrRange');
    if(fpInput) {
        histFlatpickr = flatpickr(fpInput, {
            mode: "range",
            dateFormat: "Y-m-d",
            locale: "vn",
            onChange: function(selectedDates) {
                if(selectedDates.length === 2) {
                    const d1 = new Date(selectedDates[0].getTime() - (selectedDates[0].getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                    const d2 = new Date(selectedDates[1].getTime() - (selectedDates[1].getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                    document.getElementById('filterStartDate').value = d1;
                    document.getElementById('filterEndDate').value = d2;
                    currentDateLimit = DATES_PER_PAGE;
                    updateUI();
                }
            }
        });
    }
});

document.querySelectorAll('.btn-quick-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-quick-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const range = btn.getAttribute('data-range');
        const customContainer = document.getElementById('customDateContainer');
        
        let startVal = '', endVal = '';
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();

        if (range === 'custom') {
            customContainer?.classList.remove('hide');
            return; 
        } else {
            customContainer?.classList.add('hide');
            if(histFlatpickr) histFlatpickr.clear();
        }

        if (range === 'this_month') {
            startVal = `${y}-${String(m + 1).padStart(2, '0')}-01`;
            endVal = `${y}-${String(m + 1).padStart(2, '0')}-${new Date(y, m + 1, 0).getDate()}`;
        } else if (range === 'last_month') {
            const prevM = m === 0 ? 11 : m - 1;
            const prevY = m === 0 ? y - 1 : y;
            startVal = `${prevY}-${String(prevM + 1).padStart(2, '0')}-01`;
            endVal = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${new Date(prevY, prevM + 1, 0).getDate()}`;
        } else if (range === 'this_week') {
            const week = getWeekRange();
            startVal = week.start; endVal = week.end;
        }

        const fStart = document.getElementById('filterStartDate');
        const fEnd = document.getElementById('filterEndDate');
        const sInput = document.getElementById('searchInput');
        if (fStart) fStart.value = startVal;
        if (fEnd) fEnd.value = endVal;
        if (sInput) sInput.value = ''; 
        currentDateLimit = DATES_PER_PAGE;
        updateUI();
    });
});

document.getElementById('searchInput')?.addEventListener('input', debounce(() => {
    currentDateLimit = DATES_PER_PAGE; 
    updateUI();
}, 300));

function updateUI() {
    const fStart = document.getElementById('filterStartDate');
    const fEnd = document.getElementById('filterEndDate');
    const fStartDate = fStart ? fStart.value : '';
    const fEndDate = fEnd ? fEnd.value : '';
    const sText = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
    // Lấy danh sách TẤT CẢ các danh mục đang được chọn
    const activeCatPills = Array.from(document.querySelectorAll('#historyCategoryFilter .cat-pill.active'));
    const fCats = activeCatPills.map(p => p.getAttribute('data-filter')).filter(f => f !== '');
    
    const activeQuickFilter = document.querySelector('.btn-quick-filter.active');
    const isQuickAll = activeQuickFilter ? activeQuickFilter.getAttribute('data-range') === 'all' : false;
    
    const listEl = document.getElementById('transactionList');
    const filteredSummary = document.getElementById('filteredSummary');
    if (!listEl) return;

    const totalIncomeAll = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenseAll = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    currentBalances.total = totalIncomeAll - totalExpenseAll;
    currentBalances.income = totalIncomeAll;
    currentBalances.expense = totalExpenseAll;
    renderBalances();

    let displayData = [...transactions];
    const isFiltering = (!isQuickAll && (fStartDate || fEndDate)) || sText || fCats.length > 0;

    if (isFiltering) {
        displayData = transactions.filter(t => {
            let matchDate = true;
            if (fStartDate && fEndDate) matchDate = t.date >= fStartDate && t.date <= fEndDate;
            else if (fStartDate) matchDate = t.date >= fStartDate;
            else if (fEndDate) matchDate = t.date <= fEndDate;
            
            // Nếu có lọc danh mục, kiểm tra xem giao dịch có nằm trong mảng fCats không
            const matchCat = fCats.length > 0 ? (fCats.includes(t.categoryName) || fCats.includes(t.category)) : true;
            const amtString = t.amount.toString();
            const matchSearch = sText ? (
                t.categoryName?.toLowerCase().includes(sText) || 
                t.category?.toLowerCase().includes(sText) || 
                (t.note && t.note.toLowerCase().includes(sText)) ||
                amtString.includes(sText)
            ) : true;
            
            return matchDate && matchCat && matchSearch;
        });

        filteredSummary?.classList.remove('hide');
        const fInc = displayData.filter(t => t.type === 'income').reduce((a,b)=>a+b.amount,0);
        const fExp = displayData.filter(t => t.type === 'expense').reduce((a,b)=>a+b.amount,0);
        
        const fTxCount = document.getElementById('filterTxCount');
        const fSumInc = document.getElementById('filterSumInc');
        const fSumExp = document.getElementById('filterSumExp');
        if (fTxCount) fTxCount.innerText = `(${displayData.length})`;
        if (fSumInc) fSumInc.innerText = '+' + formatter.format(fInc) + 'đ';
        if (fSumExp) fSumExp.innerText = '-' + formatter.format(fExp) + 'đ';
        
        const bal = fInc - fExp;
        const elBal = document.getElementById('filterSumBal');
        if (elBal) {
            elBal.innerText = (bal > 0 ? '+' : '') + formatter.format(bal) + 'đ';
            elBal.style.color = bal >= 0 ? 'var(--success)' : 'var(--danger)';
        }
    } else {
        filteredSummary?.classList.add('hide');
    }

    const grouped = {};
    displayData.forEach(t => {
        const dateStr = t.date; 
        if (!grouped[dateStr]) grouped[dateStr] = { items: [], in: 0, out: 0 };
        grouped[dateStr].items.push(t);
        if (t.type === 'income') grouped[dateStr].in += t.amount;
        if (t.type === 'expense') grouped[dateStr].out += t.amount;
    });

    // BỔ SUNG LƯU BIẾN TOÀN CỤC CHO RECYCLER
    window.currentGroupedData = grouped; 

    const sortedDates = Object.keys(grouped).sort().reverse();
    
    // ==========================================
    // THUẬT TOÁN TÌM MỐC 100% CHO NỀN HÀO QUANG
    // ==========================================
    let maxDailyExpenseGlobal = 0;
    for (let d in grouped) {
        if (grouped[d].out > maxDailyExpenseGlobal) maxDailyExpenseGlobal = grouped[d].out;
    }
    if (maxDailyExpenseGlobal === 0) maxDailyExpenseGlobal = 1;

    let listHTML = '<div class="timeline-wrapper-seamless">';

    if(sortedDates.length === 0) {
        listEl.innerHTML = `
            <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px; opacity: 0.5;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <p style="font-size: 15px; font-weight: 500;">Không tìm thấy giao dịch nào</p>
            </div>
        `;
        if(!document.getElementById('calendarViewContainer').classList.contains('hide')) renderCalendar();
        if (typeof calculateStreak === 'function') calculateStreak(); 
        document.getElementById('historyChartWrapper')?.classList.add('hide');
        return;
    }

    const paginatedDates = sortedDates.slice(0, currentDateLimit);

    for (const rawDate of paginatedDates) {
        const data = grouped[rawDate];
        
        // --- BẮT ĐẦU ĐOẠN CODE THAY THẾ ---
        const dObj = new Date(rawDate);
        const dayOfWeek = dObj.getDay();
        const daysVN = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const todayD = new Date();
        const yestD = new Date(); yestD.setDate(yestD.getDate() - 1);
        const formatD = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        
        let displayDateText = '';
        const [y, m, d] = rawDate.split('-');
        if (rawDate === formatD(todayD)) displayDateText = 'Hôm nay';
        else if (rawDate === formatD(yestD)) displayDateText = 'Hôm qua';
        else displayDateText = `${daysVN[dayOfWeek]}, ${d}/${m}`;
        // --- KẾT THÚC ĐOẠN CODE THAY THẾ ---

        // Đã xóa bỏ hoàn toàn biến groupIndex gây lỗi
        const collapsedClass = 'collapsed';

        // ==========================================
        // THUẬT TOÁN DẢI LỤA TỶ TRỌNG (INLINE SPARKBAR)
        // ==========================================
        let sparkbarHtml = '';
        if (data.out > 0) {
            const catExpense = {};
            data.items.forEach(t => {
                if (t.type === 'expense') {
                    catExpense[t.categoryId] = (catExpense[t.categoryId] || 0) + t.amount;
                }
            });
            
            let segmentsHtml = '';
            for (let cid in catExpense) {
                const pct = (catExpense[cid] / data.out) * 100;
                const catObj = categories.find(c => c.id === cid);
                const colorHex = catObj && THEMES[catObj.color] ? THEMES[catObj.color].hex : '#8395a7';
                segmentsHtml += `<div class="sparkbar-segment" style="width: ${pct}%; background-color: ${colorHex};"></div>`;
            }
            sparkbarHtml = `<div class="daily-sparkbar">${segmentsHtml}</div>`;
        } else if (data.in > 0) {
            sparkbarHtml = `<div class="daily-sparkbar"><div class="sparkbar-segment" style="width: 100%; background-color: #2ecc71; opacity: 0.6;"></div></div>`;
        } else {
            sparkbarHtml = `<div class="daily-sparkbar"></div>`;
        }
        // ==========================================

        listHTML += `
        <div class="date-group ${collapsedClass}" id="date_group_${rawDate}" data-date="${rawDate}">
            <div class="date-group-header" onclick="toggleDateGroup('${rawDate}')" style="flex-direction: column; align-items: stretch; justify-content: center !important; gap: 8px; padding-bottom: 10px !important;">
                
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; gap: 8px;">
                    <div class="date-title" style="font-size: 14px; display: flex; align-items: center; white-space: nowrap; flex-shrink: 0;">
                        ${displayDateText}
                        <svg class="header-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                    <div class="date-summary" style="display: flex; justify-content: flex-end; white-space: nowrap; overflow: hidden; flex: 1;">
                        <span class="ds-in text-success" style="width: auto !important; text-align: right;">+${formatter.format(data.in)}</span>
                        <span class="ds-sep" style="margin: 0 4px;">|</span> 
                        <span class="ds-out text-danger" style="width: auto !important; text-align: left;">-${formatter.format(data.out)}</span>
                    </div>
                </div>

                ${sparkbarHtml}
                
            </div>
            
            <div class="date-group-items" id="items_${rawDate}"></div>
        </div>
        `;
        // Đã xóa dòng `groupIndex++;` gây lỗi ở đây
    }

    listHTML += `</div>`;

    // QUAY LẠI NÚT TẢI THÊM TRUYỀN THỐNG (Khắc phục lỗi đơ khi cuộn tự động)
    if (sortedDates.length > currentDateLimit) {
        listHTML += `<button class="btn-load-more" onclick="currentDateLimit += ${DATES_PER_PAGE}; updateUI();">Xem thêm các ngày trước</button>`;
    } else if (sortedDates.length > 0) {
        listHTML += `<div class="end-of-list-msg">Đã hiển thị toàn bộ giao dịch</div>`;
    }

    listEl.innerHTML = listHTML;

    // === TÁI CHẾ DOM (VIRTUAL SCROLLING) BẰNG INTERSECTION OBSERVER ===
    if (window.domRecycler) window.domRecycler.disconnect();
    
    window.domRecycler = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const group = entry.target;
            const dateStr = group.getAttribute('data-date');
            const itemsContainer = document.getElementById('items_' + dateStr);
            if (!itemsContainer) return;

            if (entry.isIntersecting) {
                // VÀO KHUNG NHÌN: Bơm ruột HTML vào
                if (!itemsContainer.hasAttribute('data-loaded')) {
                    itemsContainer.innerHTML = buildGroupItemsHTML(dateStr);
                    itemsContainer.setAttribute('data-loaded', 'true');
                    itemsContainer.style.height = 'auto'; // Gỡ khóa chiều cao
                }
            } else {
                // RA KHỎI KHUNG NHÌN: Hút sạch HTML để giải phóng RAM
                if (itemsContainer.hasAttribute('data-loaded')) {
                    // Chốt chiều cao hiện tại để thanh cuộn không bị giật
                    const currentHeight = itemsContainer.getBoundingClientRect().height;
                    if (currentHeight > 0) itemsContainer.style.height = currentHeight + 'px';
                    
                    itemsContainer.innerHTML = ''; // Hút cạn DOM
                    itemsContainer.removeAttribute('data-loaded');
                }
            }
        });
    }, { rootMargin: '1000px 0px' }); // Bắt đầu load ngầm khi cách mép màn hình 1000px

    // Gắn cảm biến vào các nhóm ngày
    document.querySelectorAll('.date-group').forEach(g => window.domRecycler.observe(g));

    if(typeof renderBudgets === 'function') renderBudgets();
    if(!document.getElementById('calendarViewContainer').classList.contains('hide')) renderCalendar();
    if (typeof calculateStreak === 'function') calculateStreak();

    // ==========================================
    // VẼ BIỂU ĐỒ ĐƯỜNG KÉP CHO TAB LỊCH SỬ
    // ==========================================
    const historyChartWrapper = document.getElementById('historyChartWrapper');
    const isCalendarHidden = document.getElementById('calendarViewContainer').classList.contains('hide');

    if (historyChartWrapper && isCalendarHidden && sortedDates.length > 0) {
        historyChartWrapper.classList.remove('hide');
        
        const chartLabels = [];
        const chartIncData = [];
        const chartExpData = [];

        // Đảo ngược mảng để vẽ biểu đồ tiến tới (từ cũ -> mới)
        const chartSortedDates = [...sortedDates].reverse();

        chartSortedDates.forEach(dateStr => {
            const d = grouped[dateStr];
            const [y, m, day] = dateStr.split('-');
            chartLabels.push(`${day}/${m}`);
            chartIncData.push(d.in);
            chartExpData.push(d.out);
        });

        const canvas = document.getElementById('historyLineChart');
        if (canvas) {
            if (window.histLineChartInst) {
                window.histLineChartInst.destroy();
            }
            const ctx = canvas.getContext('2d');

            // === 1. TẠO MÀU SÓNG GRADIENT XANH/ĐỎ ===
            // Sóng Thu (Màu Xanh lá)
            const incGradient = ctx.createLinearGradient(0, 0, 0, 180);
            incGradient.addColorStop(0, 'rgba(46, 204, 113, 0.4)');
            incGradient.addColorStop(1, 'rgba(46, 204, 113, 0.0)');

            // Sóng Chi (Màu Đỏ)
            const expGradient = ctx.createLinearGradient(0, 0, 0, 180);
            expGradient.addColorStop(0, 'rgba(231, 76, 60, 0.4)');
            expGradient.addColorStop(1, 'rgba(231, 76, 60, 0.0)');

            // === 2. VẼ BIỂU ĐỒ SÓNG ĐAN XEN ===
            window.histLineChartInst = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [
                        {
                            label: 'Tiền Thu',
                            data: chartIncData,
                            borderColor: '#2ecc71',
                            backgroundColor: incGradient, // Đổ màu sóng Xanh
                            borderWidth: 2.5,
                            pointBackgroundColor: '#fff',
                            pointBorderColor: '#2ecc71',
                            pointRadius: 0, // Ẩn các chấm tròn gồ ghề
                            pointHoverRadius: 6, // Chỉ hiện khi vuốt qua
                            fill: true,
                            tension: 0.4 // Bo cong mềm mại
                        },
                        {
                            label: 'Tiền Chi',
                            data: chartExpData,
                            borderColor: '#e74c3c',
                            backgroundColor: expGradient, // Đổ màu sóng Đỏ
                            borderWidth: 2.5,
                            pointBackgroundColor: '#fff',
                            pointBorderColor: '#e74c3c',
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { intersect: false, mode: 'index' },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: v => (v === 0 ? 0 : v / 1000 + 'K'), font: {size: 10} },
                            grid: { borderDash: [4, 4], color: document.body.classList.contains('dark-theme') ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { maxTicksLimit: 7, font: {size: 10}, color: '#94a3b8' }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: document.body.classList.contains('dark-theme') ? '#1e293b' : '#ffffff',
                            titleColor: document.body.classList.contains('dark-theme') ? '#94a3b8' : '#64748b',
                            bodyColor: document.body.classList.contains('dark-theme') ? '#f1f5f9' : '#0f172a',
                            borderColor: document.body.classList.contains('dark-theme') ? '#334155' : '#e2e8f0',
                            borderWidth: 1,
                            usePointStyle: true,
                            callbacks: {
                                label: function(c) {
                                    return ' ' + c.dataset.label + ': ' + formatter.format(c.parsed.y) + 'đ';
                                }
                            }
                        }
                    }
                }
            });
        }
    } else if (historyChartWrapper) {
        historyChartWrapper.classList.add('hide');
    }
}
// LOGIC CHO CHẾ ĐỘ XEM LỊCH
let currentCalDate = new Date();
let selectedCalDateStr = todayStr; 
// Ghi đè logic hiển thị Của Tab Lịch Sử
window.switchHistoryView = function(view) {
    if(view === 'list') {
        document.getElementById('btnHistList').classList.add('active', 'income');
        document.getElementById('btnHistCalendar').classList.remove('active', 'expense');
        document.getElementById('histListViewFilters').classList.remove('hide');
        document.getElementById('transactionList').classList.remove('hide');
        document.getElementById('calendarViewContainer').classList.add('hide');
        document.getElementById('filteredSummary').style.display = ''; 
        updateUI(); // Gọi lại để hiển thị kèm biểu đồ
    } else {
        document.getElementById('btnHistCalendar').classList.add('active', 'expense');
        document.getElementById('btnHistList').classList.remove('active', 'income');
        document.getElementById('histListViewFilters').classList.add('hide');
        document.getElementById('transactionList').classList.add('hide');
        document.getElementById('filteredSummary').style.display = 'none'; 
        document.getElementById('calendarViewContainer').classList.remove('hide');
        document.getElementById('historyChartWrapper')?.classList.add('hide'); // Ẩn biểu đồ
        renderCalendar();
    }
};


window.changeCalendarMonth = function(delta) {
    currentCalDate.setMonth(currentCalDate.getMonth() + delta);
    renderCalendar();
};

function renderCalendar() {
    const y = currentCalDate.getFullYear();
    const m = currentCalDate.getMonth();
    const monthDisplay = document.getElementById('calendarMonthDisplay');
    if (monthDisplay) monthDisplay.innerText = `Tháng ${m + 1}, ${y}`;

    const grid = document.getElementById('calendarGrid');
    if(!grid) return;
    grid.innerHTML = '';

    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    
    let emptyDays = firstDay - 1;
    if (emptyDays === -1) emptyDays = 6;

    for (let i = 0; i < emptyDays; i++) {
        grid.innerHTML += `<div class="cal-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === selectedCalDateStr;

        const dayTxs = transactions.filter(t => t.date === dateStr);
        let hasIn = false; let hasOut = false;
        
        // CẢI TIẾN: Tính tổng tiền chi trong ngày để làm Bản đồ nhiệt
        let dailyExpense = 0;

        dayTxs.forEach(t => {
            if(t.type === 'income') hasIn = true;
            if(t.type === 'expense') {
                hasOut = true;
                dailyExpense += t.amount;
            }
        });

        // Xếp loại "Độ nóng" của ví tiền
        let heatClass = '';
        if (dailyExpense > 0 && dailyExpense <= 100000) heatClass = 'heat-1'; // Dưới 100k
        else if (dailyExpense > 100000 && dailyExpense <= 500000) heatClass = 'heat-2'; // 100k - 500k
        else if (dailyExpense > 500000) heatClass = 'heat-3'; // Lớn hơn 500k

        let dotsHtml = '';
        if(hasIn || hasOut) {
            dotsHtml = `<div class="cal-dots">
                ${hasIn ? '<div class="cal-dot in"></div>' : ''}
                ${hasOut ? '<div class="cal-dot out"></div>' : ''}
            </div>`;
        }

        // Nhét class bản đồ nhiệt vào HTML
        const classes = `cal-day ${isToday ? 'today' : ''} ${isSelected ? 'active' : ''} ${heatClass}`;
        
        grid.innerHTML += `
            <div class="${classes}" onclick="selectCalendarDate('${dateStr}')">
                ${day}
                ${dotsHtml}
            </div>
        `;
    }

    renderCalendarDetails(selectedCalDateStr);
}

window.selectCalendarDate = function(dateStr) {
    selectedCalDateStr = dateStr;
    renderCalendar(); 
};

function renderCalendarDetails(dateStr) {
    const container = document.getElementById('calendarSelectedDayDetails');
    if(!container) return;
    const dayTxs = transactions.filter(t => t.date === dateStr).sort((a, b) => b.id - a.id);
    
    const [y, m, d] = dateStr.split('-');
    let html = `<h4 style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px; margin-top: 8px;">Giao dịch ngày ${d}/${m}/${y}</h4>`;

    if (dayTxs.length === 0) {
        html += `<div style="text-align:center; padding: 20px; background: #fff; border-radius: 12px; border: 1px dashed #e2e8f0; color: var(--text-muted); font-size: 13px;">Không có giao dịch nào.</div>`;
        container.innerHTML = html;
        return;
    }

    let inSum = 0; let outSum = 0;
    let itemsHtml = '';

    dayTxs.forEach(t => {
        const isInc = t.type === 'income';
        if (isInc) inSum += t.amount; else outSum += t.amount;

        const cName = t.categoryName || t.category;
        const catObj = categories.find(c => c.id === t.categoryId);
        const iconSvg = catObj ? SVG_LIB[catObj.icon] : (SVG_LIB[t.icon] || SVG_LIB['other']);
        const themeObj = catObj ? THEMES[catObj.color] : THEMES['theme-gray'];
        const safeName = cName.replace(/'/g, "\\'");

        itemsHtml += `
            <div class="transaction-item" onclick="openActionSheet(${t.id}, '${safeName}', ${t.amount})" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); margin-bottom: 8px; padding: 12px;">
                <div class="t-left">
                    <div class="t-icon" style="background-color: ${themeObj.bg}; color: ${themeObj.color}; width: 36px; height: 36px;">${iconSvg}</div>
                    <div class="t-info">
                        <div class="t-title" style="font-size: 14px;">${cName}</div>
                        <div class="t-note" style="font-size: 11px;">${t.note || '...'}</div>
                    </div>
                </div>
                <div class="t-action">
                    <div class="t-amount ${isInc ? 'text-success' : 'text-danger'}" style="font-size: 14px;">${isInc ? '+' : '-'}${formatter.format(t.amount)}</div>
                    <div class="t-chevron">›</div>
                </div>
            </div>
        `;
    });

    html += `
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <div style="flex: 1; background: var(--success-light); color: var(--success); padding: 10px; border-radius: 8px; text-align: center; font-weight: 800; font-size: 13px;">+${formatter.format(inSum)}</div>
            <div style="flex: 1; background: var(--danger-light); color: var(--danger); padding: 10px; border-radius: 8px; text-align: center; font-weight: 800; font-size: 13px;">-${formatter.format(outSum)}</div>
        </div>
        ${itemsHtml}
    `;

    container.innerHTML = html;
}
// ==========================================
// 7. RENDER BIỂU ĐỒ (CHART.JS)
// ==========================================
function renderCharts() {
    if (!document.getElementById('analyticsView')?.classList.contains('active')) return;
    
    const mode = document.getElementById('statsFilterMode')?.value || 'range';
    let startDateStr = ''; let endDateStr = ''; let displayTitleText = ''; let daysToAverage = 1;

    if (mode === 'month') {
        const monthVal = document.getElementById('statsMonthPicker')?.value;
        if (!monthVal) return;
        const y = parseInt(monthVal.split('-')[0]); const m = parseInt(monthVal.split('-')[1]);
        startDateStr = `${y}-${String(m).padStart(2, '0')}-01`;
        const lastDay = new Date(y, m, 0).getDate();
        endDateStr = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        
        displayTitleText = `Tháng ${m}/${y}`;
        const now = new Date();
        daysToAverage = (y === now.getFullYear() && m === (now.getMonth() + 1)) ? now.getDate() : lastDay;

    } else {
        startDateStr = document.getElementById('statsStartDate')?.value || '';
        endDateStr = document.getElementById('statsEndDate')?.value || '';
        if (!startDateStr || !endDateStr) return;
        
        if (startDateStr > endDateStr) {
            let temp = startDateStr; startDateStr = endDateStr; endDateStr = temp;
            const sEl = document.getElementById('statsStartDate');
            const eEl = document.getElementById('statsEndDate');
            if (sEl) sEl.value = startDateStr;
            if (eEl) eEl.value = endDateStr;
        }

        const formatVN = (d) => `${d.split('-')[2]}/${d.split('-')[1]}`;
        displayTitleText = `${formatVN(startDateStr)} - ${formatVN(endDateStr)}`;

        const sDate = new Date(startDateStr); const eDate = new Date(endDateStr);
        daysToAverage = Math.floor((eDate - sDate) / (1000 * 60 * 60 * 24)) + 1;
        if (daysToAverage < 1) daysToAverage = 1;
    }

    document.querySelectorAll('#analyticsView .chart-subtitle').forEach(el => el.innerText = displayTitleText);
    const kpiMaxDesc = document.querySelector('#kpiMaxExpense ~ .kpi-desc');

    const allPeriodTransactions = transactions.filter(t => t.date >= startDateStr && t.date <= endDateStr);
    let totalIncPeriod = 0; let totalExpPeriod = 0; let maxExpTx = null;

    allPeriodTransactions.forEach(t => {
        if (t.type === 'income') totalIncPeriod += t.amount;
        if (t.type === 'expense') {
            totalExpPeriod += t.amount;
            if (!maxExpTx || t.amount > maxExpTx.amount) maxExpTx = t;
        }
    });

    const netFlow = totalIncPeriod - totalExpPeriod;
    const elNetFlow = document.getElementById('kpiNetFlow');
    if (elNetFlow) {
        elNetFlow.innerText = currencyFormatter.format(netFlow);
        elNetFlow.className = 'hero-kpi-value ' + (netFlow >= 0 ? 'text-success' : 'text-danger');
        const netFlowDesc = document.getElementById('kpiNetFlowDesc');
        if (netFlowDesc) netFlowDesc.innerHTML = `Thu: <span class="text-success">+${formatter.format(totalIncPeriod)}</span> | Chi: <span class="text-danger">-${formatter.format(totalExpPeriod)}</span>`;
    }
    const elAvgExp = document.getElementById('kpiAvgExpense');
    if (elAvgExp) elAvgExp.innerText = currencyFormatter.format(Math.round(totalExpPeriod / daysToAverage));

    const prevSDateObj = new Date(startDateStr); 
    prevSDateObj.setMonth(prevSDateObj.getMonth() - 1);
    const prevEDateObj = new Date(endDateStr); 
    prevEDateObj.setMonth(prevEDateObj.getMonth() - 1);

    const prevStartDateStr = `${prevSDateObj.getFullYear()}-${String(prevSDateObj.getMonth() + 1).padStart(2, '0')}-${String(prevSDateObj.getDate()).padStart(2, '0')}`;
    const prevEndDateStr = `${prevEDateObj.getFullYear()}-${String(prevEDateObj.getMonth() + 1).padStart(2, '0')}-${String(prevEDateObj.getDate()).padStart(2, '0')}`;

    let prevDaysToAverage = daysToAverage;
    if (mode === 'month') {
        const pY = prevSDateObj.getFullYear();
        const pM = prevSDateObj.getMonth() + 1;
        prevDaysToAverage = new Date(pY, pM, 0).getDate();
        const now = new Date();
        if (pY === now.getFullYear() && pM === (now.getMonth() + 1)) {
            prevDaysToAverage = now.getDate();
        }
    }

    const prevPeriodTxs = transactions.filter(t => t.date >= prevStartDateStr && t.date <= prevEndDateStr);
    let prevTotalExp = 0;
    prevPeriodTxs.forEach(t => { if (t.type === 'expense') prevTotalExp += t.amount; });

    const currentAvgExp = Math.round(totalExpPeriod / daysToAverage);
    const prevAvgExp = Math.round(prevTotalExp / prevDaysToAverage);

    const elTrend = document.getElementById('kpiAvgExpenseTrend');
    if (elTrend) {
        elTrend.classList.remove('hide', 'good', 'bad', 'neutral');
        if (prevAvgExp === 0 && currentAvgExp === 0) {
            elTrend.classList.add('neutral'); elTrend.innerHTML = '- 0%';
        } else if (prevAvgExp === 0 && currentAvgExp > 0) {
            elTrend.classList.add('bad'); elTrend.innerHTML = '↑ 100%';
        } else {
            const diffPercent = Math.round(((currentAvgExp - prevAvgExp) / prevAvgExp) * 100);
            if (diffPercent > 0) {
                elTrend.classList.add('bad');
                elTrend.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg> ${diffPercent}%`;
            } else if (diffPercent < 0) {
                elTrend.classList.add('good');
                elTrend.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg> ${Math.abs(diffPercent)}%`;
            } else {
                elTrend.classList.add('neutral');
                elTrend.innerHTML = '- 0%';
            }
        }
    }

    const elMaxExp = document.getElementById('kpiMaxExpense');
    if (elMaxExp) {
        if (maxExpTx) {
            elMaxExp.innerText = currencyFormatter.format(maxExpTx.amount);
            const maxShortDate = `${maxExpTx.date.split('-')[2]}/${maxExpTx.date.split('-')[1]}`;
            if (kpiMaxDesc) kpiMaxDesc.innerText = (maxExpTx.categoryName || maxExpTx.category || 'Khác') + ` (${maxShortDate})`;
        } else {
            elMaxExp.innerText = '0 đ'; if (kpiMaxDesc) kpiMaxDesc.innerText = 'Chưa có dữ liệu';
        }
    }

    const top5Container = document.getElementById('top5Container');
    const topExpenseList = document.getElementById('topExpenseList');
    const top5Title = document.getElementById('top5Title');

    if (top5Container && topExpenseList) {
        if (top5Title) top5Title.innerText = currentPieType === 'expense' ? 'Top 5 khoản chi lớn nhất' : 'Top 5 khoản thu lớn nhất';
        
        const top5Txs = allPeriodTransactions
            .filter(t => t.type === currentPieType)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
            
        // TỐI ƯU DOM CHO KHỐI TOP 5
        if (top5Txs.length === 0) {
            topExpenseList.innerHTML = `<div style="text-align:center; padding: 20px 0; color: var(--text-muted); font-size: 13px;">Không có dữ liệu</div>`;
        } else {
            let top5HTML = '';
            top5Txs.forEach(t => {
                const catObj = categories.find(c => c.id === t.categoryId);
                const themeObj = catObj ? THEMES[catObj.color] : THEMES['theme-gray'];
                const shortDate = `${t.date.split('-')[2]}/${t.date.split('-')[1]}/${t.date.split('-')[0].substring(2)}`;
                
                const amountClass = currentPieType === 'expense' ? 'text-danger' : 'text-success';
                const amountPrefix = currentPieType === 'expense' ? '-' : '+';

                top5HTML += `
                    <div class="transaction-item" style="padding: 12px 0; cursor: default;">
                        <div class="t-left">
                            <div class="t-icon" style="background-color: ${themeObj.bg}; color: ${themeObj.color}; width: 40px; height: 40px;">${catObj ? SVG_LIB[catObj.icon] : SVG_LIB['other']}</div>
                            <div class="t-info">
                                <div class="t-title" style="font-size: 15px;">${t.categoryName || t.category}</div>
                                <div class="t-note" style="font-size: 12px;">${shortDate} ${t.note ? ' • ' + t.note : ''}</div>
                            </div>
                        </div>
                        <div class="t-action"><div class="t-amount ${amountClass}" style="font-size: 15px;">${amountPrefix}${formatter.format(t.amount)}</div></div>
                    </div>
                `;
            });
            topExpenseList.innerHTML = top5HTML;
        }
    }

    const targetTypeTxs = allPeriodTransactions.filter(t => t.type === currentPieType);
    const txByCat = {};
    targetTypeTxs.forEach(t => {
        const cName = t.categoryName || t.category;
        if(!txByCat[cName]) {
            const catObj = categories.find(c => c.id === t.categoryId);
            txByCat[cName] = { amount: 0, colorHex: catObj ? THEMES[catObj.color].hex : '#8395a7' };
        }
        txByCat[cName].amount += t.amount;
    });

    if(pieChartInstance) pieChartInstance.destroy();
    const pieCanvas = document.getElementById('pieChart');
    const pieEmptyState = document.getElementById('pieEmptyState');
    const pieEmptyText = document.getElementById('pieEmptyText');
    const pieLabels = Object.keys(txByCat);

    if (pieLabels.length === 0) {
        if (pieCanvas) pieCanvas.style.display = 'none';
        pieEmptyState?.classList.remove('hide');
        if (pieEmptyText) pieEmptyText.innerText = currentPieType === 'expense' ? `Chưa có chi tiêu` : `Chưa có tiền thu`;
    } else {
        if (pieCanvas) pieCanvas.style.display = 'block';
        pieEmptyState?.classList.add('hide');
        
        // Tự động nhận diện màu viền nền theo Giao diện Sáng/Tối
        const bgColor = document.body.classList.contains('dark-theme') ? '#1e293b' : '#ffffff';

        if (pieCanvas) {
            pieChartInstance = new Chart(pieCanvas.getContext('2d'), {
                type: 'doughnut',
                data: { 
                    labels: pieLabels, 
                    datasets: [{ 
                        data: pieLabels.map(k => txByCat[k].amount), 
                        backgroundColor: pieLabels.map(k => txByCat[k].colorHex), 
                        borderWidth: 3, // Viền dày tạo khoảng cách
                        borderColor: bgColor, // Viền tiệp màu nền
                        hoverOffset: 6, // Hiệu ứng nảy to ra khi lướt ngón tay
                        borderRadius: 4 // Bo tròn các lát cắt cực kỳ hiện đại
                    }] 
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    cutout: '75%', // Khoét lỗ giữa to ra để nhét chữ
                    plugins: { 
                        legend: { 
                            position: 'right', 
                            labels: { usePointStyle: true, padding: 20, font: {size: 12, weight: '600'} } 
                        }, 
                        tooltip: { 
                            enabled: false // TẮT TOOLTIP MẶC ĐỊNH ĐỂ NHƯỜNG CHỖ CHO TÂM ĐIỂM ĐỘNG
                        } 
                    } 
                }
            });
        }
    }

    let dateList = []; let currDate = new Date(startDateStr); let eDate = new Date(endDateStr);
    while(currDate <= eDate) {
        let y = currDate.getFullYear(); let m = String(currDate.getMonth() + 1).padStart(2, '0'); let d = String(currDate.getDate()).padStart(2, '0');
        dateList.push(`${y}-${m}-${d}`);
        currDate.setDate(currDate.getDate() + 1);
    }

    const barLabels = []; const inData = []; const outData = [];
    let lineLabels = []; let lineData = []; let runningBalance = 0;

    transactions.forEach(t => { if (t.date < startDateStr) runningBalance += (t.type === 'income' ? t.amount : -t.amount); });

    dateList.forEach(dateStr => {
        let shortLabel = `${dateStr.split('-')[2]}/${dateStr.split('-')[1]}`;
        barLabels.push(shortLabel); lineLabels.push(shortLabel);
        
        const dayTxs = allPeriodTransactions.filter(t => t.date === dateStr);
        let dayIn = dayTxs.filter(t => t.type === 'income').reduce((s, t)=>s+t.amount, 0);
        let dayOut = dayTxs.filter(t => t.type === 'expense').reduce((s, t)=>s+t.amount, 0);
        
        inData.push(dayIn); outData.push(dayOut);
        runningBalance += (dayIn - dayOut); lineData.push(runningBalance);
    });

    const barCanvas = document.getElementById('barChart');
    if(barChartInstance) barChartInstance.destroy();
    if (barCanvas) {
        barChartInstance = new Chart(barCanvas.getContext('2d'), {
            type: 'bar',
            data: { labels: barLabels, datasets: [{ label: 'Tiền Thu', data: inData, backgroundColor: '#2ecc71', borderRadius: 4 }, { label: 'Tiền Chi', data: outData, backgroundColor: '#e74c3c', borderRadius: 4 }] },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                scales: { 
                    y: { 
                        beginAtZero: true, 
                        ticks: { callback: function(v) { return v === 0 ? 0 : (v/1000) + 'K'; } }, 
                        grid: { borderDash: [4, 4] } 
                    }, 
                    x: { 
                        grid: { display: false }, 
                        ticks: { maxTicksLimit: 15 } 
                    } 
                }, 
                plugins: { 
                    legend: { 
                        position: 'top', 
                        align: 'end', 
                        labels: { usePointStyle: true, boxWidth: 8, font: {size: 12} } 
                    }, 
                    tooltip: { 
                        callbacks: { 
                            title: function(context) { return context[0].label; },
                            label: function(context) { return ' ' + currencyFormatter.format(context.parsed.y); } 
                        } 
                    } 
                } 
            }
        });
    }

    const lineCanvas = document.getElementById('lineChart');
    if(lineChartInstance) lineChartInstance.destroy();
    if (lineCanvas) {
        const lineCtx = lineCanvas.getContext('2d');

        // === 1. TẠO MÀU DÒNG CHẢY (GRADIENT) ===
        const lineGradient = lineCtx.createLinearGradient(0, 0, 0, 260);
        lineGradient.addColorStop(0, 'rgba(67, 97, 238, 0.4)');
        lineGradient.addColorStop(1, 'rgba(67, 97, 238, 0.0)');

        // === 2. VẼ BIỂU ĐỒ DÒNG CHẢY MỚI ===
        lineChartInstance = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: lineLabels, // Dữ liệu ngày tháng gốc
                datasets: [{
                    label: 'Số dư',
                    data: lineData, // Dữ liệu số dư gốc
                    
                    borderColor: '#4361ee',
                    backgroundColor: lineGradient,
                    borderWidth: 2.5,
                    
                    fill: true,
                    tension: 0.4, // Bo cong mềm mại
                    
                    pointRadius: 0, // Tàng hình điểm neo
                    pointHoverRadius: 6, // Hiện khi vuốt qua
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#4361ee',
                    pointBorderWidth: 2,
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false, // Hiển thị tooltips mượt mà
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: document.body.classList.contains('dark-theme') ? '#1e293b' : '#ffffff',
                        titleColor: document.body.classList.contains('dark-theme') ? '#94a3b8' : '#64748b',
                        bodyColor: document.body.classList.contains('dark-theme') ? '#f1f5f9' : '#0f172a',
                        borderColor: document.body.classList.contains('dark-theme') ? '#334155' : '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                return ' Số dư: ' + new Intl.NumberFormat('vi-VN').format(context.raw) + 'đ';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { maxTicksLimit: 6, color: '#94a3b8' }
                    },
                    y: {
                        grid: {
                            color: document.body.classList.contains('dark-theme') ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                            drawBorder: false
                        },
                        ticks: { display: false } // Ẩn số trục Y
                    }
                }
            }
        });
    }
}

// ==========================================
// 8. ACTION SHEET & GIAO DỊCH (SỬA / XÓA)
// ==========================================
const sheetOverlay = document.getElementById('sheetOverlay');
const actionSheet = document.getElementById('actionSheet');

function openActionSheet(id, category, amount) {
    selectedSheetId = id;
    const sheetHeaderTitle = document.getElementById('sheetHeaderTitle');
    if (sheetHeaderTitle) sheetHeaderTitle.innerText = `${category} - ${formatter.format(amount)}đ`;
    sheetOverlay?.classList.add('show'); 
    actionSheet?.classList.add('show');
}
window.openActionSheet = openActionSheet;

function closeActionSheet() {
    sheetOverlay?.classList.remove('show'); 
    actionSheet?.classList.remove('show'); 
    selectedSheetId = null;
}

sheetOverlay?.addEventListener('click', closeActionSheet);
document.getElementById('btnSheetCancel')?.addEventListener('click', closeActionSheet);
document.getElementById('btnSheetEdit')?.addEventListener('click', () => { if(selectedSheetId) triggerEdit(selectedSheetId); closeActionSheet(); });
document.getElementById('btnSheetDelete')?.addEventListener('click', () => { if(selectedSheetId) triggerDelete(selectedSheetId); closeActionSheet(); });

function triggerEdit(id) {
    const t = transactions.find(x => x.id === id);
    if(!t) return;
    editingId = id;
    
    const editDateInput = document.getElementById('editTxDateInput');
    const editDateDisplay = document.getElementById('editTxDateDisplay');
    const editNote = document.getElementById('editTxNote');
    const editAmtRaw = document.getElementById('editTxAmountRaw');
    const editAmtDisp = document.getElementById('editTxAmountDisplay');

    if (editDateInput) editDateInput.value = t.date;
    if (editDateDisplay) editDateDisplay.innerText = formatNiceDate(t.date);
    if (editNote) editNote.value = t.note || '';
    if (editAmtRaw) editAmtRaw.value = t.amount;
    if (editAmtDisp) editAmtDisp.value = formatter.format(t.amount);
    
    setEditTxType(t.type);
    
    document.getElementById('editTxOverlay')?.classList.add('show');
    document.getElementById('editTxModal')?.classList.add('show');
}

function triggerDelete(id) {
    if(confirm('Bạn có chắc muốn xóa giao dịch này?')) {
        const t = transactions.find(x => x.id === id);
        if(t && currentUser) {
            db.ref(`users/${currentUser.uid}/transactions/${t.date}/${id}`).remove()
            .then(() => {
                if(editingId === id) closeEditTxModal(); 
                showToast('Đã xóa giao dịch');
            }).catch(() => { showToast('Lỗi khi xóa!', 'error'); });
        }
    }
}

function closeEditTxModal() {
    document.getElementById('editTxOverlay')?.classList.remove('show');
    document.getElementById('editTxModal')?.classList.remove('show');
    editingId = null;
}
window.closeEditTxModal = closeEditTxModal;

function setEditTxType(type) {
    const btnInc = document.getElementById('btnEditTxInc');
    const btnExp = document.getElementById('btnEditTxExp');
    const typeInput = document.getElementById('editTxTypeInput');

    if (btnInc) btnInc.className = 'btn-toggle income' + (type === 'income' ? ' active' : '');
    if (btnExp) btnExp.className = 'btn-toggle expense' + (type === 'expense' ? ' active' : '');
    if (typeInput) typeInput.value = type;

    const scroll = document.getElementById('editTxCategoryScroll');
    if (!scroll) return;
    scroll.innerHTML = '';
    
    const filteredCats = categories.filter(c => c.type === type);
    filteredCats.forEach(c => {
        const div = document.createElement('div');
        div.className = `cat-pill`;
        div.setAttribute('data-id', c.id);
        div.setAttribute('data-val', c.name);
        div.style.setProperty('--cat-color', THEMES[c.color]?.color || 'var(--primary)');
        div.style.setProperty('--cat-bg', THEMES[c.color]?.bg || '#eef2ff');
        div.innerHTML = `<div class="pill-icon" style="color: var(--cat-color)">${SVG_LIB[c.icon] || ''}</div> ${c.name}`;
        
        div.onclick = () => {
            scroll.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
            div.classList.add('active');
            const editCatId = document.getElementById('editTxCategoryId');
            const editCatName = document.getElementById('editTxCategoryName');
            if (editCatId) editCatId.value = c.id;
            if (editCatName) editCatName.value = c.name;
            div.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        };
        scroll.appendChild(div);
    });

    const currentTx = transactions.find(x => x.id === editingId);
    let targetId = (currentTx && currentTx.type === type) ? currentTx.categoryId : (filteredCats[0] ? filteredCats[0].id : null);
    
    if (targetId) {
        const activePill = scroll.querySelector(`.cat-pill[data-id="${targetId}"]`);
        if (activePill) activePill.click();
    }
}
window.setEditTxType = setEditTxType;

document.getElementById('editTxAmountDisplay')?.addEventListener('input', function() {
    let val = this.value.replace(/\D/g, '');
    const editAmtRaw = document.getElementById('editTxAmountRaw');
    if (val === '') { if (editAmtRaw) editAmtRaw.value = ''; this.value = ''; return; }
    if (editAmtRaw) editAmtRaw.value = val; 
    this.value = formatter.format(parseInt(val));
});

document.getElementById('editTxDateInput')?.addEventListener('change', (e) => { 
    const editDateDisp = document.getElementById('editTxDateDisplay');
    if (editDateDisp) editDateDisp.innerText = formatNiceDate(e.target.value); 
});

document.getElementById('btnSaveEditTx')?.addEventListener('click', () => {
    if(!currentUser) return;
    const amtStr = document.getElementById('editTxAmountRaw')?.value;
    if(!amtStr || parseInt(amtStr) < 1000) { alert('Vui lòng nhập số tiền hợp lệ'); return; }
    
    const amt = parseInt(amtStr);
    const catId = document.getElementById('editTxCategoryId')?.value || '';
    const catName = document.getElementById('editTxCategoryName')?.value || '';
    const note = document.getElementById('editTxNote')?.value || '';
    const date = document.getElementById('editTxDateInput')?.value || todayStr;
    const type = document.getElementById('editTxTypeInput')?.value || 'expense';

    const txData = { type, amount: amt, categoryId: catId, categoryName: catName, note };

    const oldTx = transactions.find(x => x.id === editingId);
    if (oldTx && oldTx.date !== date) {
        db.ref(`users/${currentUser.uid}/transactions/${oldTx.date}/${editingId}`).remove();
        db.ref(`users/${currentUser.uid}/transactions/${date}/${editingId}`).set(txData).then(() => {
            showToast('Đã cập nhật'); closeEditTxModal();
        });
    } else if(oldTx) {
        db.ref(`users/${currentUser.uid}/transactions/${date}/${editingId}`).update(txData).then(() => {
            showToast('Đã cập nhật'); closeEditTxModal();
        });
    }
});

function resetFormState() {
    if (amountInputDisplay) amountInputDisplay.value = ''; 
    if (amountInputRaw) amountInputRaw.value = ''; 
    const noteInput = document.getElementById('noteInput');
    if (noteInput) noteInput.value = '';
    if (dateInput) {
        dateInput.value = todayStr; 
        if (formDateDisplay) formDateDisplay.innerText = formatNiceDate(todayStr);
    }
    
    // CẢI TIẾN: Giữ nguyên Tab hiện tại (Thu hoặc Chi) thay vì nhảy về Chi
    const currentType = document.getElementById('typeInput')?.value || 'expense';
    switchType(currentType);
}

document.getElementById('transactionForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!currentUser) { showToast('Vui lòng đăng nhập!', 'error'); return; }

    const amtStr = amountInputRaw?.value;
    if(!amtStr || parseInt(amtStr) < 1000) { alert('Vui lòng nhập số tiền hợp lệ'); return; }
    
    const amt = parseInt(amtStr);
    const catId = document.getElementById('categoryIdInput')?.value || '';
    const catName = document.getElementById('categoryNameInput')?.value || '';
    const note = document.getElementById('noteInput')?.value || '';
    const date = dateInput?.value || todayStr;
    const type = document.getElementById('typeInput')?.value || 'expense';

    const txData = { type, amount: amt, categoryId: catId, categoryName: catName, note };
    const newId = Date.now();

    // === CẢI TIẾN: BẮT ĐẦU MICRO-INTERACTION ===
    const btn = document.getElementById('submitBtn');
    
    // 1. Chuyển nút bấm sang trạng thái Xoay tròn (Loading)
    if (btn) btn.classList.add('is-loading');

    db.ref(`users/${currentUser.uid}/transactions/${date}/${newId}`).set(txData)
    .then(() => {
        // Giả lập độ trễ 400ms để người dùng kịp nhìn thấy hiệu ứng vòng quay xoay mượt mà
        setTimeout(() => {
            
            // 2. Bung nút ra thành Dấu Check Thành công
            if (btn) {
                btn.classList.remove('is-loading');
                btn.classList.add('is-success');
            }
            
            // 3. Rung điện thoại nhẹ (Haptic Feedback) và phát âm thanh "Ting"
            if (navigator.vibrate) navigator.vibrate([15, 40, 15]); 
            if (typeof playUISound === 'function') playUISound(type);
            
            currentDateLimit = DATES_PER_PAGE; 
            
            // 4. Giữ nguyên trạng thái ăn mừng 1 giây, sau đó gỡ bỏ và xóa trắng form
            setTimeout(() => {
                if (btn) btn.classList.remove('is-success');
                resetFormState();
            }, 1000);
            
        }, 400); // 400ms delay
        
    }).catch(() => { 
        if (btn) btn.classList.remove('is-loading');
        showToast('Lỗi khi lưu!', 'error'); 
    });
});

// ==========================================
// 9. CÀI ĐẶT GIAO DIỆN (DARK MODE & THEME)
// ==========================================
const darkModeText = document.getElementById('darkModeText');

function applyDarkMode(isDark) {
    const settingsDarkModeText = document.getElementById('settingsDarkModeText');
    if(isDark) {
        document.body.classList.add('dark-theme');
        if(darkModeText) darkModeText.innerText = 'Chế độ sáng';
        if(settingsDarkModeText) settingsDarkModeText.innerText = 'Chế độ sáng';
    } else {
        document.body.classList.remove('dark-theme');
        if(darkModeText) darkModeText.innerText = 'Chế độ tối';
        if(settingsDarkModeText) settingsDarkModeText.innerText = 'Chế độ tối';
    }
}

const savedDarkMode = localStorage.getItem('darkMode') === 'true';
applyDarkMode(savedDarkMode);

function initWalletThemes() {
    const grid = document.getElementById('walletThemeGrid');
    if(!grid) return;
    grid.innerHTML = '';
    WALLET_THEMES.forEach(theme => {
        const div = document.createElement('div');
        div.className = 'color-circle';
        div.style.background = theme.background;
        div.style.boxShadow = '0 0 0 2px var(--bg-color) inset, 0 4px 10px rgba(0,0,0,0.1)';
        div.onclick = () => {
            applyWalletTheme(theme.id);
            closeWalletThemeModal();
        };
        grid.appendChild(div);
    });
}

function applyWalletTheme(themeId, saveToDb = true) {
    const theme = WALLET_THEMES.find(t => t.id === themeId) || WALLET_THEMES[0];
    
    const walletCard = document.querySelector('.wallet-card');
    if(walletCard) {
        walletCard.style.setProperty('--wallet-bg', theme.background);
    }

    localStorage.setItem('walletTheme', themeId);
    if (saveToDb && currentUser) {
        db.ref(`users/${currentUser.uid}/settings/walletTheme`).set(themeId);
    }
}

function openWalletThemeModal() {
    document.getElementById('walletThemeOverlay')?.classList.add('show');
    document.getElementById('walletThemeModal')?.classList.add('show');
}
window.openWalletThemeModal = openWalletThemeModal;

function closeWalletThemeModal() {
    document.getElementById('walletThemeOverlay')?.classList.remove('show');
    document.getElementById('walletThemeModal')?.classList.remove('show');
}
window.closeWalletThemeModal = closeWalletThemeModal;

initWalletThemes();

const btnAvatar = document.getElementById('btnAvatar');
const dropdownMenu = document.getElementById('dropdownMenu');

if (btnAvatar && dropdownMenu) {
    btnAvatar.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        dropdownMenu.classList.toggle('show'); 
    });
    document.addEventListener('click', (e) => { 
        if(!dropdownMenu.contains(e.target) && e.target !== btnAvatar) {
            dropdownMenu.classList.remove('show'); 
        }
    });
}

const btnLogoutAvatar = document.getElementById('btnLogoutAvatar');
if (btnLogoutAvatar) {
    btnLogoutAvatar.addEventListener('click', () => {
        dropdownMenu?.classList.remove('show');
        if(confirm('Bạn muốn đăng xuất?')) {
            auth.signOut().then(() => { 
                if(txRef) txRef.off(); 
                if(catRef) catRef.off(); 
                applyWalletTheme('wt-blue', false);
                applyAppTheme('bg-default', false);
                localStorage.removeItem('walletTheme');
                localStorage.removeItem('appTheme');
                showToast('Đã đăng xuất'); 
                switchTab('home');
            });
        }
    });
}

function initAppThemes() {
    const grid = document.getElementById('appThemeGrid');
    if(!grid) return;
    grid.innerHTML = '';
    
    APP_THEMES.forEach(theme => {
        const div = document.createElement('div');
        div.className = 'color-circle';
        
        if(theme.id === 'bg-default') {
            div.style.background = 'var(--bg-color)';
            div.innerHTML = '<span style="font-size:10px; font-weight:800; color:var(--text-muted);">GỐC</span>';
            div.style.display = 'flex'; div.style.alignItems = 'center'; div.style.justifyContent = 'center';
        } else {
            div.style.background = theme.background;
        }
        
        div.style.boxShadow = '0 0 0 2px var(--bg-color) inset, 0 4px 10px rgba(0,0,0,0.1)';
        div.onclick = () => {
            applyAppTheme(theme.id);
            closeAppThemeModal();
        };
        grid.appendChild(div);
    });
}

function applyAppTheme(themeId, saveToDb = true) {
    const theme = APP_THEMES.find(t => t.id === themeId) || APP_THEMES[0];
    
    if (theme.id === 'bg-default') {
        document.body.style.background = '';
        document.body.style.backgroundAttachment = '';
    } else {
        document.body.style.background = theme.background;
        document.body.style.backgroundAttachment = 'fixed'; 
        document.body.style.backgroundSize = 'cover';
    }
    localStorage.setItem('appTheme', themeId);

    if (saveToDb && currentUser) {
        db.ref(`users/${currentUser.uid}/settings/appTheme`).set(themeId);
    }
}

function openAppThemeModal() {
    document.getElementById('appThemeOverlay')?.classList.add('show');
    document.getElementById('appThemeModal')?.classList.add('show');
}
window.openAppThemeModal = openAppThemeModal;

function closeAppThemeModal() {
    document.getElementById('appThemeOverlay')?.classList.remove('show');
    document.getElementById('appThemeModal')?.classList.remove('show');
}
window.closeAppThemeModal = closeAppThemeModal;

initAppThemes();

// ==========================================
// 10. THÔNG TIN CÁ NHÂN & ADMIN FUNCTIONS
// ==========================================
let currentBase64Avatar = null;

function openProfileModal() {
    document.getElementById('profileOverlay')?.classList.add('show');
    document.getElementById('profileModal')?.classList.add('show');
    const pPrev = document.getElementById('profileAvatarPreview');
    const aImg = document.getElementById('avatarImg');
    if (pPrev && aImg) pPrev.src = aImg.src;
}
window.openProfileModal = openProfileModal;

function closeProfileModal() {
    document.getElementById('profileOverlay')?.classList.remove('show');
    document.getElementById('profileModal')?.classList.remove('show');
}
window.closeProfileModal = closeProfileModal;

function openAvatarActionSheet() {
    document.getElementById('avatarSheetOverlay')?.classList.add('show');
    document.getElementById('avatarActionSheet')?.classList.add('show');
}
window.openAvatarActionSheet = openAvatarActionSheet;

function closeAvatarActionSheet() {
    document.getElementById('avatarSheetOverlay')?.classList.remove('show');
    document.getElementById('avatarActionSheet')?.classList.remove('show');
}
window.closeAvatarActionSheet = closeAvatarActionSheet;

function triggerAvatarUpload() {
    document.getElementById('avatarUploadInput')?.click();
    closeAvatarActionSheet();
}
window.triggerAvatarUpload = triggerAvatarUpload;

function setDefaultAvatar() {
    if(!currentUser) return;
    const inputName = document.getElementById('profileName')?.value.trim();
    const avatarName = inputName ? inputName : currentUser.email.split('@')[0];
    const defaultUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=4361ee&color=fff&bold=true`;
    
    const pPrev = document.getElementById('profileAvatarPreview');
    if (pPrev) pPrev.src = defaultUrl;
    currentBase64Avatar = "DELETE_AVATAR"; 
    closeAvatarActionSheet();
}
window.setDefaultAvatar = setDefaultAvatar;

document.getElementById('btnSettingsProfile')?.addEventListener('click', openProfileModal);

document.getElementById('avatarUploadInput')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        showToast('Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB!', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 256; 
            const MAX_HEIGHT = 256;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            const pPrev = document.getElementById('profileAvatarPreview');
            if (pPrev) pPrev.src = dataUrl;
            currentBase64Avatar = dataUrl;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('profileDob')?.addEventListener('change', (e) => {
    const dobDisp = document.getElementById('profileDobDisplay');
    if(e.target.value && dobDisp) {
        dobDisp.innerText = formatNiceDate(e.target.value).replace('Hôm nay, ', '');
    } else if (dobDisp) {
        dobDisp.innerText = 'Chưa cập nhật';
    }
});

document.getElementById('btnSaveProfile')?.addEventListener('click', () => {
    if(!currentUser) return;
    
    const name = document.getElementById('profileName')?.value.trim() || '';
    const dob = document.getElementById('profileDob')?.value || '';
    const phone = document.getElementById('profilePhone')?.value.trim() || '';
    
    const profileData = { name, dob, phone };
    
    if (currentBase64Avatar === "DELETE_AVATAR") {
        profileData.avatarData = null; 
    } else if (currentBase64Avatar) {
        profileData.avatarData = currentBase64Avatar; 
    }

    db.ref(`users/${currentUser.uid}/profile`).update(profileData)
    .then(() => {
        showToast('Đã lưu thông tin cá nhân!');
        closeProfileModal();
        currentBase64Avatar = null;
    }).catch(() => {
        showToast('Lỗi khi lưu!', 'error');
    });
});

// ==========================================
// 11. ADMIN DASHBOARD FUNCTIONS 
// ==========================================
let allSystemUsers = [];

function openAdminDashboard() {
    document.getElementById('adminDashboardOverlay')?.classList.add('show');
    document.getElementById('adminDashboardModal')?.classList.add('show');
    loadAllUsers();
}
window.openAdminDashboard = openAdminDashboard;

function closeAdminDashboard() {
    document.getElementById('adminDashboardOverlay')?.classList.remove('show');
    document.getElementById('adminDashboardModal')?.classList.remove('show');
}
window.closeAdminDashboard = closeAdminDashboard;

document.getElementById('btnSettingsAdminDashboard')?.addEventListener('click', openAdminDashboard);

function loadAllUsers() {
    const listEl = document.getElementById('adminUserList');
    if (!listEl) return;
    listEl.innerHTML = '<div class="loading-text">Đang tải danh sách...</div>';

    db.ref('users').once('value').then(snapshot => {
        if (!snapshot.exists()) {
            listEl.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-muted);">Không có dữ liệu</div>';
            return;
        }

        allSystemUsers = [];
        let adminCount = 0;
        let userCount = 0;

        snapshot.forEach(childSnap => {
            const uid = childSnap.key;
            const data = childSnap.val();
            const role = data.role || 'user';
            
            if (role === 'admin') adminCount++;
            else userCount++;
            
            allSystemUsers.push({
                uid: uid,
                email: data.email || 'Chưa cập nhật',
                role: role,
                name: (data.profile && data.profile.name) ? data.profile.name : 'Ẩn danh',
                createdAt: data.createdAt || ''
            });
        });

        const totalEl = document.getElementById('adminTotalUsers');
        const admEl = document.getElementById('adminTotalAdmins');
        const regEl = document.getElementById('adminTotalRegulars');
        if (totalEl) totalEl.innerText = allSystemUsers.length;
        if (admEl) admEl.innerText = adminCount;
        if (regEl) regEl.innerText = userCount;

        renderAdminUserList(allSystemUsers);
    }).catch(err => {
        console.error(err);
        listEl.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--danger);">Lỗi phân quyền hoặc mất kết nối!</div>';
    });
}

// TỐI ƯU HÓA: Tìm kiếm có Debounce cho danh sách người dùng
document.getElementById('adminSearchUser')?.addEventListener('input', debounce((e) => {
    const keyword = e.target.value.toLowerCase().trim();
    if (!keyword) {
        renderAdminUserList(allSystemUsers);
        return;
    }
    const filtered = allSystemUsers.filter(u => 
        u.name.toLowerCase().includes(keyword) || 
        u.email.toLowerCase().includes(keyword) ||
        u.uid.toLowerCase().includes(keyword)
    );
    renderAdminUserList(filtered);
}, 300));

function renderAdminUserList(users) {
    const listEl = document.getElementById('adminUserList');
    if (!listEl) return;
    
    // TỐI ƯU HÓA DOM: Gom chuỗi HTML trước khi in
    let listHTML = '';

    if (users.length === 0) {
        listEl.innerHTML = `
            <div style="text-align:center; padding: 30px 20px; color: var(--text-muted); background: var(--bg-color); border-radius: 16px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.5; margin-bottom:12px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="17" y1="8" x2="23" y2="14"></line><line x1="23" y1="8" x2="17" y2="14"></line></svg>
                <div style="font-size: 14px; font-weight: 600;">Không tìm thấy tài khoản</div>
            </div>`;
        return;
    }

    users.sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return a.name.localeCompare(b.name);
    });

    users.forEach(u => {
        const isMe = currentUser && u.uid === currentUser.uid;
        const roleBadge = u.role === 'admin' 
            ? `<span style="background: var(--danger-light); color: var(--danger); padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 800;">ADMIN</span>`
            : `<span style="background: #eef2ff; color: var(--primary); padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 800;">USER</span>`;

        const displayAvatarName = u.name !== 'Ẩn danh' ? u.name : u.email.split('@')[0];
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayAvatarName)}&background=random&color=fff&bold=true`;

        // Đã xóa chữ "(Bạn)"
        listHTML += `
            <div class="cat-item" style="padding: 16px; flex-direction: column; align-items: flex-start; gap: 14px; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); cursor: default;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
                        <img src="${avatarUrl}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); flex-shrink: 0;">
                        <div style="display: flex; flex-direction: column; overflow: hidden;">
                            <div style="font-weight: 700; font-size: 15px; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${u.name}
                            </div>
                            <div style="font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${u.email}</div>
                        </div>
                    </div>
                    <div style="flex-shrink: 0;">${isMe ? '<span style="background: var(--danger-light); color: var(--danger); padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 800;">ADMIN</span>' : roleBadge}</div>
                </div>

                <div style="background: #f8f9fa; padding: 8px 12px; border-radius: 8px; width: 100%; display: flex; align-items: center; gap: 8px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="flex-shrink: 0;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span style="font-size: 11px; font-family: monospace; color: var(--text-muted); word-break: break-all;">UID: ${u.uid}</span>
                </div>
                
                ${!isMe ? `
                <div style="display: flex; gap: 8px; width: 100%; margin-top: 2px;">
                    <button onclick="viewUserTransactions('${u.uid}', '${u.name}')" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border: none; background: #eef2ff; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; color: var(--primary); transition: 0.2s;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        Lịch sử
                    </button>
                    <button onclick="viewUserStats('${u.uid}', '${u.name}')" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border: none; background: #fff5ec; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; color: var(--warning); transition: 0.2s;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        Thống kê
                    </button>
                </div>` : ''}
            </div>
        `;
    });

    listEl.innerHTML = listHTML; // Gán HTML 1 lần duy nhất để tránh giật lag

    if(document.body.classList.contains('dark-theme')) {
        listEl.querySelectorAll('.cat-item').forEach(el => {
            el.style.backgroundColor = 'var(--card-bg)';
            el.style.borderColor = '#2d3748';
        });
        listEl.querySelectorAll('.cat-item > div:nth-child(2)').forEach(box => {
            box.style.backgroundColor = '#2d3748';
        });
        listEl.querySelectorAll('button[style*="background: #eef2ff"]').forEach(b => { b.style.backgroundColor = 'rgba(67, 97, 238, 0.15)'; b.style.color = '#829fff'; });
        listEl.querySelectorAll('button[style*="background: #fff5ec"]').forEach(b => { b.style.backgroundColor = 'rgba(243, 156, 18, 0.15)'; });
    }
}

// ==========================================
// 12. ADMIN XEM LỊCH SỬ GIAO DỊCH CỦA USER
// ==========================================
let currentAdminTxs = [];
let currentAdminCats = [];
let adminTxDateLimit = 3; 

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('admTxSearchInput')?.addEventListener('input', debounce(() => {
        adminTxDateLimit = 3; renderAdminTxList();
    }, 300));

    document.querySelectorAll('#admTxQuickDateFilters .btn-quick-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#admTxQuickDateFilters .btn-quick-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const range = btn.getAttribute('data-range');
            const customContainer = document.getElementById('admTxCustomDateContainer');
            
            let startVal = '', endVal = '';
            const today = new Date();
            const y = today.getFullYear();
            const m = today.getMonth();

            if (range === 'custom') {
                customContainer?.classList.remove('hide');
                return; 
            } else {
                customContainer?.classList.add('hide');
            }

            if (range === 'this_month') {
                startVal = `${y}-${String(m + 1).padStart(2, '0')}-01`;
                endVal = `${y}-${String(m + 1).padStart(2, '0')}-${new Date(y, m + 1, 0).getDate()}`;
            } else if (range === 'last_month') {
                const prevM = m === 0 ? 11 : m - 1;
                const prevY = m === 0 ? y - 1 : y;
                startVal = `${prevY}-${String(prevM + 1).padStart(2, '0')}-01`;
                endVal = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${new Date(prevY, prevM + 1, 0).getDate()}`;
            } else if (range === 'this_week') {
                const curr = new Date();
                const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1); 
                startVal = new Date(curr.setDate(first)).toISOString().split('T')[0];
                endVal = new Date(curr.setDate(first + 6)).toISOString().split('T')[0];
            }

            const aStart = document.getElementById('admTxStartDate');
            const aEnd = document.getElementById('admTxEndDate');
            const aSearch = document.getElementById('admTxSearchInput');
            if(aStart) aStart.value = startVal;
            if(aEnd) aEnd.value = endVal;
            if(aSearch) aSearch.value = ''; 
            
            adminTxDateLimit = 3;
            renderAdminTxList();
        });
    });

    const updateCustomDateUI = (inputEl, displayEl) => {
        const val = inputEl.value;
        if(val && displayEl) {
            const [y, m, d] = val.split('-');
            displayEl.innerText = `${d}/${m}/${y}`;
        }
        adminTxDateLimit = 3;
        renderAdminTxList();
    };
    
    document.getElementById('admTxStartDate')?.addEventListener('change', (e) => updateCustomDateUI(e.target, document.getElementById('admTxStartDateDisplay')));
    document.getElementById('admTxEndDate')?.addEventListener('change', (e) => updateCustomDateUI(e.target, document.getElementById('admTxEndDateDisplay')));
});

window.viewUserTransactions = function(uid, userName) {
    document.getElementById('adminUserTxOverlay')?.classList.add('show');
    document.getElementById('adminUserTxModal')?.classList.add('show');
    
    const titleEl = document.getElementById('adminUserTxTitle');
    const subEl = document.getElementById('adminUserTxSubtitle');
    if (titleEl) titleEl.innerText = 'Giao dịch: ' + userName.replace(/'/g, "\\'");
    if (subEl) subEl.innerText = 'Đang tải dữ liệu...';
    
    const searchIn = document.getElementById('admTxSearchInput');
    if (searchIn) searchIn.value = '';
    
    const listEl = document.getElementById('adminUserTxList');
    if (listEl) listEl.innerHTML = '<div class="loading-text">Đang tải dữ liệu...</div>';
    
    db.ref(`users/${uid}/categories`).once('value').then(catSnap => {
        if(catSnap.exists()) {
            currentAdminCats = Object.keys(catSnap.val()).map(k => ({id: k, ...catSnap.val()[k]}));
        } else {
            currentAdminCats = Object.keys(DEFAULT_CATEGORIES).map(k => ({id: k, ...DEFAULT_CATEGORIES[k]})); 
        }

        const histCatScroll = document.getElementById('admTxCategoryFilter');
        if (histCatScroll) {
            histCatScroll.innerHTML = '<div class="cat-pill active" data-filter="">Tất cả</div>';
            currentAdminCats.forEach(c => {
                const theme = THEMES[c.color] || THEMES['theme-gray'];
                histCatScroll.innerHTML += `<div class="cat-pill" data-filter="${c.name}"><div class="pill-icon" style="color: ${theme.color}">${SVG_LIB[c.icon] || ''}</div> ${c.name}</div>`;
            });
            histCatScroll.querySelectorAll('.cat-pill').forEach(pill => {
                pill.addEventListener('click', () => {
                    histCatScroll.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    adminTxDateLimit = 3; renderAdminTxList();
                });
            });
        }

        db.ref(`users/${uid}/transactions`).once('value').then(txSnap => {
            currentAdminTxs = [];
            if (txSnap.exists()) {
                const data = txSnap.val();
                for (let dateKey in data) {
                    for (let txId in data[dateKey]) {
                        currentAdminTxs.push({ id: Number(txId), date: dateKey, ...data[dateKey][txId] });
                    }
                }
            }
            adminTxDateLimit = 3;
            document.querySelector('#admTxQuickDateFilters .btn-quick-filter[data-range="this_month"]')?.click();
        });
    });
};

window.closeAdminUserTx = function() {
    document.getElementById('adminUserTxOverlay')?.classList.remove('show');
    document.getElementById('adminUserTxModal')?.classList.remove('show');
};

window.loadMoreAdminTx = function(btnElement) {
    if(btnElement) {
        btnElement.innerText = 'Đang tải...';
        btnElement.style.opacity = '0.5';
    }
    adminTxDateLimit += 3;
    setTimeout(() => {
        renderAdminTxList();
    }, 50);
};

function renderAdminTxList() {
    const listEl = document.getElementById('adminUserTxList');
    if (!listEl) return;
    
    const sText = document.getElementById('admTxSearchInput')?.value.toLowerCase().trim() || '';
    const activeCatPill = document.querySelector('#admTxCategoryFilter .cat-pill.active');
    const fCat = activeCatPill ? activeCatPill.getAttribute('data-filter') : '';
    
    const fStartDate = document.getElementById('admTxStartDate')?.value || '';
    const fEndDate = document.getElementById('admTxEndDate')?.value || '';
    
    const quickFilterActive = document.querySelector('#admTxQuickDateFilters .btn-quick-filter.active');
    const isQuickAll = quickFilterActive ? quickFilterActive.getAttribute('data-range') === 'all' : false;

    let displayData = currentAdminTxs;
    const isFiltering = (!isQuickAll && (fStartDate || fEndDate)) || sText || fCat;

    if (isFiltering) {
        displayData = currentAdminTxs.filter(t => {
            let matchDate = true;
            if (fStartDate && fEndDate) matchDate = t.date >= fStartDate && t.date <= fEndDate;
            else if (fStartDate) matchDate = t.date >= fStartDate;
            else if (fEndDate) matchDate = t.date <= fEndDate;
            
            const matchCat = fCat ? t.categoryName === fCat || t.category === fCat : true;
            const amtString = t.amount.toString();
            const matchSearch = sText ? (
                t.categoryName?.toLowerCase().includes(sText) || 
                t.category?.toLowerCase().includes(sText) || 
                (t.note && t.note.toLowerCase().includes(sText)) || amtString.includes(sText)
            ) : true;
            
            return matchDate && matchCat && matchSearch;
        });
    }

    const subEl = document.getElementById('adminUserTxSubtitle');
    if (subEl) subEl.innerText = `Kết quả: ${displayData.length} giao dịch`;

    const totalInc = displayData.filter(t => t.type === 'income').reduce((a,b)=>a+b.amount,0);
    const totalExp = displayData.filter(t => t.type === 'expense').reduce((a,b)=>a+b.amount,0);
    
    const aIncEl = document.getElementById('adminTxSumInc');
    const aExpEl = document.getElementById('adminTxSumExp');
    if (aIncEl) aIncEl.innerText = '+' + formatter.format(totalInc) + 'đ';
    if (aExpEl) aExpEl.innerText = '-' + formatter.format(totalExp) + 'đ';

    const grouped = {};
    displayData.forEach(t => {
        const dateStr = t.date; 
        if (!grouped[dateStr]) grouped[dateStr] = { items: [], in: 0, out: 0 };
        grouped[dateStr].items.push(t);
        if (t.type === 'income') grouped[dateStr].in += t.amount;
        if (t.type === 'expense') grouped[dateStr].out += t.amount;
    });

    const sortedDates = Object.keys(grouped).sort().reverse();

    let listHTML = '';

    if(sortedDates.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">Không tìm thấy giao dịch nào phù hợp.</div>';
        return;
    }

    // 1. BIỂU ĐỒ LUỒNG TIỀN
    listHTML += `
    <div class="modern-card" style="padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="font-size: 14px; color: var(--text-main); font-weight: 800; margin: 0;">Luồng tiền</h4>
            <div style="display: flex; gap: 8px; font-size: 11px; font-weight: 700;">
                <span style="color: var(--success);"><span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--success); margin-right:4px;"></span>Thu</span>
                <span style="color: var(--danger);"><span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--danger); margin-right:4px;"></span>Chi</span>
            </div>
        </div>
        <div style="position: relative; height: 180px; width: 100%;">
            <canvas id="admHistoryLineChart"></canvas>
        </div>
    </div>`;

    // 2. DANH SÁCH GIAO DỊCH
    listHTML += '<div class="timeline-wrapper-seamless" style="padding-top: 4px;">';

    const paginatedDates = sortedDates.slice(0, adminTxDateLimit);

    paginatedDates.forEach(rawDate => {
        const data = grouped[rawDate];
        const dObj = new Date(rawDate);
        const dayOfWeek = dObj.getDay();
        const daysVN = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const todayD = new Date();
        const yestD = new Date(); yestD.setDate(yestD.getDate() - 1);
        const formatD = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        
        let friendlyDate = '';
        const [y, m, d] = rawDate.split('-');
        if (rawDate === formatD(todayD)) friendlyDate = 'Hôm nay';
        else if (rawDate === formatD(yestD)) friendlyDate = 'Hôm qua';
        else friendlyDate = `${daysVN[dayOfWeek]}, ${d}/${m}`;

        let sparkbarHtml = '';
        if (data.out > 0) {
            const catExpense = {};
            data.items.forEach(t => {
                if (t.type === 'expense') catExpense[t.categoryId] = (catExpense[t.categoryId] || 0) + t.amount;
            });
            let segmentsHtml = '';
            for (let cid in catExpense) {
                const pct = (catExpense[cid] / data.out) * 100;
                const catObj = currentAdminCats.find(c => c.id === cid);
                const colorHex = (catObj && catObj.color && THEMES[catObj.color]) ? THEMES[catObj.color].hex : '#8395a7';
                segmentsHtml += `<div class="sparkbar-segment" style="width: ${pct}%; background-color: ${colorHex};"></div>`;
            }
            sparkbarHtml = `<div class="daily-sparkbar">${segmentsHtml}</div>`;
        } else if (data.in > 0) {
            sparkbarHtml = `<div class="daily-sparkbar"><div class="sparkbar-segment" style="width: 100%; background-color: #2ecc71; opacity: 0.6;"></div></div>`;
        } else {
            sparkbarHtml = `<div class="daily-sparkbar"></div>`;
        }

        listHTML += `
        <div class="date-group collapsed" id="adm_date_group_${rawDate}">
            <div class="date-group-header" onclick="document.getElementById('adm_date_group_${rawDate}').classList.toggle('collapsed')" style="flex-direction: column; align-items: stretch; justify-content: center !important; gap: 8px; padding-bottom: 10px !important; cursor: pointer;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; gap: 8px;">
                        <div class="date-title" style="font-size: 14px; display: flex; align-items: center; white-space: nowrap; flex-shrink: 0;">
                            ${friendlyDate}
                            <svg class="header-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        <div class="date-summary" style="display: flex; justify-content: flex-end; white-space: nowrap; overflow: hidden; flex: 1;">
                            <span class="ds-in text-success" style="width: auto !important; text-align: right;">+${formatter.format(data.in)}</span>
                            <span class="ds-sep" style="margin: 0 4px;">|</span> 
                            <span class="ds-out text-danger" style="width: auto !important; text-align: left;">-${formatter.format(data.out)}</span>
                        </div>
                    </div>
                ${sparkbarHtml}
            </div>
            <div class="date-group-items">
        `;

        data.items.sort((a, b) => b.id - a.id);

        data.items.forEach(t => {
            const isInc = t.type === 'income';
            const cName = t.categoryName || t.category;
            
            // BỌC GIÁP CHỐNG CRASH CHO DỮ LIỆU CŨ:
            const catObj = currentAdminCats.find(c => c.id === t.categoryId);
            const iconStr = (catObj && catObj.icon && SVG_LIB[catObj.icon]) ? SVG_LIB[catObj.icon] : SVG_LIB['other'];
            const innerSvg = iconStr.replace(/<svg[^>]*>|<\/svg>/g, '');
            const themeObj = (catObj && catObj.color && THEMES[catObj.color]) ? THEMES[catObj.color] : THEMES['theme-gray'];
            
            const timeObj = new Date(t.id);
            const timeStr = `${String(timeObj.getHours()).padStart(2, '0')}:${String(timeObj.getMinutes()).padStart(2, '0')}`;
            
            const amountClass = isInc ? 'text-success' : 'text-danger';
            const amountPrefix = isInc ? '+' : '-';

            listHTML += `
                <div class="transaction-item timeline-item swipe-front" style="cursor: default; pointer-events: none;">
                    <div class="t-left">
                        <div class="t-icon" style="background-color: ${themeObj.bg}; color: ${themeObj.color}; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${innerSvg}</svg>
                        </div>
                        <div class="t-info">
                            <div class="t-title" style="font-size: 15px;">${cName}</div>
                            <div class="t-note" style="font-size: 12px;">⏱ ${timeStr} ${t.note ? ' • ' + t.note : ''}</div>
                        </div>
                    </div>
                    <div class="t-action" style="display: flex; align-items: center; gap: 8px;">
                        <div class="t-amount ${amountClass}" style="font-size: 15px; font-weight: 800;">${amountPrefix}${formatter.format(t.amount)}</div>
                    </div>
                </div>
            `;
        });
        
        listHTML += `</div></div>`;
    });

    listHTML += `</div>`; 

    if (sortedDates.length > adminTxDateLimit) {
        listHTML += `<div style="padding-bottom: 20px;"><button id="btnLoadMoreAdmin" style="width: 100%; padding: 14px; background: transparent; border: 2px dashed #cbd5e1; color: var(--text-muted); border-radius: 20px; font-weight: 700; cursor: pointer; text-align: center;" onclick="loadMoreAdminTx(this)">Xem thêm các ngày trước</button></div>`;
    } else if (sortedDates.length > 0) {
        listHTML += `<div class="end-of-list-msg">Đã hiển thị toàn bộ giao dịch</div>`;
    }
    
    listEl.innerHTML = listHTML;

    setTimeout(() => {
        if (sortedDates.length > 0) {
            const canvas = document.getElementById('admHistoryLineChart');
            if (canvas) {
                if (window.admHistLineChartInst) window.admHistLineChartInst.destroy();
                const ctx = canvas.getContext('2d');
                
                const chartLabels = [];
                const chartIncData = [];
                const chartExpData = [];

                const chartSortedDates = [...sortedDates].reverse();

                chartSortedDates.forEach(dateStr => {
                    const d = grouped[dateStr];
                    const [y, m, day] = dateStr.split('-');
                    chartLabels.push(`${day}/${m}`);
                    chartIncData.push(d.in);
                    chartExpData.push(d.out);
                });

                const incGradient = ctx.createLinearGradient(0, 0, 0, 180);
                incGradient.addColorStop(0, 'rgba(46, 204, 113, 0.4)');
                incGradient.addColorStop(1, 'rgba(46, 204, 113, 0.0)');

                const expGradient = ctx.createLinearGradient(0, 0, 0, 180);
                expGradient.addColorStop(0, 'rgba(231, 76, 60, 0.4)');
                expGradient.addColorStop(1, 'rgba(231, 76, 60, 0.0)');

                window.admHistLineChartInst = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: chartLabels,
                        datasets: [
                            { label: 'Tiền Thu', data: chartIncData, borderColor: '#2ecc71', backgroundColor: incGradient, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, fill: true, tension: 0.4 },
                            { label: 'Tiền Chi', data: chartExpData, borderColor: '#e74c3c', backgroundColor: expGradient, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, fill: true, tension: 0.4 }
                        ]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: 'index' },
                        scales: {
                            y: { beginAtZero: true, ticks: { callback: v => (v === 0 ? 0 : v / 1000 + 'K'), font: {size: 10} }, grid: { borderDash: [4, 4], color: document.body.classList.contains('dark-theme') ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } },
                            x: { grid: { display: false }, ticks: { maxTicksLimit: 7, font: {size: 10}, color: '#94a3b8' } }
                        },
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }
    }, 100);
}

// ==========================================
// 13. ADMIN XEM THỐNG KÊ CỦA USER
// ==========================================
// ==========================================
// 13. ADMIN XEM THỐNG KÊ CỦA USER
// ==========================================

// --- BẮT ĐẦU ĐOẠN CODE CẦN THÊM VÀO ---

// 1. Khai báo các biến toàn cục dùng cho Thống kê Admin để tránh lỗi Undefined/Crash
let admCurrentPieType = 'expense';
let admTxs = [];
let admCats = [];
let admBarChartInst = null;
let admLineChartInst = null;
let admPieChartInst = null;

// 2. Hàm chuyển đổi chế độ lọc (Ngày/Tháng) dành riêng cho Admin
window.switchAdmStatsMode = function(mode) {
    const modeEl = document.getElementById('adm_statsFilterMode');
    const btnRange = document.getElementById('adm_btnModeRange');
    const btnMonth = document.getElementById('adm_btnModeMonth');
    const rangeContainer = document.getElementById('adm_statsRangeContainer');
    const monthContainer = document.getElementById('adm_statsMonthContainer');

    if (modeEl) modeEl.value = mode;

    if (mode === 'range') {
        if (btnRange) { btnRange.classList.add('active'); btnRange.style.background = 'var(--primary)'; btnRange.style.color = 'white'; }
        if (btnMonth) { btnMonth.classList.remove('active'); btnMonth.style.background = 'var(--bg-color)'; btnMonth.style.color = 'var(--text-muted)'; }
        if (rangeContainer) rangeContainer.classList.remove('hide');
        if (monthContainer) monthContainer.classList.add('hide');
    } else {
        if (btnMonth) { btnMonth.classList.add('active'); btnMonth.style.background = 'var(--primary)'; btnMonth.style.color = 'white'; }
        if (btnRange) { btnRange.classList.remove('active'); btnRange.style.background = 'var(--bg-color)'; btnRange.style.color = 'var(--text-muted)'; }
        if (monthContainer) monthContainer.classList.remove('hide');
        if (rangeContainer) rangeContainer.classList.add('hide');
    }
    // Gọi lại hàm vẽ biểu đồ sau khi đổi UI
    renderAdmCharts();
};

// 3. Gắn sự kiện (Listeners) cho các nút bấm và bộ lọc trong Admin Modal
window.addEventListener('DOMContentLoaded', () => {
    // Sự kiện chuyển Tab Ngày/Tháng
    document.getElementById('adm_btnModeRange')?.addEventListener('click', () => switchAdmStatsMode('range'));
    document.getElementById('adm_btnModeMonth')?.addEventListener('click', () => switchAdmStatsMode('month'));

    // Sự kiện thay đổi Input thời gian -> Tự động cập nhật biểu đồ
    document.getElementById('adm_statsMonthPicker')?.addEventListener('change', renderAdmCharts);
    document.getElementById('adm_statsStartDate')?.addEventListener('change', renderAdmCharts);
    document.getElementById('adm_statsEndDate')?.addEventListener('change', renderAdmCharts);

    // Sự kiện chọn Thu/Chi cho Biểu đồ tròn (Pie Chart)
    document.getElementById('adm_btnPieExp')?.addEventListener('click', function() {
        this.classList.add('active', 'expense');
        document.getElementById('adm_btnPieInc')?.classList.remove('active', 'income');
        admCurrentPieType = 'expense';
        renderAdmCharts();
    });

    document.getElementById('adm_btnPieInc')?.addEventListener('click', function() {
        this.classList.add('active', 'income');
        document.getElementById('adm_btnPieExp')?.classList.remove('active', 'expense');
        admCurrentPieType = 'income';
        renderAdmCharts();
    });
});
window.viewUserStats = function(uid, userName) {
    document.getElementById('adminUserStatsOverlay')?.classList.add('show');
    document.getElementById('adminUserStatsModal')?.classList.add('show');
    
    const titleEl = document.getElementById('adminUserStatsTitle');
    if (titleEl) titleEl.innerText = 'Thống kê: ' + userName.replace(/'/g, "\\'");

    // ÉP NGÀY THÁNG ĐỂ TRÁNH LỖI TRỐNG DỮ LIỆU
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    
    const sDate = `${y}-${m}-01`;
    const eDate = `${y}-${m}-${d}`;

    const mp = document.getElementById('adm_statsMonthPicker');
    const sd = document.getElementById('adm_statsStartDate');
    const ed = document.getElementById('adm_statsEndDate');
    
    if (mp) mp.value = `${y}-${m}`;
    if (sd) sd.value = sDate;
    if (ed) ed.value = eDate;
    
    const dispStart = document.getElementById('adm_statsStartDateDisplay');
    const dispEnd = document.getElementById('adm_statsEndDateDisplay');
    if (dispStart) dispStart.innerText = `01/${m}/${y}`;
    if (dispEnd) dispEnd.innerText = `${d}/${m}/${y}`;

    const modeEl = document.getElementById('adm_statsFilterMode');
    const btnR = document.getElementById('adm_btnModeRange');
    const btnM = document.getElementById('adm_btnModeMonth');
    if (modeEl) modeEl.value = 'range';
    if (btnR) { btnR.className = 'btn-toggle active'; btnR.style.background = 'var(--primary)'; btnR.style.color = 'white'; }
    if (btnM) { btnM.className = 'btn-toggle'; btnM.style.background = 'var(--bg-color)'; btnM.style.color = 'var(--text-muted)'; }
    document.getElementById('adm_statsRangeContainer')?.classList.remove('hide');
    document.getElementById('adm_statsMonthContainer')?.classList.add('hide');

    db.ref(`users/${uid}/categories`).once('value').then(catSnap => {
        if(catSnap.exists()) {
            admCats = Object.keys(catSnap.val()).map(k => ({id: k, ...catSnap.val()[k]}));
        } else {
            admCats = Object.keys(DEFAULT_CATEGORIES).map(k => ({id: k, ...DEFAULT_CATEGORIES[k]})); 
        }

        db.ref(`users/${uid}/transactions`).once('value').then(txSnap => {
            admTxs = [];
            if (txSnap.exists()) {
                const data = txSnap.val();
                for (let dateKey in data) {
                    for (let txId in data[dateKey]) {
                        admTxs.push({ id: Number(txId), date: dateKey, ...data[dateKey][txId] });
                    }
                }
            }
            // Gọi vẽ bằng SetTimeout để đảm bảo DOM được nạp
            setTimeout(() => { renderAdmCharts(); }, 350);
        });
    });
};

window.closeAdminUserStats = function() {
    document.getElementById('adminUserStatsOverlay')?.classList.remove('show');
    document.getElementById('adminUserStatsModal')?.classList.remove('show');
};

window.switchAdmDashboardChart = function(type, btnElement) {
    const tabs = document.querySelectorAll('#adm_dashboardTabs .dash-tab-btn');
    tabs.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    document.getElementById('adm_dashViewPie').classList.add('hide');
    document.getElementById('adm_dashViewBar').classList.add('hide');
    document.getElementById('adm_dashViewLine').classList.add('hide');

    if (type === 'pie') document.getElementById('adm_dashViewPie').classList.remove('hide');
    if (type === 'bar') document.getElementById('adm_dashViewBar').classList.remove('hide');
    if (type === 'line') document.getElementById('adm_dashViewLine').classList.remove('hide');

    setTimeout(() => {
        if (type === 'pie' && admPieChartInst) admPieChartInst.resize();
        if (type === 'bar' && admBarChartInst) admBarChartInst.resize();
        if (type === 'line' && admLineChartInst) admLineChartInst.resize();
    }, 50);
};

function renderAdmCharts() {
    const modeEl = document.getElementById('adm_statsFilterMode');
    const mode = modeEl ? modeEl.value : 'range';
    let startDateStr = '', endDateStr = '', displayTitleText = '', daysToAverage = 1;

    if (mode === 'month') {
        const monthVal = document.getElementById('adm_statsMonthPicker')?.value || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        const [y, m] = monthVal.split('-');
        startDateStr = `${y}-${m}-01`;
        const lastDay = new Date(y, parseInt(m), 0).getDate();
        endDateStr = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
        displayTitleText = `Tháng ${parseInt(m)}/${y}`;
        const now = new Date();
        daysToAverage = (parseInt(y) === now.getFullYear() && parseInt(m) === (now.getMonth() + 1)) ? now.getDate() : lastDay;
    } else {
        const t = new Date();
        const y = t.getFullYear(); const m = String(t.getMonth() + 1).padStart(2, '0'); const d = String(t.getDate()).padStart(2, '0');
        
        startDateStr = document.getElementById('adm_statsStartDate')?.value || `${y}-${m}-01`;
        endDateStr = document.getElementById('adm_statsEndDate')?.value || `${y}-${m}-${d}`;
        
        if (startDateStr > endDateStr) {
            let temp = startDateStr; startDateStr = endDateStr; endDateStr = temp;
        }
        
        // Tránh lỗi khi cắt chuỗi ngày
        const formatVN = (str) => {
            if(!str) return '';
            const parts = str.split('-');
            if(parts.length < 3) return str;
            return `${parts[2]}/${parts[1]}`;
        };
        
        displayTitleText = `${formatVN(startDateStr)} - ${formatVN(endDateStr)}`;
        const sDate = new Date(startDateStr); const eDate = new Date(endDateStr);
        daysToAverage = Math.floor((eDate - sDate) / (1000 * 60 * 60 * 24)) + 1;
        if (daysToAverage < 1) daysToAverage = 1;
    }

    const pieSub = document.getElementById('adm_pieSubtitle');
    const barSub = document.getElementById('adm_barSubtitle');
    const lineSub = document.getElementById('adm_lineSubtitle');
    if (pieSub) pieSub.innerText = displayTitleText;
    if (barSub) barSub.innerText = displayTitleText;
    if (lineSub) lineSub.innerText = displayTitleText;

    const periodTxs = admTxs.filter(t => t.date >= startDateStr && t.date <= endDateStr);
    let totalInc = 0, totalExp = 0, maxExpTx = null;

    periodTxs.forEach(t => {
        if (t.type === 'income') totalInc += t.amount;
        if (t.type === 'expense') {
            totalExp += t.amount;
            if (!maxExpTx || t.amount > maxExpTx.amount) maxExpTx = t;
        }
    });

    const netFlow = totalInc - totalExp;
    const elNetFlow = document.getElementById('adm_kpiNetFlow');
    if (elNetFlow) {
        elNetFlow.innerText = currencyFormatter.format(netFlow);
        elNetFlow.className = 'hero-kpi-value ' + (netFlow >= 0 ? 'text-success' : 'text-danger');
    }
    
    const elFlowDesc = document.getElementById('adm_kpiNetFlowDesc');
    if (elFlowDesc) elFlowDesc.innerHTML = `Thu: <span class="text-success">+${formatter.format(totalInc)}</span> | Chi: <span class="text-danger">-${formatter.format(totalExp)}</span>`;
    
    const elAvg = document.getElementById('adm_kpiAvgExpense');
    if (elAvg) elAvg.innerText = currencyFormatter.format(Math.round(totalExp / daysToAverage));

    const pSDate = new Date(startDateStr); pSDate.setMonth(pSDate.getMonth() - 1);
    const pEDate = new Date(endDateStr); pEDate.setMonth(pEDate.getMonth() - 1);
    const prevStartStr = `${pSDate.getFullYear()}-${String(pSDate.getMonth() + 1).padStart(2, '0')}-${String(pSDate.getDate()).padStart(2, '0')}`;
    const prevEndStr = `${pEDate.getFullYear()}-${String(pEDate.getMonth() + 1).padStart(2, '0')}-${String(pEDate.getDate()).padStart(2, '0')}`;
    
    let prevDays = daysToAverage;
    if (mode === 'month') { prevDays = new Date(pSDate.getFullYear(), pSDate.getMonth() + 1, 0).getDate(); }
    
    const prevPeriodTxs = admTxs.filter(t => t.date >= prevStartStr && t.date <= prevEndStr);
    let prevTotalExp = 0;
    prevPeriodTxs.forEach(t => { if (t.type === 'expense') prevTotalExp += t.amount; });
    
    const currentAvgExp = Math.round(totalExp / daysToAverage);
    const prevAvgExp = Math.round(prevTotalExp / prevDays);
    
    const elTrend = document.getElementById('adm_kpiAvgExpenseTrend');
    if (elTrend) {
        elTrend.classList.remove('hide', 'good', 'bad', 'neutral');
        if (prevAvgExp === 0 && currentAvgExp === 0) {
            elTrend.classList.add('neutral'); elTrend.innerHTML = '- 0%';
        } else if (prevAvgExp === 0 && currentAvgExp > 0) {
            elTrend.classList.add('bad'); elTrend.innerHTML = '↑ 100%';
        } else {
            const diffPercent = Math.round(((currentAvgExp - prevAvgExp) / prevAvgExp) * 100);
            if (diffPercent > 0) { elTrend.classList.add('bad'); elTrend.innerHTML = `↑ ${diffPercent}%`; } 
            else if (diffPercent < 0) { elTrend.classList.add('good'); elTrend.innerHTML = `↓ ${Math.abs(diffPercent)}%`; } 
            else { elTrend.classList.add('neutral'); elTrend.innerHTML = '- 0%'; }
        }
    }

    const maxExpEl = document.getElementById('adm_kpiMaxExpense');
    const maxExpNameEl = document.getElementById('adm_kpiMaxExpenseName');
    if (maxExpTx) {
        if (maxExpEl) maxExpEl.innerText = currencyFormatter.format(maxExpTx.amount);
        
        // Tránh lỗi lấy ngày từ khoản max
        const mDateParts = maxExpTx.date ? maxExpTx.date.split('-') : ['','',''];
        const mDateStr = mDateParts.length >= 3 ? `${mDateParts[2]}/${mDateParts[1]}` : '';
        if (maxExpNameEl) maxExpNameEl.innerText = (maxExpTx.categoryName || maxExpTx.category || 'Khác') + ` (${mDateStr})`;
    } else {
        if (maxExpEl) maxExpEl.innerText = '0 đ';
        if (maxExpNameEl) maxExpNameEl.innerText = 'Chưa có dữ liệu';
    }

    const targetTypeTxs = periodTxs.filter(t => t.type === admCurrentPieType);
    const txByCat = {};
    targetTypeTxs.forEach(t => {
        const cName = t.categoryName || t.category;
        if(!txByCat[cName]) {
            const catObj = admCats.find(c => c.id === t.categoryId);
            txByCat[cName] = { amount: 0, colorHex: (catObj && catObj.color && THEMES[catObj.color]) ? THEMES[catObj.color].hex : '#8395a7' };
        }
        txByCat[cName].amount += t.amount;
    });

    if(admPieChartInst) admPieChartInst.destroy();
    const pieLabels = Object.keys(txByCat);
    
    const pCanvas = document.getElementById('adm_pieChart');
    const pEmpty = document.getElementById('adm_pieEmptyState');
    
    if (pieLabels.length === 0) {
        if (pCanvas) pCanvas.style.display = 'none';
        pEmpty?.classList.remove('hide');
    } else {
        if (pCanvas) pCanvas.style.display = 'block';
        pEmpty?.classList.add('hide');
        
        const bgColor = document.body.classList.contains('dark-theme') ? '#1e293b' : '#ffffff';

        if (pCanvas) {
            admPieChartInst = new Chart(pCanvas.getContext('2d'), {
                type: 'doughnut',
                data: { 
                    labels: pieLabels, 
                    datasets: [{ 
                        data: pieLabels.map(k => txByCat[k].amount), 
                        backgroundColor: pieLabels.map(k => txByCat[k].colorHex), 
                        borderWidth: 3, 
                        borderColor: bgColor, 
                        hoverOffset: 6, 
                        borderRadius: 4 
                    }] 
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    cutout: '75%', 
                    plugins: { 
                        legend: { position: 'right', labels: { usePointStyle: true, padding: 20, font: {size: 12, weight: '600'} } }, 
                        tooltip: { enabled: false } 
                    } 
                }
            });
        }
    }

    const t5Title = document.getElementById('adm_top5Title');
    if (t5Title) t5Title.innerText = admCurrentPieType === 'expense' ? 'Top 5 khoản chi lớn nhất' : 'Top 5 khoản thu lớn nhất';
    
    const top5Txs = targetTypeTxs.sort((a, b) => b.amount - a.amount).slice(0, 5);
    const topListEl = document.getElementById('adm_topExpenseList');
    if (topListEl) {
        let top5HTML = ''; 
        if (top5Txs.length === 0) {
            topListEl.innerHTML = `<div style="text-align:center; padding: 20px 0; color: var(--text-muted); font-size: 13px;">Không có dữ liệu</div>`;
        } else {
            top5Txs.forEach(t => {
                
                // BỌC GIÁP CHỐNG CRASH CHO TOP 5
                const catObj = admCats.find(c => c.id === t.categoryId);
                const themeObj = (catObj && catObj.color && THEMES[catObj.color]) ? THEMES[catObj.color] : THEMES['theme-gray'];
                const iconStr = (catObj && catObj.icon && SVG_LIB[catObj.icon]) ? SVG_LIB[catObj.icon] : SVG_LIB['other'];
                const innerSvg = iconStr.replace(/<svg[^>]*>|<\/svg>/g, '');

                const amtClass = admCurrentPieType === 'expense' ? 'text-danger' : 'text-success';
                const amtPrefix = admCurrentPieType === 'expense' ? '-' : '+';
                
                const tDateParts = t.date ? t.date.split('-') : ['','',''];
                const shortDate = tDateParts.length >= 3 ? `${tDateParts[2]}/${tDateParts[1]}/${tDateParts[0].substring(2)}` : '';
                
                top5HTML += `
                    <div class="transaction-item" style="padding: 12px 0; cursor: default;">
                        <div class="t-left">
                            <div class="t-icon" style="background-color: ${themeObj.bg}; color: ${themeObj.color}; width: 40px; height: 40px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${innerSvg}</svg>
                            </div>
                            <div class="t-info">
                                <div class="t-title" style="font-size: 15px;">${t.categoryName || t.category}</div>
                                <div class="t-note" style="font-size: 12px;">${shortDate}</div>
                            </div>
                        </div>
                        <div class="t-action"><div class="t-amount ${amtClass}" style="font-size: 15px;">${amtPrefix}${formatter.format(t.amount)}</div></div>
                    </div>`;
            });
            topListEl.innerHTML = top5HTML;
        }
    }

    let dateList = []; let currDate = new Date(startDateStr); let eDate = new Date(endDateStr);
    while(currDate <= eDate) {
        let y = currDate.getFullYear(); let m = String(currDate.getMonth() + 1).padStart(2, '0'); let d = String(currDate.getDate()).padStart(2, '0');
        dateList.push(`${y}-${m}-${d}`);
        currDate.setDate(currDate.getDate() + 1);
    }

    const barLabels = [], inData = [], outData = [], lineData = [];
    let runningBalance = 0;
    admTxs.forEach(t => { if (t.date < startDateStr) runningBalance += (t.type === 'income' ? t.amount : -t.amount); });

    dateList.forEach(dateStr => {
        barLabels.push(`${dateStr.split('-')[2]}/${dateStr.split('-')[1]}`);
        const dayTxs = periodTxs.filter(t => t.date === dateStr);
        let dIn = dayTxs.filter(t => t.type === 'income').reduce((s, t)=>s+t.amount, 0);
        let dOut = dayTxs.filter(t => t.type === 'expense').reduce((s, t)=>s+t.amount, 0);
        inData.push(dIn); outData.push(dOut);
        runningBalance += (dIn - dOut); lineData.push(runningBalance);
    });

    const bCanvas = document.getElementById('adm_barChart');
    if(admBarChartInst) admBarChartInst.destroy();
    if (bCanvas) {
        admBarChartInst = new Chart(bCanvas.getContext('2d'), {
            type: 'bar',
            data: { labels: barLabels, datasets: [{ label: 'Thu', data: inData, backgroundColor: '#2ecc71', borderRadius: 4 }, { label: 'Chi', data: outData, backgroundColor: '#e74c3c', borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => (v===0?0:v/1000+'K') } }, x: { grid: { display: false } } } }
        });
    }

    const lCanvas = document.getElementById('adm_lineChart');
    if(admLineChartInst) admLineChartInst.destroy();
    if (lCanvas) {
        const ctxLine = lCanvas.getContext('2d');
        const lineGradient = ctxLine.createLinearGradient(0, 0, 0, 260);
        lineGradient.addColorStop(0, 'rgba(67, 97, 238, 0.4)');
        lineGradient.addColorStop(1, 'rgba(67, 97, 238, 0.0)');

        admLineChartInst = new Chart(ctxLine, {
            type: 'line',
            data: { 
                labels: barLabels, 
                datasets: [{ 
                    label: 'Số dư', 
                    data: lineData, 
                    borderColor: '#4361ee', 
                    backgroundColor: lineGradient, 
                    borderWidth: 2.5, 
                    fill: true, 
                    tension: 0.4, 
                    pointRadius: 0, 
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#4361ee',
                    pointBorderWidth: 2,
                    pointHoverBorderWidth: 3
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                interaction: { intersect: false, mode: 'index' }, 
                scales: { 
                    y: { 
                        ticks: { display: false }, 
                        grid: { borderDash: [4, 4], color: document.body.classList.contains('dark-theme') ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } 
                    }, 
                    x: { 
                        grid: { display: false }, 
                        ticks: { maxTicksLimit: 7, font: {size: 10}, color: '#94a3b8' } 
                    } 
                }, 
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: document.body.classList.contains('dark-theme') ? '#1e293b' : '#ffffff',
                        titleColor: document.body.classList.contains('dark-theme') ? '#94a3b8' : '#64748b',
                        bodyColor: document.body.classList.contains('dark-theme') ? '#f1f5f9' : '#0f172a',
                        borderColor: document.body.classList.contains('dark-theme') ? '#334155' : '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        boxPadding: 6,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) { return ' Số dư: ' + new Intl.NumberFormat('vi-VN').format(context.raw) + 'đ'; }
                        }
                    } 
                } 
            }
        });
    }
}

// ==========================================
// 14. TÍNH NĂNG ADMIN: TẠO TÀI KHOẢN MỚI
// ==========================================
const secondaryApp = firebase.initializeApp(firebaseConfig, "SecondaryApp");

window.openCreateUserModal = function() {
    document.getElementById('createUserOverlay')?.classList.add('show');
    document.getElementById('createUserModal')?.classList.add('show');
    
    const newName = document.getElementById('newUserName');
    const newEmail = document.getElementById('newUserEmail');
    const newPwd = document.getElementById('newUserPassword');
    
    if (newName) newName.value = '';
    if (newEmail) newEmail.value = '';
    if (newPwd) newPwd.value = '';
};

window.closeCreateUserModal = function() {
    document.getElementById('createUserOverlay')?.classList.remove('show');
    document.getElementById('createUserModal')?.classList.remove('show');
};

document.getElementById('btnSubmitCreateUser')?.addEventListener('click', () => {
    const nameEl = document.getElementById('newUserName');
    const emailEl = document.getElementById('newUserEmail');
    const pwdEl = document.getElementById('newUserPassword');
    
    const name = nameEl ? nameEl.value.trim() : '';
    let email = emailEl ? emailEl.value.trim() : '';
    const password = pwdEl ? pwdEl.value : '';

    if(!name || !email || !password) {
        showToast('Vui lòng điền đủ thông tin!', 'error');
        return;
    }
    if(password.length < 6) {
        showToast('Mật khẩu phải từ 6 ký tự!', 'error');
        return;
    }

    if(!email.includes('@')) {
        email = `${email}@chitieu.com`;
    }

    const btn = document.getElementById('btnSubmitCreateUser');
    if(btn) {
        btn.innerText = 'Đang tạo...';
        btn.disabled = true;
    }

    secondaryApp.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const newUid = userCredential.user.uid;
            const userData = {
                email: email,
                role: 'user', 
                createdAt: new Date().toISOString()
            };
            
            return db.ref(`users/${newUid}`).set(userData).then(() => {
                return db.ref(`users/${newUid}/profile`).set({
                    name: name
                });
            });
        })
        .then(() => {
            secondaryApp.auth().signOut();
            showToast('Tạo tài khoản thành công!');
            closeCreateUserModal();
            if(typeof loadAllUsers === 'function') loadAllUsers(); 
        })
        .catch((error) => {
            let errorMsg = getAuthErrorVN(error.code);
            if(error.code === 'auth/email-already-in-use') {
                errorMsg = 'Email (hoặc Tên tài khoản) này đã được sử dụng!';
            }
            showToast(errorMsg || 'Lỗi khi tạo tài khoản', 'error');
        })
        .finally(() => {
            if(btn) {
                btn.innerText = 'Xác nhận tạo';
                btn.disabled = false;
            }
        });
});

// ==========================================
// ĐĂNG KÝ SERVICE WORKER & TỰ ĐỘNG CẬP NHẬT PWA
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                // Kiểm tra nếu có bản cập nhật Service Worker mới đang được tải về
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        // Nếu bản mới đã cài đặt xong và đã có SW cũ đang chạy
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('Có phiên bản mới, đang tự động tải lại...');
                        }
                    });
                });
            })
            .catch(error => console.error('Lỗi đăng ký ServiceWorker: ', error));
    });

    // Lắng nghe sự kiện khi Service Worker mới đã chiếm quyền (claim)
    // -> Tự động F5 (Reload) trang web để nạp code mới nhất
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}
// ==========================================
// TÍNH NĂNG: SỔ VAY & NỢ (DEBTS & LOANS)
// ==========================================
let debtsData = [];
let currentDebtTab = 'lent'; 

function switchDebtTab(type) {
    currentDebtTab = type;
    document.getElementById('btnTabLent')?.classList.toggle('active', type === 'lent');
    document.getElementById('btnTabBorrowed')?.classList.toggle('active', type === 'borrowed');
    
    const summaryLabel = document.getElementById('debtSummaryLabel');
    if(summaryLabel) summaryLabel.innerText = type === 'lent' ? 'Tổng tiền chưa thu' : 'Tổng tiền chưa trả';
    
    renderDebtUI();
}
window.switchDebtTab = switchDebtTab;
document.getElementById('debtSearchInput')?.addEventListener('input', debounce(() => {
    renderDebtUI();
}, 300));
// HÀM MỚI: Tự động đóng/mở chi tiết khoản nợ của từng người
window.toggleDebtGroup = function(groupId) {
    const content = document.getElementById('content_' + groupId);
    const icon = document.getElementById('icon_' + groupId);
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    }
};

function renderDebtUI() {
    const listEl = document.getElementById('debtList');
    const paidListEl = document.getElementById('debtPaidList');
    if(!listEl || !paidListEl) return;

    // 1. LẤY TỪ KHÓA TÌM KIẾM
    const searchText = document.getElementById('debtSearchInput')?.value.toLowerCase().trim() || '';

    // 2. LỌC DỮ LIỆU THEO TAB VÀ THEO TỪ KHÓA
    let filtered = debtsData.filter(d => d.type === currentDebtTab);
    
    if (searchText) {
        filtered = filtered.filter(d => {
            const matchName = d.person.toLowerCase().includes(searchText);
            const matchNote = d.note && d.note.toLowerCase().includes(searchText);
            const matchAmount = d.amount.toString().includes(searchText);
            return matchName || matchNote || matchAmount;
        });
    }

    const pending = filtered.filter(d => d.status === 'pending').sort((a,b) => b.date.localeCompare(a.date));
    const paid = filtered.filter(d => d.status === 'paid').sort((a,b) => b.date.localeCompare(a.date));

    // Gom nhóm theo tên người
    const groupedPending = {};
    let totalPending = 0;

    pending.forEach(d => {
        const personName = d.person.trim();
        if (!groupedPending[personName]) {
            groupedPending[personName] = { person: personName, totalRemain: 0, items: [] };
        }
        const remain = d.amount - (d.paidAmount || 0);
        groupedPending[personName].totalRemain += remain;
        groupedPending[personName].items.push(d);
        totalPending += remain;
    });

    const groupedArray = Object.values(groupedPending).sort((a, b) => b.totalRemain - a.totalRemain);

    const summaryAmt = document.getElementById('debtSummaryAmount');
    const countEl = document.getElementById('debtListCount');
    if(summaryAmt) summaryAmt.innerText = formatter.format(totalPending) + 'đ';
    if(countEl) countEl.innerText = searchText ? `(Đã lọc: ${pending.length} khoản)` : `(${pending.length} khoản / ${groupedArray.length} người)`;

    // Render danh sách Đang treo
    listEl.innerHTML = '';
    if(groupedArray.length === 0) {
        listEl.innerHTML = searchText 
            ? '<div style="text-align:center; padding: 20px; color: var(--text-muted); font-size:13px;">Không tìm thấy kết quả phù hợp.</div>'
            : '<div style="text-align:center; padding: 20px; color: var(--text-muted); font-size:13px;">Tuyệt vời! Không có khoản nợ nào.</div>';
    } else {
        const todayDate = getFormattedDate();

        groupedArray.forEach((group, index) => {
            const color = currentDebtTab === 'lent' ? 'var(--success)' : 'var(--danger)';
            const sign = currentDebtTab === 'lent' ? '+' : '-';
            const iconStr = currentDebtTab === 'lent' ? '👤' : '🏦';
            const groupId = `debt_group_${index}`;

            let itemsHtml = '';
            let hasOverdue = false; 

            group.items.forEach(d => {
                const remain = d.amount - (d.paidAmount || 0);
                let dueHtml = '';
                let borderStyle = '1px solid #e2e8f0';
                let bgStyle = '#fff';

                if (d.dueDate) {
                    if (todayDate > d.dueDate) {
                        dueHtml = `<div style="font-size: 10px; color: var(--danger); font-weight: 800; margin-top: 4px; background: #fee2e2; padding: 2px 6px; border-radius: 4px; display: inline-block;">⚠️ QUÁ HẠN</div>`;
                        borderStyle = '1px solid var(--danger)';
                        bgStyle = '#fffafa'; 
                        hasOverdue = true; 
                    } else {
                        const [y, m, day] = d.dueDate.split('-');
                        dueHtml = `<div style="font-size: 11px; color: #f39c12; font-weight: 600; margin-top: 4px;">⏳ Hẹn: ${day}/${m}</div>`;
                    }
                }

                let progressHtml = '';
                if (d.paidAmount > 0) {
                    progressHtml = `<div style="font-size: 11px; color: var(--success); margin-top: 4px;">Đã trả: ${formatter.format(d.paidAmount)}đ</div>`;
                }

                itemsHtml += `
                    <div style="padding: 12px; background: ${bgStyle}; border-radius: 8px; border: ${borderStyle}; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <div>
                                <div style="font-size: 13px; font-weight: 700; color: var(--text-main);">${formatNiceDate(d.date).replace('Hôm nay, ','')}</div>
                                <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${d.note ? d.note : 'Khoản vay: ' + formatter.format(d.amount) + 'đ'}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: 800; font-size: 14px; color: ${color};">${formatter.format(remain)}đ</div>
                                ${dueHtml}
                                ${progressHtml}
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="openPartialPay('${d.id}')" style="flex:1; padding: 8px; background: #eef2ff; color: var(--primary); border: none; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer;">Thanh toán</button>
                            <button onclick="deleteDebt('${d.id}')" style="padding: 8px 12px; background: #fceceb; color: var(--danger); border: none; border-radius: 8px; cursor: pointer;" title="Xóa bỏ">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    </div>
                `;
            });

            const groupBorder = hasOverdue ? '1px solid var(--danger)' : '1px solid #e2e8f0';

            // UX Cải tiến: Mở sẵn nhóm nợ nếu người dùng đang dùng tìm kiếm
            const displayStyle = searchText ? 'block' : 'none';
            const rotation = searchText ? 'rotate(180deg)' : 'rotate(0deg)';

            listEl.innerHTML += `
                <div class="transaction-item" style="padding: 0; flex-direction: column; align-items: stretch; border: ${groupBorder}; border-radius: 16px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
                    <div onclick="toggleDebtGroup('${groupId}')" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; background: #fff; cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 44px; height: 44px; border-radius: 50%; background: #f4f6f9; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">${iconStr}</div>
                            <div>
                                <div style="font-weight: 800; font-size: 16px; color: var(--text-main);">${group.person}</div>
                                <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                                    ${group.items.length} khoản ${hasOverdue ? '<span style="color:var(--danger);font-weight:700;">(Quá hạn)</span>' : ''}
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right; display: flex; align-items: center; gap: 8px;">
                            <div style="font-weight: 800; font-size: 16px; color: ${color};">${sign}${formatter.format(group.totalRemain)}</div>
                            <svg id="icon_${groupId}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5" style="transition: 0.3s; transform: ${rotation};"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                    
                    <div id="content_${groupId}" style="display: ${displayStyle}; border-top: 1px dashed #e2e8f0; background: #f8f9fa; padding: 12px;">
                       ${itemsHtml}
                    </div>
                </div>
            `;
        });
    }

    // Render danh sách Đã thanh toán
    paidListEl.innerHTML = '';
    if(paid.length === 0) {
        paidListEl.innerHTML = searchText 
            ? '<div style="text-align:center; padding: 10px; color: var(--text-muted); font-size:13px;">Không tìm thấy lịch sử.</div>'
            : '<div style="text-align:center; padding: 10px; color: var(--text-muted); font-size:13px;">Chưa có lịch sử.</div>';
    } else {
        paid.forEach(d => {
            paidListEl.innerHTML += `
                <div class="transaction-item" style="padding: 12px; cursor: default; opacity: 0.7;">
                    <div class="t-info">
                        <div class="t-title" style="text-decoration: line-through; color: var(--text-muted); font-size: 14px;">${d.person}</div>
                        <div class="t-note" style="font-size: 11px;">Tất toán: ${formatNiceDate(d.paidDate || d.date).replace('Hôm nay, ','')}</div>
                    </div>
                    <div class="t-action" style="display: flex; align-items: center; gap: 12px;">
                        <div class="t-amount" style="color: var(--text-muted); font-size: 14px;">${formatter.format(d.amount)}đ</div>
                        <button onclick="deletePaidDebt('${d.id}')" style="background: transparent; border: none; color: var(--danger); cursor: pointer; padding: 4px; display: flex;" title="Xóa lịch sử">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        });
    }
}

function openDebtForm() {
    document.getElementById('debtFormOverlay')?.classList.add('show');
    document.getElementById('debtFormModal')?.classList.add('show');
    document.getElementById('debtFormType').value = currentDebtTab;
    document.getElementById('debtPersonLabel').innerText = currentDebtTab === 'lent' ? 'Tên người vay' : 'Tên chủ nợ';
    
    document.getElementById('debtPersonInput').value = '';
    document.getElementById('debtAmountDisplay').value = '';
    document.getElementById('debtAmountRaw').value = '';
    document.getElementById('debtDateInput').value = todayStr;
    const dueInput = document.getElementById('debtDueDateInput');
    if(dueInput) dueInput.value = ''; // Reset an toàn ô hẹn trả
    document.getElementById('debtNoteInput').value = '';
}
window.openDebtForm = openDebtForm;

function closeDebtForm() {
    document.getElementById('debtFormOverlay')?.classList.remove('show');
    document.getElementById('debtFormModal')?.classList.remove('show');
}
window.closeDebtForm = closeDebtForm;

// ĐỊNH DẠNG SỐ TIỀN VAY NỢ TRỰC TIẾP
document.getElementById('debtAmountDisplay')?.addEventListener('input', function() {
    let val = this.value.replace(/\D/g, '');
    const raw = document.getElementById('debtAmountRaw');
    if (val === '') { if (raw) raw.value = ''; this.value = ''; return; }
    if (raw) raw.value = val; 
    this.value = formatter.format(parseInt(val));
});

document.getElementById('btnSaveDebt')?.addEventListener('click', () => {
    if(!currentUser) return;
    const type = document.getElementById('debtFormType').value;
    const person = document.getElementById('debtPersonInput').value.trim();
    const amtStr = document.getElementById('debtAmountRaw').value;
    const date = document.getElementById('debtDateInput').value;
    
    const dueEl = document.getElementById('debtDueDateInput');
    const dueDate = dueEl ? dueEl.value : ''; 
    const note = document.getElementById('debtNoteInput').value.trim();

    if(!person || !amtStr) { showToast('Vui lòng nhập tên và số tiền', 'error'); return; }
    
    const newId = 'debt_' + Date.now();
    const txId = Date.now(); 

    const data = { type, person, amount: parseInt(amtStr), paidAmount: 0, date, dueDate, note, status: 'pending', linkedTxId: txId };

    const txType = type === 'lent' ? 'expense' : 'income'; 
    const txCatId = type === 'lent' ? 'exp_other' : 'inc_other';
    const txCatName = type === 'lent' ? 'Cho vay' : 'Đi vay';
    const txNote = (type === 'lent' ? 'Cho vay: ' : 'Đi vay: ') + person + (note ? ' - ' + note : '');
    
    const txData = { type: txType, amount: parseInt(amtStr), categoryId: txCatId, categoryName: txCatName, note: txNote };

    const updates = {};
    updates[`users/${currentUser.uid}/debts/${newId}`] = data;
    updates[`users/${currentUser.uid}/transactions/${date}/${txId}`] = txData;

    const btn = document.getElementById('btnSaveDebt');
    if(btn) { btn.innerText = 'Đang xử lý...'; btn.disabled = true; }

    db.ref().update(updates).then(() => {
        showToast('Đã lưu sổ & Cập nhật số dư!');
        closeDebtForm();
    }).catch(() => { 
        showToast('Lỗi khi lưu dữ liệu!', 'error'); 
    }).finally(() => {
        if(btn) { btn.innerText = 'Lưu vào sổ'; btn.disabled = false; }
    });
});

// ===============================================
// LOGIC THANH TOÁN (MỘT PHẦN VÀ TOÀN BỘ)
// ===============================================

function openPartialPay(id) {
    const d = debtsData.find(x => x.id === id);
    if(!d) return;
    const remain = d.amount - (d.paidAmount || 0);
    
    document.getElementById('ppDebtId').value = id;
    document.getElementById('ppRemainingAmt').innerText = formatter.format(remain) + 'đ';
    document.getElementById('ppAmountDisplay').value = '';
    document.getElementById('ppAmountRaw').value = '';
    
    document.getElementById('partialPayOverlay')?.classList.add('show');
    document.getElementById('partialPayModal')?.classList.add('show');
}
window.openPartialPay = openPartialPay;

function closePartialPay() {
    document.getElementById('partialPayOverlay')?.classList.remove('show');
    document.getElementById('partialPayModal')?.classList.remove('show');
}
window.closePartialPay = closePartialPay;

document.getElementById('ppAmountDisplay')?.addEventListener('input', function() {
    let val = this.value.replace(/\D/g, '');
    const raw = document.getElementById('ppAmountRaw');
    if (val === '') { if (raw) raw.value = ''; this.value = ''; return; }
    if (raw) raw.value = val; 
    this.value = formatter.format(parseInt(val));
});

document.getElementById('btnSubmitPartialPay')?.addEventListener('click', () => {
    processPayment(false);
});

window.payFullDebt = function() {
    processPayment(true);
};

function processPayment(isFull) {
    if(!currentUser) return;
    const id = document.getElementById('ppDebtId').value;
    const d = debtsData.find(x => x.id === id);
    if(!d) return;

    const remain = d.amount - (d.paidAmount || 0);
    let payVal = 0;

    if(isFull) {
        payVal = remain;
    } else {
        const amtStr = document.getElementById('ppAmountRaw').value;
        if(!amtStr) { showToast('Vui lòng nhập số tiền', 'error'); return; }
        payVal = parseInt(amtStr);
    }

    if(payVal <= 0 || payVal > remain) {
        showToast('Số tiền không hợp lệ (Lớn hơn số nợ hoặc = 0)!', 'error');
        return;
    }

    const newPaidAmount = (d.paidAmount || 0) + payVal;
    const isFinished = newPaidAmount >= d.amount;
    const todayDate = getFormattedDate();
    const txId = Date.now();

    const txType = d.type === 'lent' ? 'income' : 'expense';
    const txCatId = d.type === 'lent' ? 'inc_other' : 'exp_other';
    const txCatName = d.type === 'lent' ? 'Thu nợ' : 'Trả nợ';
    const txNote = (d.type === 'lent' ? 'Thu nợ từ: ' : 'Trả nợ cho: ') + d.person + (isFinished ? ' (Tất toán)' : ' (Trả một phần)');
    
    const txData = { type: txType, amount: payVal, categoryId: txCatId, categoryName: txCatName, note: txNote };

    const updates = {};
    updates[`users/${currentUser.uid}/debts/${id}/paidAmount`] = newPaidAmount;
    if(isFinished) {
        updates[`users/${currentUser.uid}/debts/${id}/status`] = 'paid';
        updates[`users/${currentUser.uid}/debts/${id}/paidDate`] = todayDate;
    }
    updates[`users/${currentUser.uid}/transactions/${todayDate}/${txId}`] = txData;

    db.ref().update(updates).then(() => {
        showToast('Đã thanh toán & Cập nhật số dư!');
        closePartialPay();
    });
}

// Xóa bỏ khoản nợ và hoàn lại số dư
function deleteDebt(id) {
    const d = debtsData.find(x => x.id === id);
    if (!d) return;

    if (confirm('Bạn có chắc muốn xóa khoản nợ này?\n\nHệ thống sẽ hủy giao dịch gốc và tự động hoàn lại số dư cho thẻ Card. (Lưu ý: Nếu có các khoản đã trả góp trước đó, bạn cần tự xóa bên tab Lịch Sử).')) {
        
        const updates = {};
        
        // 1. Xóa bản ghi trong Sổ nợ
        updates[`users/${currentUser.uid}/debts/${id}`] = null;
        
        // 2. Tìm và xóa luôn giao dịch Gốc bên tab Lịch sử (Dựa vào ID liên kết)
        if (d.linkedTxId && d.date) {
            updates[`users/${currentUser.uid}/transactions/${d.date}/${d.linkedTxId}`] = null;
        }

        // Cập nhật cả 2 nơi cùng 1 lúc
        db.ref().update(updates).then(() => {
            showToast('Đã xóa nợ và hoàn lại số dư!');
        }).catch(() => {
            showToast('Có lỗi khi xóa!', 'error');
        });
    }
}
window.deleteDebt = deleteDebt;
// Dọn dẹp 1 khoản nợ đã hoàn tất
window.deletePaidDebt = function(id) {
    if(confirm('Bạn có chắc muốn xóa lịch sử này?\n\n(Lưu ý: Chỉ xóa khỏi danh sách vay nợ, các giao dịch gốc bên tab Lịch Sử vẫn được giữ nguyên)')) {
        db.ref(`users/${currentUser.uid}/debts/${id}`).remove().then(() => {
            showToast('Đã dọn dẹp lịch sử!');
        });
    }
};

// Dọn dẹp TOÀN BỘ lịch sử đã hoàn tất (Theo Tab hiện tại)
window.clearAllPaidDebts = function() {
    const paidDebts = debtsData.filter(d => d.type === currentDebtTab && d.status === 'paid');
    
    if(paidDebts.length === 0) {
        showToast('Không có lịch sử để xóa', 'error');
        return;
    }
    
    if(confirm(`Bạn có chắc muốn xóa toàn bộ ${paidDebts.length} lịch sử đã hoàn tất?\n\n(Chỉ dọn dẹp hiển thị ở đây, các giao dịch thu/chi gốc vẫn an toàn)`)) {
        const updates = {};
        paidDebts.forEach(d => {
            updates[`users/${currentUser.uid}/debts/${d.id}`] = null;
        });
        
        db.ref().update(updates).then(() => {
            showToast('Đã dọn dẹp sạch sẽ!');
        });
    }
};
// ==========================================
// TÍNH NĂNG: QUẢN LÝ HẠN MỨC CHI TIÊU NHANH
// ==========================================
function openBudgetManager() {
    document.getElementById('budgetManagerOverlay')?.classList.add('show');
    document.getElementById('budgetManagerModal')?.classList.add('show');
    
    const listEl = document.getElementById('budgetManagerList');
    if(!listEl) return;
    
    const expenseCats = categories.filter(c => c.type === 'expense');
    listEl.innerHTML = '';
    
    if (expenseCats.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-muted); font-size:13px;">Chưa có danh mục chi tiêu nào.</div>';
        return;
    }

    // In danh sách các danh mục - CẬP NHẬT: Tất cả nằm trên 1 hàng ngang (Flex-row)
    expenseCats.forEach(c => {
        const theme = THEMES[c.color] || THEMES['theme-gray'];
        const iconSvg = SVG_LIB[c.icon] || SVG_LIB['other'];
        const budgetVal = c.budgetLimit ? formatter.format(c.budgetLimit) : '';
        const rawVal = c.budgetLimit || '';
        
        const innerSvg = iconSvg.replace(/<svg[^>]*>|<\/svg>/g, '');
        const saveIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`;

        listEl.innerHTML += `
            <div class="transaction-item" style="padding: 12px; cursor: default; display: flex; align-items: center; justify-content: space-between; gap: 8px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff;">
                
                <!-- Trái: Icon + Tên Danh mục -->
                <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: ${theme.bg}; color: ${theme.color}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${innerSvg}</svg>
                    </div>
                    <div style="font-weight: 700; font-size: 14px; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.name}</div>
                </div>
                
                <!-- Phải: Ô nhập tiền & Nút lưu (Thu nhỏ lại) -->
                <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0; width: 170px;">
                    <div class="amount-wrapper" style="height: 36px; flex: 1; background: #f8f9fa; border: 1px solid transparent; transition: 0.3s; border-radius: 8px; margin-bottom: 0;">
                        <input type="text" class="form-control input-amount budget-input-display" data-id="${c.id}" placeholder="Vô hạn" value="${budgetVal}" style="font-size: 14px; background: transparent; border: none; text-align: right; font-weight: 700; width: 100%; height: 100%; padding: 0 24px 0 8px;">
                        <span class="amount-currency" style="right: 8px; top: 9px; font-size: 12px;">đ</span>
                        <input type="hidden" class="budget-input-raw" id="raw_budget_${c.id}" value="${rawVal}">
                    </div>
                    <button id="btn_save_bud_${c.id}" onclick="saveSingleBudget('${c.id}')" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #eef2ff; color: var(--primary); border: none; border-radius: 8px; cursor: pointer; transition: 0.2s; flex-shrink: 0;" title="Lưu hạn mức">
                        ${saveIcon}
                    </button>
                </div>
                
            </div>
        `;
    });
    
    document.querySelectorAll('.budget-input-display').forEach(input => {
        input.addEventListener('input', function() {
            let val = this.value.replace(/\D/g, '');
            const catId = this.getAttribute('data-id');
            const raw = document.getElementById('raw_budget_' + catId);
            if (val === '') { if (raw) raw.value = ''; this.value = ''; return; }
            if (raw) raw.value = val; 
            this.value = formatter.format(parseInt(val));
        });
    });
}
window.openBudgetManager = openBudgetManager;

function closeBudgetManager() {
    document.getElementById('budgetManagerOverlay')?.classList.remove('show');
    document.getElementById('budgetManagerModal')?.classList.remove('show');
}
window.closeBudgetManager = closeBudgetManager;

// LƯU TỪNG HẠN MỨC ĐƠN LẺ VỚI HIỆU ỨNG ICON (Thu nhỏ kích thước Icon cho khớp)
window.saveSingleBudget = function(catId) {
    if(!currentUser) return;
    const rawStr = document.getElementById('raw_budget_' + catId)?.value;
    const budgetLimit = rawStr ? parseInt(rawStr) : null;
    const btn = document.getElementById('btn_save_bud_' + catId);

    const saveIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`;
    const successIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

    if(btn) { btn.innerHTML = '...'; btn.disabled = true; }

    db.ref(`users/${currentUser.uid}/categories/${catId}/budgetLimit`).set(budgetLimit)
    .then(() => {
        if(btn) {
            btn.innerHTML = successIcon;
            btn.style.background = '#e8f8f0';
            btn.style.color = 'var(--success)';
            
            setTimeout(() => {
                btn.innerHTML = saveIcon;
                btn.style.background = '#eef2ff';
                btn.style.color = 'var(--primary)';
                btn.disabled = false;
            }, 2000);
        }
    })
    .catch(() => {
        showToast('Lỗi lưu dữ liệu', 'error');
        if(btn) { btn.innerHTML = saveIcon; btn.disabled = false; }
    });
};
// Lắng nghe sự kiện click vào nút "Thiết lập Hạn mức chi tiêu" ở tab Cài đặt
document.getElementById('btnSettingsBudget')?.addEventListener('click', openBudgetManager);

// Nút "Lưu tất cả hạn mức" ở dưới cùng của khung Popup
document.getElementById('btnSaveAllBudgets')?.addEventListener('click', () => {
    if(!currentUser) return;
    const updates = {};
    const inputs = document.querySelectorAll('.budget-input-display');
    let hasChanges = false;
    
    inputs.forEach(input => {
        const catId = input.getAttribute('data-id');
        const rawStr = document.getElementById('raw_budget_' + catId)?.value;
        const budgetLimit = rawStr ? parseInt(rawStr) : null;
        
        updates[`users/${currentUser.uid}/categories/${catId}/budgetLimit`] = budgetLimit;
        hasChanges = true;
    });
    
    if (!hasChanges) {
        closeBudgetManager();
        return;
    }

    const btn = document.getElementById('btnSaveAllBudgets');
    if(btn) { btn.innerText = 'Đang lưu...'; btn.disabled = true; }
    
    db.ref().update(updates).then(() => {
        showToast('Đã lưu mọi hạn mức thành công!');
        closeBudgetManager();
    }).catch(() => {
        showToast('Lỗi khi lưu dữ liệu!', 'error');
    }).finally(() => {
        if(btn) { btn.innerText = 'Lưu tất cả hạn mức'; btn.disabled = false; }
    });
});
// ==========================================
// TÍNH NĂNG: CHUỖI NGÀY GHI CHÉP (STREAK & BADGES)
// ==========================================
function calculateStreak() {
    if (!transactions || transactions.length === 0) {
        updateStreakUI(0);
        return;
    }

    // 1. Lọc ra danh sách các ngày có phát sinh thu/chi (Loại bỏ các giao dịch lỗi/trống)
    const validTxs = transactions.filter(t => t.type === 'income' || t.type === 'expense');
    const uniqueDates = [...new Set(validTxs.map(t => t.date))].sort().reverse();
    
    if (uniqueDates.length === 0) {
        updateStreakUI(0);
        return;
    }

    // 2. Thuật toán ngày tháng
    const today = new Date();
    // Hàm định dạng ngày chuẩn yyyy-mm-dd
    const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const todayStr = formatDate(today);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);

    let streak = 0;
    let checkDate = new Date(today);

    // LUẬT TÍNH CHUỖI:
    // Nếu hôm nay chưa ghi, nhưng hôm qua CÓ ghi -> Chuỗi vẫn được bảo lưu (đang chờ ghi hôm nay)
    if (uniqueDates.includes(todayStr)) {
        checkDate = new Date(today); // Bắt đầu lùi từ hôm nay
    } else if (uniqueDates.includes(yesterdayStr)) {
        checkDate = new Date(yesterday); // Bắt đầu lùi từ hôm qua
    } else {
        // Quá 2 ngày không ghi chép -> Gãy chuỗi
        updateStreakUI(0);
        return;
    }

    // Vòng lặp đếm ngược từng ngày về quá khứ
    while (true) {
        const checkStr = formatDate(checkDate);
        if (uniqueDates.includes(checkStr)) {
            streak++; // Cộng thêm 1 ngày vào chuỗi
            checkDate.setDate(checkDate.getDate() - 1); // Lùi tiếp 1 ngày về trước
        } else {
            break; // Ngày này không có giao dịch -> Kết thúc đếm
        }
    }

    updateStreakUI(streak);
}

// Cập nhật giao diện ngọn lửa
function updateStreakUI(streak) {
    const badge = document.getElementById('streakBadge');
    const countSpan = document.getElementById('streakCount');
    if (!badge || !countSpan) return;

    if (streak > 0) {
        countSpan.innerText = streak;
        badge.style.display = 'flex';
        badge.title = `Bạn đã ghi chép ${streak} ngày liên tiếp!`;
        
        // Hiệu ứng ăn mừng nhẹ nếu đạt mốc đẹp (Tùy chọn)
        if(streak % 7 === 0) {
            badge.style.transform = 'scale(1.1)';
            setTimeout(() => badge.style.transform = 'scale(1)', 400);
        }
    } else {
        badge.style.display = 'none';
    }
}

// 3. Móc nối ngầm vào hệ thống tải dữ liệu hiện tại
const originalUpdateUIForStreak = updateUI;
updateUI = function() {
    originalUpdateUIForStreak(); // Chạy bản gốc để vẽ danh sách
    calculateStreak();           // Chạy thêm thuật toán tính chuỗi ngọn lửa
};
// ==========================================
// TÍNH NĂNG: NÚT THÊM NHANH (FAB - FLOATING ACTION BUTTON)
// ==========================================
const fabBtn = document.getElementById('fabAddTransaction');

if (fabBtn) {
    fabBtn.addEventListener('click', () => {
        // 1. Tạo hiệu ứng xoay icon 90 độ
        fabBtn.classList.add('spin');
        setTimeout(() => fabBtn.classList.remove('spin'), 300);

        // 2. Chuyển về màn hình Nhập liệu (Home)
        if (!document.getElementById('homeView').classList.contains('active')) {
            switchTab('home');
        }

        // 3. Reset form trắng trẻo để nhập dữ liệu mới
        if (typeof resetFormState === 'function') resetFormState();

        // 4. Cuộn mượt mà và gọi Bàn phím Máy tính tích hợp
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            document.getElementById('mainAmountWrapper')?.click();
        }, 300);
    });
}

// 5. THUẬT TOÁN ĐÁNH CHẶN: Chỉ hiện nút FAB khi không ở tab Home
const originalSwitchTabForFAB = switchTab;
switchTab = function(tabName) {
    originalSwitchTabForFAB(tabName); // Chạy logic chuyển tab gốc
    
    const fab = document.getElementById('fabAddTransaction');
    if (fab) {
        if (tabName === 'home') {
            fab.classList.add('hide'); // Ẩn khi ở màn hình nhập liệu
        } else {
            fab.classList.remove('hide'); // Hiện lơ lửng ở các màn hình khác
        }
    }
};

// Gọi thử 1 lần lúc mới tải trang để ẩn FAB đi (vì trang mặc định là tab Home)
setTimeout(() => { switchTab('home'); }, 100);
// ==========================================
// TÍNH NĂNG: ÂM THANH TƯƠNG TÁC (WEB AUDIO API)
// ==========================================
let audioCtx;

function playUISound(type) {
    // 1. Khởi tạo màng nhĩ kỹ thuật số (Chỉ chạy khi người dùng đã tương tác với trang)
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // 2. Tạo bộ dao động sóng âm (Oscillator) và bộ điều chỉnh âm lượng (GainNode)
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // 3. Phối âm theo loại giao dịch
    if (type === 'income') {
        // Tiếng "Ting!" (Sóng Sine trong trẻo, vuốt tần số cao, vui tai)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // Nốt A5
        oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // Nốt A6
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    } else {
        // Tiếng "Swoosh" (Sóng Triangle trầm, dứt khoát, cảm giác xót ví)
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1); // Tần số chìm dần
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.15);
    }
}
// ==========================================
// TÍNH NĂNG: CẢM BIẾN VUỐT CHẠM (SWIPE TO ACTION)
// ==========================================
let isSwipeInit = false;

function initSwipeActions() {
    if (isSwipeInit) return;
    const list = document.getElementById('transactionList');
    if (!list) return;

    let startX = 0;
    let currentX = 0;
    let isSwiping = false;
    let swipedElement = null;
    let isClickCanceled = false; // Cờ khóa click nếu đang vuốt

    // 1. Chạm ngón tay vào màn hình
    list.addEventListener('touchstart', e => {
        const swipeFront = e.target.closest('.swipe-front');
        if (!swipeFront) return;

        // Tự động đóng các giao dịch khác đang mở
        document.querySelectorAll('.swipe-front.swiped').forEach(el => {
            if (el !== swipeFront) {
                el.style.transform = 'translateX(0)';
                el.classList.remove('swiped');
            }
        });

        startX = e.touches[0].clientX;
        isSwiping = true;
        isClickCanceled = false;
        swipedElement = swipeFront;
        swipedElement.style.transition = 'none'; // Tắt hiệu ứng mượt để ngón tay kéo đi ngay lập tức
    }, {passive: true});

    // 2. Kéo ngón tay
    list.addEventListener('touchmove', e => {
        if (!isSwiping || !swipedElement) return;
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;

        // Nếu di chuyển quá 10px thì đánh dấu là vuốt, không phải là click mở xem
        if (Math.abs(diffX) > 10) isClickCanceled = true; 

        // Chỉ cho phép vuốt qua TRÁI và tối đa 120px (bằng độ rộng 2 nút)
        if (diffX < 0 && diffX >= -120) { 
            swipedElement.style.transform = `translateX(${diffX}px)`;
        }
    }, {passive: true});

    // 3. Nhấc ngón tay lên
    list.addEventListener('touchend', e => {
        if (!isSwiping || !swipedElement) return;
        isSwiping = false;
        const diffX = currentX - startX;

        swipedElement.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)';
        
        // Vuốt quá một nửa (50px) thì bật bung ra, ngược lại thì thu về
        if (diffX < -50) { 
            swipedElement.style.transform = `translateX(-120px)`;
            swipedElement.classList.add('swiped');
        } else {
            swipedElement.style.transform = `translateX(0)`;
            swipedElement.classList.remove('swiped');
        }
        swipedElement = null;
    });

    // 4. Khóa chức năng "bấm mở xem chi tiết" nếu người dùng đang vuốt
    list.addEventListener('click', e => {
        if (isClickCanceled) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true); 

    isSwipeInit = true;
}

// Khởi chạy cảm biến
document.addEventListener('DOMContentLoaded', () => {
    initSwipeActions();
});
// ==========================================
// TÍNH NĂNG: HỆ THỐNG HUY HIỆU (VŨ TRỤ GAMIFICATION V3 - ĐA NHÓM)
// ==========================================
let unlockedBadges = {};

// 1. Kho tàng 42 Huy hiệu Độc quyền (Được chia làm 6 Nhóm)
const BADGES_CONFIG = [
    // --- Nhóm 1: ⏳ KỶ LUẬT BỀN BỈ (Streak) ---
    { id: 'streak_3', name: 'Khởi Động', desc: 'Ghi chép 3 ngày liên tiếp', icon: '🔥', group: 1 },
    { id: 'streak_7', name: 'Tuần Trăng Mật', desc: 'Ghi chép 7 ngày liên tiếp', icon: '🥉', group: 1 },
    { id: 'streak_21', name: 'Định Hình', desc: 'Ghi chép 21 ngày liên tiếp', icon: '🥈', group: 1 },
    { id: 'streak_100', name: 'Kỷ Luật Thép', desc: 'Ghi chép 100 ngày liên tiếp', icon: '🥇', group: 1 },
    { id: 'streak_365', name: 'Khổ Luyện', desc: 'Ghi chép 365 ngày (1 năm) không sót ngày nào', icon: '🐉', group: 1 },

    // --- Nhóm 2: 🎯 CỘT MỐC GIAO DỊCH (Milestones) ---
    { id: 'count_10', name: 'Mầm Non', desc: 'Đạt 10 giao dịch đầu tiên', icon: '👶', group: 2 },
    { id: 'count_100', name: 'Bứt Tốc', desc: 'Đạt 100 giao dịch', icon: '🚀', group: 2 },
    { id: 'count_500', name: 'Máy Đếm Tiền', desc: 'Đạt 500 giao dịch', icon: '🏦', group: 2 },
    { id: 'count_1000', name: 'Đại Gia', desc: 'Đạt 1.000 giao dịch', icon: '👑', group: 2 },
    { id: 'count_2000', name: 'Thần Gõ Phím', desc: 'Đạt 2.000 giao dịch', icon: '⌨️', group: 2 },

    // --- Nhóm 3: 🍔 ĐAM MÊ & LỐI SỐNG (Lifestyle) ---
    { id: 'shop_king', name: 'Vua Mua Sắm', desc: 'Có hơn 20 lần vung tiền vào Mua sắm', icon: '🛍️', group: 3 },
    { id: 'shopee_lord', name: 'Chúa Tể Chốt Đơn', desc: 'Ghi chú "shopee", "lazada", "tiktok" 5 lần', icon: '🛒', group: 3 },
    { id: 'boba_addict', name: 'Bể Trà Sữa', desc: 'Uống trà sữa hơn 10 lần', icon: '🧋', group: 3 },
    { id: 'boba_enemy', name: 'Kẻ Thù Trà Sữa', desc: 'Ghi chú "nhịn trà sữa" hoặc "cai trà sữa"', icon: '🛡️', group: 3 },
    { id: 'foodie', name: 'Cái Mỏ Khoét', desc: 'Phát sinh 30 giao dịch Ăn uống', icon: '🍲', group: 3 },
    { id: 'travel_bug', name: 'Cuồng Chân', desc: 'Ghi chú "vé máy bay", "khách sạn", "du lịch" 3 lần', icon: '✈️', group: 3 },
    { id: 'pet_lover', name: 'Sen Yêu Boss', desc: 'Ghi chú liên quan đến chó/mèo/pate 5 lần', icon: '🐈', group: 3 },
    { id: 'beauty_guru', name: 'Đại Sứ Nhan Sắc', desc: 'Làm đẹp, spa, mỹ phẩm 5 lần', icon: '💄', group: 3 },
    { id: 'tech_bro', name: 'Hệ Công Nghệ', desc: 'Mua đồ công nghệ (điện thoại/laptop) trên 10 triệu', icon: '💻', group: 3 },

    // --- Nhóm 4: 📈 QUẢN LÝ THÔNG MINH (Finance Mastery) ---
    { id: 'piggy_bank', name: 'Heo Đất Béo', desc: 'Trích hơn 1 triệu với ghi chú "tiết kiệm"', icon: '🐷', group: 4 },
    { id: 'investor', name: 'Cá Mập Phố Wall', desc: 'Ghi chú "cổ phiếu", "chứng khoán", "vàng" 5 lần', icon: '📈', group: 4 },
    { id: 'pay_debt', name: 'Uy Tín Đầy Mình', desc: 'Ghi chú "trả nợ" hoặc "thanh toán nợ"', icon: '🤝', group: 4 },
    { id: 'refund_lord', name: 'Trùm Hoàn Tiền', desc: 'Nhận Tiền thu với ghi chú "hoàn tiền", "refund"', icon: '🔄', group: 4 },
    { id: 'adulting', name: 'Người Trưởng Thành', desc: 'Thanh toán tiền Điện, Nước, Mạng', icon: '🧾', group: 4 },

    // --- Nhóm 5: 🎭 HIỆN THỰC KHỐC LIỆT (Tears & Fines) ---
    { id: 'traffic_fine', name: 'Đóng Họ Quốc Gia', desc: 'Bị Công an phạt (Ghi chú "phạt", "csgt", "công an")', icon: '👮', group: 5 },
    { id: 'broken_bike', name: 'Thánh Nhọ', desc: 'Xe hư giữa đường ("sửa xe", "thủng săm", "bơm xe")', icon: '🔧', group: 5 },
    { id: 'borrow_money', name: 'Phao Cứu Sinh', desc: 'Phải vay mượn người khác ("vay tiền", "mượn tiền")', icon: '🆘', group: 5 },
    { id: 'broke_af', name: 'Cạp Đất Mà Ăn', desc: 'Số dư tổng tụt xuống dưới 10.000đ', icon: '🍂', group: 5 },
    { id: 'broke_mid', name: 'Viêm Màng Túi', desc: 'Còn dưới 50k mà chưa qua ngày 15 của tháng', icon: '🫠', group: 5 },

    // --- Nhóm 6: 🐣 ẨN SỐ & THỜI GIAN (Easter Eggs) ---
    { id: 'egg_owl', name: 'Cú Đêm', desc: 'Chi tiền vào lúc 0h - 4h sáng', icon: '🦉', group: 6 },
    { id: 'egg_bird', name: 'Gà Mờ', desc: 'Tiêu tiền vào khung giờ 4h - 6h sáng', icon: '🐓', group: 6 },
    { id: 'order_rush', name: 'Xả Lũ Chốt Đơn', desc: 'Phát sinh hơn 10 giao dịch chi tiền chỉ trong 1 ngày', icon: '📦', group: 6 },
    { id: 'weekend_party', name: 'Dân Chơi Cuối Tuần', desc: 'Chi hơn 5 khoản trong 1 ngày Thứ 7 hoặc Chủ Nhật', icon: '🪩', group: 6 },
    { id: 'lucky_hand', name: 'Bàn Tay Vàng', desc: 'Khoản thu mang tên "trúng thưởng" / "lì xì" / "vietlott"', icon: '🧧', group: 6 },
    { id: 'big_spender', name: 'Khách Sộp', desc: 'Có 1 khoản chi vung tay trên 10 triệu', icon: '💸', group: 6 },
    { id: 'valentine_sad', name: 'Lễ Tình Nhân', desc: 'Phát sinh giao dịch đúng ngày 14/02', icon: '💔', group: 6 },
    { id: 'salary_joy', name: 'Ting Ting!', desc: 'Nhận "Tiền lương" vào ngày 1, 5, 10 hoặc 15', icon: '💰', group: 6 },
    { id: 'rich_kid', name: 'Đại Gia Ngầm', desc: 'Tổng số dư vượt mốc 50 triệu đồng', icon: '💎', group: 6 }
];

const BADGE_GROUPS = {
    1: '⏳ Kỷ Luật Bền Bỉ',
    2: '🎯 Cột Mốc Giao Dịch',
    3: '🍔 Đam Mê & Lối Sống',
    4: '📈 Quản Lý Thông Minh',
    5: '🎭 Hiện Thực Khốc Liệt',
    6: '🐣 Ẩn Số & Sự Kiện'
};

// 2. Hàm vẽ Tủ trưng bày (Phân nhóm chuyên nghiệp)
function renderBadgeCabinet() {
    const cabinet = document.getElementById('badgeCabinet');
    if (!cabinet) return;
    
    // Tính toán tỷ lệ hoàn thành
    const unlockedCount = Object.keys(unlockedBadges).length;
    const progressPercent = Math.round((unlockedCount / BADGES_CONFIG.length) * 100);
    
    // Xóa grid mặc định của container cha để chia grid theo nhóm con
    cabinet.style.display = 'block'; 
    
    let html = `
        <div style="margin-bottom: 24px; padding: 16px; background: var(--card-bg); border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; font-weight: 800; color: var(--text-main);">
                <span>Tiến độ Thu thập</span>
                <span style="color: var(--primary);">${unlockedCount}/${BADGES_CONFIG.length} (${progressPercent}%)</span>
            </div>
            <div style="width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #f5af19, #f12711); transition: 1s ease-out;"></div>
            </div>
        </div>
    `;

    // Render từng nhóm
    for (let groupId = 1; groupId <= 6; groupId++) {
        const groupBadges = BADGES_CONFIG.filter(b => b.group === groupId);
        const unlockedInGroup = groupBadges.filter(b => unlockedBadges[b.id]).length;
        
        html += `
            <div style="margin-bottom: 24px;">
                <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 12px; color: var(--text-main); display: flex; justify-content: space-between;">
                    ${BADGE_GROUPS[groupId]}
                    <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); background: var(--bg-color); padding: 2px 8px; border-radius: 10px;">${unlockedInGroup}/${groupBadges.length}</span>
                </h4>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
        `;
        
        groupBadges.forEach(b => {
            const isUnlocked = unlockedBadges[b.id] ? 'unlocked' : '';
            html += `
                <div class="badge-item ${isUnlocked}" onclick="openBadgeInfo('${b.id}')" style="cursor: pointer;">
                    <div class="badge-icon">${b.icon}</div>
                    <div class="badge-name">${b.name}</div>
                </div>
            `;
        });
        
        html += `</div></div>`; // Đóng Grid và Group
    }

    cabinet.innerHTML = html;
}

// 3. Hàm mở Popup hiển thị chi tiết Huy hiệu
window.openBadgeInfo = function(id) {
    const b = BADGES_CONFIG.find(x => x.id === id);
    if (!b) return;

    const isUnlocked = !!unlockedBadges[b.id];
    const iconEl = document.getElementById('biIcon');
    const statusEl = document.getElementById('biStatus');
    const btnClose = document.querySelector('#badgeInfoModal button');

    document.getElementById('biName').innerText = b.name;
    document.getElementById('biDesc').innerText = b.desc;
    iconEl.innerText = b.icon;

    if (isUnlocked) {
        // UI khi Đã mở khóa
        const unlockTime = new Date(unlockedBadges[b.id]);
        const dateStr = `${String(unlockTime.getDate()).padStart(2, '0')}/${String(unlockTime.getMonth()+1).padStart(2, '0')}/${unlockTime.getFullYear()}`;
        
        iconEl.style.filter = 'drop-shadow(0 10px 25px rgba(255,215,0,0.6))';
        iconEl.style.transform = 'scale(1.1)';
        
        statusEl.innerText = `🌟 ĐÃ MỞ KHÓA (${dateStr})`;
        statusEl.style.background = 'var(--success-light)';
        statusEl.style.color = 'var(--success)';
        
        btnClose.style.background = 'var(--primary)';
        btnClose.style.color = 'white';
    } else {
        // UI khi Chưa mở khóa
        iconEl.style.filter = 'grayscale(1) opacity(0.4)';
        iconEl.style.transform = 'scale(1)';
        
        statusEl.innerText = '🔒 CHƯA MỞ KHÓA';
        statusEl.style.background = '#f1f5f9';
        statusEl.style.color = '#64748b';
        
        btnClose.style.background = '#e2e8f0';
        btnClose.style.color = '#475569';
    }

    // Hiển thị trực tiếp bằng Javascript
    document.getElementById('badgeInfoOverlay').style.display = 'block';
    document.getElementById('badgeInfoModal').style.display = 'block';
};

window.closeBadgeInfo = function() {
    document.getElementById('badgeInfoOverlay').style.display = 'none';
    document.getElementById('badgeInfoModal').style.display = 'none';
};

// 4. AI Phân tích dữ liệu & Trao thưởng (Đã nâng cấp Regex siêu nhạy)
function evaluateAchievements() {
    if (!currentUser || transactions.length === 0) return;
    let newlyUnlocked = null;
    
    // --- CHUẨN BỊ DỮ LIỆU ĐỂ PHÂN TÍCH ---
    const totalTx = transactions.length;
    const currentStreak = parseInt(document.getElementById('streakCount')?.innerText || '0');
    const expTxs = transactions.filter(t => t.type === 'expense');
    const incTxs = transactions.filter(t => t.type === 'income');
    
    const today = new Date();
    const todayDateNum = today.getDate();
    
    // Đếm số đơn trong từng ngày
    const dateCounts = {};
    expTxs.forEach(t => { dateCounts[t.date] = (dateCounts[t.date] || 0) + 1; });
    const maxDailyOrders = Object.values(dateCounts).length > 0 ? Math.max(...Object.values(dateCounts)) : 0;

    // --- TIẾN HÀNH QUÉT ĐIỀU KIỆN ---
    BADGES_CONFIG.forEach(b => {
        if (unlockedBadges[b.id]) return; 
        
        let isMet = false;
        
        // Nhóm 1: Kỷ luật
        if (b.id === 'streak_3' && currentStreak >= 3) isMet = true;
        if (b.id === 'streak_7' && currentStreak >= 7) isMet = true;
        if (b.id === 'streak_21' && currentStreak >= 21) isMet = true;
        if (b.id === 'streak_100' && currentStreak >= 100) isMet = true;
        if (b.id === 'streak_365' && currentStreak >= 365) isMet = true;
        
        // Nhóm 2: Số lượng
        if (b.id === 'count_10' && totalTx >= 10) isMet = true;
        if (b.id === 'count_100' && totalTx >= 100) isMet = true;
        if (b.id === 'count_500' && totalTx >= 500) isMet = true;
        if (b.id === 'count_1000' && totalTx >= 1000) isMet = true;
        if (b.id === 'count_2000' && totalTx >= 2000) isMet = true;
        
        // Nhóm 3: Lối sống (Regex)
        if (b.id === 'shop_king' && expTxs.filter(t => t.categoryName?.toLowerCase().includes('mua sắm')).length >= 20) isMet = true;
        if (b.id === 'shopee_lord' && expTxs.filter(t => t.note?.toLowerCase().match(/shopee|lazada|tiktok|tiki/)).length >= 5) isMet = true;
        if (b.id === 'boba_addict' && expTxs.filter(t => t.note?.toLowerCase().match(/trà sữa|boba|phê la|koi|highlands|phúc long/)).length >= 10) isMet = true;
        if (b.id === 'boba_enemy' && transactions.some(t => t.note?.toLowerCase().match(/cai trà sữa|nhịn trà sữa|không uống trà sữa/))) isMet = true;
        if (b.id === 'foodie' && expTxs.filter(t => t.categoryName?.toLowerCase().includes('ăn uống')).length >= 30) isMet = true;
        if (b.id === 'travel_bug' && expTxs.filter(t => t.note?.toLowerCase().match(/vé máy bay|du lịch|homestay|khách sạn|resort/)).length >= 3) isMet = true;
        if (b.id === 'pet_lover' && expTxs.filter(t => t.note?.toLowerCase().match(/thú cưng|chó|mèo|pate|cát mèo/)).length >= 5) isMet = true;
        if (b.id === 'beauty_guru' && expTxs.filter(t => t.note?.toLowerCase().match(/mỹ phẩm|skincare|spa|cắt tóc|làm đẹp|nail/)).length >= 5) isMet = true;
        if (b.id === 'tech_bro' && expTxs.some(t => t.amount >= 10000000 && t.note?.toLowerCase().match(/điện thoại|laptop|apple|samsung|bàn phím|chuột/))) isMet = true;

        // Nhóm 4: Quản lý Thông minh
        if (b.id === 'piggy_bank' && expTxs.some(t => t.amount >= 1000000 && t.note?.toLowerCase().match(/tiết kiệm|heo đất/))) isMet = true;
        if (b.id === 'investor' && expTxs.filter(t => t.note?.toLowerCase().match(/cổ phiếu|chứng khoán|vàng|sjc|coin|crypto/)).length >= 5) isMet = true;
        if (b.id === 'pay_debt' && expTxs.some(t => t.note?.toLowerCase().match(/trả nợ|thanh toán nợ/))) isMet = true;
        if (b.id === 'refund_lord' && incTxs.some(t => t.note?.toLowerCase().match(/hoàn tiền|refund/))) isMet = true;
        if (b.id === 'adulting' && expTxs.filter(t => t.categoryName?.toLowerCase().match(/hóa đơn|điện|nước|mạng|internet/)).length >= 5) isMet = true;

        // Nhóm 5: Hiện thực khốc liệt
        if (b.id === 'traffic_fine' && expTxs.some(t => t.note?.toLowerCase().match(/phạt|công an|csgt|giao thông/))) isMet = true;
        if (b.id === 'broken_bike' && expTxs.some(t => t.note?.toLowerCase().match(/sửa xe|thủng săm|bơm xe|vá xe|thay dầu/))) isMet = true;
        if (b.id === 'borrow_money' && expTxs.some(t => t.note?.toLowerCase().match(/vay tiền|mượn tiền|vay nợ/))) isMet = true;
        if (b.id === 'broke_af' && currentBalances.total >= 0 && currentBalances.total < 10000 && totalTx > 5) isMet = true;
        if (b.id === 'broke_mid' && currentBalances.total >= 0 && currentBalances.total < 50000 && todayDateNum <= 15 && totalTx > 10) isMet = true;

        // Nhóm 6: Ẩn số & Thời gian
        if (b.id === 'egg_owl' && expTxs.some(t => new Date(t.id).getHours() >= 0 && new Date(t.id).getHours() < 4)) isMet = true;
        if (b.id === 'egg_bird' && expTxs.some(t => new Date(t.id).getHours() >= 4 && new Date(t.id).getHours() < 6)) isMet = true;
        if (b.id === 'order_rush' && maxDailyOrders >= 10) isMet = true;
        
        if (b.id === 'weekend_party') {
            const hasCrazyWeekend = Object.keys(dateCounts).some(dateStr => {
                const dayOfWeek = new Date(dateStr).getDay();
                return (dayOfWeek === 0 || dayOfWeek === 6) && dateCounts[dateStr] >= 5;
            });
            if (hasCrazyWeekend) isMet = true;
        }

        if (b.id === 'lucky_hand' && incTxs.some(t => t.note?.toLowerCase().match(/trúng thưởng|lì xì|được cho|cho tiền|vietlott/))) isMet = true;
        if (b.id === 'big_spender' && expTxs.some(t => t.amount >= 10000000)) isMet = true;
        
        if (b.id === 'valentine_sad' && expTxs.some(t => {
            const txDate = new Date(t.date);
            return txDate.getDate() === 14 && (txDate.getMonth() + 1) === 2;
        })) isMet = true;

        if (b.id === 'salary_joy' && incTxs.some(t => {
            const txDate = new Date(t.date).getDate();
            return (txDate === 1 || txDate === 5 || txDate === 10 || txDate === 15) && t.categoryName?.toLowerCase().includes('lương');
        })) isMet = true;

        if (b.id === 'rich_kid' && currentBalances.total >= 50000000) isMet = true;

        // LƯU VÀO FIREBASE NẾU ĐẠT CHUẨN
        if (isMet) {
            unlockedBadges[b.id] = Date.now();
            db.ref(`users/${currentUser.uid}/badges/${b.id}`).set(Date.now());
            newlyUnlocked = b; 
        }
    });

    // Bắn pháo hoa nếu có huy hiệu mới!
    if (newlyUnlocked) {
        document.getElementById('badgePopupName').innerText = newlyUnlocked.name;
        document.getElementById('badgePopupIcon').innerText = newlyUnlocked.icon;
        document.getElementById('badgePopupDesc').innerText = newlyUnlocked.desc;
        
        document.getElementById('badgePopupOverlay').style.display = 'block';
        document.getElementById('badgePopupModal').style.display = 'block';
        
        if(typeof playUISound === 'function') playUISound('income'); 
        renderBadgeCabinet();
    }
}

// 5. Lắng nghe dữ liệu huy hiệu từ Firebase
auth.onAuthStateChanged(user => {
    if(user) {
        db.ref(`users/${user.uid}/badges`).on('value', snap => {
            unlockedBadges = snap.val() || {};
            renderBadgeCabinet();
        });
    }
});

// 6. Móc nối để tự động chạy ngầm mỗi khi cập nhật UI
const originalUpdateUIForBadges = updateUI;
updateUI = function() {
    originalUpdateUIForBadges();
    setTimeout(() => { evaluateAchievements(); }, 600); // Đợi giao diện load xong mới chấm điểm
};
// ==========================================
// TÍNH NĂNG: BỘ LỌC TÍCH HỢP (SMART FILTER TOGGLE)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Đóng/Mở khung lọc
    document.getElementById('btnToggleFilters')?.addEventListener('click', function() {
        this.classList.toggle('active');
        document.getElementById('advancedFiltersWrapper')?.classList.toggle('open');
    });
});

// 2. Thuật toán kiểm tra và bật/tắt chấm đỏ báo hiệu
function checkFilterStatus() {
    const dot = document.getElementById('filterActiveDot');
    if (!dot) return;

    // Kiểm tra Danh mục (Nếu mảng chọn lớn hơn 0 -> Bật)
    const activeCatPills = Array.from(document.querySelectorAll('#historyCategoryFilter .cat-pill.active'));
    const hasCatFilter = activeCatPills.some(p => p.getAttribute('data-filter') !== '');

    // Kiểm tra Thời gian (Tháng này là mặc định, nếu chọn mốc thời gian khác -> Bật)
    const activeDatePill = document.querySelector('#quickDateFilters .btn-quick-filter.active');
    const dateRange = activeDatePill ? activeDatePill.getAttribute('data-range') : '';
    const hasDateFilter = dateRange !== 'this_month' && dateRange !== 'all';

    // Nếu người dùng có áp dụng bộ lọc thì thắp sáng Chấm Đỏ
    if (hasCatFilter || hasDateFilter) {
        dot.classList.remove('hide');
    } else {
        dot.classList.add('hide');
    }
}

// 3. Móc nối ngầm vào hàm updateUI hiện tại của bạn để tự động check chấm đỏ mỗi khi người dùng ấn lọc
if (typeof updateUI === 'function') {
    const originalUpdateUIForSmartFilter = updateUI;
    updateUI = function() {
        originalUpdateUIForSmartFilter(); // Chạy ruột hàm gốc
        checkFilterStatus();              // Chạy thêm thuật toán chấm đỏ
    };
}
// ==========================================
// TÍNH NĂNG: GẬP/MỞ LỊCH SỬ (TÍCH HỢP TẢI LƯỜI BIẾNG)
// ==========================================
window.toggleDateGroup = function(dateStr) {
    const groupEl = document.getElementById('date_group_' + dateStr);
    if (groupEl) {
        // TẢI LƯỜI BIẾNG (Lazy Load): Tiết kiệm RAM tuyệt đối!
        // Chỉ vẽ thẻ HTML khi người dùng THỰC SỰ BẤM MỞ xem ngày hôm đó
        const itemsContainer = document.getElementById('items_' + dateStr);
        if (itemsContainer && !itemsContainer.hasAttribute('data-loaded')) {
            if (typeof buildGroupItemsHTML === 'function') {
                itemsContainer.innerHTML = buildGroupItemsHTML(dateStr);
                itemsContainer.setAttribute('data-loaded', 'true');
            }
        }
        
        // Đảo trạng thái gập/mở
        groupEl.classList.toggle('collapsed');
    }
};
// ==========================================
// TÍNH NĂNG: BÀN PHÍM MÁY TÍCH HỢP (CUSTOM NUMPAD)
// ==========================================
let npExpression = '';
const npOverlay = document.getElementById('numpadOverlay');
const npSheet = document.getElementById('numpadSheet');
const npExprDisplay = document.getElementById('numpadExpression');
const mainAmtDisp = document.getElementById('amountInputDisplay');
const mainAmtRaw = document.getElementById('amountInputRaw');
const mainAmtWrapper = document.getElementById('mainAmountWrapper');

// 1. Mở Numpad khi click vào VÙNG KHUNG BAO NGOÀI
mainAmtWrapper?.addEventListener('click', () => {
    npOverlay?.classList.add('show');
    npSheet?.classList.add('show');
    npExpression = mainAmtRaw?.value || '';
    updateNpDisplay();
});

// 2. Đóng Numpad
function closeNumpad() {
    npOverlay?.classList.remove('show');
    npSheet?.classList.remove('show');
}
npOverlay?.addEventListener('click', closeNumpad);

// 3. Xử lý logic khi bấm nút
document.querySelectorAll('#numpadGrid .np-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(15); // Rung phản hồi haptic
        
        const val = btn.getAttribute('data-val');
        
        if (val === 'C') {
            npExpression = '';
        } else if (val === 'back') {
            npExpression = npExpression.slice(0, -1);
        } else if (btn.id === 'btnNumpadDone') {
            finalizeCalculation();
            closeNumpad();
            return; 
        } else {
            // Chống bấm 2 phép tính liên tiếp
            const lastChar = npExpression.slice(-1);
            const isOp = ['+', '-', '×', '÷'].includes(val);
            const isLastOp = ['+', '-', '×', '÷'].includes(lastChar);
            
            if (isOp && isLastOp) {
                npExpression = npExpression.slice(0, -1) + val; // Ghi đè phép tính cuối
            } else if (val === '.' && lastChar === '.') {
                return; // Tránh 2 dấu chấm liên tiếp
            } else {
                let displayVal = val;
                if (val === '*') displayVal = '×';
                if (val === '/') displayVal = '÷';
                npExpression += displayVal;
            }
        }
        updateNpDisplay();
    });
});

// 4. Render chuỗi phép tính & Tính tổng thời gian thực
function updateNpDisplay() {
    if (npExprDisplay) npExprDisplay.innerText = npExpression || '0';
    
    // Tính toán mượt mà đẩy thẳng ra giao diện bên ngoài
    try {
        let tempExpr = npExpression.replace(/×/g, '*').replace(/÷/g, '/');
        // Chỉ tính nếu kết thúc không phải là dấu phép tính
        if (tempExpr && !['+', '-', '*', '/'].includes(tempExpr.slice(-1))) {
            let tempResult = new Function('return ' + tempExpr)();
            tempResult = Math.max(0, Math.round(tempResult)); // Không nhận số âm và số lẻ
            
            if (mainAmtDisp && !isNaN(tempResult)) mainAmtDisp.value = formatter.format(tempResult);
            if (mainAmtRaw && !isNaN(tempResult)) mainAmtRaw.value = tempResult;
        } else if (!tempExpr) {
            if (mainAmtDisp) mainAmtDisp.value = '';
            if (mainAmtRaw) mainAmtRaw.value = '';
        }
    } catch(e) {}
}

function finalizeCalculation() {
    updateNpDisplay();
    // Gắn cứng kết quả cuối cùng thành giá trị gốc (Xóa bỏ chuỗi phép tính)
    if (mainAmtRaw && mainAmtRaw.value) {
        npExpression = mainAmtRaw.value;
    }
}
// ==========================================
// TÍNH NĂNG: MINI-LIST "VỪA NHẬP XONG"
// ==========================================
function renderRecentTransactions() {
    const container = document.getElementById('recentTxContainer');
    const listEl = document.getElementById('recentTxList');
    if (!container || !listEl) return;

    // 1. Lọc lấy các giao dịch của NGÀY HÔM NAY
    const todayTxs = transactions.filter(t => t.date === todayStr);

    // 2. Sắp xếp mới nhất lên đầu (theo ID vì ID chính là Timestamp) và LẤY TỐI ĐA 2 MỤC
    const recentTxs = todayTxs.sort((a, b) => b.id - a.id).slice(0, 2);

    // Nếu hôm nay chưa nhập gì -> Ẩn khối này đi
    if (recentTxs.length === 0) {
        container.classList.add('hide');
        return;
    }

    // 3. Nếu có dữ liệu -> Bật lên và vẽ HTML
    container.classList.remove('hide');
    let html = '';
    
    recentTxs.forEach(t => {
        const isInc = t.type === 'income';
        const catObj = categories.find(c => c.id === t.categoryId);
        const themeObj = catObj ? THEMES[catObj.color] : THEMES['theme-gray'];
        const iconSvg = catObj ? SVG_LIB[catObj.icon] : SVG_LIB['other'];
        
        // Trích xuất giờ:phút từ ID (Date.now())
        const timeObj = new Date(t.id);
        const timeStr = `${String(timeObj.getHours()).padStart(2, '0')}:${String(timeObj.getMinutes()).padStart(2, '0')}`;

        const amountClass = isInc ? 'text-success' : 'text-danger';
        const amountPrefix = isInc ? '+' : '-';

        // Tách cái thẻ <svg> bên trong ra để cho vào khung icon siêu nhỏ 14px
        const innerSvg = iconSvg.replace(/<svg[^>]*>|<\/svg>/g, '');

        html += `
            <div class="mini-tx-item">
                <div class="mini-tx-left">
                    <div class="mini-tx-icon" style="background: ${themeObj.bg}; color: ${themeObj.color};">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${innerSvg}</svg>
                    </div>
                    <div class="mini-tx-name">${t.categoryName || t.category} <span class="mini-tx-time">• ${timeStr}</span></div>
                </div>
                <!-- SỬA ĐỔI: Thêm nút Undo bên phải số tiền -->
                <div style="display: flex; align-items: center;">
                    <div class="mini-tx-amount ${amountClass}" style="font-weight: 800;">${amountPrefix}${formatter.format(t.amount)}đ</div>
                    <button class="btn-undo-tx" onclick="undoTransaction(${t.id}, '${t.date}')" title="Hoàn tác (Sửa lại)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path></svg>
                    </button>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

// 4. Móc nối ngầm vào hàm updateUI hiện tại
// Mỗi khi Firebase trả về data mới (hoặc sau khi nhập/xóa), hàm này tự động được gọi
if (typeof updateUI === 'function') {
    const originalUpdateUIForRecents = updateUI;
    updateUI = function() {
        originalUpdateUIForRecents(); // Chạy ruột hàm gốc (cập nhật Lịch sử, Biểu đồ...)
        renderRecentTransactions();   // Chạy thêm render Mini-List
    };
}
// ==========================================
// TÍNH NĂNG: NÚT HOÀN TÁC (QUICK UNDO)
// ==========================================
window.undoTransaction = function(id, dateStr) {
    if(!currentUser) return;
    
    // 1. Tìm lại dữ liệu gốc của giao dịch đó
    const t = transactions.find(x => x.id === id);
    if(!t) return;

    // Rung phản hồi (Haptic feedback)
    if(navigator.vibrate) navigator.vibrate(20);

    // 2. NHẢ NGƯỢC DỮ LIỆU VỀ FORM NHẬP LIỆU
    // Trả lại Loại (Thu/Chi)
    switchType(t.type);
    
    // Trả lại Số tiền (Đồng bộ với cả bàn phím Numpad)
    const amtRaw = document.getElementById('amountInputRaw');
    const amtDisp = document.getElementById('amountInputDisplay');
    if (amtRaw) amtRaw.value = t.amount;
    if (amtDisp) amtDisp.value = formatter.format(t.amount);
    if (typeof npExpression !== 'undefined') npExpression = t.amount.toString();
    
    // Trả lại Ghi chú
    const noteInput = document.getElementById('noteInput');
    if (noteInput) noteInput.value = t.note || '';

    // Trả lại Ngày tháng
    const dateInp = document.getElementById('dateInput');
    const dateDisp = document.getElementById('formDateDisplay');
    if (dateInp) dateInp.value = t.date;
    if (dateDisp) dateDisp.innerText = formatNiceDate(t.date);

    // Trả lại Danh mục (Giả lập thao tác click vào nút Danh mục trên Grid)
    setTimeout(() => {
        const targetPill = document.querySelector(`#categoryScroll .cat-pill[data-id="${t.categoryId}"]`);
        if (targetPill) {
            targetPill.click(); // Click để kích hoạt màu xanh và cập nhật value ẩn
        }
    }, 50); // Delay nhẹ để hàm switchType render xong UI

    // 3. XÓA GIAO DỊCH KHỎI FIREBASE
    db.ref(`users/${currentUser.uid}/transactions/${dateStr}/${id}`).remove()
    .then(() => {
        showToast('Đã hoàn tác! Hãy sửa lại thông tin.', 'success');
        // Cuộn màn hình lên trên cùng chỗ có Form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(() => showToast('Lỗi khi hoàn tác', 'error'));
};
// ==========================================
// TÍNH NĂNG: CHUYỂN ĐỔI BIỂU ĐỒ ALL-IN-ONE
// ==========================================
window.switchDashboardChart = function(type, btnElement) {
    // 1. Cập nhật nút bấm (Sử dụng class 'active' cực kỳ gọn gàng)
    const tabs = document.querySelectorAll('#dashboardTabs .dash-tab-btn');
    tabs.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    // 2. Ẩn tất cả các khung biểu đồ đi
    document.getElementById('dashViewPie').classList.add('hide');
    document.getElementById('dashViewBar').classList.add('hide');
    document.getElementById('dashViewLine').classList.add('hide');

    // 3. Hiện khung được chọn
    if (type === 'pie') document.getElementById('dashViewPie').classList.remove('hide');
    if (type === 'bar') document.getElementById('dashViewBar').classList.remove('hide');
    if (type === 'line') document.getElementById('dashViewLine').classList.remove('hide');

    // 4. FIX LỖI CHART.JS: Vẽ lại kích thước biểu đồ khi hiển thị lên
    setTimeout(() => {
        if (type === 'pie' && typeof pieChartInstance !== 'undefined' && pieChartInstance) pieChartInstance.resize();
        if (type === 'bar' && typeof barChartInstance !== 'undefined' && barChartInstance) barChartInstance.resize();
        if (type === 'line' && typeof lineChartInstance !== 'undefined' && lineChartInstance) lineChartInstance.resize();
    }, 50);
};
// ==========================================
// PLUGIN CHART.JS: ĐƯỜNG HỒNG TÂM CẢNH BÁO
// ==========================================
Chart.register({
    id: 'averageThresholdLine',
    afterDraw: function(chart) {
        if (chart.canvas.id !== 'barChart' && chart.canvas.id !== 'adm_barChart') return;
        if (!chart.chartArea) return; // CHỐNG CRASH QUAN TRỌNG

        const expenseDataset = chart.data.datasets.find(d => d.label && d.label.toLowerCase().includes('chi'));
        if (!expenseDataset || !expenseDataset.data || expenseDataset.data.length === 0) return;

        const dataArr = expenseDataset.data;
        const total = dataArr.reduce((sum, val) => sum + (Number(val) || 0), 0);
        const avgValue = total / (dataArr.length || 1);

        if (avgValue === 0) return;

        const ctx = chart.ctx;
        const yAxis = chart.scales.y;
        const xAxis = chart.scales.x;
        const yPixel = yAxis.getPixelForValue(avgValue);

        if (yPixel < chart.chartArea.top || yPixel > chart.chartArea.bottom) return;

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([6, 4]); 
        ctx.moveTo(xAxis.left, yPixel);
        ctx.lineTo(xAxis.right, yPixel);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.8)'; 
        ctx.stroke();

        const text = 'TB: ' + new Intl.NumberFormat('vi-VN').format(Math.round(avgValue));
        ctx.font = 'bold 10px sans-serif';
        const textWidth = ctx.measureText(text).width;
        const padding = 4;

        ctx.fillStyle = document.body.classList.contains('dark-theme') ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)'; 
        ctx.fillRect(xAxis.right - textWidth - padding * 2, yPixel - 10, textWidth + padding * 2, 20);
        
        ctx.fillStyle = '#e74c3c';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, xAxis.right - textWidth/2 - padding, yPixel);
        ctx.restore();
    }
});
// ==========================================
// PLUGIN CHART.JS: TÂM ĐIỂM ĐỘNG DOUGHNUT
// ==========================================
Chart.register({
    id: 'dynamicDoughnutCenter',
    beforeDraw: function(chart) {
        if (chart.config.type !== 'doughnut') return;
        if (!chart.chartArea) return; // CHỐNG CRASH QUAN TRỌNG
        
        const ctx = chart.ctx;
        const width = chart.chartArea.right - chart.chartArea.left;
        const height = chart.chartArea.bottom - chart.chartArea.top;
        const centerX = chart.chartArea.left + width / 2;
        const centerY = chart.chartArea.top + height / 2;

        const dataset = chart.data.datasets[0];
        if (!dataset || !dataset.data || dataset.data.length === 0) return;

        let total = dataset.data.reduce((sum, val) => sum + (Number(val) || 0), 0);
        if (total === 0) return;

        let activeLabel = 'TỔNG CỘNG';
        let activeValue = total;
        let activeColor = document.body.classList.contains('dark-theme') ? '#f1f5f9' : '#1e293b'; 
        let percentText = '';

        const activeElements = chart.getActiveElements();
        if (activeElements.length > 0) {
            const index = activeElements[0].index;
            activeLabel = chart.data.labels[index].toUpperCase();
            activeValue = dataset.data[index];
            activeColor = dataset.backgroundColor[index];
            percentText = Math.round((activeValue / total) * 100) + '%';
        }

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '600 11px sans-serif';
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#94a3b8' : '#64748b';
        ctx.fillText(activeLabel, centerX, centerY - 12);

        ctx.font = '800 15px sans-serif';
        ctx.fillStyle = activeColor;
        
        let valueText = new Intl.NumberFormat('vi-VN').format(activeValue);
        if (activeValue >= 1000000000) {
            valueText = (activeValue / 1000000000).toFixed(1).replace('.0', '') + ' Tỷ';
        } else if (activeValue >= 1000000 && activeElements.length === 0) {
             valueText = (activeValue / 1000000).toFixed(1).replace('.0', '') + ' Tr';
        }
        ctx.fillText(valueText + (percentText ? ` (${percentText})` : ''), centerX, centerY + 8);
        ctx.restore();
    }
});
// ==========================================
// TÍNH NĂNG: TÁI CHẾ DOM (VIRTUAL SCROLLING HELPER)
// ==========================================
window.buildGroupItemsHTML = function(dateStr) {
    if (!window.currentGroupedData || !window.currentGroupedData[dateStr]) return '';
    const data = window.currentGroupedData[dateStr];
    data.items.sort((a, b) => b.id - a.id);

    let itemsHtml = '';
    data.items.forEach(t => {
        const isInc = t.type === 'income';
        const cName = t.categoryName || t.category;
        const catObj = categories.find(c => c.id === t.categoryId);
        const iconSvg = catObj ? SVG_LIB[catObj.icon] : (SVG_LIB[t.icon] || SVG_LIB['other']);
        const themeObj = catObj ? THEMES[catObj.color] : THEMES['theme-gray'];
        const safeName = cName.replace(/'/g, "\\'");

        itemsHtml += `
            <div class="swipe-container">
                <div class="timeline-dot ${isInc ? 'in' : 'out'}"></div>
                <div class="swipe-actions">
                    <button class="btn-edit" onclick="triggerEdit(${t.id})">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button class="btn-delete" onclick="triggerDelete(${t.id})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                <div class="transaction-item timeline-item swipe-front" onclick="openActionSheet(${t.id}, '${safeName}', ${t.amount})">
                    <div class="t-left">
                        <div class="t-icon" style="background-color: ${themeObj.bg}; color: ${themeObj.color}; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">${iconSvg}</div>
                        <div class="t-info">
                            <div class="t-title" style="font-size: 15px;">${cName}</div>
                            <div class="t-note" style="font-size: 12px;">${t.note || '...'}</div>
                        </div>
                    </div>
                    <div class="t-action" style="display: flex; align-items: center; gap: 8px;">
                        <div class="t-amount ${isInc ? 'text-success' : 'text-danger'}" style="font-size: 15px; font-weight: 800;">${isInc ? '+' : '-'}${formatter.format(t.amount)}</div>
                        <div class="t-chevron" style="color: #cbd5e1; font-size: 18px; margin-top: -2px;">›</div>
                    </div>
                </div>
            </div>
        `;
    });
    return itemsHtml;
};
// ==========================================
// TÍNH NĂNG: HOLOGRAPHIC GYROSCOPE SHIMMER
// ==========================================
function initGyroscopeShimmer() {
    const card = document.querySelector('.wallet-card');
    if (!card) return;

    let isPermissionGranted = false;

    // 1. Hàm xử lý tọa độ khi điện thoại nghiêng
    const handleOrientation = (e) => {
        const gamma = e.gamma; // Góc nghiêng trái-phải (-90 đến 90)
        const beta = e.beta;   // Góc nghiêng trước-sau (-180 đến 180)

        if (gamma === null || beta === null) return;

        // Quy đổi góc nghiêng thành tọa độ % trên bề mặt thẻ (0% đến 100%)
        // Thu hẹp biên độ để vệt sáng di chuyển mượt mà theo cổ tay
        const px = Math.min(Math.max((gamma + 30) / 60 * 100, 0), 100);
        const py = Math.min(Math.max((beta + 30) / 60 * 100, 0), 100);

        card.style.setProperty('--px', `${px}%`);
        card.style.setProperty('--py', `${py}%`);
        card.style.setProperty('--o', `1`); // Bật sáng ánh kim
    };

    // 2. Kích hoạt cảm biến trên Mobile (Đặc biệt xử lý bảo mật cho iOS 13+)
    const enableGyroscope = () => {
        if (window.DeviceOrientationEvent) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                // iOS yêu cầu người dùng phải chạm 1 lần vào thẻ để cấp quyền đọc cảm biến
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                            isPermissionGranted = true;
                            showToast('Đã kích hoạt cảm biến ánh kim!');
                        }
                    })
                    .catch(err => console.log('Lỗi cấp quyền Gyroscope:', err));
            } else {
                // Android và các thiết bị hỗ trợ trực tiếp không cần hỏi quyền
                window.addEventListener('deviceorientation', handleOrientation);
                isPermissionGranted = true;
            }
        }
    };

    // Cho phép người dùng chạm vào thẻ trên iOS để bật cảm biến
    card.addEventListener('click', () => {
        if (!isPermissionGranted) {
            enableGyroscope();
        }
    });

    // 3. Dự phòng cho Máy tính (PC): Dùng chuột rà qua lại để test hiệu ứng
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--px', `${px}%`);
        card.style.setProperty('--py', `${py}%`);
        card.style.setProperty('--o', `1`);
    });

    card.addEventListener('mouseleave', () => {
        if (!isPermissionGranted) {
            card.style.setProperty('--o', `0`);
        }
    });
}

// Khởi chạy sau khi nạp trang
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initGyroscopeShimmer, 500);
});