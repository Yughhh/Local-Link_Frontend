import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiSend,
  FiSmile,
  FiPhone,
  FiCalendar,
  FiUser,
  FiPaperclip,
  FiMapPin,
  FiShield,
  FiCheckCircle,
  FiSearch,
  FiZap,
  FiDroplet,
  FiScissors,
  FiWind,
  FiCode,
  FiBookOpen
} from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import ChatBubble from '../../components/ChatBubble/ChatBubble';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { 
  workers, 
  getNetworkWorkers, 
  getPersistentChatMessages, 
  savePersistentChatMessage,
  editPersistentChatMessage,
  deletePersistentChatMessage 
} from '../../data/dummyData';
import { messageAPI, workerAPI } from '../../utils/api';
import defaultAvatarImg from '../../assets/images/NoProfilePicture.png';
import './Chat.css';

const popularEmojis = ["😊", "👍", "🙌", "👋", "💡", "🛠️", "📅", "💯", "🙏", "⚡", "🔧", "⭐"];

const quickPrompts = [
  { label: "📅 Can you visit today at 4 PM?", text: "Hi, can you visit my location today around 4:00 PM for the service?" },
  { label: "💰 What is the estimated cost?", text: "Could you please provide an estimated cost for this service?" },
  { label: "📍 Sending my exact location", text: "I'm located in Alambagh Market, Lucknow. How quickly can you reach?" },
  { label: "⚡ Emergency repair needed", text: "This is an urgent requirement. Are you available for immediate dispatch?" },
];

