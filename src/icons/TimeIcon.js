import React from 'react'

const TimeIcon = (props) => (
  <svg width="38" height="38" viewBox="0 0 38 38" style={{display: 'block', margin: '0 auto 8px auto'}} {...props}>
    <circle cx="19" cy="19" r="15" fill="#b3f0ff" stroke="#0288d1" strokeWidth="2"/>
    <circle cx="19" cy="19" r="12" fill="#fff" stroke="#0288d1" strokeWidth="1"/>
    <rect x="18.2" y="10" width="1.6" height="9" rx="0.8" fill="#0288d1"/>
    <rect x="19" y="19" width="7" height="1.6" rx="0.8" fill="#0288d1" transform="rotate(30 19 19)"/>
    <circle cx="19" cy="19" r="2" fill="#0288d1"/>
  </svg>
)

export default TimeIcon
