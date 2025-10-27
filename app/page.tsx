'use client';

import LandingPage from './components/landing/LandingPage';
import ZoneLayout from './components/layout/ZoneLayout';

export default function Home() {
  return (
    <ZoneLayout zone="home" showNavigation={true}>
      <LandingPage />
    </ZoneLayout>
  );
}