import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, CheckCircle } from 'lucide-react';

const faqData = [
  {
    q: 'How does the preliminary screening classifier evaluate disease risk?',
    a: 'Our screening models use a Random Forest algorithm, which aggregates decisions across multiple decision trees. The model maps features (such as age, biological sex, Body Mass Index, and patient-reported symptoms) to predict the statistical likelihood of a specific disorder.'
  },
  {
    q: 'Can the computed risk score replace clinical diagnostics?',
    a: 'Absolutely not. This platform acts strictly as a preliminary screening tool to aid early symptom awareness. It does not possess medical certification and cannot substitute for clinical tests, lab evaluations, or direct medical diagnostics.'
  },
  {
    q: 'How is patient data security managed?',
    a: 'All personal evaluations and diagnostic histories are stored locally using SQLite database persistence. Sessions are secured via JSON Web Tokens (JWT) to prevent unauthorized local credentials access.'
  },
  {
    q: 'What is the clinical significance of the selected symptom sets?',
    a: 'The symptom sets were compiled based on primary clinical criteria for each target condition—such as polyuria and polydipsia for Diabetes, or edema and fatigue for Chronic Kidney Disease—ensuring models capture relevant indicators.'
  }
];

export default function Contact() {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq(prev => prev === index ? null : index);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    setAlert(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setAlert(false), 5000);
  };

  return (
    <div className="contact-container">
      <h1 className="page-title">{t('contact')} Support</h1>
      <p className="page-subtitle">Submit inquiries or explore common topics regarding our classifier models.</p>

      <div className="contact-grid">
        {/* Contact info cards */}
        <div className="contact-left-col">
          <div className="contact-card glass-card">
            <h2>Contact Information</h2>
            <div className="info-list">
              <div className="info-detail-item">
                <Mail className="detail-icon" />
                <div>
                  <strong>Email Inquiry</strong>
                  <a href="mailto:support@diagnostix.com">support@diagnostix.com</a>
                </div>
              </div>

              <div className="info-detail-item">
                <Phone className="detail-icon" />
                <div>
                  <strong>Phone Line</strong>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </div>
              </div>

              <div className="info-detail-item">
                <MapPin className="detail-icon" />
                <div>
                  <strong>Center</strong>
                  <span>Tech Innovation Hub, New Delhi, India 110001</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="contact-card glass-card faqs-card">
            <h2>
              <HelpCircle size={20} className="sec-icon" /> Frequently Asked Questions
            </h2>
            <div className="faqs-list">
              {faqData.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className={`faq-item-accordion ${isOpen ? 'open' : ''}`}>
                    <button type="button" className="faq-question-btn" onClick={() => toggleFaq(index)}>
                      <span>{faq.q}</span>
                      <ChevronDown size={18} className="faq-chevron" />
                    </button>
                    <div className="faq-answer-pane">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Message submission form */}
        <div className="contact-right-col">
          <div className="contact-card glass-card">
            <h2>Send a Message</h2>
            <p className="form-info-txt">Fill out the form below and our team will get back to you within 24 hours.</p>

            {alert && (
              <div className="alert alert-success animate-fade-in">
                <CheckCircle size={18} />
                <span>Message submitted successfully. We will follow up shortly.</span>
              </div>
            )}

            <form onSubmit={handleMessageSubmit} className="contact-form-elements">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Message Subject"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea
                  className="form-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={5}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Send Message <Send size={16} style={{ marginLeft: '6px' }} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
