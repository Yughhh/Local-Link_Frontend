import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlusCircle, 
  FiCheck, 
  FiX, 
  FiUserPlus, 
  FiCheckCircle, 
  FiMessageSquare, 
  FiSend, 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiShield,
  FiTrash2,
  FiTag,
  FiMapPin,
  FiEdit3
} from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { useAuth } from '../../context/AuthContext';
import { 
  bookings as initialBookings, 
  getNetworkServices,
  saveNetworkService, 
  saveNetworkWorker,
  deleteNetworkService,
  getNetworkBookings,
  updateNetworkBookingStatus,
  getPersistentChatMessages, 
  savePersistentChatMessage,
  editPersistentChatMessage,
  deletePersistentChatMessage,
  saveCustomerNotification,
  initialChats 
} from '../../data/dummyData';
import { formatINR } from '../../data/formatters';
import { bookingAPI, serviceAPI, messageAPI } from '../../utils/api';
import defaultAvatarImg from '../../assets/images/NoProfilePicture.png';
import './ProviderDashboard.css';

function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState(() => getNetworkBookings(user?._id || user?.email));
  const [loading, setLoading] = useState(false);
  const [publishedServices, setPublishedServices] = useState(() => getNetworkServices(user?._id || user?.email));

  // Post Service Modal State
  const [showModal, setShowModal] = useState(false);
  const [svcTitle, setSvcTitle] = useState('');
  const [svcCategory, setSvcCategory] = useState('electrician');
  const [svcPrice, setSvcPrice] = useState('₹499');
  const [svcArea, setSvcArea] = useState('Alambagh, Lucknow');
  const [svcDesc, setSvcDesc] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  // Provider Chat Drawer State
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInputText, setChatInputText] = useState('');
  const chatMessagesEndRef = useRef(null);

  // Access check: only provider or admin can view this panel
  const isProviderOrAdmin = isAuthenticated && (user?.role === 'provider' || user?.role === 'admin');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const providerKey = user?._id || user?.email;
      const netBookings = getNetworkBookings(providerKey);
      try {
        const res = await bookingAPI.getProviderBookings();
        if (res.data?.bookings?.length) {
          setBookings([...res.data.bookings, ...netBookings.filter(b => typeof b.id === 'string' && b.id.startsWith('BK-'))]);
        } else {
          setBookings(netBookings);
        }
      } catch (err) {
        setBookings(netBookings);
      } finally {
        setLoading(false);
      }
    };

    const fetchMyServices = async () => {
      const providerKey = user?._id || user?.email;
      const localServices = getNetworkServices(providerKey);
      try {
        const res = await serviceAPI.getMyServices();
        if (res.data?.services?.length) {
          setPublishedServices([...res.data.services, ...localServices]);
        } else {
          setPublishedServices(localServices);
        }
      } catch (err) {
        setPublishedServices(localServices);
      }
    };

    if (isProviderOrAdmin) {
      fetchBookings();
      fetchMyServices();
    }
  }, [isProviderOrAdmin, user]);

  useEffect(() => {
    if (showChatModal) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChatModal]);

  // Update booking status & Notify customer of acceptance/rejection
  const handleUpdateStatus = async (bookingId, newStatus) => {
    const bookingToUpdate = bookings.find(b => (b._id || b.id || b.bookingId) === bookingId);
    const custId = bookingToUpdate?.customer?._id || bookingToUpdate?.customer;
    const custEmail = bookingToUpdate?.customer?.email;
    const custName = bookingToUpdate?.customerName || bookingToUpdate?.customer?.name;
    const isAccepted = newStatus === 'Confirmed' || newStatus === 'Completed';

    // Persist status update in local network storage
    updateNetworkBookingStatus(bookingId, newStatus);

    // Notify ONLY the customer whose service request is accepted by the provider
    if (isAccepted) {
      const notifObj = {
        id: 'notif_' + Date.now(),
        title: '🎉 Booking Request Accepted!',
        message: `Your booking request for "${bookingToUpdate?.service || 'service'}" has been accepted by the provider.`,
        status: newStatus,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };

      if (custId) saveCustomerNotification(String(custId), notifObj);
      if (custEmail) saveCustomerNotification(custEmail, notifObj);
      if (custName) saveCustomerNotification(custName, notifObj);
    }

    try {
      await bookingAPI.updateStatus(bookingId, newStatus);
    } catch (err) {
      console.log('Status updated in local state');
    }

    setBookings(prev => prev.map(b => ((b._id || b.id || b.bookingId) === bookingId ? { ...b, status: newStatus } : b)));
  };

  const handlePublishService = async (e) => {
    e.preventDefault();
    if (!svcTitle.trim()) return;

    const providerKey = user?._id || user?.email || 'provider_local';
    const newSvcId = 'svc_' + Date.now();
    const newServiceObj = {
      id: newSvcId,
      _id: newSvcId,
      providerId: providerKey,
      providerEmail: user?.email || 'provider@localconnect.in',
      providerName: user?.name || 'Provider',
      providerAvatar: user?.avatar || defaultAvatarImg,
      avatar: user?.avatar || defaultAvatarImg,
      provider: user?._id,
      title: svcTitle.trim(),
      name: svcTitle.trim(),
      category: svcCategory,
      price: svcPrice.startsWith('₹') ? svcPrice : `₹${svcPrice}`,
      area: svcArea,
      distance: '1.0 km away',
      rating: 5.0,
      reviewsCount: 1,
      tag: 'Verified Pro',
      icon: svcCategory === 'electrician' ? 'FiZap' : svcCategory === 'plumber' ? 'FiDroplet' : 'FiTool',
      description: svcDesc.trim() || 'Verified local service provided by trained, Aadhaar-verified specialists in your neighborhood.'
    };

    try {
      await serviceAPI.create(newServiceObj);
    } catch (err) {
      console.log('Backend offline - saved service to local network database');
    }

    saveNetworkService(newServiceObj);
    saveNetworkWorker({
      id: 'w_' + Date.now(),
      name: user?.name || 'Service Provider',
      profession: svcTitle.trim(),
      category: svcCategory,
      area: svcArea,
      avatar: user?.avatar || defaultAvatarImg,
      providerAvatar: user?.avatar || defaultAvatarImg,
      rating: 5.0,
      reviewsCount: 1,
      pricePerHour: svcPrice,
      phone: user?.phone || '+91 98765 43210'
    });
    setPublishedServices(getNetworkServices(providerKey));
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setShowModal(false);
      setSvcTitle('');
      setSvcDesc('');
    }, 1800);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to remove this published service package?")) {
      const providerKey = user?._id || user?.email;
      try {
        await serviceAPI.delete(serviceId);
      } catch (err) {
        console.log('Deleted service locally');
      }
      deleteNetworkService(serviceId);
      setPublishedServices(getNetworkServices(providerKey));
    }
  };

  // Open Chat Drawer for a specific Customer Booking
  const handleOpenCustomerChat = async (bookingObj) => {
    const custName = bookingObj.customerName || bookingObj.customer?.name || 'Customer';
    const custId = bookingObj.customer?._id || bookingObj.customer || 'cust_' + (bookingObj._id || bookingObj.id);
    const custObj = {
      name: custName,
      id: custId,
      phone: bookingObj.customer?.phone || '+91 98765 12345',
      bookingId: bookingObj.bookingId || bookingObj._id || bookingObj.id,
      service: bookingObj.service,
      avatar: bookingObj.customer?.avatar || defaultAvatarImg,
    };

    setActiveCustomer(custObj);

    // Fetch messages for this customer
    try {
      const res = await messageAPI.getMessages(custId);
      if (res.data?.messages?.length) {
        const formatted = res.data.messages.map(m => ({
          id: m._id,
          createdAt: new Date(m.createdAt).getTime(),
          sender: String(m.sender) === String(user?._id) ? 'provider' : 'customer',
          text: m.text,
          timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setChatMessages(formatted);
        setShowChatModal(true);
        return;
      }
    } catch (err) {
      console.log('Using local persistent chat history');
    }

    const persistent = getPersistentChatMessages(custName) || 
                       getPersistentChatMessages(custId) || [];

    const formattedPersistent = persistent.map((m, idx) => ({
      id: m.id || idx,
      createdAt: m.createdAt || Date.now(),
      sender: m.sender === 'user' || m.sender === 'customer' ? 'customer' : 'provider',
      text: m.text,
      timestamp: m.timestamp || 'Just now',
      isEdited: m.isEdited || false,
    }));

    setChatMessages(formattedPersistent);
    setShowChatModal(true);
  };

  // Provider sends a message to customer
  const handleSendProviderMessage = async (e) => {
    e.preventDefault();
    if (!chatInputText.trim() || !activeCustomer) return;

    const msgText = chatInputText.trim();
    const msgCreatedAt = Date.now();
    const msgId = 'msg_' + msgCreatedAt;

    const newMsg = {
      id: msgId,
      createdAt: msgCreatedAt,
      sender: 'provider',
      text: msgText,
      timestamp: new Date(msgCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInputText('');

    const customerViewMsg = {
      id: msgId,
      createdAt: msgCreatedAt,
      sender: 'worker',
      text: msgText,
      timestamp: new Date(msgCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    savePersistentChatMessage(activeCustomer.name, customerViewMsg);
    savePersistentChatMessage(activeCustomer.id, customerViewMsg);

    try {
      await messageAPI.sendMessage({
        receiverId: activeCustomer.id,
        text: msgText,
      });
    } catch (err) {
      console.log('Saved provider message to local persistent chat');
    }
  };

  // Provider edits a sent message (Allowed within 5 minutes)
  const handleEditProviderMessage = async (msgId, currentText) => {
    const newText = window.prompt("Edit your message (Sent within 5 minutes):", currentText);
    if (!newText || !newText.trim() || newText === currentText) return;

    try {
      await messageAPI.editMessage(msgId, newText.trim());
    } catch (err) {
      console.log('Edited message locally');
    }

    setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: newText.trim(), isEdited: true } : m));
    if (activeCustomer) {
      editPersistentChatMessage(activeCustomer.name, msgId, newText.trim());
      editPersistentChatMessage(activeCustomer.id, msgId, newText.trim());
    }
  };

  // Provider deletes a sent message (Allowed within 5 minutes)
  const handleDeleteProviderMessage = async (msgId) => {
    if (!window.confirm("Delete this message? (Sent within 5 minutes)")) return;

    try {
      await messageAPI.deleteMessage(msgId);
    } catch (err) {
      console.log('Deleted message locally');
    }

    setChatMessages(prev => prev.filter(m => m.id !== msgId));
    if (activeCustomer) {
      deletePersistentChatMessage(activeCustomer.name, msgId);
      deletePersistentChatMessage(activeCustomer.id, msgId);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-completed';
      case 'confirmed': return 'badge-confirmed';
      case 'pending': return 'badge-pending';
      default: return 'badge-default';
    }
  };

  // Render access restriction view if user is not provider/admin
  if (!isProviderOrAdmin) {
    return (
      <div className="provider-dashboard-page-wrapper">
        <Navbar />
        <main className="dashboard-main container" style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div className="glass" style={{ padding: '40px', borderRadius: '24px', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '26px', color: '#ef4444', fontWeight: 800, marginBottom: '12px' }}>Provider Access Restricted</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>
              This panel is exclusively accessible by registered Service Provider accounts. Log in with a service provider account to access your customer bookings & chat panel.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button variant="gradient" onClick={() => navigate('/')}>
                Return to Home Page
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate statistics dynamically for THIS authorized provider
  const totalBookingsCount = bookings.length;
  const uniqueCustomersList = Array.from(
    new Set(bookings.map(b => b.customerName || b.customer?.name || b.customer || 'Customer'))
  );
  const uniqueCustomersCount = uniqueCustomersList.length;
  const publishedServicesCount = publishedServices.length;

  const totalEarningsAmount = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((acc, b) => {
      const numericPrice = parseInt((b.amount || '0').replace(/[^0-9]/g, '')) || 0;
      return acc + numericPrice;
    }, 0);

  // Dynamic monthly earnings breakdown for authorized provider
  const monthlyEarningsMap = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0 };
  bookings.forEach(b => {
    if (b.status !== 'Cancelled') {
      const amt = parseInt((b.amount || '0').replace(/[^0-9]/g, '')) || 0;
      const m = b.date?.includes('Jan') ? 'Jan' :
                b.date?.includes('Feb') ? 'Feb' :
                b.date?.includes('Mar') ? 'Mar' :
                b.date?.includes('Apr') ? 'Apr' :
                b.date?.includes('May') ? 'May' :
                b.date?.includes('Jun') ? 'Jun' : 'Jul';
      monthlyEarningsMap[m] = (monthlyEarningsMap[m] || 0) + amt;
    }
  });

  const dynamicMonthlyEarnings = Object.keys(monthlyEarningsMap).map(m => ({
    month: m,
    amount: monthlyEarningsMap[m]
  }));

  return (
    <div className="provider-dashboard-page-wrapper">
      <Navbar />

      <main className="dashboard-main container">
        <div className="dashboard-header-section">
          <div>
            <h1 className="dashboard-title">Service Provider Console</h1>
            <p className="dashboard-subtitle">Create service packages, track customer hiring requests, and chat directly with customers.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="gradient" onClick={() => setShowModal(true)} icon={FiPlusCircle}>
              + Create New Service Package
            </Button>
          </div>
        </div>

        {/* Post Service Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="modal-backdrop" onClick={() => setShowModal(false)}>
              <motion.div 
                className="post-service-modal glass"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header-row">
                  <h3>Create & Publish Service Package</h3>
                  <button className="btn-close-modal" onClick={() => setShowModal(false)}>
                    <FiX />
                  </button>
                </div>

                {postSuccess ? (
                  <div className="post-success-banner">
                    <FiCheckCircle className="succ-icon" />
                    <h4>Service Published Successfully!</h4>
                    <p>Your service package is now live on the Local Link network and available for customers to hire.</p>
                  </div>
                ) : (
                  <form onSubmit={handlePublishService} className="post-service-form">
                    <div className="form-group">
                      <label>Service Package Title *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 3BHK Full Apartment Deep Cleaning & Sanitization"
                        value={svcTitle}
                        onChange={(e) => setSvcTitle(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-grid-2 mt-3">
                      <div className="form-group">
                        <label>Category *</label>
                        <select value={svcCategory} onChange={(e) => setSvcCategory(e.target.value)}>
                          <option value="electrician">Electrician & Smart Home</option>
                          <option value="plumber">Plumbing & Leak Repair</option>
                          <option value="salon">Salon & Beauty at Home</option>
                          <option value="cleaning">Home Deep Cleaning</option>
                          <option value="webdev">Web & Mobile App Development</option>
                          <option value="tutors">IIT & School Tutors</option>
                          <option value="carpenter">Carpentry & Furniture</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Service Price (Rupees) *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. ₹1,499"
                          value={svcPrice}
                          onChange={(e) => setSvcPrice(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-group mt-3">
                      <label>Service Location / Area *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Indiranagar, Bengaluru"
                        value={svcArea}
                        onChange={(e) => setSvcArea(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group mt-3">
                      <label>Service Description & Details</label>
                      <textarea 
                        rows="3" 
                        placeholder="Explain what is included in this service package..."
                        value={svcDesc}
                        onChange={(e) => setSvcDesc(e.target.value)}
                      />
                    </div>

                    <div className="form-actions-row mt-4">
                      <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="gradient" icon={FiPlusCircle}>
                        Publish Service Package
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Interactive Provider-to-Customer Chat Drawer/Modal ── */}
        <AnimatePresence>
          {showChatModal && activeCustomer && (
            <div className="modal-backdrop" onClick={() => setShowChatModal(false)}>
              <motion.div 
                className="provider-chat-modal-box glass"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Chat Modal Header */}
                <div className="provider-chat-header">
                  <div className="provider-chat-user-info">
                    <img src={activeCustomer.avatar || defaultAvatarImg} alt={activeCustomer.name} className="provider-chat-avatar" />
                    <div>
                      <h4 className="provider-chat-name">{activeCustomer.name}</h4>
                      <span className="provider-chat-meta">Booking #{activeCustomer.bookingId} • {activeCustomer.service}</span>
                    </div>
                  </div>
                  <button className="btn-close-modal" onClick={() => setShowChatModal(false)}>
                    <FiX />
                  </button>
                </div>

                {/* Chat Messages Body */}
                <div className="provider-chat-body">
                  {chatMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                      No messages yet with {activeCustomer.name}. Type a message below to start chatting!
                    </div>
                  ) : (
                    chatMessages.map((m, idx) => {
                      const msgTimestampNum = typeof m.id === 'string' && m.id.startsWith('msg_')
                        ? parseInt(m.id.replace('msg_', ''))
                        : (m.createdAt || Date.now());
                      const isWithin5Mins = (Date.now() - msgTimestampNum) <= 5 * 60 * 1000;

                      return (
                        <div key={m.id || idx} className={`provider-chat-bubble ${m.sender === 'provider' ? 'sent' : 'received'}`}>
                          <div>{m.text} {m.isEdited && <span style={{ fontSize: '10px', opacity: 0.75 }}>(edited)</span>}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', gap: '8px' }}>
                            <span className="provider-chat-timestamp">{m.timestamp}</span>
                            {m.sender === 'provider' && isWithin5Mins && (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button 
                                  type="button" 
                                  onClick={() => handleEditProviderMessage(m.id, m.text)}
                                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '11px', padding: 0 }}
                                  title="Edit message (Within 5 mins)"
                                >
                                  <FiEdit3 />
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleDeleteProviderMessage(m.id)}
                                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '11px', padding: 0 }}
                                  title="Delete message (Within 5 mins)"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Chat Input Bar */}
                <form className="provider-chat-input-bar" onSubmit={handleSendProviderMessage}>
                  <input 
                    type="text" 
                    placeholder={`Message ${activeCustomer.name}...`} 
                    value={chatInputText} 
                    onChange={(e) => setChatInputText(e.target.value)} 
                  />
                  <button type="submit" className="provider-chat-send-btn" title="Send Message to Customer">
                    <FiSend />
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* KPI Grid – Dynamic Statistics calculated for authorized logged-in provider */}
        <section className="dashboard-kpis-grid">
          <DashboardCard title="Total Customer Bookings" value={totalBookingsCount.toString()} icon="FiCalendar" change="Authorized live sync" />
          <DashboardCard title="People Who Booked You" value={`${uniqueCustomersCount} Customers`} icon="FiUsers" change="Verified Clients" />
          <DashboardCard title="Published Service Packages" value={publishedServicesCount.toString()} icon="FiTag" change="Active Marketplace" />
          <DashboardCard title="Total Provider Earnings" value={formatINR(totalEarningsAmount)} icon="FiDollarSign" change="Gross Earnings" />
        </section>

        {/* ── SECTION: Service Provider's Created Services ── */}
        <section className="published-services-section glass" style={{ marginBottom: '32px', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
                My Published Service Packages ({publishedServices.length})
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                Services created here are instantly visible to local customers for hiring & booking.
              </p>
            </div>
            <Button variant="gradient" size="sm" onClick={() => setShowModal(true)} icon={FiPlusCircle}>
              + Create Service Package
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {publishedServices.map((svc) => (
              <div 
                key={svc._id || svc.id} 
                style={{
                  background: 'var(--bg-soft)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'uppercase' }}>
                      {svc.category}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
                      {svc.price}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '4px 0' }}>
                    {svc.title || svc.name}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 8px 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {svc.description}
                  </p>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <FiMapPin /> {svc.area || 'Alambagh, Lucknow'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteService(svc.id || svc._id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 10px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Delete service package"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Analytics Section & Action Panels */}
        <section className="dashboard-analytics-section">
          {/* Dynamic earnings chart */}
          <div className="analytics-chart-box glass">
            <h3>Monthly Revenue Breakdown (INR ₹)</h3>
            <p className="chart-subtitle">Calculated dynamically from your authorized customer bookings.</p>
            
            <div className="chart-bar-canvas">
              {dynamicMonthlyEarnings.map((data, index) => {
                const maxAmount = 100000;
                const percentageHeight = Math.min(100, (data.amount / maxAmount) * 100);
                return (
                  <div key={index} className="chart-bar-column">
                    <div className="chart-bar-tooltip">{formatINR(data.amount)}</div>
                    <div className="chart-bar-fill" style={{ height: `${percentageHeight}%` }}></div>
                    <span className="chart-bar-label">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="quick-actions-box glass">
            <h3>Provider Operations</h3>
            <div className="console-actions-list">
              <button onClick={() => alert("Updating active working hours...")}>Set Active Working Hours</button>
              <button onClick={() => alert("Opening festive discount setup...")}>Create Festive Coupon</button>
              <button onClick={() => alert("Opening city service radius settings...")}>Set Service Radius (10km)</button>
              <button onClick={() => alert("Opening instant UPI payout settings...")}>Link UPI / Bank Account</button>
            </div>
          </div>
        </section>

        {/* Recent Bookings & Customers Table */}
        <section className="recent-bookings-box glass">
          <h3>Customer Booking Requests ({bookings.length})</h3>
          <p className="section-subtitle">Manage appointments and chat directly with customers who booked your service.</p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Loader type="spinner" />
            </div>
          ) : (
            <div className="bookings-table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer Name</th>
                    <th>Service Requested</th>
                    <th>Scheduled Date</th>
                    <th>Billing (₹)</th>
                    <th>Status</th>
                    <th>Action / Chat</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const bId = booking._id || booking.id || booking.bookingId;
                    const custName = booking.customerName || booking.customer?.name || 'Customer';
                    return (
                      <tr key={bId}>
                        <td><strong>{booking.bookingId || bId}</strong></td>
                        <td>
                          <strong>{custName}</strong>
                          {booking.customer?.phone && <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>{booking.customer.phone}</span>}
                        </td>
                        <td>{booking.service}</td>
                        <td>{booking.date}</td>
                        <td>{booking.amount}</td>
                        <td>
                          <span className={`status-badge-table ${getStatusClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions-btns">
                            {/* Dedicated Chat Button for Service Provider to Chat with Customer */}
                            <button 
                              type="button" 
                              className="btn-action-chat" 
                              onClick={() => handleOpenCustomerChat(booking)}
                              title={`Chat with ${custName}`}
                            >
                              <FiMessageSquare /> Chat
                            </button>

                            {booking.status === 'Pending' && (
                              <>
                                <button 
                                  className="btn-action-ok" 
                                  onClick={() => handleUpdateStatus(bId, 'Confirmed')}
                                  title="Accept Booking Request"
                                >
                                  <FiCheck /> Accept
                                </button>
                                <button 
                                  className="btn-action-no" 
                                  onClick={() => handleUpdateStatus(bId, 'Cancelled')}
                                  title="Decline Booking Request"
                                >
                                  <FiX /> Decline
                                </button>
                              </>
                            )}
                            {booking.status === 'Confirmed' && (
                              <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => handleUpdateStatus(bId, 'Completed')}
                              >
                                Mark Done
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProviderDashboard;
