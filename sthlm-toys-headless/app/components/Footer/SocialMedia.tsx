import {Facebook, Instagram, Youtube} from 'lucide-react';

interface SocialMediaProps {
  isMobile?: boolean;
}

export function SocialMedia({isMobile = false}: SocialMediaProps) {
  const socialLinks = [
    {name: 'YouTube', icon: Youtube, url: '#'},
    {name: 'Instagram', icon: Instagram, url: '#'},
    {name: 'Facebook', icon: Facebook, url: '#'},
  ];

  return (
    <div className={`flex ${isMobile ? 'justify-center' : ''} gap-4`}>
      {socialLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            className="text-white hover:text-yellow-300 transition-colors"
            aria-label={social.name}
          >
            <IconComponent size={24} className="text-white" />
          </a>
        );
      })}
    </div>
  );
}
