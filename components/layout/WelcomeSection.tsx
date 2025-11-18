'use client';

import Image from 'next/image';

export default function WelcomeSection() {
  return (
    <div className="welcome-section">
      <div className="profile-section">
        <div className="profile-image">
          <Image
            src="/images/profilepic.png"
            alt="María's Profile"
            width={80}
            height={80}
            className="rounded-full"
            style={{ objectFit: 'cover', boxShadow: '0 4px 12px rgba(68, 152, 202, 0.2)' }}
          />
        </div>
      </div>
    </div>
  );
}

