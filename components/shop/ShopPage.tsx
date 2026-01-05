'use client';

interface ShopCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

const shopCategories: ShopCategory[] = [
  {
    id: 'supplements',
    title: 'Supplements',
    subtitle: 'Bundles Foundation & Booster',
    description: 'Evidenzbasierte Supplement-Bundles für optimale Longevity-Unterstützung',
    icon: 'bi-capsule-pill',
    color: '#006EA7',
  },
  {
    id: 'pflege',
    title: 'Pflege',
    subtitle: 'Hautcremes und Kollagen',
    description: 'Hochwertige Pflegeprodukte für Hautgesundheit und Kollagenaufbau',
    icon: 'bi-moisture',
    color: '#7FD049',
  },
  {
    id: 'regeneration',
    title: 'Regeneration',
    subtitle: 'Schlaf, Wärme und Licht',
    description: 'Produkte und Tools für optimale Regeneration durch Schlaf, Wärmetherapie und Lichtoptimierung',
    icon: 'bi-moon-stars',
    color: '#4C99C2',
  },
  {
    id: 'technologie',
    title: 'Technologie',
    subtitle: 'Wearables (Whoop & Oura)',
    description: 'Premium Wearables für präzises Bio-Tracking und Longevity-Monitoring',
    icon: 'bi-smartwatch',
    color: '#FF6B35',
  },
];

interface ShopPageProps {
  category?: string;
}

export default function ShopPage({ category }: ShopPageProps) {
  const selectedCategory = category 
    ? shopCategories.find(c => c.id === category)
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
      <div className="shop-header">
        <div className="shop-header-content">
          <h1>
            <span className="shop-brand-blue">True Years</span>{' '}
            <span className="shop-brand-green">SHOP</span>
          </h1>
          <p className="shop-tagline">
            Evidenzbasierte Produkte für Schlaf, Regeneration & Performance
          </p>
        </div>
      </div>

      <div className="shop-categories-grid">
        {shopCategories.map((category) => (
          <div
            key={category.id}
            className="shop-category-card"
            style={{ borderTop: `4px solid ${category.color}` }}
          >
            <div className="shop-category-icon" style={{ color: category.color }}>
              <i className={`bi ${category.icon}`}></i>
            </div>
            <div className="shop-category-content">
              <h3>{category.title}</h3>
              <p className="shop-category-subtitle">{category.subtitle}</p>
              <p className="shop-category-description">{category.description}</p>
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




