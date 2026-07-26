import React from 'react';
import { FiCheckCircle, FiEdit3, FiTrash2 } from 'react-icons/fi';
import './ChatBubble.css';

function ChatBubble({ message, isMe, providerAvatar, userAvatar, onEdit, onDelete }) {
  const { id, text, timestamp, createdAt, isEdited } = message;

  const msgTimeMs = typeof id === 'string' && id.startsWith('msg_')
    ? parseInt(id.replace('msg_', ''))
    : (createdAt || Date.now());
  
  const isWithin5Mins = (Date.now() - msgTimeMs) <= 5 * 60 * 1000;

  return (
    <div className={`chat-bubble-container ${isMe ? 'msg-right' : 'msg-left'}`}>
      {!isMe && (
        <img 
          src={providerAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=100&q=80'} 
          alt="Provider" 
          className="bubble-avatar" 
        />
      )}
      <div className="chat-bubble">
        <p className="chat-msg-text">
          {text} {isEdited && <span style={{ fontSize: '10px', opacity: 0.75 }}>(edited)</span>}
        </p>
        <div className="chat-msg-meta">
          <span className="chat-msg-time">{timestamp}</span>
          {isMe && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isWithin5Mins && (
                <>
                  <button 
                    type="button"
                    onClick={() => onEdit && onEdit(id, text)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                    title="Edit message (within 5 minutes)"
                  >
                    <FiEdit3 />
                  </button>
                  <button 
                    type="button"
                    onClick={() => onDelete && onDelete(id)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                    title="Delete message (within 5 minutes)"
                  >
                    <FiTrash2 />
                  </button>
                </>
              )}
              <span className="chat-read-tick" title="Read">
                <FiCheckCircle className="tick-icon read" />
              </span>
            </div>
          )}
        </div>
      </div>
      {isMe && (
        <img 
          src={userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
          alt="You" 
          className="bubble-avatar user-avatar-bubble" 
        />
      )}
    </div>
  );
}

export default ChatBubble;
