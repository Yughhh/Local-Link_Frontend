import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiCheck, FiX, FiUserPlus, FiCheckCircle } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { bookings as initialBookings, saveNetworkService } from '../../data/dummyData';
import { formatINR } from '../../data/formatters';
import { bookingAPI, serviceAPI } from '../../utils/api';
import './ProviderDashboard.css';

// Chart simulation data in INR Thousands
const monthlyEarnings = [
  { month: 'Jan', amount: 35000 },
  { month: 'Feb', amount: 48000 },
  { month: 'Mar', amount: 42000 },
  { month: 'Apr', amount: 65000 },
  { month: 'May', amount: 82000 },
  { month: 'Jun', amount: 74000 },
  { month: 'Jul', amount: 98000 }
];

function ProviderDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(initialBookings);
  const [loading, setLoading] = useState(false);

  // Post Service Modal State
  const [showModal, setShowModal] = useState(false);
  const [svcTitle, setSvcTitle] = useState('');
  const [svcCategory, setSvcCategory] = useState('electrician');
  const [svcPrice, setSvcPrice] = useState('₹499');
  const [svcArea, setSvcArea] = useState('Alambagh, Lucknow');
  const [svcDesc, setSvcDesc] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await bookingAPI.getMyBookings();
        if (res.data?.bookings?.length) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        setBookings(initialBookings);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, newStatus);
    } catch (err) {
      console.log('Status updated in local state');
    }
    setBookings(bookings.map(b => (b._id || b.id) === bookingId ? { ...b, status: newStatus } : b));
  };

  const handlePublishService = async (e) => {
    e.preventDefault();
    if (!svcTitle.trim()) return;

    const newSvcId = 'svc_' + Date.now();
    const newServiceObj = {
      id: newSvcId,
      _id: newSvcId,
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
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setShowModal(false);
      setSvcTitle('');
      setSvcDesc('');
    }, 1800);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-completed';
      case 'confirmed': return 'badge-confirmed';
      case 'pending': return 'badge-pending';
      default: return 'badge-default';
    }
  };

  return (
    <div className="provider-dashboard-page-wrapper">
      <Navbar />

      <main className="dashboard-main container">
        <div className="dashboard-header-section">
          <div>
            <h1 className="dashboard-title">Provider & Partner Console</h1>
            <p className="dashboard-subtitle">Manage Indian customer bookings, track payouts, and post local services to the network.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="gradient" onClick={() => setShowModal(true)} icon={FiPlusCircle}>
              Post Local Service
            </Button>
            <Button variant="outline" onClick={() => navigate('/become-provider')} icon={FiUserPlus}>
              Register New Provider Profile
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
                  <h3>Post Local Service to Network</h3>
                  <button className="btn-close-modal" onClick={() => setShowModal(false)}>
                    <FiX />
                  </button>
                </div>

                {postSuccess ? (
                  <div className="post-success-banner">
                    <FiCheckCircle className="succ-icon" />
                    <h4>Service Published Successfully!</h4>
                    <p>Your service is now live on Local Link network and visible to all customers.</p>
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
                        Publish Service to Network
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* KPI Grid */}
        <section className="dashboard-kpis-grid">
          <DashboardCard title="Total Bookings" value={bookings.length.toString()} icon="FiCalendar" change="Live sync" />
          <DashboardCard title="Average Rating" value="4.9" icon="FiCheck" change="Verified (184 reviews)" />
          <DashboardCard title="Monthly Earnings" value={formatINR(98000)} icon="FiDollarSign" change="18% vs last month" />
          <DashboardCard title="KYC Verification" value="Active" icon="FiShieldCheck" change="Aadhaar Verified" />
        </section>

        {/* Analytics Section & Action Panels */}
        <section className="dashboard-analytics-section">
          {/* Simulated earnings chart */}
          <div className="analytics-chart-box glass">
            <h3>Monthly Revenue (INR ₹)</h3>
            <p className="chart-subtitle">Gross payouts processed via Razorpay & UPI for current calendar year.</p>
            
            <div className="chart-bar-canvas">
              {monthlyEarnings.map((data, index) => {
                const maxAmount = 100000;
                const percentageHeight = (data.amount / maxAmount) * 100;
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

        {/* Recent Bookings Table */}
        <section className="recent-bookings-box glass">
          <h3>Recent Booking Requests</h3>
          <p className="section-subtitle">Manage appointments from local Indian customers in your city.</p>

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
                    <th>Customer</th>
                    <th>Service Requested</th>
                    <th>Scheduled Date</th>
                    <th>Billing (₹)</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const bId = booking._id || booking.id || booking.bookingId;
                    return (
                      <tr key={bId}>
                        <td><strong>{booking.bookingId || bId}</strong></td>
                        <td>{booking.customerName || booking.customer?.name || 'Customer'}</td>
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
                            {booking.status === 'Pending' && (
                              <>
                                <button 
                                  className="btn-action-ok" 
                                  onClick={() => handleUpdateStatus(bId, 'Confirmed')}
                                  title="Accept Booking"
                                >
                                  <FiCheck />
                                </button>
                                <button 
                                  className="btn-action-no" 
                                  onClick={() => handleUpdateStatus(bId, 'Cancelled')}
                                  title="Decline Booking"
                                >
                                  <FiX />
                                </button>
                              </>
                            )}
                            {booking.status === 'Confirmed' && (
                              <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => handleUpdateStatus(bId, 'Completed')}
                              >
                                Mark Completed
                              </Button>
                            )}
                            {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                              <span className="no-action-label">-</span>
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
