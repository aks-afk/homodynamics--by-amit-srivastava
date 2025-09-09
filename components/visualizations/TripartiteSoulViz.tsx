import React, { useState, useMemo } from 'react';

const TripartiteSoulViz: React.FC = () => {
  const [reason, setReason] = useState(50);
  const [spirit, setSpirit] = useState(50);
  const [appetite, setAppetite] = useState(50);

  const total = reason + spirit + appetite;
  const reasonPct = (reason / total) * 100;
  const spiritPct = (spirit / total) * 100;
  
  const balanceStatus = useMemo(() => {
    const maxVal = Math.max(reason, spirit, appetite);
    const minVal = Math.min(reason, spirit, appetite);
    if (maxVal - minVal < 20 && reason > (spirit + appetite) / 2.2) {
      return "Harmonious Balance";
    }
    if (reason > spirit && reason > appetite) {
        return "Guided by Reason";
    }
    if (spirit > reason && spirit > appetite) {
        return "Driven by Spirit";
    }
    return "Overcome by Appetite";
  }, [reason, spirit, appetite]);

  const Slider = ({ label, value, onChange, color }: { label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, color: string }) => (
    <div style={{ marginBottom: '0.5rem' }}>
      <label style={{ display: 'block', marginBottom: '0.2rem', color: '#5A5A5A', fontSize: '0.9rem' }}>{label}</label>
      <input type="range" min="1" max="100" value={value} onChange={onChange} style={{ width: '100%', accentColor: color }} />
    </div>
  );

  return (
    <div>
      <h4 style={{marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>The Tripartite Soul</h4>
       <div style={{ height: '150px', width: '100%', display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid #C1C1C1', marginBottom: '1rem' }}>
          <div title={`Reason: ${Math.round(reasonPct)}%`} style={{ width: `${reasonPct}%`, background: '#3A3A3A', height: `${reasonPct}%`, transition: 'all 0.3s ease', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
          <div title={`Spirit: ${Math.round(spiritPct)}%`} style={{ width: `${spiritPct}%`, background: '#8A8A8A', height: `${spiritPct}%`, transition: 'all 0.3s ease', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
          <div title={`Appetite: ${100 - reasonPct - spiritPct}%`} style={{ width: `${100 - reasonPct - spiritPct}%`, background: '#C1C1C1', height: `${100 - reasonPct - spiritPct}%`, transition: 'all 0.3s ease', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
       </div>
       <p style={{textAlign: 'center', color: '#3A3A3A', fontWeight: 600, fontSize: '1.1rem', minHeight: '1.2em'}}>{balanceStatus}</p>
      <Slider label="Reason" value={reason} onChange={e => setReason(+e.target.value)} color="#3A3A3A" />
      <Slider label="Spirit" value={spirit} onChange={e => setSpirit(+e.target.value)} color="#8A8A8A" />
      <Slider label="Appetite" value={appetite} onChange={e => setAppetite(+e.target.value)} color="#C1C1C1" />
    </div>
  );
};

export default TripartiteSoulViz;