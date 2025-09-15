import {SiYoutube, SiInstagram, SiFacebook, SiTiktok} from 'react-icons/si';

interface SocialMediaProps {
  isMobile?: boolean;
}

export function SocialMedia({isMobile = false}: SocialMediaProps) {
  const socialLinks = [
    {name: 'YouTube', icon: SiYoutube, url: 'https://www.youtube.com/@klosslabbet'},
    {name: 'Instagram', icon: SiInstagram, url: 'https://www.instagram.com/klosslabbet.se/'},
    {name: 'Facebook', icon: SiFacebook, url: 'https://www.facebook.com/profile.php?id=61573161414339'},
    {name: 'TikTok', icon: SiTiktok, url: 'http://www.tiktok.com/@klosslabbet'},
  ];

  // Responsive border radius: square on very small screens, rounded on mobile, circular on desktop
  const getBorderRadius = () => {
    if (!isMobile) return '50%'; // Desktop: circular
    if (typeof window !== 'undefined' && window.innerWidth <= 375) {
      return '0px'; // Very small screens (iPhone SE): completely square
    }
    return '8px'; // Regular mobile: rounded
  };

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
                width: isMobile ? '40px' : '40px',
                height: isMobile ? '40px' : '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: getBorderRadius(),
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
                size={isMobile ? 20 : 20} 
                color="white"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}