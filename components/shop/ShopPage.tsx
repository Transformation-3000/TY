'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState('Alle');

  const products = [
    { id: 1, name: 'Methylierungstest Pro', price: '249 €', category: 'Tests', image: '/images/longevity_sphere_final.png' },
    { id: 2, name: 'Spermidin Komplex', price: '39 €', category: 'Supplements', image: '/images/photo_sunflower.png' },
    { id: 3, name: 'Omega-3 Algenöl', price: '29 €', category: 'Supplements', image: '/images/photo_water.png' },
    { id: 4, name: 'Schlaf-Optimierungskit', price: '89 €', category: 'Kits', image: '/images/photo_meditation.png' },
  ];

  return (
    <div className="shop-container">
      <div className="shop-hero">
        <div className="hero-content">
          <h1 className="hero-title">Deine Longevity Apotheke</h1>
          <p className="hero-subtitle">Wissenschaftlich fundierte Produkte für ein längeres, gesünderes Leben.</p>
        </div>
      </div>

      <div className="shop-filters">
        {['Alle', 'Tests', 'Supplements', 'Kits'].map(cat => (
          <button 
            key={cat} 
            className={`filter-btn ${activeTab === cat ? 'active' : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {products.filter(p => activeTab === 'Alle' || p.category === activeTab).map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <Image src={product.image} fill alt={product.name} style={{ objectFit: 'contain', padding: '1rem' }} />
            </div>
            <div className="product-info">
              <span className="product-cat">{product.category}</span>
              <h3 className="product-title">{product.name}</h3>
              <div className="product-footer">
                <span className="product-price">{product.price}</span>
                <button className="add-cart-btn"><i className="bi bi-cart-plus"></i></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .shop-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .shop-hero {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 32px; padding: 4rem 3rem; margin-bottom: 3rem; color: #fff;
        }
        .hero-title { font-size: 2.8rem; font-weight: 800; margin-bottom: 1rem; }
        .hero-subtitle { font-size: 1.2rem; opacity: 0.9; max-width: 600px; }

        .shop-filters { display: flex; gap: 1rem; margin-bottom: 3rem; }
        .filter-btn {
          padding: 0.75rem 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0;
          background: #fff; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.2s;
        }
        .filter-btn.active { background: #4498ca; color: #fff; border-color: #4498ca; }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2rem; }
        .product-card {
          background: #fff; border-radius: 24px; border: 1px solid #f1f5f9;
          overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: transform 0.3s;
        }
        .product-card:hover { transform: translateY(-8px); }
        .product-image { height: 220px; position: relative; background: #f8fafc; }
        .product-info { padding: 1.5rem; }
        .product-cat { font-size: 0.75rem; font-weight: 800; color: #4498ca; text-transform: uppercase; letter-spacing: 0.05em; }
        .product-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0.5rem 0 1rem; }
        
        .product-footer { display: flex; justify-content: space-between; align-items: center; }
        .product-price { font-size: 1.25rem; font-weight: 800; color: #1e293b; }
        .add-cart-btn {
          width: 45px; height: 45px; border-radius: 12px; border: none;
          background: #f1f5f9; color: #1e293b; font-size: 1.2rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .add-cart-btn:hover { background: #4498ca; color: #fff; }
      `}</style>
    </div>
  );
}
