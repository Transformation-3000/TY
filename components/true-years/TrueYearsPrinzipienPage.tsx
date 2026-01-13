'use client';

import { useState, useEffect, useRef } from 'react';

interface Principle {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const principles: Principle[] = [
  {
    id: 1,
    title: 'Verantwortung',
    description: 'Langlebigkeit beginnt bei uns selbst. Wir handeln informiert und bewusst – jeden Tag.',
    icon: 'bi-heart-pulse-fill',
  },
  {
    id: 2,
    title: 'Weitsicht',
    description: 'Longevity ist kein Sprint, sondern ein intelligenter Marathon mit kleinen, klugen Entscheidungen.',
    icon: 'bi-hourglass-split',
  },
  {
    id: 3,
    title: 'Weisheit',
    description: 'Daten geben Orientierung, Erfahrung gibt Tiefe. Wir nutzen beides.',
    icon: 'bi-lightbulb-fill',
  },
  {
    id: 4,
    title: 'Ganzheit',
    description: 'Energie, Schlaf, Geist, Beziehungen und Sinn gehören zusammen.',
    icon: 'bi-infinity',
  },
  {
    id: 5,
    title: 'Beständigkeit',
    description: 'Nicht der perfekte Tag zählt – sondern die Richtung.',
    icon: 'bi-compass-fill',
  },
  {
    id: 6,
    title: 'Gemeinschaft',
    description: 'Longevity entsteht im Austausch, im Spiegeln, im Miteinander.',
    icon: 'bi-people-fill',
  },
  {
    id: 7,
    title: 'Lebensfreude',
    description: 'Wir investieren nicht in Sorge vor dem Altern, sondern in Lust am Leben.',
    icon: 'bi-sun-fill',
  },
];

export default function TrueYearsPrinzipienPage() {
  const [confirmedPrinciples, setConfirmedPrinciples] = useState<Set<number>>(new Set());
  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [isSigned, setIsSigned] = useState(false);
  const [signedDate, setSignedDate] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    
    // Check if already signed (localStorage)
    const savedSignature = localStorage.getItem('trueYearsSignature');
    if (savedSignature) {
      const data = JSON.parse(savedSignature);
      setSignatureData(data.signature);
      setSignedDate(data.date);
      setIsSigned(true);
      setConfirmedPrinciples(new Set([1, 2, 3, 4, 5, 6, 7]));
    }
  }, []);

  // Initialize canvas when modal opens
  useEffect(() => {
    if (showSignature && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // Set canvas size with device pixel ratio for sharp lines
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2.5;
        contextRef.current = ctx;
      }
    }
  }, [showSignature]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords || !contextRef.current) return;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !contextRef.current) return;
    
    const coords = getCoordinates(e);
    if (!coords) return;
    
    contextRef.current.lineTo(coords.x, coords.y);
    contextRef.current.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    contextRef.current.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const togglePrinciple = (id: number) => {
    if (isSigned) return;
    const newSet = new Set(confirmedPrinciples);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setConfirmedPrinciples(newSet);
  };

  const allConfirmed = confirmedPrinciples.size === 7;

  const handleSign = () => {
    if (!hasDrawn || !canvasRef.current) return;
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    // Get signature as data URL
    const signatureDataUrl = canvasRef.current.toDataURL('image/png');
    
    setSignatureData(signatureDataUrl);
    setSignedDate(dateStr);
    setIsSigned(true);
    setShowSignature(false);
    
    // Save to localStorage
    localStorage.setItem('trueYearsSignature', JSON.stringify({
      signature: signatureDataUrl,
      date: dateStr
    }));
  };

  const resetCommitment = () => {
    localStorage.removeItem('trueYearsSignature');
    setIsSigned(false);
    setShowSignature(false);
    setSignatureData('');
    setSignedDate('');
    setConfirmedPrinciples(new Set());
    setHasDrawn(false);
  };

  const openSignatureModal = () => {
    setShowSignature(true);
    setHasDrawn(false);
  };

  // Certificate View
  if (isSigned) {
    return (
      <div className="manifest-container certificate-view">
        <div className="ambient-bg">
          <div className="glow glow-1"></div>
          <div className="glow glow-2"></div>
          <div className="glow glow-3"></div>
        </div>

        <div className="certificate">
          <div className="certificate-border">
            <div className="certificate-inner">
              {/* Header */}
              <div className="cert-header">
                <div className="cert-emblem">
                  <i className="bi bi-award-fill"></i>
                </div>
                <div className="cert-seal">
                  <i className="bi bi-patch-check-fill"></i>
                </div>
              </div>

              <h1 className="cert-title">TRUE YEARS</h1>
              <p className="cert-subtitle">COMMITMENT URKUNDE</p>

              <div className="cert-divider">
                <span></span>
                <i className="bi bi-diamond-fill"></i>
                <span></span>
              </div>

              <p className="cert-declaration">
                Hiermit bekenne ich mich zu den sieben<br />
                Leitprinzipien der True Years Gemeinschaft
              </p>

              {/* Mini Principles */}
              <div className="cert-principles">
                {principles.map((p) => (
                  <div key={p.id} className="cert-principle-badge">
                    <i className={`bi ${p.icon}`}></i>
                    <span>{p.title}</span>
                  </div>
                ))}
              </div>

              {/* Signature Area */}
              <div className="cert-signature-area">
                <div className="signature-display">
                  <img src={signatureData} alt="Unterschrift" className="signature-image" />
                  <div className="signature-line"></div>
                </div>
                <p className="signature-label">Unterschrift</p>
              </div>

              {/* Date & Seal */}
              <div className="cert-footer">
                <div className="cert-date">
                  <i className="bi bi-calendar3"></i>
                  <span>{signedDate}</span>
                </div>
                <div className="cert-stamp">
                  <div className="stamp-circle">
                    <span className="stamp-text">VERIFIED</span>
                    <span className="stamp-member">MEMBER</span>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <p className="cert-quote">
                „Mehr Leben in jedem Jahr – gemeinsam."
              </p>
            </div>
          </div>
        </div>

        <div className="cert-actions">
          <button className="action-btn secondary" onClick={resetCommitment}>
            <i className="bi bi-arrow-counterclockwise"></i>
            Neu unterzeichnen
          </button>
        </div>

        <style jsx>{`
          .manifest-container {
            min-height: calc(100vh - 80px);
            background: linear-gradient(170deg, #0d1a2d 0%, #152238 50%, #1a2d47 100%);
            padding: 2rem 1rem;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .ambient-bg {
            position: absolute;
            inset: 0;
            pointer-events: none;
          }

          .glow {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
          }

          .glow-1 {
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
            top: -100px;
            right: -50px;
          }

          .glow-2 {
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
            bottom: -50px;
            left: -50px;
          }

          .glow-3 {
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .certificate {
            position: relative;
            z-index: 1;
            animation: fadeIn 0.8s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }

          .certificate-border {
            background: linear-gradient(135deg, #D4AF37 0%, #F5E6B8 25%, #D4AF37 50%, #B8962E 75%, #D4AF37 100%);
            padding: 3px;
            border-radius: 12px;
            box-shadow: 
              0 20px 60px rgba(0, 0, 0, 0.4),
              0 0 40px rgba(212, 175, 55, 0.2);
          }

          .certificate-inner {
            background: linear-gradient(180deg, #0f1c2e 0%, #152238 50%, #0f1c2e 100%);
            border-radius: 10px;
            padding: 2.5rem 2rem;
            text-align: center;
            min-width: 340px;
            max-width: 420px;
          }

          .cert-header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .cert-emblem {
            font-size: 2.5rem;
            color: #D4AF37;
            filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.5));
          }

          .cert-seal {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            font-size: 1.5rem;
            color: #7FD049;
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }

          .cert-title {
            font-size: 1.8rem;
            font-weight: 800;
            letter-spacing: 8px;
            margin: 0 0 0.25rem;
            background: linear-gradient(135deg, #fff 20%, #D4AF37 50%, #F5E6B8 80%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .cert-subtitle {
            font-size: 0.7rem;
            letter-spacing: 4px;
            color: rgba(212, 175, 55, 0.8);
            margin: 0 0 1rem;
            font-weight: 600;
          }

          .cert-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          .cert-divider span {
            width: 60px;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
          }

          .cert-divider i {
            font-size: 0.5rem;
            color: #D4AF37;
          }

          .cert-declaration {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            margin: 0 0 1.25rem;
          }

          .cert-principles {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.4rem;
            margin-bottom: 1.5rem;
          }

          .cert-principle-badge {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            padding: 0.3rem 0.6rem;
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 20px;
            font-size: 0.65rem;
            color: #D4AF37;
          }

          .cert-principle-badge i {
            font-size: 0.6rem;
          }

          .cert-signature-area {
            margin-bottom: 1.25rem;
          }

          .signature-display {
            position: relative;
            padding: 0.5rem 0;
          }

          .signature-image {
            max-width: 200px;
            max-height: 80px;
            object-fit: contain;
          }

          .signature-line {
            width: 180px;
            height: 1px;
            background: rgba(212, 175, 55, 0.4);
            margin: 0.25rem auto 0;
          }

          .signature-label {
            font-size: 0.6rem;
            color: rgba(255, 255, 255, 0.4);
            letter-spacing: 2px;
            text-transform: uppercase;
            margin: 0.5rem 0 0;
          }

          .cert-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .cert-date {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
          }

          .cert-date i {
            color: #D4AF37;
          }

          .cert-stamp {
            position: relative;
          }

          .stamp-circle {
            width: 50px;
            height: 50px;
            border: 2px solid rgba(127, 208, 73, 0.6);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transform: rotate(-15deg);
          }

          .stamp-text {
            font-size: 0.5rem;
            font-weight: 800;
            color: #7FD049;
            letter-spacing: 1px;
          }

          .stamp-member {
            font-size: 0.4rem;
            color: rgba(127, 208, 73, 0.7);
            letter-spacing: 1px;
          }

          .cert-quote {
            font-size: 0.8rem;
            font-style: italic;
            color: rgba(255, 255, 255, 0.5);
            margin: 0;
          }

          .cert-actions {
            margin-top: 1.5rem;
            display: flex;
            gap: 0.75rem;
          }

          .action-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.25rem;
            border-radius: 25px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
          }

          .action-btn.secondary {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.15);
          }

          .action-btn.secondary:hover {
            background: rgba(255, 255, 255, 0.15);
          }

          @media (max-width: 480px) {
            .certificate-inner {
              padding: 2rem 1.25rem;
              min-width: 300px;
            }

            .cert-title {
              font-size: 1.5rem;
              letter-spacing: 5px;
            }

            .signature-image {
              max-width: 160px;
              max-height: 60px;
            }
          }
        `}</style>
      </div>
    );
  }

  // Commitment Process View
  return (
    <div className="manifest-container">
      <div className="ambient-bg">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>

      {/* Hero */}
      <div className={`hero ${isVisible ? 'visible' : ''}`}>
        <div className="hero-emblem">
          <div className="emblem-ring"></div>
          <i className="bi bi-award-fill"></i>
        </div>
        <h1>TRUE YEARS</h1>
        <p className="hero-tagline">Bekenne dich zu den sieben Prinzipien</p>
        <div className="progress-indicator">
          <span className="progress-count">{confirmedPrinciples.size}/7</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(confirmedPrinciples.size / 7) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Principles */}
      <div className="principles">
        {principles.map((p, i) => {
          const isConfirmed = confirmedPrinciples.has(p.id);
          return (
            <div
              key={p.id}
              className={`principle ${isVisible ? 'visible' : ''} ${isConfirmed ? 'confirmed' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => togglePrinciple(p.id)}
            >
              <div className="principle-check">
                {isConfirmed ? (
                  <i className="bi bi-check-circle-fill"></i>
                ) : (
                  <i className="bi bi-circle"></i>
                )}
              </div>
              <div className="principle-icon">
                <i className={`bi ${p.icon}`}></i>
              </div>
              <div className="principle-body">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Signature Modal */}
      {showSignature && (
        <div className="signature-modal">
          <div className="modal-backdrop" onClick={() => setShowSignature(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <i className="bi bi-pen-fill"></i>
              <h2>Deine Unterschrift</h2>
            </div>
            <p className="modal-text">
              Unterschreibe mit deinem Finger oder der Maus
            </p>
            
            {/* Canvas for signature */}
            <div className="canvas-container">
              <canvas
                ref={canvasRef}
                className="signature-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasDrawn && (
                <div className="canvas-placeholder">
                  <i className="bi bi-pencil"></i>
                  <span>Hier unterschreiben</span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="modal-btn clear" onClick={clearCanvas}>
                <i className="bi bi-eraser"></i>
                Löschen
              </button>
              <button className="modal-btn cancel" onClick={() => setShowSignature(false)}>
                Abbrechen
              </button>
              <button 
                className="modal-btn confirm" 
                onClick={handleSign}
                disabled={!hasDrawn}
              >
                <i className="bi bi-check2"></i>
                Bestätigen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className={`closing ${isVisible ? 'visible' : ''}`}>
        {allConfirmed ? (
          <button className="commit-btn ready" onClick={openSignatureModal}>
            <i className="bi bi-pen-fill"></i>
            Manifest unterzeichnen
          </button>
        ) : (
          <p className="instruction">
            <i className="bi bi-hand-index"></i>
            Bestätige alle Prinzipien, um fortzufahren
          </p>
        )}
      </div>

      <style jsx>{`
        .manifest-container {
          min-height: calc(100vh - 80px);
          background: linear-gradient(170deg, #0d1a2d 0%, #152238 50%, #1a2d47 100%);
          padding: 2rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .ambient-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }

        .glow-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
          top: -100px;
          right: -50px;
        }

        .glow-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(127, 208, 73, 0.1) 0%, transparent 70%);
          bottom: -50px;
          left: -50px;
        }

        /* Hero */
        .hero {
          text-align: center;
          margin-bottom: 2rem;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-emblem {
          position: relative;
          width: 60px;
          height: 60px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emblem-ring {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(212, 175, 55, 0.4);
          border-radius: 50%;
          animation: pulse-ring 3s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.2; }
        }

        .hero-emblem i {
          font-size: 1.75rem;
          color: #D4AF37;
          filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.5));
        }

        .hero h1 {
          font-size: clamp(1.6rem, 5vw, 2.2rem);
          font-weight: 800;
          letter-spacing: 6px;
          margin: 0 0 0.4rem;
          background: linear-gradient(135deg, #fff 20%, #D4AF37 50%, #F5E6B8 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-tagline {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 1.25rem;
        }

        .progress-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .progress-count {
          font-size: 0.85rem;
          font-weight: 700;
          color: #D4AF37;
        }

        .progress-bar {
          width: 120px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #D4AF37, #7FD049);
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        /* Principles */
        .principles {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 0.6rem;
          max-width: 900px;
          margin: 0 auto 2rem;
        }

        .principle {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          cursor: pointer;
          opacity: 0;
          transform: translateY(15px);
          transition: all 0.3s ease;
          user-select: none;
        }

        .principle.visible {
          animation: fadeUp 0.5s forwards;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .principle:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .principle.confirmed {
          background: rgba(127, 208, 73, 0.08);
          border-color: rgba(127, 208, 73, 0.3);
        }

        .principle-check {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .principle.confirmed .principle-check {
          color: #7FD049;
          transform: scale(1.1);
        }

        .principle-icon {
          width: 36px;
          height: 36px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .principle-icon i {
          font-size: 1rem;
          color: #D4AF37;
        }

        .principle.confirmed .principle-icon {
          background: rgba(127, 208, 73, 0.15);
        }

        .principle.confirmed .principle-icon i {
          color: #7FD049;
        }

        .principle-body {
          flex: 1;
          min-width: 0;
        }

        .principle-body h3 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.25rem;
        }

        .principle-body p {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.45;
          margin: 0;
        }

        /* Closing */
        .closing {
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
        }

        .closing.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .instruction {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }

        .instruction i {
          color: rgba(212, 175, 55, 0.6);
        }

        .commit-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 2rem;
          border: none;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .commit-btn.ready {
          background: linear-gradient(135deg, #D4AF37 0%, #B8962E 100%);
          color: #0d1a2d;
          box-shadow: 0 4px 25px rgba(212, 175, 55, 0.4);
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 4px 25px rgba(212, 175, 55, 0.4); }
          50% { box-shadow: 0 4px 35px rgba(212, 175, 55, 0.6); }
        }

        .commit-btn.ready:hover {
          transform: translateY(-2px) scale(1.02);
        }

        /* Signature Modal */
        .signature-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9998;
        }

        .modal-content {
          position: relative;
          z-index: 10000;
          background: linear-gradient(180deg, #1a2d47 0%, #152238 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: 2rem;
          max-width: 420px;
          width: 100%;
          text-align: center;
          animation: modalIn 0.3s ease;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
        }

        .modal-header i {
          font-size: 1.5rem;
          color: #D4AF37;
        }

        .modal-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .modal-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 1.25rem;
        }

        /* Canvas Container */
        .canvas-container {
          position: relative;
          width: 100%;
          height: 150px;
          background: rgba(0, 0, 0, 0.3);
          border: 2px dashed rgba(212, 175, 55, 0.4);
          border-radius: 12px;
          margin-bottom: 1.25rem;
          overflow: hidden;
        }

        .signature-canvas {
          width: 100%;
          height: 100%;
          cursor: crosshair;
          touch-action: none;
        }

        .canvas-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: rgba(212, 175, 55, 0.5);
          pointer-events: none;
        }

        .canvas-placeholder i {
          font-size: 1.5rem;
        }

        .canvas-placeholder span {
          font-size: 0.85rem;
        }

        .modal-actions {
          display: flex;
          gap: 0.6rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .modal-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.7rem 1.25rem;
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .modal-btn.clear {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.6);
        }

        .modal-btn.clear:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .modal-btn.cancel {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
        }

        .modal-btn.cancel:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .modal-btn.confirm {
          background: linear-gradient(135deg, #D4AF37 0%, #B8962E 100%);
          color: #0d1a2d;
        }

        .modal-btn.confirm:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .modal-btn.confirm:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .manifest-container {
            padding: 1.5rem 1rem;
          }

          .principles {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .principle {
            padding: 0.9rem 1rem;
          }

          .modal-content {
            padding: 1.5rem;
          }

          .canvas-container {
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
}
