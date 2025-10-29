import { Facebook, Instagram } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Story', href: '#about' },

    ],
    shop: [
      { label: 'Best Sellers', href: '#bestsellers' },
      { label: 'New Arrivals', href: '#newarrivals' },
    
    ],
    support: [
      { label: 'Contact Us', href: '#contact' },
  
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/le__tick_?igsh=MWtuNXo1czZ2NmZ2ag==', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/share/1Dfv7VwhUB/?mibextid=wwXIfr', label: 'Facebook' },
    { icon: SiTiktok, href: 'https://www.tiktok.com/@le__tick_?_t=ZS-90pHSRKEqgR&_r=1', label: 'TikTok' },
  ];

  return (
    <footer className="bg-radial-bw border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4" data-testid="text-footer-brand">LE TICK</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Crafting exceptional timepieces for those who appreciate true quality and elegance.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  className="bg-muted p-2 rounded-md hover-elevate active-elevate-2"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                   
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm" data-testid="text-footer-copyright">
            © {currentYear} LE TICK Watches. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
