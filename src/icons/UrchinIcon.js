import React from 'react'

const UrchinIcon = (props) => (
  <svg width="38" height="38" viewBox="0 0 38 38" style={{display: 'block', margin: '0 auto 0 auto'}} {...props}>
    <g>
      <circle cx="19" cy="19" r="8" fill="#7e57c2" stroke="#4527a0" strokeWidth="2"/>
      <g stroke="#4527a0" strokeWidth="2" strokeLinecap="round">
        <line x1="19" y1="2" x2="19" y2="10"/>
        <line x1="19" y1="28" x2="19" y2="36"/>
        <line x1="2" y1="19" x2="10" y2="19"/>
        <line x1="28" y1="19" x2="36" y2="19"/>
        <line x1="7" y1="7" x2="13" y2="13"/>
        <line x1="31" y1="7" x2="25" y2="13"/>
        <line x1="7" y1="31" x2="13" y2="25"/>
        <line x1="31" y1="31" x2="25" y2="25"/>
      </g>
      <ellipse cx="17" cy="19" rx="1.1" ry="1.5" fill="#fff"/>
      <ellipse cx="21" cy="19" rx="1.1" ry="1.5" fill="#fff"/>
      <ellipse cx="17" cy="19.5" rx="0.4" ry="0.6" fill="#222"/>
      <ellipse cx="21" cy="19.5" rx="0.4" ry="0.6" fill="#222"/>
      <path d="M17 23 Q19 24 21 23" stroke="#fff" strokeWidth="1" fill="none"/>
    </g>
  </svg>
)

export default UrchinIcon
