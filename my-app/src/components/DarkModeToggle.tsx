import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import "./DarkModeToggle.css";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    const enable = !isDark;
    root.classList.toggle('dark', enable);
    localStorage.setItem('theme', enable ? 'dark' : 'light');
    setIsDark(enable);
  };

  return (
    <button onClick={toggleDarkMode} className='toggle-button'>
      {isDark ? <SunIcon></SunIcon> : <MoonIcon></MoonIcon>}
    </button>
  );
}