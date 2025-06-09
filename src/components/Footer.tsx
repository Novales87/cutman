import React from 'react';

interface FooterProps {
  currentYear: number;
}

const Footer: React.FC<FooterProps> = ({ currentYear }) => {
  return (
    <footer id="contacto" className="bg-gray-800 text-white dark:bg-gray-950 py-6">
      <div className="container mx-auto px-6 text-center justify-center">
        <div className="mt-8">
          <p>© {currentYear} The Cutman Co. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
