'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Trend {
  id: string;
  title: string;
  category: string;
  description: string;
  source: string;
  date: string;
  icon: string;
  color: string;
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
}

interface Expert {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  image?: string;
  latestUpdate: string;
  status: 'active' | 'recent';
}

const trends: Trend[] = [
  {
    id: '1',
    title: 'NAD+ Supplementierung zeigt vielversprechende Ergebnisse',
    category: 'Longevity',
    description: 'Neue Studien zeigen positive Effekte auf zelluläre Reparaturmechanismen',
    source: 'Nature Aging',
    date: 'Vor 2 Tagen',
    icon: 'bi-graph-up-arrow',
    color: '#4498ca',
  },
  {
    id: '2',
    title: 'Intermittierendes Fasten: Neue Erkenntnisse zu Autophagie',
    category: 'Ernährung',
    description: 'Forschung bestätigt Verbesserung der zellulären Reinigungsprozesse',
    source: 'Cell Metabolism',
    date: 'Vor 5 Tagen',
    icon: 'bi-clock-history',
    color: '#2e6ca3',
  },
  {
    id: '3',
    title: 'KI-gestützte Biomarker-Analyse revolutioniert Prävention',
    category: 'Technologie',
    description: 'Machine Learning ermöglicht präzisere Vorhersage von Gesundheitsrisiken',
    source: 'Science Daily',
    date: 'Vor 1 Woche',
    icon: 'bi-cpu',
    color: '#5aafde',
  },
];

const events: Event[] = [
  {
    id: '1',
    title: 'Longevity Summit 2024',
    type: 'conference',
    date: '15.03.2024',
    time: '09:00 - 18:00',
    location: 'Berlin, Deutschland',
    description: 'Internationale Konferenz zu neuesten Erkenntnissen in der Longevity-Forschung',
    expert: 'Dr. David Sinclair',
  },
  {
    id: '2',
    title: 'Webinar: Optimierung des Schlafes für Langlebigkeit',
    type: 'webinar',
    date: '22.02.2024',
    time: '19:00 - 20:30',
    location: 'Online',
    description: 'Praktische Tipps zur Verbesserung der Schlafqualität',
    expert: 'Prof. Matthew Walker',
  },
  {
    id: '3',
    title: 'Workshop: Personalisierte Ernährung',
    type: 'workshop',
    date: '10.03.2024',
    time: '14:00 - 17:00',
    location: 'München, Deutschland',
    description: 'Hands-on Workshop zur Erstellung individueller Ernährungspläne',
  },
];

const experts: Expert[] = [
  {
    id: '1',
    name: 'Dr. David Sinclair',
    title: 'Professor für Genetik, Harvard Medical School',
    expertise: ['Longevity', 'NAD+', 'Epigenetik'],
    latestUpdate: 'Neue Studie zu Resveratrol veröffentlicht',
    status: 'active',
  },
  {
    id: '2',
    name: 'Prof. Rhonda Patrick',
    title: 'Biochemikerin & Wissenschaftskommunikatorin',
    expertise: ['Mikronährstoffe', 'Omega-3', 'Vitamin D'],
    latestUpdate: 'Podcast zu Omega-3 Fettsäuren',
    status: 'recent',
  },
  {
    id: '3',
    name: 'Dr. Peter Attia',
    title: 'Arzt & Longevity-Experte',
    expertise: ['Metabolismus', 'Krafttraining', 'Prävention'],
    latestUpdate: 'Neue Erkenntnisse zu Zone 2 Training',
    status: 'active',
  },
];

export default function BlackBoardPage() {
  const [activeTab, setActiveTab] = useState<'trends' | 'events' | 'experts'>('trends');

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'webinar':
        return 'bi-camera-video';
      case 'workshop':
        return 'bi-tools';
      case 'conference':
        return 'bi-people';
      case 'meetup':
        return 'bi-calendar-event';
      default:
        return 'bi-calendar';
    }
  };

  return (
    <div className="blackboard-container">
      <div className="blackboard-header">
        <h1>Black Board</h1>
        <p>Trends, Veranstaltungen und Expert Watchlist - Bleib auf dem Laufenden</p>
      </div>

      <div className="blackboard-tabs">
        <button
          className={`blackboard-tab ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          <i className="bi bi-graph-up-arrow"></i>
          Trends
        </button>
        <button
          className={`blackboard-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <i className="bi bi-calendar-event"></i>
          Veranstaltungen
        </button>
        <button
          className={`blackboard-tab ${activeTab === 'experts' ? 'active' : ''}`}
          onClick={() => setActiveTab('experts')}
        >
          <i className="bi bi-person-badge"></i>
          Expert Watchlist
        </button>
      </div>

      <div className="blackboard-content">
        {activeTab === 'trends' && (
          <div className="trends-grid">
            {trends.map((trend) => (
              <div key={trend.id} className="trend-card">
                <div className="trend-header">
                  <div className="trend-icon" style={{ background: trend.color }}>
                    <i className={`bi ${trend.icon}`}></i>
                  </div>
                  <div className="trend-category">{trend.category}</div>
                </div>
                <h3>{trend.title}</h3>
                <p>{trend.description}</p>
                <div className="trend-footer">
                  <span className="trend-source">{trend.source}</span>
                  <span className="trend-date">{trend.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <div className="event-icon">
                    <i className={`bi ${getEventIcon(event.type)}`}></i>
                  </div>
                  <div className="event-type">{event.type}</div>
                </div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div className="event-details">
                  <div className="event-detail-item">
                    <i className="bi bi-calendar"></i>
                    <span>{event.date}</span>
                  </div>
                  <div className="event-detail-item">
                    <i className="bi bi-clock"></i>
                    <span>{event.time}</span>
                  </div>
                  <div className="event-detail-item">
                    <i className="bi bi-geo-alt"></i>
                    <span>{event.location}</span>
                  </div>
                  {event.expert && (
                    <div className="event-detail-item">
                      <i className="bi bi-person"></i>
                      <span>{event.expert}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'experts' && (
          <div className="experts-grid">
            {experts.map((expert) => (
              <div key={expert.id} className={`expert-card ${expert.status}`}>
                <div className="expert-header">
                  <div className="expert-avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="expert-status-badge">{expert.status === 'active' ? 'Aktiv' : 'Kürzlich'}</div>
                </div>
                <h3>{expert.name}</h3>
                <p className="expert-title">{expert.title}</p>
                <div className="expert-expertise">
                  {expert.expertise.map((skill, index) => (
                    <span key={index} className="expertise-tag">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="expert-update">
                  <i className="bi bi-clock-history"></i>
                  <span>{expert.latestUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


