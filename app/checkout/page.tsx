'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import './checkout.css';

// Type definitions
type PlanKey = 'basic' | 'premium' | 'platin';

interface PlanDetails {
  id: PlanKey;
  name: string;
  price: string;
  priceNum: number;
  badgeClass: string;
  features: string[];
}

const PLANS: Record<PlanKey, PlanDetails> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: '29,90 €',
    priceNum: 29.90,
    badgeClass: 'basic',
    features: [
      'Tägliche Check-Ins',
      'Persönliche Dashboards',
      'Do it yourself (Basic)',
      'Longevity Trainer (Basic)',
      'Longevity Insights',
      'Monatliche Live-Calls'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: '49,90 €',
    priceNum: 49.90,
    badgeClass: 'premium',
    features: [
      'Tägliche Check-Ins',
      'Persönliche Dashboards',
      'Do it yourself (Pro)',
      'Longevity Trainer (Pro)',
      'Longevity Insights',
      'Monatliche Live-Calls',
      'Wearable-Integration',
      'Analysen zum biologischen Alter',
      'Feel-Good-Area'
    ]
  },
  platin: {
    id: 'platin',
    name: 'Platin',
    price: '89,90 €',
    priceNum: 89.90,
    badgeClass: 'platin',
    features: [
      'Tägliche Check-Ins',
      'Persönliche Dashboards',
      'Do it yourself (Pro)',
      'Longevity Trainer (Pro)',
      'Longevity Insights',
      'Monatliche Live-Calls',
      'Wearable-Integration',
      'Analysen zum biologischen Alter',
      'Feel-Good-Area',
      'Biomarker-Tracking mit Lab-Analysen',
      'Jährliches 1:1-Expertengespräch'
    ]
  }
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State variables
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails>(PLANS.premium);
  const [paymentMethod, setPaymentMethod] = useState<'cc' | 'sepa' | 'paypal'>('cc');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form fields state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: 'Im Mediapark',
    number: '5',
    zip: '50670',
    city: 'Köln',
    country: 'Deutschland',
    cardName: 'Max Mustermann',
    cardNumber: '4500 1234 5678 9012',
    cardExpiry: '12 / 28',
    cardCvc: '123',
    sepaIban: 'DE89 5001 0517 1234 5678 90',
    sepaHolder: 'Max Mustermann',
    agreeTerms: true
  });

  // Load plan details from query parameters on mount or param change
  useEffect(() => {
    const planParam = searchParams.get('plan') as PlanKey;
    if (planParam && PLANS[planParam]) {
      setSelectedPlan(PLANS[planParam]);
    }
  }, [searchParams]);

  // Automatically generate email from firstName and lastName
  useEffect(() => {
    const fn = formData.firstName.trim().toLowerCase().replace(/\s+/g, '');
    const ln = formData.lastName.trim().toLowerCase().replace(/\s+/g, '');
    if (fn || ln) {
      setFormData(prev => ({
        ...prev,
        email: `${fn}.${ln}@gmx.de`
      }));
    }
  }, [formData.firstName, formData.lastName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateSubtotal = () => {
    // 19% German VAT calculation
    const total = selectedPlan.priceNum;
    const subtotal = total / 1.19;
    const vat = total - subtotal;
    return {
      subtotal: subtotal.toFixed(2).replace('.', ','),
      vat: vat.toFixed(2).replace('.', ','),
      total: total.toFixed(2).replace('.', ',')
    };
  };

  const costs = calculateSubtotal();

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) return;

    setLoading(true);

    // Simulated network delay
    setTimeout(async () => {
      try {
        // Authenticate client in background to set cookies so they can access the dashboard immediately
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: 'Longevity3000', type: 'gatekeeper' }),
        });

        // Set local storage flags just like the login page
        localStorage.setItem('ty_is_member', 'true');
        localStorage.setItem('ty_saved_password', 'Longevity3000');
        localStorage.setItem('ty_last_active', Date.now().toString());
        sessionStorage.setItem('ty_session_active', 'true');

        setSuccess(true);
      } catch (err) {
        console.error('Login simulation failed:', err);
        setSuccess(true); // Proceed to success screen anyway for demo robustness
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  if (success) {
    return (
      <div className="success-overlay">
        <div className="success-card">
          <div className="success-checkmark-container">
            <i className="bi bi-check-lg"></i>
          </div>
          <h2 className="success-title">Vielen Dank für deine Bestellung!</h2>
          <p className="success-text">
            Deine Mitgliedschaft für <strong>TrueYears {selectedPlan.name}</strong> wurde erfolgreich aktiviert. Wir haben dir eine Bestätigungs-E-Mail mit den Details deiner Bestellung gesendet.
          </p>
          <div className="success-details">
            <div className="success-detail-row">
              <span className="success-detail-label">Mitgliedschaft:</span>
              <span className="success-detail-value">TrueYears {selectedPlan.name}</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">Preis:</span>
              <span className="success-detail-value">{selectedPlan.price} / Monat</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">Kunde:</span>
              <span className="success-detail-value">{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="success-detail-row last">
              <span className="success-detail-label">E-Mail:</span>
              <span className="success-detail-value">{formData.email}</span>
            </div>
          </div>
          <Link href="/dashboard" className="btn-success-action">
            Direkt zum Dashboard gehen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {/* Header */}
      <header className="checkout-header">
        <Link href="/">
          <Image 
            src="/images/logoneu.png" 
            alt="TrueYears Logo" 
            width={180} 
            height={60} 
            className="checkout-header-logo"
            priority
          />
        </Link>
        <Link href="/" className="checkout-back-btn">
          <i className="bi bi-arrow-left"></i> Zurück
        </Link>
      </header>

      {/* Grid */}
      <form onSubmit={handleCheckoutSubmit} className="checkout-grid">
        {/* Left Column: Form */}
        <div>
          {/* Personal details */}
          <div className="checkout-section-card">
            <h2 className="checkout-section-title">
              <i className="bi bi-person-fill"></i> 1. Persönliche Details
            </h2>
            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">Vorname</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Max"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Nachname</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Mustermann"
                />
              </div>
            </div>
            <div className="form-group last">
              <label className="form-label" htmlFor="email">E-Mail-Adresse</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="max.mustermann@mail.de"
              />
            </div>
          </div>

          {/* Billing address */}
          <div className="checkout-section-card">
            <h2 className="checkout-section-title">
              <i className="bi bi-geo-alt-fill"></i> 2. Rechnungsadresse
            </h2>
            <div className="form-group-row">
              <div className="form-group" style={{ gridColumn: 'span 1', flex: '3 1 0%' }}>
                <label className="form-label" htmlFor="street">Straße</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  className="form-input"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Hauptstraße"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="number">Nr.</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  className="form-input"
                  required
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="42"
                />
              </div>
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label" htmlFor="zip">PLZ</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  className="form-input"
                  required
                  value={formData.zip}
                  onChange={handleInputChange}
                  placeholder="12345"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="city">Ort</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Musterstadt"
                />
              </div>
            </div>
            <div className="form-group last">
              <label className="form-label" htmlFor="country">Land</label>
              <select
                id="country"
                name="country"
                className="form-input"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="Deutschland">Deutschland</option>
                <option value="Österreich">Österreich</option>
                <option value="Schweiz">Schweiz</option>
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section-card">
            <h2 className="checkout-section-title">
              <i className="bi bi-credit-card-fill"></i> 3. Zahlungsmethode
            </h2>
            <div className="payment-methods-grid">
              <div 
                className={`payment-method-card ${paymentMethod === 'cc' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cc')}
              >
                <i className="bi bi-credit-card payment-method-icon"></i>
                <span className="payment-method-title">Kreditkarte</span>
              </div>
              <div 
                className={`payment-method-card ${paymentMethod === 'sepa' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('sepa')}
              >
                <i className="bi bi-bank payment-method-icon"></i>
                <span className="payment-method-title">Lastschrift</span>
              </div>
              <div 
                className={`payment-method-card ${paymentMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <i className="bi bi-paypal payment-method-icon"></i>
                <span className="payment-method-title">PayPal</span>
              </div>
            </div>

            {/* Dynamic details form */}
            <div className="payment-details-panel">
              {paymentMethod === 'cc' && (
                <div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cardName">Karteninhaber</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      className="form-input"
                      required={paymentMethod === 'cc'}
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="Max Mustermann"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cardNumber">Kreditkartennummer</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      className="form-input"
                      required={paymentMethod === 'cc'}
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="4500 1234 5678 9012"
                    />
                  </div>
                  <div className="form-group-row last">
                    <div className="form-group last">
                      <label className="form-label" htmlFor="cardExpiry">Gültig bis</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        className="form-input"
                        required={paymentMethod === 'cc'}
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM / YY"
                      />
                    </div>
                    <div className="form-group last">
                      <label className="form-label" htmlFor="cardCvc">CVC</label>
                      <input
                        type="password"
                        id="cardCvc"
                        name="cardCvc"
                        maxLength={4}
                        className="form-input"
                        required={paymentMethod === 'cc'}
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'sepa' && (
                <div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sepaHolder">Kontoinhaber</label>
                    <input
                      type="text"
                      id="sepaHolder"
                      name="sepaHolder"
                      className="form-input"
                      required={paymentMethod === 'sepa'}
                      value={formData.sepaHolder}
                      onChange={handleInputChange}
                      placeholder="Max Mustermann"
                    />
                  </div>
                  <div className="form-group last">
                    <label className="form-label" htmlFor="sepaIban">IBAN</label>
                    <input
                      type="text"
                      id="sepaIban"
                      name="sepaIban"
                      className="form-input"
                      required={paymentMethod === 'sepa'}
                      value={formData.sepaIban}
                      onChange={handleInputChange}
                      placeholder="DE89 5001 0517 ..."
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div style={{ textAlign: 'center', padding: '15px 0' }}>
                  <i className="bi bi-paypal" style={{ fontSize: '3rem', color: '#003087', marginBottom: '10px', display: 'block' }}></i>
                  <p style={{ color: '#475569', fontSize: '0.92rem' }}>
                    Nach Klick auf "Jetzt zahlungspflichtig bestellen" wirst du zur Autorisierung deiner Zahlung sicher zu PayPal weitergeleitet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Cart/Summary */}
        <div>
          <div className="checkout-summary-card">
            <div className="summary-plan-header">
              <span className={`summary-plan-badge ${selectedPlan.badgeClass}`}>
                {selectedPlan.name} Plan
              </span>
              <h3 className="summary-plan-title">TrueYears {selectedPlan.name}</h3>
              <div style={{ marginTop: '10px' }}>
                <span className="summary-plan-price">{selectedPlan.price}</span>
                <span className="summary-plan-period"> / Monat</span>
              </div>
            </div>

            <ul className="summary-features-list">
              {selectedPlan.features.map((feature, idx) => (
                <li key={idx}>
                  <i className="bi bi-check-circle-fill"></i> {feature}
                </li>
              ))}
            </ul>

            <div className="summary-divider"></div>

            <div className="summary-cost-row">
              <span>Zwischensumme:</span>
              <span>{costs.subtotal} €</span>
            </div>
            <div className="summary-cost-row">
              <span>inkl. 19% MwSt.:</span>
              <span>{costs.vat} €</span>
            </div>
            <div className="summary-cost-row total">
              <span>Gesamtsumme:</span>
              <span>{costs.total} € / Monat</span>
            </div>

            <div className="summary-divider"></div>

            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                className="terms-checkbox"
                required
                checked={formData.agreeTerms}
                onChange={handleInputChange}
              />
              <span>
                Ich stimme den Allgemeinen Geschäftsbedingungen (AGB) und der Datenschutzerklärung von TrueYears zu.
              </span>
            </label>

            <button
              type="submit"
              className="btn-checkout-submit"
              disabled={loading || !formData.agreeTerms}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Zahlung wird autorisiert...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-lock-fill"></i> Jetzt zahlungspflichtig bestellen
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #B3E0F0 0%, #E8F4F8 100%)' }}>
        <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#006EA7', marginBottom: '10px' }}>TrueYears Checkout</h2>
          <p style={{ color: '#7D8087' }}>Wird geladen...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
