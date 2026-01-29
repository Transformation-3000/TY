'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Science {
  id: string;
  title: string;
  category: string;
  description: string;
  source: string;
  date: string;
  thumbnail: string;
}

interface Event {
  id: string;
  title: string;
  type: 'webinar' | 'workshop' | 'conference' | 'meetup';
  date: string;
  time: string;
  location: string;
  description: string;
  expert?: string;
  thumbnail: string;
}

interface Expert {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  image: string;
  latestUpdate: string;
  followers: string;
  videos: number;
}

const science: Science[] = [
  {
    id: '1',
    title: 'NAD+ Supplementierung zeigt vielversprechende Ergebnisse',
    category: 'Longevity',
    description: 'Neue Studien zeigen positive Effekte auf zelluläre Reparaturmechanismen und Energiestoffwechsel.',
    source: 'Nature Aging',
    date: 'Vor 2 Tagen',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop',
  },
  {
    id: '2',
    title: 'Intermittierendes Fasten: Neue Erkenntnisse zu Autophagie',
    category: 'Ernährung',
    description: 'Forschung bestätigt Verbesserung der zellulären Reinigungsprozesse durch gezieltes Fasten.',
    source: 'Cell Metabolism',
    date: 'Vor 5 Tagen',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop',
  },
  {
    id: '3',
    title: 'Telomer-Länge als Biomarker für biologisches Alter',
    category: 'Genetik',
    description: 'Neue Methoden zur präzisen Messung der Telomer-Länge ermöglichen bessere Altersbestimmung.',
    source: 'Science Daily',
    date: 'Vor 1 Woche',
    thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=250&fit=crop',
  },
];

const events: Event[] = [
  {
    id: '1',
    title: 'Longevity Summit 2026',
    type: 'conference',
    date: '15.03.2026',
    time: '09:00 - 18:00',
    location: 'Berlin, Deutschland',
    description: 'Internationale Konferenz zu neuesten Erkenntnissen in der Longevity-Forschung',
    expert: 'Dr. David Sinclair',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
  },
  {
    id: '2',
    title: 'Webinar: Optimierung des Schlafes für Langlebigkeit',
    type: 'webinar',
    date: '22.02.2026',
    time: '19:00 - 20:30',
    location: 'Online',
    description: 'Praktische Tipps zur Verbesserung der Schlafqualität mit Prof. Matthew Walker',
    expert: 'Prof. Matthew Walker',
    thumbnail: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop',
  },
  {
    id: '3',
    title: 'Workshop: Personalisierte Ernährung',
    type: 'workshop',
    date: '10.03.2026',
    time: '14:00 - 17:00',
    location: 'München, Deutschland',
    description: 'Hands-on Workshop zur Erstellung individueller Ernährungspläne',
    thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=250&fit=crop',
  },
];

