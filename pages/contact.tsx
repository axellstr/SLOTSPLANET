import Head from 'next/head';
import Header from '../components/Header';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us - Slots Planet</title>
        <meta name="description" content="Get in touch with the Slots Planet team" />
        <link rel="stylesheet" href="/styles/main.css" />
        <link rel="stylesheet" href="/styles/contact.css" />
      </Head>

      <div className="main-layout">
        <Header />
        
        <div className="main-content">
          <main className="contact-container">
            <div className="contact-header">
              <h1 className="contact-title">Contact Us</h1>
              <p className="contact-subtitle">Get in touch with the Slots Planet team</p>
            </div>

            <div className="contact-grid">
              {/* Contact Information */}
              <div>
                <h2 className="contact-section-title">Get In Touch</h2>
                
                <div className="contact-info-group">
                  <div className="contact-info-card">
                    <h3 className="info-card-title">📧 Email Support</h3>
                    <p className="info-card-text">General Inquiries:</p>
                    <p><a href="mailto:info@slotsplanet.com" className="email-link">info@slotsplanet.com</a></p>
                    <p className="info-card-text mt-4">Partnership & Business:</p>
                    <p><a href="mailto:partnerships@slotsplanet.com" className="email-link">partnerships@slotsplanet.com</a></p>
                  </div>

                  <div className="contact-info-card">
                    <h3 className="info-card-title">💬 Social Media</h3>
                    <div>
                      <p className="info-card-text">Follow us for updates and exclusive offers:</p>
                      <div className="social-links">
                        <a href="https://t.me" className="social-link">📱 Telegram</a>
                        <a href="https://instagram.com" className="social-link">📷 Instagram</a>
                        <a href="https://youtube.com" className="social-link">📹 YouTube</a>
                        <a href="https://discord.com" className="social-link">💬 Discord</a>
                      </div>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <h3 className="info-card-title">⏰ Response Times</h3>
                    <div className="response-times">
                      <p>• Email inquiries: 24-48 hours</p>
                      <p>• Partnership requests: 3-5 business days</p>
                      <p>• Live chat: Instant during business hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="contact-section-title">Send us a Message</h2>
                
                <div className="contact-form-container">
                  <form className="contact-form">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject" className="form-label">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="form-select"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="technical">Technical Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message" className="form-label">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className="form-textarea"
                        placeholder="Tell us how we can help you..."
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="submit-button"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="privacy-notice">
              <p>
                We value your privacy and will never share your information with third parties.
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
} 