function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // All workers from local + custom/created profiles
  const allNetworkWorkers = getNetworkWorkers();

  // Resolve the current worker by matching the route :id against both id and _id fields
  const findWorkerById = (targetId) => {
    return allNetworkWorkers.find(w =>
      String(w.id) === String(targetId) ||
      String(w._id) === String(targetId)
    );
  };

  const [currentWorker, setCurrentWorker] = useState(() => findWorkerById(id) || null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const messagesEndRef = useRef(null);

  // Filter sidebar workers using full network list
  const filteredWorkers = allNetworkWorkers.filter(w =>
    w.name.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
    w.profession.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  // Resolve current worker: first try local data, then fetch from backend API
  useEffect(() => {
    const localMatch = findWorkerById(id);
    if (localMatch) {
      setCurrentWorker(localMatch);
      return;
    }

    // Worker not found locally — fetch from backend API by id
    const fetchWorkerFromAPI = async () => {
      try {
        const res = await workerAPI.getById(id);
        if (res.data?.worker) {
          setCurrentWorker(res.data.worker);
          return;
        }
      } catch (err) {
        console.log('Worker API lookup failed for chat, using fallback');
      }
      // Final fallback: use first worker only if nothing else matched
      setCurrentWorker(allNetworkWorkers[0] || workers[0]);
    };

    fetchWorkerFromAPI();
  }, [id]);

  // Load chat messages once currentWorker is resolved (Initially empty by default unless saved)
  useEffect(() => {
    if (!currentWorker) return;

    const fetchChatHistory = async () => {
      const workerKey = currentWorker._id || currentWorker.id;
      try {
        const res = await messageAPI.getMessages(workerKey);
        if (res.data?.messages?.length) {
          const formatted = res.data.messages.map(m => ({
            id: m._id,
            createdAt: new Date(m.createdAt).getTime(),
            sender: String(m.sender) === String(user?._id) ? 'user' : 'worker',
            text: m.text,
            timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
          setMessages(formatted);
          return;
        }
      } catch (err) {
        console.log('Using local/persistent chat storage');
      }

      const persistent = getPersistentChatMessages(currentWorker.id) || 
                         getPersistentChatMessages(currentWorker._id) || 
                         getPersistentChatMessages(currentWorker.name);
      setMessages(persistent || []);
    };

    fetchChatHistory();
  }, [currentWorker, user]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachmentPreview) return;

    const currentText = inputText.trim();
    const msgCreatedAt = Date.now();
    const msgId = 'msg_' + msgCreatedAt;

    const userMessage = {
      id: msgId,
      createdAt: msgCreatedAt,
      sender: 'user',
      text: attachmentPreview ? `[Photo Attachment] ${currentText}` : currentText,
      timestamp: new Date(msgCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setShowEmojis(false);
    setAttachmentPreview(null);

    const workerKey = currentWorker._id || currentWorker.id;
    savePersistentChatMessage(workerKey, userMessage);
    savePersistentChatMessage(currentWorker.id, userMessage);
    savePersistentChatMessage(currentWorker.name, userMessage);

    try {
      await messageAPI.sendMessage({
        receiverId: currentWorker._id || currentWorker.id,
        text: currentText,
        workerId: currentWorker._id || currentWorker.id,
      });
    } catch (err) {
      console.log('Saved message locally');
    }

    // Provider typing response simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyTime = Date.now();
      const workerResponse = {
        id: 'msg_' + replyTime,
        createdAt: replyTime,
        sender: 'worker',
        text: getCustomReply(currentWorker, currentText),
        timestamp: new Date(replyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, workerResponse]);
      savePersistentChatMessage(workerKey, workerResponse);
      savePersistentChatMessage(currentWorker.id, workerResponse);
      savePersistentChatMessage(currentWorker.name, workerResponse);
    }, 1400);
  };

  const handleEditMessage = async (msgId, currentText) => {
    const newText = window.prompt("Edit your message (Sent within 5 minutes):", currentText);
    if (!newText || !newText.trim() || newText === currentText) return;

    try {
      await messageAPI.editMessage(msgId, newText.trim());
    } catch (err) {
      console.log('Edited message locally');
    }

    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: newText.trim(), isEdited: true } : m));
    if (currentWorker) {
      editPersistentChatMessage(currentWorker.id, msgId, newText.trim());
      editPersistentChatMessage(currentWorker._id, msgId, newText.trim());
      editPersistentChatMessage(currentWorker.name, msgId, newText.trim());
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Delete this message? (Sent within 5 minutes)")) return;

    try {
      await messageAPI.deleteMessage(msgId);
    } catch (err) {
      console.log('Deleted message locally');
    }

    setMessages(prev => prev.filter(m => m.id !== msgId));
    if (currentWorker) {
      deletePersistentChatMessage(currentWorker.id, msgId);
      deletePersistentChatMessage(currentWorker._id, msgId);
      deletePersistentChatMessage(currentWorker.name, msgId);
    }
  };

  const getCustomReply = (workerObj, query) => {
    const q = query.toLowerCase();
    if (q.includes('schedule') || q.includes('visit') || q.includes('4 pm') || q.includes('today') || q.includes('time')) {
      return `Sure! I can visit your location around that time. Please use the 'Book Appointment' button on my profile page to lock your time slot.`;
    }
    if (q.includes('cost') || q.includes('price') || q.includes('estimate') || q.includes('charge')) {
      return `My base consultation rate is ${workerObj.pricePerHour || '₹399'}. For custom work, I can inspect the site and provide a final transparent estimate.`;
    }
    if (q.includes('urgent') || q.includes('emergency')) {
      return `I handle emergency requests! I'm located near ${workerObj.area || 'your neighborhood'} (${workerObj.distance || '1.2 km'}) and can reach you in under 20 mins.`;
    }
    return `Thanks for reaching out! I've received your note and can get started promptly. Feel free to call me directly if it's urgent!`;
  };

  const handleQuickPromptClick = (promptText) => {
    setInputText(promptText);
  };

  const handleEmojiClick = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  const handleSimulateAttachment = () => {
    setAttachmentPreview("service_site_photo.jpg");
  };

  // Show loading state while worker is being resolved from API
  if (!currentWorker) {
    return (
      <div className="chat-page-wrapper">
        <Navbar />
        <main className="chat-main-content container">
          <div className="chat-app-card glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Loading chat...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="chat-page-wrapper">
      <Navbar />

      <main className="chat-main-content container">
        <div className="chat-app-card glass">

          {/* ── Left Sidebar: Provider Conversations List ── */}
          <aside className="chat-sidebar">
            <div className="sidebar-header">
              <h3>Local Conversations</h3>
              <div className="sidebar-search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search providers..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="providers-list-scroll">
              {filteredWorkers.map((w) => {
                const wKey = String(w._id || w.id);
                const currentKey = String(currentWorker._id || currentWorker.id);
                const isActive = wKey === currentKey;
                return (
                  <button
                    key={w._id || w.id}
                    className={`sidebar-provider-item ${isActive ? 'active' : ''}`}
                    onClick={() => navigate(`/chat/${w._id || w.id}`)}
                  >
                    <div className="provider-avatar-box">
                      <img src={w.image} alt={w.name} />
                      {w.isOpen && <span className="online-indicator"></span>}
                    </div>
                    <div className="provider-meta">
                      <div className="name-time-row">
                        <span className="p-name">{w.name}</span>
                        <span className="p-time">Live</span>
                      </div>
                      <span className="p-sub">{w.profession} • {w.area || 'Lucknow'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ── Right Main Chat Screen ── */}
          <section className="chat-main-window">

            {/* Chat Window Header */}
            <div className="chat-window-header">
              <button className="btn-back-mobile" onClick={() => navigate('/services')}>
                <FiArrowLeft />
              </button>

              <img src={currentWorker.image} alt={currentWorker.name} className="header-provider-avatar" />

              <div className="header-provider-details">
                <div className="name-badge-row">
                  <h2>{currentWorker.name}</h2>
                  <span className="verified-badge-pill"><FiShield /> Verified Pro</span>
                </div>
                <div className="status-distance-row">
                  <span className="status-pill">
                    <span className={`dot ${currentWorker.isOpen ? 'online' : 'busy'}`}></span>
                    {currentWorker.isOpen ? 'Active Now' : 'Busy'}
                  </span>
                  <span className="dot-separator">•</span>
                  <span className="distance-pill">
                    <FiMapPin className="pin-icon" /> {currentWorker.area || 'Indiranagar'} ({currentWorker.distance || '1.2 km'})
                  </span>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="chat-header-actions">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-header-call"
                  onClick={() => window.location.href = `tel:${currentWorker.phone || '+91 98765 43210'}`}
                  icon={FiPhone}
                >
                  Call
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => navigate(`/worker/${currentWorker._id || currentWorker.id}`)}
                  icon={FiCalendar}
                >
                  Book Service
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages-area">
              {/* Privacy Trust Banner */}
              <div className="chat-trust-banner">
                <FiCheckCircle className="trust-icon" />
                <span>End-to-end local encrypted connection with <strong>{currentWorker.name}</strong></span>
              </div>

              {messages.length === 0 ? (
                <div className="chat-empty-state" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>No messages yet with {currentWorker.name}.</p>
                  <p style={{ fontSize: '13px', marginTop: '6px' }}>Type a message below or use a quick prompt to start chatting!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <ChatBubble
                    key={msg.id}
                    message={msg}
                    isMe={msg.sender === 'user'}
                    providerAvatar={currentWorker.image}
                    userAvatar={user?.avatar || defaultAvatarImg}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                  />
                ))
              )}

              {isTyping && (
                <div className="worker-typing-box">
                  <img src={currentWorker.image} alt="Typing..." className="typing-avatar" />
                  <div className="typing-bubble">
                    <span className="typing-text">{currentWorker.name.split(' ')[0]} is typing</span>
                    <div className="typing-dots">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Contextual Reply Chips */}
            <div className="quick-prompts-bar">
              <span className="prompts-label">Quick Prompts:</span>
              <div className="prompts-scroller">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="prompt-chip"
                    onClick={() => handleQuickPromptClick(p.text)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Typing Area */}
            <div className="chat-typing-container">
              {showEmojis && (
                <div className="emojis-bar glass fade-in">
                  {popularEmojis.map(emoji => (
                    <button key={emoji} type="button" onClick={() => handleEmojiClick(emoji)}>
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {attachmentPreview && (
                <div className="attachment-preview-tag">
                  <span>📷 Attachment: {attachmentPreview}</span>
                  <button type="button" onClick={() => setAttachmentPreview(null)}>✕</button>
                </div>
              )}

              <form className="chat-typing-form" onSubmit={handleSend}>
                <button
                  type="button"
                  className={`typing-icon-btn ${showEmojis ? 'active' : ''}`}
                  onClick={() => setShowEmojis(!showEmojis)}
                  title="Insert Emoji"
                >
                  <FiSmile />
                </button>

                <button
                  type="button"
                  className="typing-icon-btn"
                  onClick={handleSimulateAttachment}
                  title="Attach Photo / Site Location"
                >
                  <FiPaperclip />
                </button>

                <input
                  type="text"
                  placeholder={`Message ${currentWorker.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                <button type="submit" className="chat-send-btn" title="Send Message">
                  <FiSend />
                </button>
              </form>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default Chat;
