import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Initial fade-in for the entire hero section
        const initialTimer = setTimeout(() => setIsVisible(true), 50);
        
        const timers = [
            setTimeout(() => setStep(1), 300),  // Words slide in with delay
            setTimeout(() => setStep(2), 1000), // Fade in '+' 
            setTimeout(() => setStep(3), 2200), // Fade out '+' and merge words
            setTimeout(() => setStep(4), 3000) // Fade in byline
        ];
        
        return () => {
            clearTimeout(initialTimer);
            timers.forEach(clearTimeout);
        };
    }, []);

    const baseTextStyle: React.CSSProperties = {
        fontFamily: 'var(--font-family-secondary)',
        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
        fontWeight: 'var(--font-weight-normal)',
        color: '#faf8f4',
        transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'inline-block',
        verticalAlign: 'baseline',
        letterSpacing: 'var(--letter-spacing-tight)',
    };

    const homoStyle: React.CSSProperties = {
        ...baseTextStyle,
        transform: step < 1 ? 'translateX(-40px) translateY(10px)' : 'translateX(0) translateY(0)',
        opacity: step >= 1 ? 1 : 0,
        filter: step >= 1 ? 'blur(0px)' : 'blur(2px)',
        transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease-out',
    };

    const dynamicsStyle: React.CSSProperties = {
        ...baseTextStyle,
        transform: step < 1 ? 'translateX(40px) translateY(10px)' : 'translateX(0) translateY(0)',
        opacity: step >= 1 ? 1 : 0,
        filter: step >= 1 ? 'blur(0px)' : 'blur(2px)',
        transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease-out',
    };
    
    const plusStyle: React.CSSProperties = {
        ...baseTextStyle,
        overflow: 'hidden',
        margin: step >= 3 ? '0' : '0 var(--space-4)',
        maxWidth: step >= 3 ? '0' : '5rem',
        opacity: step === 2 ? 1 : 0,
        transform: step === 2 ? 'scale(1) rotate(0deg)' : step < 2 ? 'scale(0.8) rotate(-90deg)' : 'scale(0.8) rotate(90deg)',
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), margin 1s cubic-bezier(0.16, 1, 0.3, 1), max-width 1s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformOrigin: 'center',
    };

    const bylineStyle: React.CSSProperties = {
        fontFamily: 'var(--font-family-primary)',
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-medium)',
        color: '#fffef8', // Bright ivory/cream color
        marginTop: 'var(--space-6)',
        opacity: step >= 4 ? 0.95 : 0, // Increased opacity for brightness
        transform: step >= 4 ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        letterSpacing: 'var(--letter-spacing-wide)',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // Subtle shadow for better contrast
    };

    const heroStyle: React.CSSProperties = {
        height: '240px',
        backgroundColor: 'var(--color-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
    };

    const titleContainerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        position: 'relative',
    };

    return (
        <section className="hero" style={heroStyle}>
            {/* Subtle background gradient overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
                pointerEvents: 'none',
            }} />
            
            {/* Flex container solves whitespace rendering issues between spans */}
            <div style={titleContainerStyle}>
                <span style={homoStyle}>Homo</span>
                <span style={plusStyle}>+</span>
                <span style={dynamicsStyle}>Dynamics</span>
            </div>
            <p style={bylineStyle}>By Amit Srivastava</p>
        </section>
    );
};

export default Hero;