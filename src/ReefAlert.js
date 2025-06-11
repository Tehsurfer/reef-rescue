import React from 'react'
import UrchinIcon from './icons/UrchinIcon'
import TimeIcon from './icons/TimeIcon'

const ReefAlert = ({ message, onClose }) => {

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 20000,
      background: 'rgba(0,0,0,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #b3f0ff 60%, #43e97b 100%)',
        border: '3px solid #0288d1',
        borderRadius: 18,
        boxShadow: '0 4px 24px #0288d1aa',
        padding: '32px 28px 20px 28px',
        minWidth: 260,
        maxWidth: 340,
        textAlign: 'center',
        fontFamily: '"Trebuchet MS", "Verdana", "Arial", sans-serif',
        color: '#0288d1',
        fontWeight: 700,
        fontSize: 18,
        position: 'relative'
      }}>
        <div style={{
          fontSize: 32,
          marginBottom: 10,
          color: '#ff5e8e',
          textShadow: '0 2px 8px #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}>
          {/* Show both icons inline if message is about urchin or time, else just warning */}
          {typeof message === 'string' && message.toLowerCase().includes('urchin') && (
            <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
              <UrchinIcon />
              <span style={{fontSize: 28}}>⚠️</span>
            </span>
          )}
          {typeof message === 'string' && message.toLowerCase().includes('time') && (
            <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
              <TimeIcon />
              <span style={{fontSize: 28}}>⚠️</span>
            </span>
          )}
          {/* Default: just warning icon */}
          {!(typeof message === 'string' && (message.toLowerCase().includes('urchin') || message.toLowerCase().includes('time'))) && (
            <span>⚠️</span>
          )}
        </div>
        <div style={{
          marginBottom: 18,
          color: '#0288d1',
          textShadow: '0 1px 4px #fff'
        }}>{message}</div>
        <button
          onClick={onClose}
          style={{
            background: '#fff',
            color: '#0288d1',
            border: '2px solid #43e97b',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
            padding: '6px 22px',
            cursor: 'pointer',
            boxShadow: '0 1px 4px #b3e5fc'
          }}
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default ReefAlert
