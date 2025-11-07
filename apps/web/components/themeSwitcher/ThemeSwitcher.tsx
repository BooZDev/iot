import { useEffect, useState } from 'react';
import { Switch, Tooltip } from '@heroui/react';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa6';


export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Tooltip
      content={`Switch to ${isDark ? "light" : "dark"} mode`}
      placement="bottom"
    >
      <div className="flex items-center gap-2">
        <FaSun className={`text-default-500 ${!isDark && "text-warning"}`} />
        <Switch
          isSelected={isDark}
          onValueChange={handleToggle}
          size="sm"
          color="primary"
          className="mx-1"
        />
        <FaMoon className={`text-default-500 ${isDark && "text-primary"}`} />
      </div>
    </Tooltip>
  );
};