const experts: Expert[] = [
  {
    id: '1',
    name: 'Bryan Johnson',
    title: 'Unternehmer & Biohacker',
    expertise: ['Blueprint Protocol', 'Anti-Aging', 'Biohacking'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    latestUpdate: 'Blueprint Protocol: Neues Update zur Schlafoptimierung',
    followers: '1.2M',
    videos: 156,
  },
  {
    id: '2',
    name: 'Dr. David Sinclair',
    title: 'Professor für Genetik, Harvard Medical School',
    expertise: ['Longevity', 'NAD+', 'Epigenetik'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    latestUpdate: 'Neue Studie zu Resveratrol und Zellverjüngung',
    followers: '2.8M',
    videos: 243,
  },
  {
    id: '3',
    name: 'Dr. Mark Hyman',
    title: 'Funktionelle Medizin Experte',
    expertise: ['Funktionelle Medizin', 'Ernährung', 'Metabolismus'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    latestUpdate: 'Young Forever: Neue Erkenntnisse zur Zellgesundheit',
    followers: '1.8M',
    videos: 312,
  },
];

export default function BlackBoardPage() {
  const [activeTab, setActiveTab] = useState<'experts' | 'science' | 'events'>('experts');

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'webinar':
        return 'Webinar';
      case 'workshop':
        return 'Workshop';
      case 'conference':
        return 'Konferenz';
      case 'meetup':
        return 'Meetup';
      default:
        return 'Event';
    }
  };

  return (
    <div className="blackboard-container">
      <div className="blackboard-tabs">
        <button
          className={`blackboard-tab ${activeTab === 'experts' ? 'active' : ''}`}
          onClick={() => setActiveTab('experts')}
        >
          <i className="bi bi-star-fill"></i>
          Experts
        </button>
        <button
          className={`blackboard-tab ${activeTab === 'science' ? 'active' : ''}`}
          onClick={() => setActiveTab('science')}
        >
          <i className="bi bi-journal-medical"></i>
          Science
        </button>
        <button
          className={`blackboard-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <i className="bi bi-calendar-event"></i>
          Events
        </button>
      </div>

      <div className="blackboard-content">
        {activeTab === 'experts' && (
          <div className="watchlist-grid">
            {experts.map((expert) => (
              <div key={expert.id} className="watchlist-card expert-card-new">
                <div className="watchlist-thumbnail">
                  <img 
                    src={expert.image} 
                    alt={expert.name}
                    className="watchlist-image"
                  />
                  <div className="watchlist-overlay">
                    <button className="watchlist-play-btn">
                      <i className="bi bi-play-fill"></i>
                    </button>
                  </div>
                  <div className="watchlist-badge expert-badge">
                    <i className="bi bi-patch-check-fill"></i> Verifiziert
                  </div>
                </div>
                <div className="watchlist-content">
                  <h3>{expert.name}</h3>
                  <p className="watchlist-subtitle">{expert.title}</p>
                  <div className="expert-tags">
                    {expert.expertise.map((skill, index) => (
                      <span key={index} className="expert-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="watchlist-meta">
                    <span className="meta-item">
                      <i className="bi bi-people-fill"></i> {expert.followers}
                    </span>
                    <span className="meta-item">
                      <i className="bi bi-camera-video-fill"></i> {expert.videos} Videos
                    </span>
                  </div>
                  <div className="watchlist-update">
                    <i className="bi bi-lightning-fill"></i>
                    <span>{expert.latestUpdate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'science' && (
          <div className="watchlist-grid">
            {science.map((item) => (
              <div key={item.id} className="watchlist-card science-card">
                <div className="watchlist-thumbnail">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="watchlist-image"
                  />
                  <div className="watchlist-overlay">
                    <button className="watchlist-play-btn">
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                  <div className="watchlist-badge science-badge">
                    <i className="bi bi-journal-medical"></i> {item.category}
                  </div>
                </div>
                <div className="watchlist-content">
                  <h3>{item.title}</h3>
                  <p className="watchlist-description">{item.description}</p>
                  <div className="watchlist-footer">
                    <span className="source-tag">
                      <i className="bi bi-bookmark-fill"></i> {item.source}
                    </span>
                    <span className="date-tag">
                      <i className="bi bi-clock"></i> {item.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="watchlist-grid">
            {events.map((event) => (
              <div key={event.id} className="watchlist-card event-card-new">
                <div className="watchlist-thumbnail">
                  <img 
                    src={event.thumbnail} 
                    alt={event.title}
                    className="watchlist-image"
                  />
                  <div className="watchlist-overlay">
                    <button className="watchlist-play-btn">
                      <i className="bi bi-calendar-check"></i>
                    </button>
                  </div>
                  <div className="watchlist-badge event-badge">
                    <i className="bi bi-calendar-event"></i> {getEventTypeLabel(event.type)}
                  </div>
                </div>
                <div className="watchlist-content">
                  <h3>{event.title}</h3>
                  <p className="watchlist-description">{event.description}</p>
                  <div className="event-info">
                    <div className="event-info-item">
                      <i className="bi bi-calendar3"></i>
                      <span>{event.date}</span>
                    </div>
                    <div className="event-info-item">
                      <i className="bi bi-clock"></i>
                      <span>{event.time}</span>
                    </div>
                    <div className="event-info-item">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  {event.expert && (
                    <div className="event-speaker">
                      <i className="bi bi-mic-fill"></i>
                      <span>Speaker: {event.expert}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


