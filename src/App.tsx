import { useState, useEffect } from 'react';
import { Scissors, Clock, Phone, MapPin, Sun, Moon } from 'lucide-react';
import Chat from './components/Chat';
import corteCabelloImage from './pictures/corte.jpg';
import corteBarbaImage from './pictures/corte y barba.jpg';
import barbaImage from './pictures/barba.jpg';
import portadaImage from './pictures/portada.jpg';
import aperturaImage from './pictures/apertura.jpg';

function App() {
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800 text-white dark:bg-gray-950">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Scissors className="w-8 h-8" />
            <div>
              <span className="text-2xl font-bold block">The Cutman CO.</span>
              <span className="text-sm block ml-4">Barber & Outfitters.</span>
            </div>
          </div>
          <div className="hidden md:flex space-x-4 items-center">
            <a href="#servicios" className="text-base hover:text-gray-200">Servicios</a>
            <a href="#horario" className="text-base hover:text-gray-200">Horario</a>
            <a href="#ubicacion" className="text-base hover:text-gray-200">Ubicación</a>
            <a href="#contacto" className="text-base hover:text-gray-200">Contacto</a>
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
              {theme === 'light' ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
            </button>
          </div>
          {/* Botón de tema para pantallas pequeñas */}
          <button onClick={toggleTheme} className="flex md:hidden p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 ml-auto">
            {theme === 'light' ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative h-[600px]">
        <div className="absolute inset-0">
          <img
            src={portadaImage}
            alt="Salon de belleza"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="text-white dark:text-gray-100 max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">VIVÍ TU MEJOR EXPERIENCIA EN THE CUTMAN</h1>
            <p className="text-xl mb-8">Descubrí nuestros servicios profesionales de peluquería y estética</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Nuestros Servicios</h2>
          <div className="grid md:grid-cols-3 gap-8"> {/* Grid de 3 columnas original */}
            {[
              {
                id: 'corte-cabello',
                title: 'Corte de Cabello',
                price: '$10.800,00',
                Time: 'Duración 30 minutos',
                image: corteCabelloImage
              },
              {
                id: 'corte-barba',
                title: 'Corte y Barba',
                price: '$11.300,00',
                Time: 'Duración 40 minutos',
                image: corteBarbaImage
              },
              {
                id: 'barba',
                title: 'Barba',
                price: '$5.100,00',
                Time: 'Duración 30 minutos',
                image: barbaImage
              },
            ].map((service) => (
              <div key={service.id} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                <img src={service.image} alt={service.title} className="w-full h-96 object-cover" /> {/* Aumentar altura de imagen a h-96 */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-gray-800 font-bold dark:text-gray-200">{service.price}</p>
                  <p className="text-gray-800 font-bold dark:text-gray-200">{service.Time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="horario" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Horario de Atención</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-gray-800 dark:text-gray-200 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Lunes a Sabado</p>
                    <p className="text-gray-800 dark:text-gray-200">10:00 - 20:00</p>
                  </div>
                </div>
                </div>
            </div>
            <div className="md:w-1/2">
              <img
                src={aperturaImage}
                alt="Salon interior"
                className="rounded-lg shadow-lg h-[72%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="ubicacion" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Ubicación</h2>
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3287.139798987948!2d-58.74957972405424!3d-34.49445997297992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca0a4147f9cf%3A0xca5a0895a488c57d!2sAv.%20Italia%204950%2C%20B1622%20Dique%20Luj%C3%A1n%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1708439329948!5m2!1ses-419!2sar"
                width="100%"
                height="300"
                style={{ border:0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
                title="Google Maps Location"
              ></iframe>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-center space-y-6 md:space-y-0 md:space-x-12 mt-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-8 h-8 text-gray-800 dark:text-gray-200" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Dirección</p>
                  <p className="text-gray-800 dark:text-gray-200">Av. Italia 4950, B1622</p>
                  <p className="text-gray-800 dark:text-gray-200">Dique Luján, Provincia de Buenos</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="w-8 h-8 text-gray-800 dark:text-gray-200" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Teléfono</p>
                  <p className="text-gray-800 dark:text-gray-200">+549 11 6225-8491</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-gray-800 text-white dark:bg-gray-950 py-6"> {/* Reduce padding vertical */}
        <div className="container mx-auto px-6 text-center justify-center"> {/* Centrar contenido horizontalmente */}
          <div className="mt-8">
            <p>© {currentYear} The Cutman Co. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Chat Component */}
      <Chat />
    </div>
  );
}

export default App;
