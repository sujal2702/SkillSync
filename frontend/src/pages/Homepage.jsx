import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Homepage.css'

export default function Homepage() {
    const [showWelcome, setShowWelcome] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false)
        }, 3000) // Show welcome for 3 seconds

        return () => clearTimeout(timer)
    }, [])

    const handleLoginClick = () => {
        navigate('/login')
    }

    if (showWelcome) {
        return (
            <div className="welcome-screen">
                <div className="welcome-content">
                    <h1 className="welcome-title">Welcome to SkillSync</h1>
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="holographic-bg"></div>
                    <h1 className="hero-title">
                        Transform Your Workforce with
                        <span className="gradient-text"> SkillSync</span>
                    </h1>
                    <p className="hero-subtitle">
                        Revolutionize talent management and unlock your team's potential through intelligent skill matching
                    </p>
                    <div className="hero-buttons">
                        <button className="cta-button primary" onClick={handleLoginClick}>
                            Get Started
                        </button>
                        <button className="cta-button secondary">
                            Learn More
                        </button>
                    </div>
                </div>
                <div className="floating-elements">
                    <div className="floating-card card-1"></div>
                    <div className="floating-card card-2"></div>
                    <div className="floating-card card-3"></div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="container">
                    <h2 className="section-title">How SkillSync Works</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">👥</div>
                            <h3>Employee Profiles</h3>
                            <p>Create comprehensive skill profiles for your team members</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Project Matching</h3>
                            <p>Intelligent algorithms match the right talent to the right projects</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Analytics Dashboard</h3>
                            <p>Track performance and optimize team allocation with data insights</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3>Skill Development</h3>
                            <p>Identify skill gaps and create development pathways</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Login Section */}
            <section id="login" className="login-section">
                <div className="container">
                    <div className="login-content">
                        <h2 className="section-title">Ready to Get Started?</h2>
                        <p>Join thousands of companies already using SkillSync to optimize their workforce</p>
                        <button className="login-button" onClick={handleLoginClick}>
                            Access Your Dashboard
                        </button>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="container">
                    <h2 className="section-title">Contact Us</h2>
                    <div className="contact-grid">
                        <div className="contact-info">
                            <h3>Get in Touch</h3>
                            <div className="contact-item">
                                <span className="contact-icon">📧</span>
                                <span>info@skillsync-demo.com</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-icon">📞</span>
                                <span>+1 (555) DEMO-APP</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-icon">📍</span>
                                <span>Demo Project - Portfolio Showcase</span>
                            </div>
                        </div>
                        <div className="contact-form">
                            <h3>Send us a Message</h3>
                            <form>
                                <input type="text" placeholder="Your Name" className="form-input" />
                                <input type="email" placeholder="Your Email" className="form-input" />
                                <textarea placeholder="Your Message" className="form-textarea"></textarea>
                                <button type="submit" className="submit-button">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}