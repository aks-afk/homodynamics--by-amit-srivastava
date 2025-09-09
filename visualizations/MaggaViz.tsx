import React from 'react';

const MaggaViz: React.FC = () => {
    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Magga: The Path to Liberation</h4>
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 250">
                    <style>{`
                        @keyframes ascend {
                           from { motion-offset: 0%; }
                           to { motion-offset: 100%; }
                        }
                    `}</style>
                    <defs>
                        <radialGradient id="lightSource">
                            <stop offset="0%" stopColor="rgba(253, 251, 246, 1)" />
                            <stop offset="100%" stopColor="rgba(253, 251, 246, 0)" />
                        </radialGradient>
                    </defs>

                    {/* Light at the top */}
                    <circle cx="150" cy="50" r="50" fill="url(#lightSource)" />
                    <circle cx="150" cy="50" r="10" fill="#FDFBF6" />

                    {/* The Path */}
                    <path 
                        id="ascentPath"
                        d="M 150 220 C 50 220, 50 80, 150 80 S 250 80, 250 150 S 50 150, 150 50"
                        stroke="#C1C1C1"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        fill="none"
                    />
                    
                    {/* Ascending Particle */}
                    <circle r="5" fill="#3A3A3A">
                       <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
                            <mpath href="#ascentPath"/>
                       </animateMotion>
                    </circle>
                </svg>
            </div>
             <p style={{ fontSize: '0.9rem', color: '#5A5A5A', lineHeight: 1.5, textAlign: 'center', marginTop: '0.5rem' }}>
                The Noble Eightfold Path provides the way to enlightenment.
            </p>
        </div>
    );
};

export default MaggaViz;