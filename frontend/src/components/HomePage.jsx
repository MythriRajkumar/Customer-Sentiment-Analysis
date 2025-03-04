import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import image from '../images/homepage.png';

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="header">
        <div className="container header-container">
          <div className="logo-container">
            <svg 
              className="logo-icon" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" 
                clipRule="evenodd" 
              />
            </svg>
            <h1 className="logo-text">SentimentIQ</h1>
          </div>
          <nav>
            <ul className="nav-links">
              <li><a href="#features" className="nav-link">Features</a></li>
              <li><a href="#benefits" className="nav-link">Benefits</a></li>
              <li><a href="#contact" className="nav-link">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container hero-container">
            <div className="hero-content">
              <h2 className="hero-title">
                AI-Powered Customer Sentiment Analysis for Business Insights
              </h2>
              <p className="hero-description">
                Unlock the power of customer feedback with real-time sentiment analysis. Quickly adapt strategies, enhance customer satisfaction, and drive sustainable growth for your business.
              </p>
              <div className="hero-buttons">
                <Link 
                  to="/dashboard" 
                  className="primary-button"
                >
                  Try Now
                </Link>
              </div>
            </div>
            <div className="hero-image-container">
              <img 
                src={image}
                alt="Sentiment Analysis Dashboard" 
                className="hero-image"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="container">
            <h2 className="section-title">Key Features</h2>
            <div className="features-grid">
              <div className="feature-card blue">
                <div className="feature-icon-container blue">
                  <svg className="feature-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Real-time Analysis</h3>
                <p className="feature-description">Process customer feedback as it arrives with our advanced AI algorithms.</p>
              </div>
              <div className="feature-card green">
                <div className="feature-icon-container green">
                  <svg className="feature-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12 6 6 0 000-12z" clipRule="evenodd"></path>
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Multi-source Integration</h3>
                <p className="feature-description">Collect and analyze feedback from social media, reviews, surveys, and support tickets.</p>
              </div>
              <div className="feature-card purple">
                <div className="feature-icon-container purple">
                  <svg className="feature-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm2 1v10h10V4H5z" clipRule="evenodd"></path>
                    <path d="M7 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"></path>
                    <path d="M7 11a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Custom Dashboards</h3>
                <p className="feature-description">Create personalized visualization dashboards tailored to your business needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="benefits-section">
          <div className="container">
            <h2 className="section-title">Business Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon-container">
                  <svg className="benefit-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="benefit-title">Improved Customer Experience</h3>
                  <p className="benefit-description">Identify pain points quickly and address customer needs proactively.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon-container">
                  <svg className="benefit-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="benefit-title">Data-Driven Decision Making</h3>
                  <p className="benefit-description">Base your business strategies on concrete customer sentiment data.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon-container">
                  <svg className="benefit-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="benefit-title">Competitive Advantage</h3>
                  <p className="benefit-description">Stay ahead of market trends by understanding customer preferences.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon-container">
                  <svg className="benefit-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="benefit-title">Brand Reputation Management</h3>
                  <p className="benefit-description">Monitor and improve your brand perception in real-time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="demo" className="cta-section">
          <div className="container cta-container">
            <h2 className="cta-title">Ready to transform customer feedback into actionable insights?</h2>
            <p className="cta-description">
              Join businesses that are already leveraging AI-powered sentiment analysis to drive growth and customer satisfaction.
            </p>
            <Link 
              to="/dashboard" 
              className="cta-button"
            >
              Try SentimentIQ Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3 className="footer-title">SentimentIQ</h3>
              <p className="footer-text">
                AI-powered customer sentiment analysis for business growth and improved customer experiences.
              </p>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#features" className="footer-link">Features</a></li>
                <li><a href="#benefits" className="footer-link">Benefits</a></li>
                <li><a href="#demo" className="footer-link">Demo</a></li>
                <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Resources</h3>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Documentation</a></li>
                <li><a href="#" className="footer-link">API</a></li>
                <li><a href="#" className="footer-link">Tutorials</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-title">Contact Us</h3>
              <ul className="footer-contact">
                <li className="contact-item">
                  <svg className="contact-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  <a href="mailto:info@sentimentiq.com" className="footer-link">info@sentimentiq.com</a>
                </li>
                <li className="contact-item">
                  <svg className="contact-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"></path>
                    <path d="M10 8a2 2 0 100-4 2 2 0 000 4z"></path>
                  </svg>
                  <span className="footer-text">123 Business Ave, Suite 300, San Francisco, CA 94107</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">&copy; {new Date().getFullYear()} SentimentIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;