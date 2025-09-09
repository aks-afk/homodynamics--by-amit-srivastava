import React, { useState } from 'react';

const AllegoricalJourneyViz: React.FC = () => {
    const journeySteps = [
        'The Cave', 'The Ascent', 'World Outside', 'Exploration', 'The Practice', 'The Return'
    ];
    const [currentStep, setCurrentStep] = useState(0);

    const Step = ({ index, label }: { index: number, label: string }) => {
        const isActive = index === currentStep;
        return (
            <div
                onClick={() => setCurrentStep(index)}
                style={{
                    padding: '0.5rem 0.75rem',
                    border: `1px solid ${isActive ? '#3A3A3A' : '#C1C1C1'}`,
                    borderRadius: '4px',
                    textAlign: 'center',
                    background: isActive ? '#F1F0EC' : '#FCFBF8',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.9rem',
                    flex: '1 1 0px',
                }}
            >
                {label}
            </div>
        );
    };

    const descriptions = [
        "Trapped in low-information internal models.",
        "The tripartite discovery: biological, logical, intellectual.",
        "Life revealed as dimensions of energy, space, and time.",
        "Walking through the Four Purusharthas as goals.",
        "The Eight Limbs of Yoga as tools for balance.",
        "Applying Homodynamics to modern life.",
    ];

    return (
        <div>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', color: '#3A3A3A', fontWeight: 'normal' }}>Allegorical Journey</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {journeySteps.map((label, index) => (
                    <Step key={index} index={index} label={label} />
                ))}
            </div>
            <div style={{ 
                minHeight: '80px', 
                padding: '1rem', 
                background: '#F1F0EC', 
                borderRadius: '4px', 
                border: '1px solid #EAE8E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <p style={{ margin: 0, color: '#3A3A3A', fontSize: '1rem', lineHeight: '1.5' }}>
                    {descriptions[currentStep]}
                </p>
            </div>
        </div>
    );
};

export default AllegoricalJourneyViz;
