// Support.jsx
import React from 'react';
import HeroSection from './Support/HeroSection.jsx';
import QuickLinks from './Support/QuickLinks.jsx';
import FAQSection from './Support/FAQSection.jsx';
import ContactOptions from './Support/ContactOptions.jsx';
import StatusSection from './Support/StatusSection.jsx';
import TutorialsSection from './Support/TutorialsSection.jsx';

const Support = () => {
  return (
    <div className="max-w-7xl mx-auto p-5">
      <HeroSection />
      <QuickLinks />
      <FAQSection />
      <ContactOptions />
      <StatusSection />
      <TutorialsSection />
    </div>
  );
};

export default Support;