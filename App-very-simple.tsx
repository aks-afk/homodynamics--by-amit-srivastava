import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f7f5f0',
      color: '#2c2a26'
    }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#8b6914', fontSize: '2.5rem', marginBottom: '10px' }}>
          Homodynamics
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#4a453e' }}>
          A Philosophical Framework for Understanding Complex Systems
        </p>
      </header>

      <main>
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#2c2a26', fontSize: '2rem', marginBottom: '20px' }}>
            About Homodynamics
          </h2>
          <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
            Homodynamics is a philosophical framework that synthesizes ancient wisdom traditions
            with modern scientific understanding to explore the fundamental dynamics of human
            consciousness and experience.
          </p>
          <p style={{ lineHeight: '1.6' }}>
            This is a very simple version to ensure React is working correctly without any
            complex components or visualizations.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#2c2a26', fontSize: '2rem', marginBottom: '20px' }}>
            Dynamic Equilibrium
          </h2>
          <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
            Dynamic equilibrium represents the balance between opposing forces in complex systems.
            This concept is fundamental to understanding how systems maintain stability while
            adapting to change.
          </p>
          <div style={{
            padding: '20px',
            backgroundColor: '#faf8f4',
            border: '1px solid #e8e4dc',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            [Visualization would appear here]
          </div>
        </section>
      </main>

      <footer style={{
        marginTop: '60px',
        padding: '20px 0',
        borderTop: '1px solid #e8e4dc',
        textAlign: 'center',
        color: '#8b8073',
        fontSize: '0.9rem'
      }}>
        © 2024 Homodynamics. Created by Amit Srivastava. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
