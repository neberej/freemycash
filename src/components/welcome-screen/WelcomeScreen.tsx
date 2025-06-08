
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import messages from '@src/static/messages.json';
import { useStore } from '@src/store/useStore';
import { FinancialData } from '@src/types';
import hero1 from '@src/assets/hero1.jpg';
import './WelcomeScreen.scss';

const bgImages = [hero1];

const staticData = [
  {
    id: 'hero',
    title: 'Manage your finance',
    desc: 'Get a clear picture of your transactions without the data leaving your computer.',
    cta1: 'Upload a file',
    cta2: 'Create a new file'
  },
  {
    id: 'steps',
    title: 'How to get started?',
    steps: [
        {
            title: 'Step 1. Create or upload a financial file',
            desc: 'FreeMyCash uses a simple json file (financial file) to keep all your transactions in one place.',
        },
        {
            title: 'Step 2. Manage transactions',
            desc: 'Add, edit, or delete entries in one organized view. Upload a statement from your bank account. Or edit the raw file.',
        },
        {
            title: 'Step 3. Download your file',
            desc: 'Download the updated financial file and keep it with you.',
        },
        ],
    },
    {
    id: 'features',
    title: 'Just what you need',
    desc: `Add/Edit transactions, visualize and see trends. No more!`,
  },
  {
    id: 'usage',
    title: 'Three ways to use',
    items: [
      {
        title: 'Backend is optional',
        desc: 'Runs entirely in-browser; no server required.',
      },
      {
        title: 'With Backend',
        desc: 'Optional sync via sample backend.',
      },
      {
        title: 'Mobile App (on the way)',
        desc: 'Manage finances on the go.',
      },
    ],
  },
  {
    id: 'github',
    title: 'Like what you see?',
    desc: 'Get in touch!',
    cta1: 'Contact',
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {staticData.map(section => {
        switch (section.id) {
          case 'hero':
            return <HeroSection key={section.id} data={section} />;
          case 'steps':
            return <StepsSection key={section.id} data={section} />;
          case 'usage':
            return <UsageSection key={section.id} data={section} />;
          case 'github':
            return <GithubSection key={section.id} data={section} />;
          default:
            return <FeatureSection key={section.id} data={section} />;
        }
      })}
    </div>
  );
};

let uploadCounter = 0; // Counter for uploaded transaction IDs

const HeroSection: React.FC<{ data: any }> = ({ data }) => {
  const { setData, setIsModified } = useStore();
  const [bgIndex, setBgIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert(messages.errors.invalidFileType);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData: FinancialData = JSON.parse(event.target?.result as string);
        const timestamp = Date.now();
        const updatedData = {
          ...jsonData,
          transactions: jsonData.transactions.map((t, index) => ({
            ...t,
            id: t.id || `t-${timestamp}-${uploadCounter++}`,
          })),
        };
        setData(updatedData);
        setIsModified(false);
        navigate('/overview');
      } catch (error) {
        alert(messages.errors.invalidData);
      }
    };
    reader.readAsText(file);
  };

  return (
    <section
      className="hero section"
      style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
    >
      <div className="hero-content">
        <h1>{data.title}</h1>
        <p>{data.desc}</p>
        <button className="cta-primary" onClick={() => fileInputRef.current?.click()}>{data.cta1}</button>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <button className="cta-primary" onClick={() => navigate('/create-new')}>{data.cta2}</button>
        <p className="demo-link"><a href='?demo=true'>Try a demo</a></p>
      </div>
      <div className="hero-pattern" />
    </section>
  );
};

const FeatureSection: React.FC<{ data: any }> = ({ data }) => (
  <section className="feature section">
    <div className="feature-content">
      <h2>{data.title}</h2>
      <p>{data.desc}</p>
    </div>
    <div className="feature-pattern" />
  </section>
);

const StepsSection: React.FC<{ data: any }> = ({ data }) => {
  const [active, setActive] = useState(0);
  return (
    <section className="steps section">
      <h2>{data.title}</h2>
      <div className="steps-tabs">
        {data.steps.map((s: any, i: number) => (
          <button key={i} className={i === active ? 'active' : ''} onClick={() => setActive(i)}>
            {s.title.split('.')[0]}
          </button>
        ))}
      </div>
      <div key={active} className="steps-detail fade-in">
        <h3>{data.steps[active].title}</h3>
        <p>{data.steps[active].desc}</p>
      </div>
    </section>
  );
};

const UsageSection: React.FC<{ data: any }> = ({ data }) => (
  <section className="usage section">
    <h2>{data.title}</h2>
    <div className="usage-grid">
      {data.items.map((item: any, i: number) => (
        <div key={i} className="usage-card">
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const GithubSection: React.FC<{ data: any }> = ({ data }) => (
  <section className="github section">
    <h2>{data.title}</h2>
    <p>{data.desc}</p>
    <button className="cta-primary" onClick={() => window.location.href = "mailto:mail@freemycash.com"}>{data.cta1}</button>
  </section>
);

export default LandingPage;
