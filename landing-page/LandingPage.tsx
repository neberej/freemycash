import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import './LandingPage.scss';

interface StaticData {
  heroTitle: string;
  heroSubtitle: string;
  modularityTitle: string;
  modularityText: string;
  stepsTitle: string;
  step1Title: string;
  step1Text: string;
  step2Title: string;
  step2Text: string;
  step3Title: string;
  step3Text: string;
  openSourceTitle: string;
  openSourceText: string;
  ctaTitle: string;
  ctaText: string;
  howToUseTitle: string;
  howToUseOptions: Array<{ title: string; description: string }>;
}

const staticData: StaticData = {
  heroTitle: 'Free My Cash',
  heroSubtitle: 'Take control of your finances with a simple, private, and customizable financial management tool.',
  modularityTitle: 'Modular & Extensible',
  modularityText: 'Designed for flexibility, our decoupled frontend lets you integrate with any backend API or use our provided solution.',
  stepsTitle: 'How It Works',
  step1Title: '1. Create or Upload',
  step1Text: 'Start a new financial file or upload an existing one.',
  step2Title: '2. Manage & Visualize',
  step2Text: 'Categorize transactions and visualize your financial data with ease.',
  step3Title: '3. Save & Export',
  step3Text: 'Download your data securely and take it anywhere.',
  openSourceTitle: 'Open Source Freedom',
  openSourceText: 'Fork it, customize it, or host it on your own server. Use Free My Cash your way.',
  ctaTitle: 'Join the Community',
  ctaText: 'Contribute to the project, report issues, or suggest new features on GitHub.',
  howToUseTitle: 'How to Use Free My Cash',
  howToUseOptions: [
    {
      title: 'Without Backend',
      description: 'Upload your financial file, manage and categorize transactions, then download your updated file.',
    },
    {
      title: 'With Backend',
      description: 'Connect to any JSON-based backend. Try our sample backend powered by LowDB.',
    },
    {
      title: 'Mobile App',
      description: 'Coming soon! Manage your finances on the go with our upcoming mobile app.',
    },
  ],
};

const goToPage = (page?: string) => {
  window.location.href = page ? `/${page}` : '/';
};

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div
          className="header__logo"
          onClick={() => goToPage()}
        ></div>
        <iframe
          className="header__github"
          src="https://ghbtns.com/github-btn.html?user=neberej&repo=freemycash&type=star&count=false&size=large"
          width="170"
          height="30"
          title="GitHub"
        ></iframe>
      </div>
    </header>
  );
};

const ToggleSection: React.FC<{ options: StaticData['howToUseOptions'] }> = ({ options }) => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="how-to-use">
      <div className="container">
        <h2 className="section__title">{staticData.howToUseTitle}</h2>
        <div className="toggle__wrapper">
          <div className="toggle__buttons">
            {options.map((option, index) => (
              <button
                key={index}
                className={`toggle__button ${selected === index ? 'toggle__button--active' : ''}`}
                onClick={() => setSelected(index)}
              >
                {option.title}
              </button>
            ))}
          </div>
          <div className="toggle__content">
            <h3 className="toggle__content-title">{options[selected].title}</h3>
            <p className="toggle__content-description">{options[selected].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Header />
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">{staticData.heroTitle}</h1>
          <p className="hero__subtitle">{staticData.heroSubtitle}</p>
          <div className="hero__actions">
            <button
              className="button button--primary"
              onClick={() => goToPage('app')}
            >
              Get Started
            </button>
            <button
              className="button button--secondary"
              onClick={() => goToPage('app')}
            >
              See Demo
            </button>
          </div>
        </div>
      </section>

      <section className="modularity">
        <div className="container">
          <div className="modularity__image">
            <img src="./images/money.svg" alt="Modular money management tool" />
          </div>
          <div className="modularity__text">
            <h2 className="section__title">{staticData.modularityTitle}</h2>
            <p className="section__text">{staticData.modularityText}</p>
          </div>
        </div>
      </section>

      <section className="steps">
        <div className="container">
          <h2 className="section__title">{staticData.stepsTitle}</h2>
          <div className="step-list">
            <div className="step-card">
              <h3>{staticData.step1Title}</h3>
              <p>{staticData.step1Text}</p>
            </div>
            <div className="step-card">
              <h3>{staticData.step2Title}</h3>
              <p>{staticData.step2Text}</p>
            </div>
            <div className="step-card">
              <h3>{staticData.step3Title}</h3>
              <p>{staticData.step3Text}</p>
            </div>
          </div>
        </div>
      </section>

      <ToggleSection options={staticData.howToUseOptions} />

      <section className="open-source">
        <div className="container">
          <div className="modularity__text">
            <h2 className="section__title">{staticData.openSourceTitle}</h2>
            <p className="section__text">{staticData.openSourceText}</p>
          </div>
          <div className="modularity__image">
            <img src="./images/money.svg" alt="Open source financial tool" />
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2 className="section__title">{staticData.ctaTitle}</h2>
          <p className="section__text">{staticData.ctaText}</p>
          <a
            href="https://github.com/neberej/freemycash/"
            target="_blank"
            rel="noopener noreferrer"
            className="button button--primary"
          >
            Visit GitHub
          </a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;