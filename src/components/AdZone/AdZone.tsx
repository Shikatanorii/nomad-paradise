import React from 'react';
import './AdZone.css';

interface AdZoneProps {
  type: 'banner-bottom' | 'inline-feed' | 'modal';
  isMonetizationActive?: boolean; // Set to true when AdSense or affiliate is approved
}

const AdZone: React.FC<AdZoneProps> = ({ type, isMonetizationActive = false }) => {
  if (isMonetizationActive) {
    // Future live ad integration logic goes here (e.g. Google AdSense snippet)
    return <div className={`ad-wrapper ${type} active-ad`}>{/* Live Ad Script */}</div>;
  }

  // Placeholder for ad space readiness (invisible to users in production unless debugging)
  return (
    <div className={`ad-wrapper ${type} ad-placeholder`}>
      <span className="ad-label">Ad Space ({type})</span>
    </div>
  );
};

export default AdZone;
