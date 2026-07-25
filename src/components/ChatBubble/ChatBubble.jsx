import React from 'react';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';
import './ChatBubble.css';

function ChatBubble({ message, isMe, providerAvatar, userAvatar }) {
  const { text, timestamp } = message;

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
        <p className="chat-msg-text">{text}</p>
        <div className="chat-msg-meta">
          <span className="chat-msg-time">{timestamp}</span>
          {isMe && (
            <span className="chat-read-tick" title="Read">
              <FiCheckCircle className="tick-icon read" />
            </span>
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
