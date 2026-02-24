'use client';

import Image from 'next/image';

interface ShopCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  image: string;
}

const shopCategories: ShopCategory[] = [
  {
    id: 'daily-essentials',
    title: 'Daily Essentials',
    subtitle: 'Evidenzbasierte Supplement-Bundles',
    description: 'Evidenzbasierte Supplement-Bundle zur täglichen Einnahme auf 3-Monatsbasis.',
    icon: 'bi-capsule-pill',
    color: '#006EA7',
    image: '/images/shop/daily-essentials.jpg',
  },
  {
    id: 'performance-energy',
    title: 'Performance + Energy Booster',
    subtitle: 'Evidenzbasierte Supplement-Bundles',
    description: 'Evidenzbasierte Supplement-Bundle zur täglichen Einnahme auf 3-Monatsbasis.',
    icon: 'bi-lightning-charge',
    color: '#7FD049',
    image: '/images/shop/performance-energy.jpg',
  },
  {
    id: 'schlaf-stress-erholung',
    title: 'Schlaf + Stressreduktion + Erholung',
    subtitle: 'Evidenzbasierte Supplement-Bundles',
    description: 'Evidenzbasierte Supplement-Bundle zur täglichen Einnahme auf 3-Monatsbasis.',
    icon: 'bi-moon-stars',
    color: '#4C99C2',
    image: '/images/shop/schlaf-stress-erholung.jpg',
  },
  {
    id: 'hautcremes',
    title: 'High-Tech-Hautcremes',
    subtitle: 'Nachweisliche Wirkung',
    description: 'Rückgang der Faltenbildung, Stärkung von Elastizität und Barrierefunktion der Haut.',
    icon: 'bi-moisture',
    color: '#E8A0BF',
    image: '/images/shop/hautcremes.jpg',
  },
  {
    id: 'high-tech',
    title: 'High-Tech-Produkte',
    subtitle: 'Positive Longevity-Effekte',
    description: 'Smarte Matratze mit unterschiedlichen Temperaturzonen für tieferen Schlaf, 6-Frequenzen-Rotlicht für zahlreiche Effekte auf Zellstatus-Ebene.',
    icon: 'bi-smartwatch',
    color: '#FF6B35',
    image: '/images/shop/high-tech.jpg',
  },
];

interface ShopPageProps {
  category?: string;
  onNavigate?: (menuId: string) => void;
}

export default function ShopPage({ category, onNavigate }: ShopPageProps) {
  const selectedCategory = category
    ? shopCategories.find((c) => c.id === category)
    : null;

  if (selectedCategory) {
    return (
      <div className="shop-category-page">
        <div className="shop-category-header">
          <div className="shop-category-header-content">
            <h1>{selectedCategory.title}</h1>
            <p className="shop-subtitle">{selectedCategory.subtitle}</p>
            <p className="shop-description">{selectedCategory.description}</p>
          </div>
        </div>
        <div className="shop-products-container">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
            Produkte werden geladen...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-hero">
        <div className="shop-hero-bg">
          <Image
            src="/images/shop/shop-hero-couple.png"
            alt="Personalized Longevity Journey"
            fill
            className="shop-hero-image"
            priority
          />
          <div className="shop-hero-overlay" />
        </div>
        <div className="shop-hero-content">
          <h1>Dein Shop für mehr Vitalität</h1>
          <p>
            Kuratierte Produktauswahl für deine persönliche Reise für mehr Langlebigkeit und Vitalität
          </p>
          <div className="shop-usp-badges">
            <span className="shop-usp-badge-hero">
              <i className="bi bi-shield-check"></i> Von Experten geprüft
            </span>
            <span className="shop-usp-badge-hero">
              <i className="bi bi-star-fill"></i> Kuratierte Auswahl
            </span>
          </div>
        </div>
      </div>

      <div className="shop-categories-grid">
        {shopCategories.map((cat) => (
          <div
            key={cat.id}
            className="shop-category-card"
            style={{ borderTop: `4px solid ${cat.color}` }}
            onClick={() => onNavigate?.(`shop-${cat.id}`)}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate?.(`shop-${cat.id}`)}
            role="button"
            tabIndex={0}
          >
            <div className="shop-card-badge">
              <i className="bi bi-shield-check"></i> Geprüft
            </div>
            <div className="shop-category-image-wrap">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="shop-category-image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div
                className="shop-category-image-fallback"
                style={{
                  background: `linear-gradient(135deg, ${cat.color}40 0%, ${cat.color} 100%)`,
                }}
                aria-hidden
              />
            </div>
            <div className="shop-category-icon" style={{ color: cat.color }}>
              <i className={`bi ${cat.icon}`}></i>
            </div>
            <div className="shop-category-content">
              <h3>{cat.title}</h3>
              <p className="shop-category-subtitle">{cat.subtitle}</p>
              <p className="shop-category-description">{cat.description}</p>
            </div>
            <div className="shop-category-arrow">
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
