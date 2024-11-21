import React from 'react';
import HeaderSection from '../components/Home/HeaderSection';
import AboutSection from '../components/Home/AboutSection';
import FeaturesSection from '../components/Home/FeaturesSection';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import CallToActionSection from '../components/Home/CallToActionSection';
import Footer from '../components/Home/Footer';
import './css/Home.css';

const Home = () => {
  return (
    <div className="home">
      <HeaderSection />
      <AboutSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Home;