import React from "react";
import { FaGithub } from "react-icons/fa";
import "./LandingPage.scss";

const staticData = {
  heroTitle: "Free My Cash",
  heroSubtitle: "Create a financial file and manage your finances. No accounts needed. Fast, modular, and private.",
  modularityTitle: "Modular. Yours to Extend.",
  modularityText: "Built with flexibility in mind, the frontend is decoupled and easy to customize. This allows you to integrate your own backend API or get started with the one provided.",
  stepsTitle: "How It Works",
  step1Title: "1. Create a File",
  step1Text: "Create a financial file (or upload an existing one).",
  step2Title: "2. Edit, Manage and Visualize",
  step2Text: "Clean, categorize, and visualize your transactions.",
  step3Title: "3. Save & Download",
  step3Text: "Download your data and take it with you.",
  openSourceTitle: "Open Source",
  openSourceText: "Hack it, Fork it and dump it in your own web server. Use it your own way!",
  ctaTitle: "Get Involved",
  ctaText: "Contribute on GitHub, report issues or request a feature",
  github: "https://github.com/neberej/freemycash"
};


const goToPage = (page?: string) => {
  window.location.href = page ? `/${page}` : '/';
};

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo" onClick={() => goToPage()}></div>
        <div className="header__spacer" />
        <iframe className="github-star" src="https://ghbtns.com/github-btn.html?user=neberej&repo=freemycash&type=star&count=false&size=large" width="170" height="30" title="GitHub"></iframe>
      </div>
    </header>
  );
};

const LandingPage = () => {
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
              onClick={() => goToPage('upload')}
            >
              Get started
            </button>
            <button 
              className="button button--secondary" 
              onClick={() => goToPage('manage')}
            >
              See Demo
            </button>
          </div>
        </div>
      </section>

      <section className="modularity">
        <div className="container">
          <div className="modularity__image">
            <img src="./images/money.svg" alt="modular money management tool" />
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

      <section className="modularity">
        <div className="container">
          <div className="modularity__text">
            <h2 className="section__title">{staticData.openSourceTitle}</h2>
            <p className="section__text">{staticData.openSourceText}</p>
          </div>
          <div className="modularity__image">
            <img src="./images/money.svg" alt="modular money management tool" />
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2 className="section__title">{staticData.ctaTitle}</h2>
          <p className="section__text">{staticData.ctaText}</p>
          <a target="_blank" href="https://github.com/neberej/freemycash/" className="button button--primary">
            Visit GitHub
          </a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;