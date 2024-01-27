import React from "react";
import logo from '../../Assets/SoftXion.png'
import hero from '../../Assets/hero.jpg'
import slide from '../../Assets/slide.png'
import heero from '../../Assets/heero.jpg'
import { Link } from "react-router-dom";
import './homenew.css';
function HomeNew() {
  return (
    <>
    <div className="landing-page">
      <div className="head-home">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="cta">
          <button>Get Started</button>
        </div>
      </div>
      <div className="Hero">
        <h1>Contemporary <br />
<strong>Real Estate </strong> <br />
Media & Marketing</h1>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam expedita saepe tenetur repudiandae dolore magni cumque dignissimos, voluptate explicabo odit.</p>
    <button>Get Strted</button>
      
      <div className="hero-img">
        <img src={hero} alt="" />
      </div>
      </div>
      <div className="team-works">
        <h3>Trusted By Teams at</h3>
        <div className="logos-slider">
          <img src={slide} alt="" />
          <img src={slide} alt="" />
          <img src={slide} alt="" />
          <img src={slide} alt="" />
          <img src={slide} alt="" />
        </div>
      </div>

      <div className="marketing-components">
        <div className="market-typo">
          <h2>Leverage the power of video</h2>
          <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo, obcaecati.</span>
        </div>
        <div className="market-img">
          <img src={heero} alt="" />
        </div>
      </div>

      <div className="marketing-components">
        <div className="market-typo">
          <h2>Leverage the power of video</h2>
          <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo, obcaecati.</span>
        </div>
        <div className="market-img">
          <img src={heero} alt="" />
        </div>
      </div>

      <div className="marketing-components">
        <div className="market-typo">
          <h2>Leverage the power of video</h2>
          <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo, obcaecati.</span>
        </div>
        <div className="market-img">
          <img src={heero} alt="" />
        </div>
      </div>

      <div className="our-works">
        <h1>Works Heading</h1>
        <span>Lorem ipsum dolor sit amet.</span>
        <div className="cards-offer">
        <div className="flex-cards">
          <div className="work-cards">
            <h2>2 Lines Heading</h2>
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus at similique maiores reprehenderit possimus.</span>
            <div className="cars-mid-section">
              <h2>Mid Top Heading</h2>
              <Link>Learn More</Link>
            </div>
          </div>
        </div>

        <div className="flex-cards">
          <div className="work-cards">
            <h2>2 Lines Heading</h2>
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus at similique maiores reprehenderit possimus.</span>
            <div className="cars-mid-section">
              <h2>Mid Top Heading</h2>
              <Link>Learn More</Link>
            </div>
          </div>
        </div>  <div className="flex-cards">
          <div className="work-cards">
            <h2>2 Lines Heading</h2>
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus at similique maiores reprehenderit possimus.</span>
            <div className="cars-mid-section">
              <h2>Mid Top Heading</h2>
              <Link>Learn More</Link>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      <div className="social-links">
            <i className="fa-solid fa-facebook">Fb</i>
            <i className="fa-solid fa-instagram">In</i>
            <i className="fa-solid fa-tiktok">tt</i>
            <i className="fa-solid fa-youtube">yt</i>
          </div>
      </div>
    </>
  );
}

export default HomeNew;
