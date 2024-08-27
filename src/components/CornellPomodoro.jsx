import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const CornellPomodoro = ({ initialTitle, initialNotes, initialTimers, onSave, onExit }) => {
  const [title, setTitle] = useState(initialTitle);
  const [notes, setNotes] = useState(initialNotes || { ideas: '', content: '', summary: '' });
  const [timers, setTimers] = useState(initialTimers || [
    { id: 1, name: 'Pomodoro', time: 25 * 60, isActive: false }
  ]);
  const [showNotes, setShowNotes] = useState(true);
  const [theme, setTheme] = useState('light');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const intervals = timers.map(timer => {
      if (timer.isActive && timer.time > 0) {
        return setInterval(() => {
          setTimers(prevTimers =>
            prevTimers.map(t =>
              t.id === timer.id ? { ...t, time: t.time - 1 } : t
            )
          );
        }, 1000);
      }
      return null;
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [timers]);

  useEffect(() => {
    timers.forEach(timer => {
      if (timer.time === 0 && timer.isActive) {
        alert(`¡Tiempo terminado para ${timer.name}!`);
        setTimers(prevTimers =>
          prevTimers.map(t =>
            t.id === timer.id ? { ...t, isActive: false } : t
          )
        );
      }
    });
  }, [timers]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotes(prev => ({ ...prev, [name]: value }));
  };

  const toggleTimer = (id) => {
    setTimers(prevTimers =>
      prevTimers.map(t =>
        t.id === id ? { ...t, isActive: !t.isActive } : t
      )
    );
  };

  const resetTimer = (id) => {
    setTimers(prevTimers =>
      prevTimers.map(t =>
        t.id === id ? { ...t, time: 25 * 60, isActive: false } : t
      )
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const addTimer = () => {
    const newId = Math.max(...timers.map(t => t.id)) + 1;
    setTimers([...timers, { id: newId, name: `Timer ${newId}`, time: 25 * 60, isActive: false }]);
  };

  const updateTimerName = (id, newName) => {
    setTimers(prevTimers =>
      prevTimers.map(t =>
        t.id === id ? { ...t, name: newName } : t
      )
    );
  };

  const updateTimerTime = (id, newTime) => {
    setTimers(prevTimers =>
      prevTimers.map(t =>
        t.id === id ? { ...t, time: newTime * 60 } : t
      )
    );
  };

  const handleSave = () => {
    onSave({ title, notes, timers });
    setSaveMessage('Método guardado con éxito');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        : 'bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900'
    }`}>
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 text-gray-800 dark:text-white"
          />
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Guardar
            </button>
            <button
              onClick={onExit}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Salir
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>

        {saveMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {saveMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            className={`flex-1 ${showNotes ? '' : 'hidden md:block'}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-3 gap-4">
              <textarea
                name="ideas"
                value={notes.ideas}
                onChange={handleInputChange}
                placeholder="Ideas clave"
                className="col-span-1 h-64 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none text-gray-800 dark:text-white"
              />
              <textarea
                name="content"
                value={notes.content}
                onChange={handleInputChange}
                placeholder="Apuntes o notas de clase"
                className="col-span-2 h-64 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none text-gray-800 dark:text-white"
              />
            </div>
            <textarea
              name="summary"
              value={notes.summary}
              onChange={handleInputChange}
              placeholder="Resumen"
              className="w-full h-24 mt-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none text-gray-800 dark:text-white"
            />
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              {timers.map(timer => (
                <div key={timer.id} className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={timer.name}
                    onChange={(e) => updateTimerName(timer.id, e.target.value)}
                    className="text-2xl font-bold mb-2 w-full bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 text-gray-800 dark:text-white"
                  />
                  <div className="flex items-center mb-4">
                    <input
                      type="number"
                      value={Math.floor(timer.time / 60)}
                      onChange={(e) => updateTimerTime(timer.id, e.target.value)}
                      className="w-16 p-1 mr-2 text-center bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-white"
                    />
                    <span className="text-4xl font-bold text-gray-800 dark:text-white">{formatTime(timer.time)}</span>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => toggleTimer(timer.id)}
                      className={`px-6 py-2 rounded-full text-white transition-colors ${
                        timer.isActive
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {timer.isActive ? 'Pausar' : 'Iniciar'}
                    </button>
                    <button
                      onClick={() => resetTimer(timer.id)}
                      className="px-6 py-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-white"
                    >
                      Reiniciar
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addTimer}
                className="w-full px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                Agregar Cronómetro
              </button>
            </div>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="md:hidden mt-4 px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              {showNotes ? 'Ocultar Notas' : 'Mostrar Notas'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function CornellPomodoroApp() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [savedMethods, setSavedMethods] = useState([]);
  const [currentMethod, setCurrentMethod] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('savedMethods');
    if (saved) {
      setSavedMethods(JSON.parse(saved));
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleEnter = () => {
    setCurrentMethod({ title: 'Nuevo Método Cornell con Pomodoro', notes: {}, timers: [] });
    setShowWelcome(false);
  };

  const handleLoadMethod = (method) => {
    setCurrentMethod(method);
    setShowWelcome(false);
  };

  const handleSave = (method) => {
    const updatedMethods = [...savedMethods.filter(m => m.title !== method.title), method];
    setSavedMethods(updatedMethods);
    localStorage.setItem('savedMethods', JSON.stringify(updatedMethods));
  };

  const handleDeleteMethod = (title) => {
    const updatedMethods = save
dMethods.filter(m => m.title !== title);
    setSavedMethods(updatedMethods);
    localStorage.setItem('savedMethods', JSON.stringify(updatedMethods));
  };

  const handleExit = () => {
    setShowWelcome(true);
    setCurrentMethod(null);
  };

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return (
    <AnimatePresence mode="wait">
      {showWelcome ? (
        <WelcomeScreen
          key="welcome"
          onEnter={handleEnter}
          savedMethods={savedMethods}
          onLoadMethod={handleLoadMethod}
          onDeleteMethod={handleDeleteMethod}
          theme={theme}
        />
      ) : (
        <CornellPomodoro
          key="cornell-pomodoro"
          initialTitle={currentMethod.title}
          initialNotes={currentMethod.notes}
          initialTimers={currentMethod.timers}
          onSave={handleSave}
          onExit={handleExit}
        />
      )}
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </AnimatePresence>
  );
}