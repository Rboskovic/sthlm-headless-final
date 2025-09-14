import {Facebook, Instagram, Youtube} from 'lucide-react';

interface SocialMediaProps {
  isMobile?: boolean;
}

export function SocialMedia({isMobile = false}: SocialMediaProps) {
  const socialLinks = [
    {name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@klosslabbet'},
    {name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/klosslabbet/'},
    {name: 'Facebook', icon: Facebook, url: '#'},
  ];

  return (
    <div className={`${isMobile ? 'mt-2' : ''}`}>
      <div className={`flex ${isMobile ? 'justify-start' : 'justify-center'} gap-3`}>
        {socialLinks.map((social) => {
          const IconComponent = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target={social.url !== '#' ? '_blank' : undefined}
              rel={social.url !== '#' ? 'noopener noreferrer' : undefined}
              className="transition-all duration-200 hover:scale-110"
              aria-label={social.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '48px' : '40px',
                height: isMobile ? '48px' : '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                const element = e.target as HTMLElement;
                element.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                element.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                const element = e.target as HTMLElement;
                element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                element.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              <IconComponent 
                size={isMobile ? 24 : 20} 
                className="text-white" 
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}