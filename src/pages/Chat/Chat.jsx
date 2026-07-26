import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
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
  getNetworkServices,
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
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const targetId = routeId || searchParams.get('workerId') || searchParams.get('id');
  const targetName = searchParams.get('name') || searchParams.get('workerName');
  const targetAvatar = searchParams.get('avatar');

  // Unified contacts directory combining network workers and published service providers
  const allNetworkWorkers = getNetworkWorkers();
  const networkServices = getNetworkServices();

  const extraProvidersFromServices = networkServices
    .filter(s => s.providerName || s.title || s.name)
    .map(s => ({
      id: s.providerId || s.provider || s.id || s._id,
      _id: s.providerId || s.provider || s._id || s.id,
      name: s.providerName || s.name || s.title || 'Service Provider',
      profession: s.title || s.name || 'Service Specialist',
      avatar: s.providerAvatar || s.avatar || defaultAvatarImg,
      phone: s.phone || '+91 98765 43210',
      rating: s.rating || 5.0,
      reviewsCount: s.reviewsCount || 1,
      area: s.area || 'Lucknow, UP',
      isOnline: true
    }));

  const contactsMap = new Map();
  [...allNetworkWorkers, ...extraProvidersFromServices].forEach(w => {
    const key = String(w._id || w.id || w.name).toLowerCase();
    if (!contactsMap.has(key)) {
      contactsMap.set(key, w);
    }
  });

  const unifiedContactsList = Array.from(contactsMap.values());

  const findWorkerTarget = (tId, tName) => {
    if (tId) {
      const match = unifiedContactsList.find(w =>
        String(w.id) === String(tId) ||
        String(w._id) === String(tId)
      );
      if (match) return match;
    }
    if (tName) {
      const matchName = unifiedContactsList.find(w =>
        w.name.toLowerCase() === tName.toLowerCase()
      );
      if (matchName) return matchName;
    }
    if (tId || tName) {
      return {
        id: tId || 'w_' + Date.now(),
        _id: tId || 'w_' + Date.now(),
        name: tName || 'Service Provider',
        profession: 'Verified Service Provider',
        avatar: targetAvatar || defaultAvatarImg,
        phone: '+91 98765 43210',
        rating: 5.0,
        reviewsCount: 1,
        area: 'Lucknow, UP',
        isOnline: true
      };
    }
    return unifiedContactsList[0] || workers[0];
  };

  const [currentWorker, setCurrentWorker] = useState(() => findWorkerTarget(targetId, targetName));
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const messagesEndRef = useRef(null);

  // Update target worker when route parameters change
  useEffect(() => {
    const resolved = findWorkerTarget(targetId, targetName);
    if (resolved) {
      setCurrentWorker(resolved);
    }
  }, [routeId, targetId, targetName]);

  // Filter sidebar contacts
  const filteredWorkers = unifiedContactsList.filter(w =>
    w.name.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
    (w.profession && w.profession.toLowerCase().includes(sidebarSearch.toLowerCase()))
  );

  // Load chat messages when currentWorker updates
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
        console.log('Using persistent local chat storage');
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
    if (q.includes('location') || q.includes('address') || q.includes('reach') || q.includes('where')) {
      return `I am located in ${workerObj.area || 'Alambagh, Lucknow'}. I can reach your doorstep within 25-40 minutes after booking confirmation.`;
    }
    if (q.includes('urgent') || q.includes('emergency') || q.includes('leak') || q.includes('power')) {
      return `Understood! I treat emergency service requests with top priority. Go ahead and confirm the booking and I will dispatch immediately!`;
    }
    return `Hello! Thanks for reaching out to ${workerObj.name}. How can I assist you with your service requirements today?`;
  };

  const handleSelectContact = (workerObj) => {
    setCurrentWorker(workerObj);
    navigate(`/chat/${workerObj._id || workerObj.id}`);
  };

  const handleQuickPromptClick = (promptText) => {
    setInputText(promptText);
  };

  const handleEmojiClick = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  const handleSimulateAttachment = () => {
    setAttachmentPreview("Service_Site_Photo.jpg (1.4 MB)");
  };

  if (!currentWorker) {
    return (
      <div className="chat-page-wrapper">
        <Navbar />
        <main className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <h3>No provider selected</h3>
          <Link to="/nearby">Browse Nearby Service Providers</Link>
        </main>
      </div>
    );
  }

  const workerAvatar = currentWorker.avatar || currentWorker.image || currentWorker.providerAvatar || defaultAvatarImg;

  return (
    <div className="chat-page-wrapper">
      <Navbar />

      <main className="chat-main-container container">
        <div className="chat-layout-grid glass">
          
          {/* Left Sidebar: Contacts List */}
          <aside className="chat-sidebar">
            <div className="sidebar-header">
              <h3>Service Chats</h3>
              <span className="active-badge">{unifiedContactsList.length} Pros</span>
            </div>

            <div className="sidebar-search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search provider name or service..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
              />
            </div>

            <div className="contacts-scroll-list">
              {filteredWorkers.map(w => {
                const isSelected = String(w.id) === String(currentWorker.id) || String(w._id) === String(currentWorker._id);
                const contactAvatar = w.avatar || w.image || w.providerAvatar || defaultAvatarImg;
                return (
                  <div
                    key={w._id || w.id}
                    className={`contact-item-row ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectContact(w)}
                  >
                    <div className="contact-avatar-wrapper">
                      <img src={contactAvatar} alt={w.name} />
                      {w.isOnline && <span className="online-indicator"></span>}
                    </div>
                    <div className="contact-info">
                      <div className="contact-name-row">
                        <span className="contact-name">{w.name}</span>
                        <span className="contact-rate">{w.pricePerHour || '₹399'}</span>
                      </div>
                      <span className="contact-subtitle">{w.profession}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Right Main Panel: Active Chat Thread */}
          <section className="chat-active-window">
            
            {/* Header Top Bar */}
            <div className="chat-window-header">
              <div className="worker-header-info">
                <button type="button" className="btn-back-mobile" onClick={() => navigate('/nearby')}>
                  <FiArrowLeft />
                </button>

                <div className="avatar-header-box">
                  <img src={workerAvatar} alt={currentWorker.name} />
                  <span className="online-pulse-dot"></span>
                </div>

                <div>
                  <h3 className="header-worker-name">{currentWorker.name}</h3>
                  <div className="header-meta-row">
                    <span className="pro-tag">{currentWorker.profession}</span>
                    <span className="meta-dot">•</span>
                    <span className="location-tag"><FiMapPin /> {currentWorker.area || 'Lucknow'}</span>
                    <span className="meta-dot">•</span>
                    <span className="rating-tag">⭐ {currentWorker.rating || '5.0'}</span>
                  </div>
                </div>
              </div>

              <div className="header-action-buttons">
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={FiPhone}
                  onClick={() => window.location.href = `tel:${currentWorker.phone || '+91 98765 43210'}`}
                >
                  Call
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  icon={FiCalendar}
                  onClick={() => navigate(`/worker/${currentWorker._id || currentWorker.id}`)}
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
                <span>End-to-end encrypted connection with <strong>{currentWorker.name}</strong></span>
              </div>

              {messages.length === 0 ? (
                <div className="chat-empty-state" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>No messages yet with {currentWorker.name}.</p>
                  <p style={{ fontSize: '13px', marginTop: '6px' }}>Type a message below or click a quick prompt to start chatting!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <ChatBubble
                    key={msg.id}
                    message={msg}
                    isMe={msg.sender === 'user'}
                    providerAvatar={workerAvatar}
                    userAvatar={user?.avatar || defaultAvatarImg}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                  />
                ))
              )}

              {isTyping && (
                <div className="worker-typing-box">
                  <img src={workerAvatar} alt="Typing..." className="typing-avatar" />
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
