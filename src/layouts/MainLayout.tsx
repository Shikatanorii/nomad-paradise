import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Map, Compass, Bookmark, User } from 'lucide-react';
import ComingSoonModal from '../components/ComingSoon/ComingSoonModal';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFeature, setModalFeature] = useState('');

  const openModal = (feature: string) => {
    setModalFeature(feature);
    setModalOpen(true);
  };
  return (
    <div className="layout-container">
      <main className="main-content">
        <Outlet />
      </main>
      
      {/* Bottom Navigation for Mobile-first PWA feel */}
      <nav className="bottom-nav shadow-lg glass" aria-label="Main Navigation">
        <button className="nav-item active" aria-label="Explore Map">
          <Map size={24} aria-hidden="true" />
          <span>Explore</span>
        </button>
        <button className="nav-item" onClick={() => openModal('Trips & Planning')} aria-label="Trips">
          <Compass size={24} aria-hidden="true" />
          <span>Trips</span>
        </button>
        <button className="nav-item" onClick={() => openModal('Saved Places')} aria-label="Saved">
          <Bookmark size={24} aria-hidden="true" />
          <span>Saved</span>
        </button>
        <button className="nav-item" onClick={() => openModal('User Profiles')} aria-label="User Profile">
          <User size={24} aria-hidden="true" />
          <span>Profile</span>
        </button>
      </nav>

      <ComingSoonModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        featureName={modalFeature} 
      />
    </div>
  );
};

export default MainLayout;
