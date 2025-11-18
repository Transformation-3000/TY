'use client';

import { useState } from 'react';
import Image from 'next/image';

const nutritionSlides = [
  {
    id: 1,
    image: '/images/protein.png',
    label: 'Protein',
    value: '80g / 100g',
    progress: 80,
    color: '#64B5F6',
  },
  {
    id: 2,
    image: '/images/kohlenhydrate.png',
    label: 'Kohlenhydrate',
    value: '225g / 300g',
    progress: 75,
    color: '#42A5F5',
  },
  {
    id: 3,
    image: '/images/gemüse.png',
    label: 'Gemüse',
    value: '3 / 5 Portionen',
    progress: 60,
    color: '#2196F3',
  },
];

export default function NutritionCard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % nutritionSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + nutritionSlides.length) % nutritionSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="dashboard-card">
      <div className="metric-header">
        <h3>ERNÄHRUNG</h3>
        <div className="time-selector">
          <button
            className={`time-btn ${timeRange === 'day' ? 'active' : ''}`}
            onClick={() => setTimeRange('day')}
          >
            Tag
          </button>
          <button
            className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Woche
          </button>
          <button
            className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Monat
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem' }}>
        {/* Slide-Dots */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {nutritionSlides.map((_, index) => (
            <span
              key={index}
              className="dot"
              onClick={() => goToSlide(index)}
              style={{
                height: '10px',
                width: '10px',
                backgroundColor: index === currentSlide ? '#4498ca' : '#ccc',
                borderRadius: '50%',
                display: 'inline-block',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Slide-Container */}
        <div style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              width: '300%',
              transition: 'transform 0.4s ease',
              transform: `translateX(-${currentSlide * 33.33}%)`,
            }}
          >
            {nutritionSlides.map((slide) => (
              <div
                key={slide.id}
                style={{
                  width: '33.33%',
                  padding: '0 10px',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: '#f8fbff',
                    borderRadius: '16px',
                    padding: '1.2rem',
                    height: '260px',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '150px',
                      height: '150px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '0.8rem',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.label}
                      width={150}
                      height={150}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: '#2e6ca3',
                      marginBottom: '0.3rem',
                      fontSize: '1.2rem',
                    }}
                  >
                    {slide.label}
                  </div>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      color: '#4498ca',
                      marginBottom: '0.3rem',
                    }}
                  >
                    {slide.value}
                  </div>
                  <div style={{ width: '90%', height: '6px', marginTop: '0.2rem' }} className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${slide.progress}%`,
                        backgroundColor: slide.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#4498ca',
              fontSize: '1.3rem',
              zIndex: 10,
              background: 'none',
              border: 'none',
            }}
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#4498ca',
              fontSize: '1.3rem',
              zIndex: 10,
              background: 'none',
              border: 'none',
            }}
          >
            &#10095;
          </button>
        </div>
      </div>
      <div
        style={{
          marginTop: '1rem',
          background: '#E8F5E9',
          color: '#2E7D32',
          borderRadius: '8px',
          padding: '0.7rem',
          fontSize: '0.85rem',
        }}
      >
        <i className="bi bi-lightbulb"></i> Tipp: Achte heute auf eine ausgewogene Proteinfaufnahme
      </div>
    </div>
  );
}

