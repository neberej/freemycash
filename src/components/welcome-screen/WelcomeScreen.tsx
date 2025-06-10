
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import messages from '@src/static/messages.json';
import { useStore } from '@src/store/useStore';
import { FinancialData } from '@src/types';
import hero1 from '@src/assets/hero1.jpg';
import screen from '@src/assets/screen.png';
import screen2 from '@src/assets/screen2.png';
import './WelcomeScreen.scss';

const bgImages = [hero1];

type Slide = {
  title: string;
  desc: string;
  icon?: string;
};

const staticData = [
  {
    id: 'hero',
    title: 'Take Control of Your Finances',
    desc: 'View, manage, and analyze your transactions directly in your browser. No accounts, no tracking—your data stays local.',
    cta1: 'Upload a file',
    cta2: 'Create a new file'
  },
  {
    id: 'steps',
    title: 'How to get started?',
    steps: [
      {
        title: 'Step 1. Create or upload a financial file',
        desc: 'Start with a blank financial file or import a local JSON. Your data structure is simple, portable, and versionable.',
      },
      {
        title: 'Step 2. Manage transactions',
        desc: 'Edit directly in the UI, import from bank statements, or tweak the JSON manually. You’re in full control.',
      },
      {
        title: 'Step 3. Download your file',
        desc: 'Save your updated financial data anytime. Nothing is stored online unless you choose to sync it.',
      },
    ],
  },
  {
    id: 'features',
    title: 'Focused on the essentials',
    desc: 'Quickly add and update transactions, filter by category, and track your spending trends with clean visuals.',
    img: screen
  },
  {
    id: 'usage',
    title: 'Three ways to use',
    items: [
      {
        title: 'Backend is optional',
        desc: 'Works entirely in-browser by default. No API calls, no external services.',
      },
      {
        title: 'With Backend',
        desc: 'Optionally sync your data using a lightweight backend API.',
      },
      {
        title: 'App',
        desc: 'Desktop app version coming soon—same features, packaged for local use.',
      },
    ],
  },
  {
    id: 'features2',
    title: 'Designed for performance',
    desc: 'Handles thousands of transactions without lag. Works smoothly on modern browsers—even offline.',
    img: screen2
  },
  {
    id: 'carousel',
    title: 'Why FreeMyCash?',
    desc: '',
    slides: [
      { title: 'Private by Design', desc: 'Everything runs locally. No cloud, no third parties, no surprises.' },
      { title: 'Instant Insights', desc: 'Built with fast rendering and real-time updates for large datasets.' },
      { title: 'Open Source', desc: 'Available on GitHub. Fork it, extend it, or contribute improvements.' },
      { title: 'No Lock-in', desc: 'Data stays in standard JSON. Use it wherever, however you want.' },
    ]
  },
  {
    id: 'github',
    title: 'Feedback/Issues?',
    desc: 'Found a bug? Have an idea? Open a ticket or star the project on GitHub.',
    cta1: 'Github Link',
  },
];

let uploadCounter = 0;
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
        <p className="demo-link"><a target="_blank" href='https://www.freemycash.com?demo=true'>Try a demo</a> | <a target="_blank" href='https://github.com/neberej/freemycash'>See on github</a></p>
      </div>
      <div className="hero-pattern" />
    </section>
  );
};

const FeatureSection: React.FC<{ data: any; reverse?: boolean; isEven?: boolean }> = ({ data, reverse, isEven }) => (
  <section className={`feature ${reverse ? 'reverse' : ''} ${isEven ? 'even' : 'odd'}`}>
    <div className="feature-inner">
      <div className="text-content">
        <h2>{data.title}</h2>
        <p>{data.desc}</p>
      </div>
      {data.img && (
        <div className="image-content">
          <img className="screen-img" src={data.img} alt={data.title} />
        </div>
      )}
    </div>
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

export const CarouselSection: React.FC<{ title: string; slides: Slide[] | undefined }> = ({ title, slides }) => {
  const [index, setIndex] = useState(0);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  if (!slides) return null;
  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
  if (timeout.current) clearTimeout(timeout.current);
  timeout.current = setTimeout(next, 8000); // auto advance every 8s

  return () => {
    if (timeout.current) clearTimeout(timeout.current);
  };
}, [index]);

  return (
    <section className="carousel section">
      <h2>{title}</h2>
      <div className="carousel-wrapper">
        <button className="nav left" onClick={prev} aria-label="Previous slide">‹</button>
        <div className="carousel-slide fade-in" key={index}>
          {slides[index].icon && <div className="icon">{slides[index].icon}</div>}
          <h3>{slides[index].title}</h3>
          <p>{slides[index].desc}</p>
        </div>
        <button className="nav right" onClick={next} aria-label="Next slide">›</button>
      </div>
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === index ? 'dot active' : 'dot'}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
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
    <button className="cta-primary" onClick={() => window.open("https://github.com/neberej/freemycash", "_blank")} > {data.cta1} </button>
  </section>
);

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
          case 'carousel':
            return <CarouselSection title={section.title} slides={section.slides} />;
          default:
            return <FeatureSection key={section.id} data={section} reverse />;
        }
      })}
    </div>
  );
};

export default LandingPage;
