import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar.jsx';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import TextEditor from '../components/app/TextEditor';
import AudioPlayer from '../components/app/AudioPlayer';
import ImageUploader from '../components/app/ImageUploader';
import VideoComposer from '../components/app/VideoComposer';
import Workflow from '../components/landing/Workflow';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function Home() {
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [audioMeta, setAudioMeta] = useState(null);
  const [images, setImages] = useState([]);

  const handleGenerate = (meta) => {
    setAudioMeta(meta);
    setAudioGenerated(true);
    // Scroll to audio player
    setTimeout(() => {
      document.getElementById('audio-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleRegenerate = () => {
    setAudioGenerated(false);
    setAudioMeta(null);
    document.getElementById('audio-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <TextEditor onGenerate={handleGenerate} />
      <AudioPlayer
        generated={audioGenerated}
        voiceMeta={audioMeta}
        onRegenerate={handleRegenerate}
      />
      <ImageUploader images={images} setImages={setImages} />
      <VideoComposer hasAudio={audioGenerated} images={images} />
      <Workflow />
      <CTASection />
      <Footer />
    </div>
  );
}