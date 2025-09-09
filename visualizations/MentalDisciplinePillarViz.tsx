import React from 'react';

const MentalDisciplinePillarViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Pillar: Mental Discipline</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                <style>{`
                    .wave-circle { animation: radiate 4s linear infinite; }
                    @keyframes radiate {
                        0% { r: 0; opacity: 1; }
                        100% { r: 100px; opacity: 0; }
                    }
                `}</style>
                <circle className="wave-circle" cx="150" cy="100" fill="none" stroke="#8A8A8A" strokeWidth="2" />
                <circle className="wave-circle" cx="150" cy="100" fill="none" stroke="#8A8A8A" strokeWidth="2" style={{ animationDelay: '1s' }} />
                <circle className="wave-circle" cx="150" cy="100" fill="none" stroke="#8A8A8A" strokeWidth="2" style={{ animationDelay: '2s' }} />
                <circle className="wave-circle" cx="150" cy="100" fill="none" stroke="#8A8A8A" strokeWidth="2" style={{ animationDelay: '3s' }} />
                
                {/* Center point */}
                <circle cx="150" cy="100" r="8" fill="#3A3A3A" />
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center' }}>
                Refining focus and attention through Right Effort, Mindfulness, and Concentration.
            </p>
        </div>
    );
};

export default MentalDisciplinePillarViz;