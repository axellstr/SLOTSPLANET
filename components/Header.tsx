import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  RiTwitchLine, 
  RiTelegramLine, 
  RiInstagramLine, 
  RiYoutubeLine, 
  RiDiscordLine, 
  RiHeadphoneLine, 
  RiMailLine,
  RiMenuLine
} from '@remixicon/react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationLinks = [
    {
      href: 'https://www.twitch.tv',
      label: 'Twitch',
      isExternal: true,
      hasStatus: true,
      icon: RiTwitchLine
    },
    {
      href: 'https://t.me',
      label: 'Telegram',
      isExternal: true,
      icon: RiTelegramLine
    },
    {
      href: 'https://instagram.com',
      label: 'Instagram',
      isExternal: true,
      icon: RiInstagramLine
    },
    {
      href: 'https://youtube.com',
      label: 'YouTube',
      isExternal: true,
      icon: RiYoutubeLine
    },
    {
      href: 'https://discord.com',
      label: 'Discord',
      isExternal: true,
      icon: RiDiscordLine
    },
    {
      href: '/support',
      label: 'Support',
      isExternal: false,
      icon: RiHeadphoneLine
    },
    {
      href: '/contact',
      label: 'Contact',
      isExternal: false,
      icon: RiMailLine
    },
    {
      href: 'https://urbanvpn.com',
      label: 'UrbanVPN',
      isExternal: true,
      isImageOnly: true
    }
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div id="menuToggle">
        <button onClick={toggleMenu} aria-label="Toggle menu">
          <RiMenuLine size={20} className="menu-icon" />
        </button>
      </div>

      {/* Header */}
      <header className={isMenuOpen ? 'mobile-open' : ''}>
        {/* Logo Section */}
        <div className="logo">
          <Link href="/">
            <Image 
              src="/Assets/LogoPNG.png" 
              alt="Slots Planet Logo" 
              width={200} 
              height={80}
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav>
          {navigationLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              target={link.isExternal ? '_blank' : '_self'}
              rel={link.isExternal ? 'noopener noreferrer' : undefined}
              className="nav-link"
            >
              <div className="nav-link-content">
                {link.isImageOnly ? (
                  <Image 
                    src="/Assets/uvpn.svg" 
                    alt="UrbanVPN" 
                    width={120}
                    height={24}
                    className="nav-image"
                  />
                ) : (
                  <>
                    {link.icon && <link.icon size={18} className="nav-icon" />}
                    <span>{link.label}</span>
                    {link.hasStatus && <div className="status-indicator" />}
                  </>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
};

export default Header; 
