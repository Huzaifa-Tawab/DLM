import React, { useState } from "react";
import homelogo from "../../Assets/sliderlogo.png";
import hero from "../../Assets/hero.jpg";
import paradise from '../../Assets/paradise.png'
import city from '../../Assets/cityparadise.jpeg'
import hawks from '../../Assets/hawks.png'
import sydney from '../../Assets/sydney.jpeg'
import about from "../../Assets/about.jpg";
import { Link, useNavigate } from "react-router-dom";
import "./homenew.css";
import Loader from "../../components/loader/Loader";
import Home from "./Home";


function HomeNew() {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="landing-page">
        <div className="head-home">
          <div className="logo">
            <img src={homelogo} alt="" />
          </div>
          <div className="cta">
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
        </div>
        <div className="Hero">
          <div className="Hero-content">
            <h1>
              Contemporary <br />
              <strong>Real Estate </strong> <br />
              Media & Marketing
            </h1>
            <p>
              Tired of pushing out endless marketing campaigns that produce
              lackluster results? Do we have you intrigued yet? Even if you are
              simply looking for some expert advice before taking the plunge
              with us, we would love to have the opportunity to speak with you!
            </p>
          </div>
          <Home />
        </div>
        <div className="team-works">
          <h3>Trusted By Teams at</h3>
          <div className="logos-slider">
            <img src={paradise} alt="" />
            <img src={hawks} alt="" />
            {/* <img src={slide} alt="" />
            <img src={slide} alt="" />
            <img src={slide} alt="" /> */}
          </div>
        </div>

        <div className="marketing-components paradise">
          <div className="market-typo">
            <h2>Our Trending Projects</h2>
            <span>
              Our professional real estate agents serve numerous housing
              societies for real estate marketing purposes and have executed
              many well-known projects in Islamabad and Rawalpindi that are
              achieving high excellence in real estate industry.
            </span>
          </div>
          <div className="market-img">
            <img src={city} alt="" />
          </div>
        </div>

        <div className="marketing-components">
        <div className="market-img">
            <img src={sydney} alt="" />
          </div>
          <div className="market-typo">
            <h2>Why Choose Us</h2>
            <span>
              We are here to help you with all of your property and real estate
              concerns. We aim to deliver the finest services and comprehensive
              real estate solutions to our clients.
            </span>
          </div>
         
        </div>

        <div className="marketing-components">
          <div className="market-typo">
            <h2>About Us</h2>
            <span>
              We are a leading real estate agency and property portal in
              Pakistan. Our focus is connecting customers with our premium
              exclusive real estate agents who work effortlessly to make your
              home journey simple, hassle-free, and more exciting!
            </span>
          </div>
          <div className="market-img">
            <img src={about} alt="" />
          </div>
        </div>

        {/* <div className="our-works">
          <h1>Works Heading</h1>
          <span>
            Our work is our reputation, and we protect it with every project we
            do.
          </span>
          <div className="cards-offer">
            <div className="flex-cards">
              <div className="work-cards">
                <h2>2 Lines Heading</h2>
                <span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                  at similique maiores reprehenderit possimus.
                </span>
                <div className="cars-mid-section">
                  <h2>Mid Top Heading</h2>
                  <Link>Learn More</Link>
                </div>
              </div>
            </div>
            <div className="flex-cards">
              <div className="work-cards">
                <h2>2 Lines Heading</h2>
                <span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                  at similique maiores reprehenderit possimus.
                </span>
                <div className="cars-mid-section">
                  <h2>Mid Top Heading</h2>
                  <Link>Learn More</Link>
                </div>
              </div>
            </div>{" "}
            <div className="flex-cards">
              <div className="work-cards">
                <h2>2 Lines Heading</h2>
                <span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                  at similique maiores reprehenderit possimus.
                </span>
                <div className="cars-mid-section">
                  <h2>Mid Top Heading</h2>
                  <Link>Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="social-links">
        <i className="fa-brands fa-facebook"></i>
        <i className="fa-brands fa-instagram"></i>
        <i className="fa-brands fa-tiktok"></i>
        <i className="fa-brands fa-youtube"></i>
        </div>
      </div>
    </>
  );
}

export default HomeNew;
