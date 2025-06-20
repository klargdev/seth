import React from 'react';
import { Biography } from '../components/Biography';
import { DonationForm } from '../components/DonationForm';
import { TributeList } from '../components/TributeList';
import { MemoryPostForm } from '../components/MemoryPostForm';
import { ProgramOutline } from '../components/ProgramOutline';
import { MapDirections } from '../components/MapDirections';
import { Gallery } from '../components/Gallery';
import { ColorThemeSelector } from '../components/ColorThemeSelector';

export const Home = () => {
  return (
    <div className="home-page">
      <section id="biography">
        <Biography />
      </section>
      
      <section id="gallery">
        <Gallery />
      </section>
      
      <section id="tributes">
        <TributeList />
      </section>
      
      <section id="memories">
        <h2>Share Your Memories</h2>
        <MemoryPostForm />
      </section>
      
      <section id="donations">
        <DonationForm />
      </section>
      
      <section id="program">
        <ProgramOutline />
      </section>
      
      <section id="directions">
        <MapDirections />
      </section>
      
      <section id="theme">
        <ColorThemeSelector />
      </section>
    </div>
  );
};