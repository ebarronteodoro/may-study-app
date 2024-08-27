import { motion } from 'framer-motion';

const WelcomeScreen = ({ onEnter, savedMethods, onLoadMethod, onDeleteMethod, theme }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className={`flex flex-col items-center justify-center min-h-screen ${
      theme === 'light'
        ? 'bg-gradient-to-br from-blue-100 via-white to-purple-100'
        : 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900'
    }`}
  >
    <h1 className="text-5xl font-bold mb-8 text-gray-800 dark:text-white">Bienvenido a tu Estudio</h1>
    <button
      onClick={onEnter}
      className="mb-8 px-8 py-3 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition-colors shadow-lg"
    >
      Nuevo Estudio
    </button>
    {savedMethods.length > 0 && (
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white text-center">Métodos Guardados</h2>
        <ul className="space-y-4">
          {savedMethods.map((method, index) => (
            <li key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => onLoadMethod(method)}
                className="flex-grow px-6 py-4 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {method.title}
              </button>
              <button
                onClick={() => onDeleteMethod(method.title)}
                className="px-4 py-4 bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Borrar
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </motion.div>
);

export default WelcomeScreen;
