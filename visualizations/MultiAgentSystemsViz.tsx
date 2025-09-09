import React from 'react';

const MultiAgentSystemsViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Multi-Agent System Theory</h4>
            <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto' }}>
                <style>{`
                    @keyframes move-agent-1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(10px, 5px); } }
                    @keyframes move-agent-2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-8px, -12px); } }
                    @keyframes move-agent-3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(5px, -10px); } }
                `}</style>
                
                {/* Target */}
                <circle cx="220" cy="100" r="10" fill="none" stroke="#3A3A3A" strokeDasharray="3 2" />
                <line x1="220" y1="90" x2="220" y2="110" stroke="#3A3A3A" strokeDasharray="3 2" />
                <line x1="210" y1="100" x2="230" y2="100" stroke="#3A3A3A" strokeDasharray="3 2" />
                <text x="220" y="75" textAnchor="middle" fontSize="12">Goal</text>

                {/* Agents */}
                <g style={{ animation: 'move-agent-1 8s linear infinite' }}>
                    <circle cx="50" cy="50" r="8" fill="#8A8A8A" />
                    <path d="M 58 50 C 100 50, 180 80, 210 95" stroke="#8A8A8A" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                </g>
                <g style={{ animation: 'move-agent-2 7s linear infinite' }}>
                    <circle cx="70" cy="150" r="8" fill="#5A5A5A" />
                    <path d="M 78 150 C 120 150, 180 120, 210 105" stroke="#5A5A5A" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                </g>
                <g style={{ animation: 'move-agent-3 9s linear infinite' }}>
                    <circle cx="80" cy="100" r="8" fill="#C1C1C1" />
                    <path d="M 88 100 C 150 100, 200 100, 212 100" stroke="#C1C1C1" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                </g>
            </svg>
            <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '1rem' }}>
                Simple, autonomous agents coordinating to achieve a complex, emergent goal.
            </p>
        </div>
    );
};

export default MultiAgentSystemsViz;