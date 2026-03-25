import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import './Admin.css';

const Admin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container centered" style={{ textAlign: 'center', padding: '2rem' }}>
      <ShieldAlert size={64} color="#ef4444" style={{ marginBottom: '1rem' }} />
      <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Admin Temporarily Unavailable</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
        The ingestion portal is currently undergoing an active security lockdown. Write operations to the public network are strictly disabled.
      </p>
      <button className="primary-btn" style={{ maxWidth: '200px', margin: '0 auto' }} onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Return to Map
      </button>
    </div>
  );
};

export default Admin;
