import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { HexColorPicker } from 'react-colorful';

export const ColorThemeSelector = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [editingColor, setEditingColor] = useState(null);

  const handleColorChange = (color) => {
    setTheme(prev => ({
      ...prev,
      [editingColor]: color
    }));
  };

  return (
    <div className="theme-selector">
      <h3>Customize Theme</h3>
      <div className="theme-colors">
        {Object.entries(theme).map(([key, value]) => (
          <div key={key} className="color-option">
            <button
              className="color-swatch"
              style={{ backgroundColor: value }}
              onClick={() => setEditingColor(key)}
            />
            <span>{key}</span>
          </div>
        ))}
      </div>
      
      {editingColor && (
        <div className="color-picker">
          <HexColorPicker color={theme[editingColor]} onChange={handleColorChange} />
          <button onClick={() => setEditingColor(null)}>Done</button>
        </div>
      )}
    </div>
  );
};