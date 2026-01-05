import React from 'react'
import './SubTabs.css'

function SubTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="sub-tabs-container">
      <div className="sub-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`sub-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className="sub-tab-icon">{tab.icon}</span>}
            <span className="sub-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SubTabs
