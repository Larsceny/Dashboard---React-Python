import React, { useState, useEffect } from 'react'
import SubTabs from '../Common/SubTabs'
import './SettingsTab.css'

function SettingsTab() {
  const [activeSubTab, setActiveSubTab] = useState('general')
  const [theme, setTheme] = useState('light')
  const [primaryColor, setPrimaryColor] = useState('#5b9bd5')
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false)

  // Tab theme variations state
  const [tabThemes, setTabThemes] = useState(() => {
    const saved = localStorage.getItem('tabThemes')
    return saved ? JSON.parse(saved) : {
      'medical-dashboard': 'darker',
      'medical-sleep': 'cooler',
      'medical-exercise': 'vibrant'
    }
  })

  // Custom theme creator state
  const [customThemeName, setCustomThemeName] = useState('')
  const [customPrimary, setCustomPrimary] = useState('#5b9bd5')
  const [customSecondary, setCustomSecondary] = useState('#70c1b3')
  const [customAccent, setCustomAccent] = useState('#06d6a0')
  const [customThemes, setCustomThemes] = useState(() => {
    const saved = localStorage.getItem('customThemes')
    return saved ? JSON.parse(saved) : []
  })
  const [showThemeCreator, setShowThemeCreator] = useState(false)

  const colorPresets = [
    { name: 'Blue', color: '#5b9bd5' },
    { name: 'Cyan', color: '#00F0FF' },
    { name: 'Purple', color: '#9b59d0' },
    { name: 'Green', color: '#70c1b3' },
    { name: 'Pink', color: '#ff6b9d' },
    { name: 'Orange', color: '#ffa94d' },
    { name: 'Red', color: '#ff6b6b' },
    { name: 'Teal', color: '#06d6a0' },
  ]

  const themePresets = [
    {
      name: 'Ocean Blue',
      emoji: '🌊',
      description: 'Cool blues and teals',
      colors: {
        primary: '#5b9bd5',
        secondary: '#70c1b3',
        accent: '#06d6a0',
      }
    },
    {
      name: 'Forest Green',
      emoji: '🌲',
      description: 'Natural greens',
      colors: {
        primary: '#45d619',
        secondary: '#2cd45e',
        accent: '#c8db15',
      }
    },
    {
      name: 'Sunset Glow',
      emoji: '🌅',
      description: 'Warm oranges and purples',
      colors: {
        primary: '#ff6b9d',
        secondary: '#ffa94d',
        accent: '#9b59d0',
      }
    },
    {
      name: 'Cyber Neon',
      emoji: '💫',
      description: 'Vibrant neon colors',
      colors: {
        primary: '#00F0FF',
        secondary: '#ff6b9d',
        accent: '#c8db15',
      }
    },
    {
      name: 'Royal Purple',
      emoji: '👑',
      description: 'Elegant purples',
      colors: {
        primary: '#9b59d0',
        secondary: '#ff6b9d',
        accent: '#5b9bd5',
      }
    },
    {
      name: 'Fire & Ice',
      emoji: '🔥',
      description: 'Bold reds and blues',
      colors: {
        primary: '#ff6b6b',
        secondary: '#5b9bd5',
        accent: '#ffa94d',
      }
    },
  ]

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    console.log('Theme changed to:', newTheme)
  }

  const changeColor = (color) => {
    setPrimaryColor(color)
    // Update CSS custom property
    document.documentElement.style.setProperty('--primary-color', color)
  }

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Color manipulation functions for generating variations
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  const hslToHex = (h, s, l) => {
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l - c / 2
    let r, g, b

    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }

    const toHex = (n) => {
      const hex = Math.round((n + m) * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    return '#' + toHex(r) + toHex(g) + toHex(b)
  }

  const generateVariation = (baseColors, variationType) => {
    const variations = {
      global: baseColors, // Unchanged
      darker: {
        primary: adjustColor(baseColors.primary, { lightness: -15 }),
        secondary: adjustColor(baseColors.secondary, { lightness: -15 }),
        accent: adjustColor(baseColors.accent, { lightness: -15 })
      },
      cooler: {
        primary: adjustColor(baseColors.primary, { hue: -30, saturation: -10 }),
        secondary: adjustColor(baseColors.secondary, { hue: -30, saturation: -10 }),
        accent: adjustColor(baseColors.accent, { hue: -30, saturation: -10 })
      },
      warmer: {
        primary: adjustColor(baseColors.primary, { hue: 30, saturation: 5 }),
        secondary: adjustColor(baseColors.secondary, { hue: 30, saturation: 5 }),
        accent: adjustColor(baseColors.accent, { hue: 30, saturation: 5 })
      },
      vibrant: {
        primary: adjustColor(baseColors.primary, { saturation: 20, lightness: 5 }),
        secondary: adjustColor(baseColors.secondary, { saturation: 20, lightness: 5 }),
        accent: adjustColor(baseColors.accent, { saturation: 20, lightness: 5 })
      },
      softer: {
        primary: adjustColor(baseColors.primary, { saturation: -25, lightness: 10 }),
        secondary: adjustColor(baseColors.secondary, { saturation: -25, lightness: 10 }),
        accent: adjustColor(baseColors.accent, { saturation: -25, lightness: 10 })
      }
    }
    return variations[variationType] || baseColors
  }

  const adjustColor = (hex, { hue = 0, saturation = 0, lightness = 0 }) => {
    const hsl = hexToHsl(hex)
    let newH = (hsl.h + hue) % 360
    if (newH < 0) newH += 360
    const newS = Math.max(0, Math.min(100, hsl.s + saturation))
    const newL = Math.max(0, Math.min(100, hsl.l + lightness))
    return hslToHex(newH, newS, newL)
  }

  const applyThemePreset = (preset) => {
    // Apply all colors from the preset
    document.documentElement.style.setProperty('--primary-color', preset.colors.primary)
    document.documentElement.style.setProperty('--secondary-color', preset.colors.secondary)
    document.documentElement.style.setProperty('--accent-color', preset.colors.accent)

    // Apply semi-transparent background variants
    document.documentElement.style.setProperty('--primary-bg', hexToRgba(preset.colors.primary, 0.1))
    document.documentElement.style.setProperty('--secondary-bg', hexToRgba(preset.colors.secondary, 0.1))
    document.documentElement.style.setProperty('--accent-bg', hexToRgba(preset.colors.accent, 0.1))

    // Update state
    setPrimaryColor(preset.colors.primary)

    // Save to localStorage for persistence
    localStorage.setItem('themeColors', JSON.stringify({
      primary: preset.colors.primary,
      secondary: preset.colors.secondary,
      accent: preset.colors.accent,
      presetName: preset.name
    }))

    // Trigger update event so tabs can apply their variations
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { baseColors: preset.colors }
    }))

    console.log('Applied theme preset:', preset.name)
  }

  const updateTabTheme = (tabKey, variationType) => {
    const newTabThemes = { ...tabThemes, [tabKey]: variationType }
    setTabThemes(newTabThemes)
    localStorage.setItem('tabThemes', JSON.stringify(newTabThemes))

    // Trigger event for tabs to update
    window.dispatchEvent(new CustomEvent('tabThemeChanged', {
      detail: { tabKey, variationType }
    }))
  }

  const saveCustomTheme = () => {
    if (!customThemeName.trim()) {
      alert('Please enter a theme name')
      return
    }

    const newTheme = {
      name: customThemeName,
      emoji: '🎨',
      description: 'Custom theme',
      colors: {
        primary: customPrimary,
        secondary: customSecondary,
        accent: customAccent
      },
      isCustom: true
    }

    const updatedCustomThemes = [...customThemes, newTheme]
    setCustomThemes(updatedCustomThemes)
    localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes))

    // Reset form
    setCustomThemeName('')
    setCustomPrimary('#5b9bd5')
    setCustomSecondary('#70c1b3')
    setCustomAccent('#06d6a0')
    setShowThemeCreator(false)

    alert(`Theme "${customThemeName}" saved successfully!`)
  }

  const deleteCustomTheme = (themeName) => {
    const updatedCustomThemes = customThemes.filter(t => t.name !== themeName)
    setCustomThemes(updatedCustomThemes)
    localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes))
  }

  useEffect(() => {
    // Load saved theme colors from localStorage
    const savedTheme = localStorage.getItem('themeColors')
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme)
        // Apply saved colors
        document.documentElement.style.setProperty('--primary-color', themeData.primary)
        document.documentElement.style.setProperty('--secondary-color', themeData.secondary)
        document.documentElement.style.setProperty('--accent-color', themeData.accent)
        document.documentElement.style.setProperty('--primary-bg', hexToRgba(themeData.primary, 0.1))
        document.documentElement.style.setProperty('--secondary-bg', hexToRgba(themeData.secondary, 0.1))
        document.documentElement.style.setProperty('--accent-bg', hexToRgba(themeData.accent, 0.1))
        setPrimaryColor(themeData.primary)
      } catch (e) {
        console.error('Failed to load theme colors:', e)
        // Fallback to default
        document.documentElement.style.setProperty('--primary-color', primaryColor)
      }
    } else {
      // Apply the initial color if no saved theme
      document.documentElement.style.setProperty('--primary-color', primaryColor)
    }
  }, [])

  const subTabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
  ]

  return (
    <div className="settings-container">
      <h1>⚙️ Settings</h1>

      <SubTabs tabs={subTabs} activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {/* General Tab */}
      {activeSubTab === 'general' && (
        <>
          <div className="settings-section card">
            <h3>Database Backup</h3>
            <p>Backup your dashboard data to ensure it's safe</p>
            <div className="backup-controls">
              <button className="btn btn-primary">💾 Create Backup Now</button>
              <button className="btn btn-secondary">📂 Open Backup Folder</button>
            </div>
            <p className="last-backup">Last backup: Never</p>
          </div>

          <div className="settings-section card">
            <h3>Data & Privacy</h3>
            <div className="privacy-info">
              <div className="info-item">
                <p className="info-label">🔐 Database Encryption</p>
                <p className="info-value">Enabled (AES-256)</p>
              </div>
              <div className="info-item">
                <p className="info-label">💾 Data Storage</p>
                <p className="info-value">Local (C:\Users\...\data\)</p>
              </div>
              <div className="info-item">
                <p className="info-label">🌐 Internet Required</p>
                <p className="info-value">Only for API syncing</p>
              </div>
            </div>
          </div>

          <div className="settings-section card">
            <h3>About</h3>
            <p><strong>Life Dashboard</strong> v1.0.0</p>
            <p>A personal productivity and health tracking application</p>
            <p className="tech-stack">
              Built with React, Electron, Python Flask, and SQLite
            </p>
          </div>

          <div className="danger-zone card">
            <h3>⚠️ Danger Zone</h3>
            <button className="btn btn-danger">Clear All Data</button>
            <p className="danger-warning">This action cannot be undone!</p>
          </div>
        </>
      )}

      {/* Appearance Tab */}
      {activeSubTab === 'appearance' && (
        <>
          <div className="settings-section card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <h3 style={{ margin: 0 }}>🎨 Create Custom Theme</h3>
                <p style={{ margin: '5px 0 0 0' }}>Design your own color theme from scratch</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowThemeCreator(!showThemeCreator)}
              >
                {showThemeCreator ? 'Hide Creator' : '+ New Theme'}
              </button>
            </div>

            {showThemeCreator && (
              <div className="theme-creator-form">
                <div className="form-group">
                  <label>Theme Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="My Awesome Theme"
                    value={customThemeName}
                    onChange={(e) => setCustomThemeName(e.target.value)}
                  />
                </div>

                <div className="color-pickers-grid">
                  <div className="color-picker-group">
                    <label>Primary Color</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={customPrimary}
                        onChange={(e) => setCustomPrimary(e.target.value)}
                        className="color-picker-input"
                      />
                      <input
                        type="text"
                        value={customPrimary}
                        onChange={(e) => setCustomPrimary(e.target.value)}
                        className="form-control color-hex-input"
                        placeholder="#5b9bd5"
                      />
                      <span className="color-preview" style={{ backgroundColor: customPrimary }}></span>
                    </div>
                  </div>

                  <div className="color-picker-group">
                    <label>Secondary Color</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={customSecondary}
                        onChange={(e) => setCustomSecondary(e.target.value)}
                        className="color-picker-input"
                      />
                      <input
                        type="text"
                        value={customSecondary}
                        onChange={(e) => setCustomSecondary(e.target.value)}
                        className="form-control color-hex-input"
                        placeholder="#70c1b3"
                      />
                      <span className="color-preview" style={{ backgroundColor: customSecondary }}></span>
                    </div>
                  </div>

                  <div className="color-picker-group">
                    <label>Accent Color</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={customAccent}
                        onChange={(e) => setCustomAccent(e.target.value)}
                        className="color-picker-input"
                      />
                      <input
                        type="text"
                        value={customAccent}
                        onChange={(e) => setCustomAccent(e.target.value)}
                        className="form-control color-hex-input"
                        placeholder="#06d6a0"
                      />
                      <span className="color-preview" style={{ backgroundColor: customAccent }}></span>
                    </div>
                  </div>
                </div>

                <div className="theme-preview">
                  <h4>Preview</h4>
                  <div className="preview-swatches">
                    <div className="preview-swatch" style={{ backgroundColor: customPrimary }}>
                      <span>Primary</span>
                    </div>
                    <div className="preview-swatch" style={{ backgroundColor: customSecondary }}>
                      <span>Secondary</span>
                    </div>
                    <div className="preview-swatch" style={{ backgroundColor: customAccent }}>
                      <span>Accent</span>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" onClick={saveCustomTheme} style={{ marginTop: '15px' }}>
                  💾 Save Custom Theme
                </button>
              </div>
            )}
          </div>

          <div className="settings-section card">
            <h3>🎨 Theme Presets</h3>
            <p>Choose a complete color theme with matching colors</p>

            <div className="theme-presets-grid">
              {[...customThemes, ...themePresets].map((preset) => (
                <div
                  key={preset.name}
                  className="theme-preset-card"
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  {preset.isCustom && (
                    <button
                      className="delete-theme-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (window.confirm(`Delete theme "${preset.name}"?`)) {
                          deleteCustomTheme(preset.name)
                        }
                      }}
                      title="Delete custom theme"
                    >
                      ✕
                    </button>
                  )}
                  <div onClick={() => applyThemePreset(preset)}>
                    <div className="preset-header">
                      <span className="preset-emoji">{preset.emoji}</span>
                      <h4>{preset.name}</h4>
                    </div>
                    <p className="preset-description">{preset.description}</p>
                    <div className="preset-colors">
                      <div
                        className="color-swatch"
                        style={{ backgroundColor: preset.colors.primary }}
                        title="Primary"
                      ></div>
                      <div
                        className="color-swatch"
                        style={{ backgroundColor: preset.colors.secondary }}
                        title="Secondary"
                      ></div>
                      <div
                        className="color-swatch"
                        style={{ backgroundColor: preset.colors.accent }}
                        title="Accent"
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-section card">
            <h3>🎨 Custom Color Customization</h3>
            <p>Fine-tune individual colors for advanced customization</p>

            <div className="color-presets">
              <p className="section-label">Preset Colors:</p>
              <div className="color-grid">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    className={`color-preset-btn ${primaryColor === preset.color ? 'active' : ''}`}
                    style={{ backgroundColor: preset.color }}
                    onClick={() => changeColor(preset.color)}
                    title={preset.name}
                  >
                    {primaryColor === preset.color && '✓'}
                  </button>
                ))}
              </div>
            </div>

            <div className="custom-color-picker">
              <p className="section-label">Custom Color:</p>
              <div className="color-input-group">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => changeColor(e.target.value)}
                  className="color-picker-input"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => changeColor(e.target.value)}
                  className="form-control color-hex-input"
                  placeholder="#00F0FF"
                />
                <span className="color-preview" style={{ backgroundColor: primaryColor }}></span>
              </div>
            </div>

            <p className="current-color-display">
              Current accent color: <strong>{primaryColor.toUpperCase()}</strong>
            </p>
          </div>

          <div className="settings-section card">
            <h3>Theme Settings</h3>
            <p>Current theme: <strong>{theme === 'light' ? 'Light' : 'Dark'}</strong></p>
            <div className="theme-toggle-container">
              <button
                className={`theme-toggle-btn ${theme}`}
                onClick={toggleTheme}
              >
                <span className="toggle-icon">{theme === 'light' ? '☀️' : '🌙'}</span>
                <span className="toggle-text">
                  Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                </span>
              </button>
            </div>
            <div className="theme-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === 'light'}
                  onChange={() => setTheme('light')}
                />
                <span>Light Theme</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === 'dark'}
                  onChange={() => setTheme('dark')}
                />
                <span>Dark Theme</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="theme" />
                <span>Auto (System)</span>
              </label>
            </div>
          </div>

          <div className="settings-section card">
            <h3>🎨 Tab Theme Variations</h3>
            <p>Customize color variations for individual tabs (Phase 1: Medical sub-tabs only)</p>
            <p className="help-text">Each tab can use a variation of your selected global theme. Variations are automatically generated from your chosen theme colors.</p>

            <div className="tab-themes-list">
              <div className="tab-theme-item">
                <div className="tab-theme-label">
                  <span className="tab-icon">💊</span>
                  <div>
                    <strong>Medical Dashboard</strong>
                    <p className="tab-description">Main medical overview</p>
                  </div>
                </div>
                <select
                  className="form-control"
                  value={tabThemes['medical-dashboard'] || 'darker'}
                  onChange={(e) => updateTabTheme('medical-dashboard', e.target.value)}
                >
                  <option value="global">Global (Same as main theme)</option>
                  <option value="darker">Darker (Clinical, professional)</option>
                  <option value="cooler">Cooler (Calming, restful)</option>
                  <option value="warmer">Warmer (Inviting, comfortable)</option>
                  <option value="vibrant">Vibrant (Energetic, active)</option>
                  <option value="softer">Softer (Gentle, subtle)</option>
                </select>
              </div>

              <div className="tab-theme-item">
                <div className="tab-theme-label">
                  <span className="tab-icon">😴</span>
                  <div>
                    <strong>Sleep Tracking</strong>
                    <p className="tab-description">Sleep logs and analysis</p>
                  </div>
                </div>
                <select
                  className="form-control"
                  value={tabThemes['medical-sleep'] || 'cooler'}
                  onChange={(e) => updateTabTheme('medical-sleep', e.target.value)}
                >
                  <option value="global">Global (Same as main theme)</option>
                  <option value="darker">Darker (Clinical, professional)</option>
                  <option value="cooler">Cooler (Calming, restful)</option>
                  <option value="warmer">Warmer (Inviting, comfortable)</option>
                  <option value="vibrant">Vibrant (Energetic, active)</option>
                  <option value="softer">Softer (Gentle, subtle)</option>
                </select>
              </div>

              <div className="tab-theme-item">
                <div className="tab-theme-label">
                  <span className="tab-icon">💪</span>
                  <div>
                    <strong>Exercise Tracking</strong>
                    <p className="tab-description">Workout logs and calendar</p>
                  </div>
                </div>
                <select
                  className="form-control"
                  value={tabThemes['medical-exercise'] || 'vibrant'}
                  onChange={(e) => updateTabTheme('medical-exercise', e.target.value)}
                >
                  <option value="global">Global (Same as main theme)</option>
                  <option value="darker">Darker (Clinical, professional)</option>
                  <option value="cooler">Cooler (Calming, restful)</option>
                  <option value="warmer">Warmer (Inviting, comfortable)</option>
                  <option value="vibrant">Vibrant (Energetic, active)</option>
                  <option value="softer">Softer (Gentle, subtle)</option>
                </select>
              </div>
            </div>

            <p className="help-text" style={{ marginTop: '15px', fontStyle: 'italic' }}>
              More tabs coming soon! Full tab theming will be available in Phase 3.
            </p>
          </div>
        </>
      )}

      {/* Integrations Tab */}
      {activeSubTab === 'integrations' && (
        <>
          <div className="settings-section card">
            <h3>📅 Google Calendar</h3>
            <p>Connect your Google Calendar to sync events</p>
            <div className="integration-item">
              <div className="integration-info">
                <div className="integration-status">
                  <span className={`status-indicator ${googleCalendarConnected ? 'connected' : 'disconnected'}`}>
                    {googleCalendarConnected ? '● Connected' : '○ Not Connected'}
                  </span>
                  {googleCalendarConnected && (
                    <p className="status-details">Last synced: 2 minutes ago</p>
                  )}
                </div>
              </div>
              <div className="integration-actions">
                {googleCalendarConnected ? (
                  <>
                    <button className="btn btn-secondary" onClick={() => console.log('Sync now')}>
                      🔄 Sync Now
                    </button>
                    <button className="btn btn-danger" onClick={() => setGoogleCalendarConnected(false)}>
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={() => setGoogleCalendarConnected(true)}>
                    Connect Google Calendar
                  </button>
                )}
              </div>
            </div>
            {googleCalendarConnected && (
              <div className="integration-settings">
                <h4>Sync Settings</h4>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Auto-sync every 15 minutes</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Sync past events (30 days)</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Sync future events (90 days)</span>
                </label>
              </div>
            )}
          </div>

          <div className="settings-section card">
            <h3>🎵 YouTube API</h3>
            <p>Connect YouTube to track music listening data</p>
            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your YouTube API key"
                defaultValue="••••••••••••••••"
              />
              <p className="help-text">Used to sync music listening data from YouTube</p>
            </div>
            <button className="btn btn-primary">Save API Key</button>
          </div>

          <div className="settings-section card">
            <h3>🔗 Future Integrations</h3>
            <p>More integrations coming soon...</p>
            <div className="future-integrations">
              <div className="future-integration-item">
                <span>🏥 Health Apps (Apple Health, Google Fit)</span>
                <span className="coming-soon">Coming Soon</span>
              </div>
              <div className="future-integration-item">
                <span>💼 Productivity Tools (Notion, Todoist)</span>
                <span className="coming-soon">Coming Soon</span>
              </div>
              <div className="future-integration-item">
                <span>📊 Analytics Platforms</span>
                <span className="coming-soon">Coming Soon</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SettingsTab
