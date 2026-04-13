'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export interface ReelItem {
  id: string;
  title: string;
  author: string;
  role: string;
  tag: string;
  tagColor: string;
  teaser: string;
  fullText: string;
  videoSrc?: string;
  image: string;
}

interface Props {
  reels: ReelItem[];
  startIndex?: number;
  onClose: () => void;
}

export default function ReelsFocusView({ reels, startIndex = 0, onClose }: Props) {
  const [idx, setIdx] = useState(startIndex);
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartY = useRef<number | null>(null);

  const cur = reels[idx];
  const hasNext = idx < reels.length - 1;
  const hasPrev = idx > 0;

  const goTo = useCallback((newIdx: number) => {
    setIdx(newIdx);
    setExpanded(false);
  }, []);

  const goNext = useCallback(() => { if (hasNext) goTo(idx + 1); }, [hasNext, idx, goTo]);
  const goPrev = useCallback(() => { if (hasPrev) goTo(idx - 1); }, [hasPrev, idx, goTo]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowUp') goPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [goNext, goPrev, onClose]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    v.load();
    v.play().catch(() => {});
  }, [idx, muted]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 60) dy > 0 ? goNext() : goPrev();
    touchStartY.current = null;
  };

  const toggleSave = () => setSaved(s => {
    const n = new Set(s);
    n.has(cur.id) ? n.delete(cur.id) : n.add(cur.id);
    return n;
  });
  const isSaved = saved.has(cur.id);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="rfv-overlay" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* Top bar: progress + controls */}
      <div className="rfv-topbar">
        <div className="rfv-progress">
          {reels.map((_, i) => (
            <button
              key={i}
              className={`rfv-prog-seg ${i === idx ? 'active' : i < idx ? 'done' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <div className="rfv-topbar-right">
          {cur.videoSrc && (
            <button className="rfv-icon-btn" onClick={() => setMuted(m => !m)} title={muted ? 'Ton an' : 'Ton aus'}>
              <i className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`} />
            </button>
          )}
          <button className="rfv-icon-btn" onClick={onClose} title="Schließen">
            <i className="bi bi-x-lg" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="rfv-stage">

        {/* Media */}
        <div className="rfv-media">
          {cur.videoSrc ? (
            <video
              ref={videoRef}
              key={cur.id}
              src={cur.videoSrc}
              className="rfv-video"
              autoPlay
              loop
              muted={muted}
              playsInline
            />
          ) : (
            <Image
              src={cur.image}
              alt={cur.title}
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
            />
          )}
          <div className="rfv-grad" />
        </div>

        {/* Educational content overlay */}
        <div className="rfv-content">
          <span className="rfv-tag" style={{ background: cur.tagColor }}>{cur.tag}</span>
          <h2 className="rfv-title">{cur.title}</h2>

          <div className="rfv-author">
            <Image
              src={cur.image}
              alt={cur.author}
              width={32}
              height={32}
              style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 10%', flexShrink: 0 }}
            />
            <div>
              <span className="rfv-aname">{cur.author}</span>
              <span className="rfv-arole">{cur.role}</span>
            </div>
          </div>

          <p className="rfv-teaser">{cur.teaser}</p>

          {expanded && (
            <div className="rfv-deepdive">
              <div className="rfv-deepdive-bar" />
              <p>{cur.fullText}</p>
            </div>
          )}

          <button className="rfv-deepbtn" onClick={() => setExpanded(e => !e)}>
            <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-journal-bookmark-fill'}`} />
            {expanded ? 'Schließen' : 'Deep Dive lesen'}
          </button>
        </div>

        {/* Side actions */}
        <div className="rfv-actions">
          <button className={`rfv-action ${isSaved ? 'saved' : ''}`} onClick={toggleSave}>
            <i className={`bi ${isSaved ? 'bi-heart-fill' : 'bi-heart'}`} />
            <span>{isSaved ? 'Gefällt mir' : 'Gefällt mir'}</span>
          </button>
          <button className="rfv-action">
            <i className="bi bi-share" />
            <span>Teilen</span>
          </button>
        </div>

        {/* Navigation arrows */}
        {hasPrev && (
          <button className="rfv-nav rfv-nav--up" onClick={goPrev} title="Vorheriger">
            <i className="bi bi-chevron-up" />
          </button>
        )}
        {hasNext && (
          <button className="rfv-nav rfv-nav--down" onClick={goNext} title="Nächster">
            <i className="bi bi-chevron-down" />
          </button>
        )}

        {/* Counter */}
        <div className="rfv-counter">{idx + 1} / {reels.length}</div>
      </div>

      <style jsx>{`
        .rfv-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* ── Top bar ── */
        .rfv-topbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem 0.5rem;
          background: linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%);
        }
        .rfv-progress {
          flex: 1;
          display: flex;
          gap: 3px;
          align-items: center;
        }
        .rfv-prog-seg {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.3);
          border: none;
          cursor: pointer;
          padding: 6px 0;
          background-clip: content-box;
          transition: background 0.3s;
        }
        .rfv-prog-seg.done { background: rgba(255,255,255,0.8); background-clip: content-box; }
        .rfv-prog-seg.active { background: #fff; background-clip: content-box; }

        .rfv-topbar-right { display: flex; align-items: center; gap: 0.5rem; }
        .rfv-icon-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff; font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .rfv-icon-btn:hover { background: rgba(255,255,255,0.18); }

        /* ── Stage ── */
        .rfv-stage {
          position: relative;
          width: min(440px, 100vw);
          height: 100vh;
          overflow: hidden;
        }

        .rfv-media {
          position: absolute;
          inset: 0;
        }
        .rfv-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .rfv-grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.15) 0%,
            transparent 20%,
            transparent 40%,
            rgba(0,0,0,0.55) 68%,
            rgba(0,0,0,0.92) 100%
          );
        }

        /* ── Educational content overlay ── */
        .rfv-content {
          position: absolute;
          bottom: 5.5rem;
          left: 0;
          right: 66px;
          padding: 0 1.25rem;
        }

        .rfv-tag {
          display: inline-block;
          padding: 0.22rem 0.62rem;
          border-radius: 6px;
          font-size: 0.62rem; font-weight: 800;
          color: #fff; letter-spacing: 0.07em;
          margin-bottom: 0.6rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .rfv-title {
          font-size: 1.12rem; font-weight: 800;
          color: #fff; margin: 0 0 0.65rem;
          line-height: 1.35;
          text-shadow: 0 2px 12px rgba(0,0,0,0.55);
        }

        .rfv-author {
          display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.65rem;
        }
        .rfv-aname { display: block; font-size: 0.74rem; font-weight: 700; color: rgba(255,255,255,0.95); }
        .rfv-arole { display: block; font-size: 0.64rem; color: rgba(255,255,255,0.65); }

        .rfv-teaser {
          font-size: 0.82rem; color: rgba(255,255,255,0.85);
          line-height: 1.55; margin: 0 0 0.85rem;
        }

        .rfv-deepdive {
          background: rgba(255,255,255,0.08);
          border-radius: 12px; padding: 0.85rem 1rem 0.85rem 1.3rem;
          margin-bottom: 0.85rem; position: relative;
          border: 1px solid rgba(255,255,255,0.1);
          animation: rfvSlideUp 0.28s ease;
        }
        @keyframes rfvSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rfv-deepdive-bar {
          position: absolute; left: 0; top: 12%; bottom: 12%;
          width: 3px; border-radius: 2px;
          background: linear-gradient(180deg, #4498ca, #22c55e);
        }
        .rfv-deepdive p {
          font-size: 0.8rem; color: rgba(255,255,255,0.9);
          line-height: 1.65; margin: 0;
        }

        .rfv-deepbtn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.5rem 1.15rem; border-radius: 24px;
          border: 1.5px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.12); backdrop-filter: blur(10px);
          color: #fff; font-size: 0.78rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .rfv-deepbtn:hover {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.55);
        }

        /* ── Side actions ── */
        .rfv-actions {
          position: absolute;
          right: 0.75rem;
          bottom: 5.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .rfv-action {
          display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
          background: none; border: none; color: #fff; cursor: pointer;
          font-size: 1.5rem; transition: transform 0.2s;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
        }
        .rfv-action span {
          font-size: 0.6rem; font-weight: 600;
          color: rgba(255,255,255,0.85);
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
        .rfv-action:hover { transform: scale(1.15); }
        .rfv-action.saved i { color: #ef4444; filter: drop-shadow(0 2px 6px rgba(239,68,68,0.5)); }

        /* ── Navigation ── */
        .rfv-nav {
          position: absolute;
          left: 50%; transform: translateX(-50%);
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255,255,255,0.25);
          color: #fff; font-size: 1rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 15; transition: all 0.2s;
        }
        .rfv-nav:hover { background: rgba(255,255,255,0.22); }
        .rfv-nav--up { top: 4.5rem; }
        .rfv-nav--down {
          bottom: 1.5rem;
          animation: rfvBounce 1.8s ease-in-out infinite;
        }
        @keyframes rfvBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(7px); }
        }

        /* ── Counter ── */
        .rfv-counter {
          position: absolute;
          top: 4.2rem;
          right: 1rem;
          font-size: 0.68rem; font-weight: 600;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.04em;
        }

        @media (max-width: 480px) {
          .rfv-stage { width: 100vw; }
          .rfv-content { right: 60px; }
        }
      `}</style>
    </div>,
    document.body
  );
}
