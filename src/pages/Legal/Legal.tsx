import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

const Legal: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-container">
      <header className="legal-header glass shadow-sm">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h1>Legal & Compliance</h1>
      </header>

      <main className="legal-content">
        <section className="legal-section">
          <h2>Safety Disclaimer & Overnight Parking</h2>
          <p>
            <strong>Crucial Notice:</strong> WanderHub provides information sourced from community data and third-party APIs
            to highlight <em>potential</em> parking, resting, and accommodation spots. We <strong>do not guarantee</strong> the legality,
            safety, or current availability of any overnight parking location.
          </p>
          <p>
            Local laws, property policies, and signage change frequently. It is explicitly your responsibility to:
          </p>
          <ul>
            <li>Verify local ordinances regarding vehicle habitation or overnight parking.</li>
            <li>Obey all posted signage at the actual location.</li>
            <li>Assess the safety of the area before deciding to stay.</li>
            <li>Patronize businesses where you park when applicable.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Data Honesty Transparency</h2>
          <p>
            <strong>Version 1.0 Notice:</strong> The current build contains a mixture of curated live parameters and structured mock data.
            Location markers, ratings, and events are represented as conceptual models and may not reflect real-time live database connections until Version 1.1.
          </p>
        </section>

        <section className="legal-section">
          <h2>Privacy Policy (Starter)</h2>
          <p>
            We respect your privacy. In this current state, WanderHub runs entirely in your browser. We do not secretly store your location data
            or sell your tracking information to third parties. If you grant location access, it is used strictly locally to center your map.
          </p>
        </section>

        <section className="legal-section">
          <h2>Terms & Conditions (Starter)</h2>
          <p>
            By using WanderHub, you agree to use our tool as an assistive guide, not an authoritative legal source. You assume all risks
            associated with travel and navigating to destinations listed herein.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Legal;
