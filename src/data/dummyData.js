import electricianImg from '../assets/images/worker_electrician.jpg';
import salonImg from '../assets/images/worker_salon.jpg';
import plumberImg from '../assets/images/worker_plumber_amit.png';
import sunitaImg from '../assets/images/worker_cleaner_sunita.png';
import rohanImg from '../assets/images/worker_developer_rohan.png';
import ananyaImg from '../assets/images/worker_tutor_ananya.png';
import heroBannerImg from '../assets/images/hero_banner.jpg';

export { heroBannerImg, electricianImg, salonImg, plumberImg, sunitaImg, rohanImg, ananyaImg };

export const locationsList = [
  "Lucknow, UP",
  "Alambagh, Lucknow",
  "Singar Nagar, Alambagh",
  "Chander Nagar, Alambagh",
  "Phoenix Mall, Alambagh",
  "Kanpur, UP",
  "Delhi NCR",
  "Mumbai, MH",
  "Bengaluru, KA"
];

export const categories = [
  { id: 'electrician', name: 'Electrician & Smart Home', icon: 'FiZap', color: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  { id: 'plumber', name: 'Plumbing & Pipeworks', icon: 'FiDroplet', color: 'linear-gradient(135deg, #0ea5e9, #2563eb)' },
  { id: 'salon', name: 'Salon & Beauty at Home', icon: 'FiScissors', color: 'linear-gradient(135deg, #ec4899, #db2777)' },
  { id: 'cleaning', name: 'Home Deep Cleaning', icon: 'FiWind', color: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 'webdev', name: 'Web & App Development', icon: 'FiCode', color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  { id: 'digitalmkt', name: 'Digital Marketing & SEO', icon: 'FiTrendingUp', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { id: 'tutors', name: 'IIT/NEET & School Tutors', icon: 'FiBookOpen', color: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  { id: 'carpenter', name: 'Carpentry & Furniture', icon: 'FiTool', color: 'linear-gradient(135deg, #b45309, #78350f)' },
  { id: 'more', name: 'More Services', icon: 'FiGrid', color: 'linear-gradient(135deg, #64748b, #475569)' }
];

export const nearbyLocalServices = [
  {
    id: 'n-elec-1',
    title: 'Emergency Electrician & Wiring',
    category: 'electrician',
    icon: 'FiZap',
    distance: '0.8 km away',
    area: 'Alambagh Market',
    city: 'Lucknow, UP',
    rating: 4.9,
    reviewsCount: 184,
    price: '₹349/visit',
    description: 'Rapid 30-minute response for MCB tripping, short-circuits, inverter connections, and smart switch fitting across Alambagh.',
    phone: '+91 98765 43210',
    verified: true,
    tag: '⚡ Fast Arrival'
  },
  {
    id: 'n-plumb-1',
    title: 'Master Plumber & Pipe Leak Repair',
    category: 'plumber',
    icon: 'FiDroplet',
    distance: '0.6 km away',
    area: 'Singar Nagar, Alambagh',
    city: 'Lucknow, UP',
    rating: 4.8,
    reviewsCount: 110,
    price: '₹299/visit',
    description: 'Expert pipe leakage detection, water heater/geyser installation, faucet replacements, and drain unclogging in Alambagh.',
    phone: '+91 97654 32109',
    verified: true,
    tag: '🔧 Licensed Pro'
  },
  {
    id: 'n-ac-1',
    title: 'Split & Window AC Jet Servicing',
    category: 'cleaning',
    icon: 'FiWind',
    distance: '1.1 km away',
    area: 'Chander Nagar, Alambagh',
    city: 'Lucknow, UP',
    rating: 4.9,
    reviewsCount: 156,
    price: '₹499/service',
    description: 'Foam jet cleaning, gas charging, filter replacement, and cooling diagnostics for all major AC brands.',
    phone: '+91 99887 76655',
    verified: true,
    tag: '❄️ Cooling Assured'
  },
  {
    id: 'n-clean-1',
    title: 'Full House Deep Cleaning & Sanitization',
    category: 'cleaning',
    icon: 'MdCleaningServices',
    distance: '1.4 km away',
    area: 'Phoenix United Road, Alambagh',
    city: 'Lucknow, UP',
    rating: 4.9,
    reviewsCount: 215,
    price: '₹1,999/flat',
    description: '3BHK/2BHK deep cleaning, sofa shampooing, modular kitchen degreasing, and anti-bacterial bathroom sanitization.',
    phone: '+91 98123 45678',
    verified: true,
    tag: '✨ Eco Products'
  },
  {
    id: 'n-carpent-1',
    title: 'Custom Carpentry & Furniture Repair',
    category: 'carpenter',
    icon: 'FiTool',
    distance: '1.2 km away',
    area: 'Krishna Nagar, Alambagh',
    city: 'Lucknow, UP',
    rating: 4.7,
    reviewsCount: 94,
    price: '₹399/hr',
    description: 'Door lock fitting, modular wardrobe fixes, teakwood table polishing, and custom kitchen cabinet repairs.',
    phone: '+91 96543 21098',
    verified: true,
    tag: '🪵 Master Craftsman'
  },
  {
    id: 'n-appliance-1',
    title: 'Appliance Repair (TV, Washer, Fridge)',
    category: 'electrician',
    icon: 'FiCpu',
    distance: '1.8 km away',
    area: 'VIP Road, Alambagh',
    city: 'Lucknow, UP',
    rating: 4.8,
    reviewsCount: 128,
    price: '₹399/visit',
    description: 'On-site repair for washing machines, double-door refrigerators, microwave ovens, and Smart LED TVs.',
    phone: '+91 94321 87654',
    verified: true,
    tag: '📺 Doorstep Service'
  },
  {
    id: 'n-grocery-1',
    title: 'Express Local Grocery & Fresh Supplies',
    category: 'grocery',
    icon: 'FiShoppingBag',
    distance: '0.4 km away',
    area: 'Alambagh Bus Stand Market',
    city: 'Lucknow, UP',
    rating: 4.9,
    reviewsCount: 310,
    price: 'Free Delivery',
    description: 'Fresh farm vegetables, dairy, organic grains, and daily household essentials delivered in under 20 mins.',
    phone: '+91 98765 11223',
    verified: true,
    tag: '🚀 20-Min Express'
  },
  {
    id: 'n-medical-1',
    title: 'Nearby Pharmacy & Urgent Medical Care',
    category: 'pharmacy',
    icon: 'FiPlusCircle',
    distance: '0.5 km away',
    area: 'Singar Nagar Metro Gate, Alambagh',
    city: 'Lucknow, UP',
    rating: 4.9,
    reviewsCount: 240,
    price: '24x7 Open',
    description: '24x7 prescription medicines, health diagnostic kits, pulse oximeters, and doorstep emergency medicine delivery.',
    phone: '+91 98765 99887',
    verified: true,
    tag: '🏥 24/7 Active'
  }
];

export const workers = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    profession: 'Master Electrician & Smart Home Automation',
    category: 'electrician',
    rating: 4.9,
    reviewsCount: 184,
    distance: '0.8 km',
    city: 'Lucknow, UP',
    area: 'Alambagh Market',
    isOpen: true,
    verified: true,
    experience: '9 Years',
    workingHours: '08:00 AM - 09:00 PM',
    pricePerHour: '₹399/hr',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@localconnect.in',
    image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&crop=faces&w=600&q=80',
    banner: heroBannerImg,
    about: 'Rajesh is a Government Licensed Master Electrician based in Alambagh, Lucknow. He specializes in full house rewiring, inverter installations, smart switch setups, MCB breaker replacements, and 24x7 emergency electrical repairs across Alambagh and Singar Nagar.',
    services: [
      { name: 'Smart Home Automation & Switch Setup', price: '₹1,299' },
      { name: 'Switchboard & Socket Replacement', price: '₹299' },
      { name: 'Inverter Wiring & Connection', price: '₹899' },
      { name: 'Ceiling Fan & Heavy Appliance Fitting', price: '₹349' }
    ],
    ratingBreakdown: { 5: 150, 4: 25, 3: 6, 2: 2, 1: 1 },
    reviews: [
      { id: 1, user: 'Aarav Mehta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', rating: 5, date: '2 days ago', comment: 'Rajesh arrived within 25 minutes in Alambagh! Fixed our main tripping MCB quickly and neatly.' },
      { id: 2, user: 'Priya Sundaram', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', rating: 5, date: '1 week ago', comment: 'Excellent setup of smart WiFi switches in our 3BHK flat near Phoenix Mall Alambagh. Very courteous.' }
    ]
  },
  {
    id: 2,
    name: 'Priya Patel',
    profession: 'Senior Hair Stylist & Organic Beautician',
    category: 'salon',
    rating: 4.8,
    reviewsCount: 142,
    distance: '1.2 km',
    city: 'Lucknow, UP',
    area: 'Singar Nagar, Alambagh',
    isOpen: true,
    verified: true,
    experience: '6 Years',
    workingHours: '09:00 AM - 08:00 PM',
    pricePerHour: '₹499/hr',
    phone: '+91 98765 11223',
    email: 'priya.patel@localconnect.in',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&crop=faces&w=600&q=80',
    banner: heroBannerImg,
    about: 'Priya is a Certified Senior Beauty Therapist & Hair Stylist providing luxury home salon services across Alambagh, Chander Nagar, and Phoenix United Lucknow.',
    services: [
      { name: 'Organic Herbal Facial & Cleanup', price: '₹799' },
      { name: 'Keratin Hair Spa & Deep Conditioning', price: '₹1,499' },
      { name: 'Bridal Makeup & Styling Package', price: '₹4,999' },
      { name: 'Full Body Waxing & Pedicure', price: '₹999' }
    ],
    ratingBreakdown: { 5: 110, 4: 25, 3: 5, 2: 1, 1: 1 },
    reviews: [
      { id: 1, user: 'Sneha Kapoor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', rating: 5, date: 'Yesterday', comment: 'Priya brought complete professional hygiene kits to Singar Nagar Alambagh. Loved the facial Glow!' },
      { id: 2, user: 'Neha Verma', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80', rating: 5, date: '3 days ago', comment: 'Super gentle and high standard hair spa at home.' }
    ]
  },
  {
    id: 3,
    name: 'Amit Kumar',
    profession: 'Master Plumber & Leak Specialist',
    category: 'plumber',
    rating: 4.9,
    reviewsCount: 98,
    distance: '0.6 km',
    city: 'Lucknow, UP',
    area: 'Chander Nagar, Alambagh',
    isOpen: true,
    verified: true,
    experience: '8 Years',
    workingHours: '08:00 AM - 09:00 PM',
    pricePerHour: '₹349/hr',
    phone: '+91 97654 32109',
    email: 'amit.kumar@localconnect.in',
    image: plumberImg,
    banner: heroBannerImg,
    about: 'Amit Kumar is a Certified Master Plumber and Leak Detection Specialist serving households and commercial establishments in Alambagh, Lucknow.',
    services: [
      { name: 'Hidden Pipe Leakage Detection & Repair', price: '₹599' },
      { name: 'Geyser & Water Heater Installation', price: '₹499' },
      { name: 'Overhead Tank Cleaning & Pipe Flush', price: '₹899' },
      { name: 'Bathroom Tap & Commode Fitting', price: '₹299' }
    ],
    ratingBreakdown: { 5: 80, 4: 15, 3: 2, 2: 1, 1: 0 },
    reviews: [
      { id: 1, user: 'Vikram Malhotra', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', rating: 5, date: '4 days ago', comment: 'Extremely polite and skilled. Fixed a major hidden ceiling leak in Chander Nagar Alambagh without damaging tiles.' }
    ]
  },
  {
    id: 4,
    name: 'Sunita Devi',
    profession: 'Deep Home Cleaning & Sanitization Lead',
    category: 'cleaning',
    rating: 4.8,
    reviewsCount: 165,
    distance: '1.4 km',
    city: 'Lucknow, UP',
    area: 'Phoenix Mall Road, Alambagh',
    isOpen: true,
    verified: true,
    experience: '7 Years',
    workingHours: '08:00 AM - 07:00 PM',
    pricePerHour: '₹449/hr',
    phone: '+91 98123 45678',
    email: 'sunita.devi@localconnect.in',
    image: sunitaImg,
    banner: heroBannerImg,
    about: 'Sunita leads an experienced team of home cleaning experts providing deep sanitization, sofa shampooing, and modular kitchen cleaning in Alambagh, Lucknow.',
    services: [
      { name: '3BHK Complete Deep Cleaning & Sanitization', price: '₹2,499' },
      { name: 'Fabric Sofa & Carpet Foam Wash', price: '₹899' },
      { name: 'Modular Kitchen Oil Degreasing', price: '₹999' },
      { name: 'Bathroom Acid Cleaning & Polish', price: '₹499' }
    ],
    ratingBreakdown: { 5: 130, 4: 28, 3: 5, 2: 1, 1: 1 },
    reviews: [
      { id: 1, user: 'Sanjay Reddy', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', rating: 5, date: '3 days ago', comment: 'Our flat looks brand new before Diwali! Impressive attention to detail.' }
    ]
  },
  {
    id: 5,
    name: 'Rohan Verma',
    profession: 'Senior Fullstack Web & Mobile Developer',
    category: 'webdev',
    rating: 5.0,
    reviewsCount: 76,
    distance: '1.0 km',
    city: 'Lucknow, UP',
    area: 'Krishna Nagar, Alambagh',
    isOpen: true,
    verified: true,
    experience: '6 Years',
    workingHours: '10:00 AM - 08:00 PM',
    pricePerHour: '₹899/hr',
    phone: '+91 99887 11223',
    email: 'rohan.verma@localconnect.in',
    image: rohanImg,
    banner: heroBannerImg,
    about: 'Rohan is a Senior Fullstack Web & Mobile Application Engineer delivering modern websites, custom software, and ecommerce portals for businesses in Alambagh, Lucknow.',
    services: [
      { name: 'Custom React & Node.js Website Development', price: '₹14,999' },
      { name: 'E-Commerce Store with UPI & Razorpay', price: '₹19,999' },
      { name: 'Android & iOS Mobile App Build', price: '₹29,999' },
      { name: 'Website Speed & SEO Optimization', price: '₹4,999' }
    ],
    ratingBreakdown: { 5: 72, 4: 4, 3: 0, 2: 0, 1: 0 },
    reviews: [
      { id: 1, user: 'Kiran Desai', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80', rating: 5, date: '1 week ago', comment: 'Delivered our retail business portal ahead of schedule with UPI payments integrated seamlessly.' }
    ]
  },
  {
    id: 6,
    name: 'Dr. Ananya Sen',
    profession: 'IIT-JEE & Physics Master Tutor',
    category: 'tutors',
    rating: 4.9,
    reviewsCount: 112,
    distance: '1.5 km',
    city: 'Lucknow, UP',
    area: 'VIP Road, Alambagh',
    isOpen: true,
    verified: true,
    experience: '10 Years',
    workingHours: '04:00 PM - 09:00 PM',
    pricePerHour: '₹699/hr',
    phone: '+91 98321 65498',
    email: 'ananya.sen@localconnect.in',
    image: ananyaImg,
    banner: heroBannerImg,
    about: 'Dr. Sen is an IITian & Physics Master Tutor helping school and JEE/NEET aspirants in Alambagh, Lucknow excel in competitive exams with conceptual clarity.',
    services: [
      { name: 'Class 11 & 12 Physics Home Tuition', price: '₹6,000/mo' },
      { name: 'IIT-JEE & NEET Physics Crash Course', price: '₹8,999' },
      { name: 'Class 9 & 10 Science Foundation', price: '₹4,500/mo' },
      { name: '1-on-1 Doubt Clearing Session', price: '₹599/hr' }
    ],
    ratingBreakdown: { 5: 102, 4: 8, 3: 2, 2: 0, 1: 0 },
    reviews: [
      { id: 1, user: 'Ramesh Mukherjee', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80', rating: 5, date: '5 days ago', comment: 'Dr. Sen helped my son improve his Physics percentile from 82 to 99 in JEE Mains!' }
    ]
  }
];

export const indianServicesCatalog = [
  {
    id: 'web-dev',
    title: 'Web Development for Indian Businesses',
    category: 'Digital Services',
    icon: 'FiCode',
    description: 'Custom, fast, and SEO-optimized web applications tailored for Indian MSMEs, D2C brands, and corporate enterprises.',
    features: ['Responsive UI/UX', 'Razorpay & UPI Payment Integration', 'WhatsApp Chat Widget', 'Hindi & Regional Language Support']
  },
  {
    id: 'ecom-solutions',
    title: 'E-commerce Solutions for Indian Retailers',
    category: 'Digital Services',
    icon: 'FiShoppingBag',
    description: 'Launch your online store with local payment gateways (UPI, Paytm, PhonePe), GST invoicing, and Indian logistics APIs.',
    features: ['Product Catalog Management', 'GST Tax Invoice Generator', 'Shiprocket/Delhivery Integration', 'Mobile Responsive Store']
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing & Growth for Startups',
    category: 'Marketing',
    icon: 'FiTrendingUp',
    description: 'Hyper-targeted Google Ads, Meta Ads, and regional social media marketing to capture local Indian customer intent.',
    features: ['Google My Business Optimization', 'Instagram Reels & Content Creation', 'Local Citation Building', 'ROI Tracking Dashboard']
  },
  {
    id: 'mobile-app',
    title: 'Mobile App Development (Android & iOS)',
    category: 'Digital Services',
    icon: 'FiSmartphone',
    description: 'Native & cross-platform Flutter/React Native mobile apps tailored for Indian consumers with offline-first support.',
    features: ['Android & iOS Apps', 'Push Notifications', 'OTP SMS Login (Firebase/Msg91)', 'Fast Performance']
  },
  {
    id: 'seo-services',
    title: 'SEO Services for Indian Markets',
    category: 'Marketing',
    icon: 'FiSearch',
    description: 'Rank on top of Google searches for local Indian keywords in major metros and regional cities.',
    features: ['On-Page & Technical SEO', 'Local SEO & Map Pack Ranking', 'Keyword Strategy in English & Hindi', 'Monthly Ranking Reports']
  },
  {
    id: 'cloud-enterprise',
    title: 'Cloud & DevOps Solutions',
    category: 'Enterprise',
    icon: 'FiCloud',
    description: 'AWS / Google Cloud infrastructure migration, server setup, data security, and 99.9% uptime management.',
    features: ['AWS / GCP Cloud Architecture', 'Automated Backups', 'SSL & Cybersecurity Hardening', '24x7 Monitoring']
  }
];

export const posts = [
  {
    id: 1,
    name: 'Rajeshwari Iyer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    time: '2 hours ago',
    city: 'Bengaluru',
    category: 'Looking For',
    description: 'Looking for a reliable technician to service two Split AC units in Indiranagar 100ft Road before the summer heat. Any recommendations?',
    likes: 18,
    commentsCount: 6
  },
  {
    id: 2,
    name: 'Vikramaditya Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    time: '4 hours ago',
    city: 'Mumbai',
    category: 'For Sale',
    description: 'Selling a 4-seater Solid Teakwood Dining Table with chairs. Excellent condition, dark walnut polish. Pickup from Bandra West. Price: ₹12,500.',
    likes: 11,
    commentsCount: 4
  },
  {
    id: 3,
    name: 'Meenakshi Sundaram',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    time: '1 day ago',
    city: 'Chennai',
    category: 'Local Alert',
    description: 'Found a black leather wallet near Anna Nagar Metro Station Gate B. Contains driving license of Mr. Karthik R. Please message to verify and collect.',
    likes: 34,
    commentsCount: 12
  }
];

export const offers = [
  {
    id: 1,
    title: 'Monsoon Home Deep Clean Special',
    discount: '30% OFF',
    code: 'INDIA30',
    validUntil: 'Aug 31, 2026',
    serviceName: 'Full House Deep Sanitization & Eco-Clean',
    price: '₹1,999',
    originalPrice: '₹2,850'
  },
  {
    id: 2,
    title: 'Smart Home Automation Saver',
    discount: '₹500 OFF',
    code: 'SMARTHOME500',
    validUntil: 'Sept 15, 2026',
    serviceName: '3+ Modular Switch & Inverter Wiring Package',
    price: '₹1,299',
    originalPrice: '₹1,799'
  },
  {
    id: 3,
    title: 'Festive Organic Beauty Glow',
    discount: '20% OFF',
    code: 'FESTIVE20',
    validUntil: 'Aug 25, 2026',
    serviceName: 'O3+ Facial Spa + Luxury Manicure Package',
    price: '₹1,499',
    originalPrice: '₹1,899'
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Siddharth Rao',
    role: 'Homeowner, Alambagh Lucknow',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    quote: 'Local Link saved our house during a sudden electrical emergency! Rajesh arrived within 25 minutes in Alambagh, resolved the short circuit cleanly, and charged transparent UPI rates.'
  },
  {
    id: 2,
    name: 'Kavita Singhania',
    role: 'Small Business Owner, Singar Nagar Alambagh',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    quote: 'We hired a web developer through Local Link for our boutique shop in Lucknow. The process was smooth, communication was great, and our online sales doubled!'
  },
  {
    id: 3,
    name: 'Amitabh Joshi',
    role: 'Resident, Phoenix Mall Road Alambagh',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    quote: 'Finding trusted plumbers who provide upfront pricing in Lucknow used to be impossible. Local Link has verified professionals, clean service, and instant booking.'
  }
];

export const faqs = [
  {
    question: 'How are service professionals verified on Local Link India?',
    answer: 'Every professional undergoes a thorough 4-step verification process: Aadhaar/PAN Identity verification, Police Background Check, Skill & License Certification, and ongoing customer rating audits.'
  },
  {
    question: 'What payment options are supported?',
    answer: 'We support all major Indian payment methods: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, Net Banking, and Cash on Delivery after service completion.'
  },
  {
    question: 'Is there any warranty on the services provided?',
    answer: 'Yes! Local Link provides a 30-day Service Protection Guarantee on electrical, plumbing, carpentry, and appliance repair jobs performed by verified partners.'
  },
  {
    question: 'Which cities in India does Local Link operate in?',
    answer: 'We are active across major Indian cities including Lucknow, Kanpur, Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, and Ahmedabad.'
  },
  {
    question: 'How can I register as a local service provider or freelancer?',
    answer: 'Click on "Become a Provider" in the navigation menu or visit the Provider Console. Fill out your details, upload your identity documents, and start receiving job requests instantly.'
  }
];

export const initialChats = {};

export const bookings = [
  { id: 'BK-IN9821', customerName: 'Sandra Bullock', service: 'Full House Deep Sanitization & Eco-Clean', date: 'Jul 24, 2026', status: 'Pending', amount: '₹1,999' },
  { id: 'BK-IN9804', customerName: 'Aarav Mehta', service: 'Smart Switch & Inverter Wiring', date: 'Jul 22, 2026', status: 'Confirmed', amount: '₹1,299' },
  { id: 'BK-IN9752', customerName: 'Pooja Hegde', service: 'Geyser & Water Heater Fitting', date: 'Jul 18, 2026', status: 'Completed', amount: '₹699' },
  { id: 'BK-IN9610', customerName: 'Rohan Gupta', service: 'Custom React Web Development', date: 'Jul 10, 2026', status: 'Completed', amount: '₹25,000' }
];

export const userProfile = {
  name: 'Anshu Kumar',
  avatar: null,
  email: 'anshu.kumar@gmail.com',
  phone: '+91 98765 12345',
  address: 'House #45, Sector B, Alambagh, Lucknow, Uttar Pradesh 226005',
  city: 'Lucknow, UP',
  role: 'Customer',
  notifications: {
    emailAlerts: true,
    pushAlerts: true,
    smsAlerts: true
  }
};

// Network Helper Functions to manage dynamic worker profiles and published services
export const getNetworkWorkers = () => {
  const custom = localStorage.getItem('localconnect_network_workers');
  let customWorkers = [];
  if (custom) {
    try {
      customWorkers = JSON.parse(custom);
    } catch (e) {}
  }
  return [...workers, ...customWorkers];
};

export const saveNetworkWorker = (newWorker) => {
  const custom = localStorage.getItem('localconnect_network_workers');
  let customWorkers = [];
  if (custom) {
    try {
      customWorkers = JSON.parse(custom);
    } catch (e) {}
  }
  customWorkers.unshift(newWorker);
  localStorage.setItem('localconnect_network_workers', JSON.stringify(customWorkers));
  return [...workers, ...customWorkers];
};

export const getNetworkServices = (providerId) => {
  const custom = localStorage.getItem('localconnect_network_services');
  let customServices = [];
  if (custom) {
    try {
      customServices = JSON.parse(custom);
    } catch (e) {}
  }
  if (providerId) {
    return customServices.filter(s => 
      String(s.providerId) === String(providerId) || 
      String(s.providerEmail) === String(providerId) ||
      String(s.provider) === String(providerId)
    );
  }
  return [...nearbyLocalServices, ...customServices];
};

export const saveNetworkService = (newService) => {
  const custom = localStorage.getItem('localconnect_network_services');
  let customServices = [];
  if (custom) {
    try {
      customServices = JSON.parse(custom);
    } catch (e) {}
  }
  customServices.unshift(newService);
  localStorage.setItem('localconnect_network_services', JSON.stringify(customServices));
  return [...nearbyLocalServices, ...customServices];
};

export const getPersistentChatMessages = (targetKey) => {
  const key = `localconnect_messages_${targetKey}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return null;
};

export const savePersistentChatMessage = (targetKey, newMsgObj) => {
  const key = `localconnect_messages_${targetKey}`;
  const existing = getPersistentChatMessages(targetKey) || initialChats[targetKey] || [];
  const updated = [...existing, newMsgObj];
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const deleteNetworkService = (serviceId) => {
  const custom = localStorage.getItem('localconnect_network_services');
  if (custom) {
    try {
      let customServices = JSON.parse(custom);
      customServices = customServices.filter(s => String(s.id) !== String(serviceId) && String(s._id) !== String(serviceId));
      localStorage.setItem('localconnect_network_services', JSON.stringify(customServices));
    } catch (e) {}
  }
  return getNetworkServices();
};

export const getNetworkBookings = (providerId) => {
  const custom = localStorage.getItem('localconnect_network_bookings');
  let customBookings = [];
  if (custom) {
    try {
      customBookings = JSON.parse(custom);
    } catch (e) {}
  }
  const allBookings = [...customBookings, ...bookings];
  if (providerId) {
    return allBookings.filter(b => 
      String(b.providerId) === String(providerId) || 
      String(b.providerEmail) === String(providerId) ||
      String(b.worker) === String(providerId) ||
      String(b.provider) === String(providerId)
    );
  }
  return allBookings;
};

export const saveNetworkBooking = (newBooking) => {
  const custom = localStorage.getItem('localconnect_network_bookings');
  let customBookings = [];
  if (custom) {
    try {
      customBookings = JSON.parse(custom);
    } catch (e) {}
  }
  customBookings.unshift(newBooking);
  localStorage.setItem('localconnect_network_bookings', JSON.stringify(customBookings));
  return [...customBookings, ...bookings];
};

export const editPersistentChatMessage = (targetKey, messageId, newText) => {
  const key = `localconnect_messages_${targetKey}`;
  const existing = getPersistentChatMessages(targetKey) || [];
  const updated = existing.map(m => (String(m.id) === String(messageId) ? { ...m, text: newText, isEdited: true } : m));
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const deletePersistentChatMessage = (targetKey, messageId) => {
  const key = `localconnect_messages_${targetKey}`;
  const existing = getPersistentChatMessages(targetKey) || [];
  const updated = existing.filter(m => String(m.id) !== String(messageId));
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const saveCustomerNotification = (recipientKey, notificationObj) => {
  if (!recipientKey) return [];
  const key = `localconnect_notifications_${String(recipientKey).toLowerCase().trim()}`;
  const custom = localStorage.getItem(key);
  let notifs = [];
  if (custom) {
    try {
      notifs = JSON.parse(custom);
    } catch (e) {}
  }
  const fullNotifObj = { ...notificationObj, recipientKey: String(recipientKey).toLowerCase().trim() };
  notifs.unshift(fullNotifObj);
  localStorage.setItem(key, JSON.stringify(notifs));
  return notifs;
};

export const getCustomerNotifications = (userObj) => {
  if (!userObj) return [];
  
  // Extract all authorized identifiers for the current user
  const userKeys = [
    typeof userObj === 'string' ? userObj : null,
    userObj?._id,
    userObj?.email,
    userObj?.name
  ].filter(Boolean).map(k => String(k).toLowerCase().trim());

  const uniqueKeys = Array.from(new Set(userKeys));
  let userNotifs = [];

  uniqueKeys.forEach(key => {
    const storageKey = `localconnect_notifications_${key}`;
    const custom = localStorage.getItem(storageKey);
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        userNotifs = [...userNotifs, ...parsed];
      } catch (e) {}
    }
  });

  // Deduplicate notifications by id
  const seenIds = new Set();
  const authorizedNotifications = [];
  for (const n of userNotifs) {
    if (!seenIds.has(n.id)) {
      seenIds.add(n.id);
      authorizedNotifications.push(n);
    }
  }

  return authorizedNotifications;
};

export const markCustomerNotificationRead = (userObj, notificationId) => {
  if (!userObj) return;
  const userKeys = [
    typeof userObj === 'string' ? userObj : null,
    userObj?._id,
    userObj?.email,
    userObj?.name
  ].filter(Boolean).map(k => String(k).toLowerCase().trim());

  const uniqueKeys = Array.from(new Set(userKeys));
  uniqueKeys.forEach(key => {
    const storageKey = `localconnect_notifications_${key}`;
    const custom = localStorage.getItem(storageKey);
    if (custom) {
      try {
        let notifs = JSON.parse(custom);
        notifs = notifs.map(n => String(n.id) === String(notificationId) ? { ...n, read: true } : n);
        localStorage.setItem(storageKey, JSON.stringify(notifs));
      } catch (e) {}
    }
  });
};

export const markAllCustomerNotificationsRead = (userObj) => {
  if (!userObj) return;
  const userKeys = [
    typeof userObj === 'string' ? userObj : null,
    userObj?._id,
    userObj?.email,
    userObj?.name
  ].filter(Boolean).map(k => String(k).toLowerCase().trim());

  const uniqueKeys = Array.from(new Set(userKeys));
  uniqueKeys.forEach(key => {
    const storageKey = `localconnect_notifications_${key}`;
    const custom = localStorage.getItem(storageKey);
    if (custom) {
      try {
        let notifs = JSON.parse(custom);
        notifs = notifs.map(n => ({ ...n, read: true }));
        localStorage.setItem(storageKey, JSON.stringify(notifs));
      } catch (e) {}
    }
  });
};

export const saveSeparateAccount = (userObj) => {
  const isProvider = userObj.role === 'provider' || userObj.accountType === 'provider';
  const storageKey = isProvider ? 'localconnect_provider_accounts' : 'localconnect_customer_accounts';
  const existingStr = localStorage.getItem(storageKey);
  let accounts = [];
  if (existingStr) {
    try {
      accounts = JSON.parse(existingStr);
    } catch (e) {}
  }

  accounts = accounts.filter(a => a.email.toLowerCase() !== userObj.email.toLowerCase());
  const formattedUser = { ...userObj, role: isProvider ? 'provider' : 'user', accountType: isProvider ? 'provider' : 'customer' };
  accounts.unshift(formattedUser);
  localStorage.setItem(storageKey, JSON.stringify(accounts));
  return formattedUser;
};

export const findSeparateAccount = (email) => {
  if (!email) return null;
  const targetEmail = email.toLowerCase().trim();

  // Search Provider Accounts storage
  const providersStr = localStorage.getItem('localconnect_provider_accounts');
  if (providersStr) {
    try {
      const providers = JSON.parse(providersStr);
      const match = providers.find(p => p.email.toLowerCase() === targetEmail);
      if (match) return { ...match, role: 'provider', accountType: 'provider' };
    } catch (e) {}
  }

  // Search Customer Accounts storage
  const customersStr = localStorage.getItem('localconnect_customer_accounts');
  if (customersStr) {
    try {
      const customers = JSON.parse(customersStr);
      const match = customers.find(c => c.email.toLowerCase() === targetEmail);
      if (match) return { ...match, role: 'user', accountType: 'customer' };
    } catch (e) {}
  }

  // Default lookup based on email identifier
  if (targetEmail.includes('provider')) {
    return {
      _id: 'provider_' + Date.now(),
      name: email.split('@')[0] || 'Service Provider',
      email,
      role: 'provider',
      accountType: 'provider'
    };
  }

  return {
    _id: 'customer_' + Date.now(),
    name: email.split('@')[0] || 'Customer',
    email,
    role: 'user',
    accountType: 'customer'
  };
};

export const updateNetworkBookingStatus = (bookingId, newStatus) => {
  const custom = localStorage.getItem('localconnect_network_bookings');
  let customBookings = [];
  if (custom) {
    try {
      customBookings = JSON.parse(custom);
      customBookings = customBookings.map(b => 
        (String(b._id) === String(bookingId) || String(b.id) === String(bookingId) || String(b.bookingId) === String(bookingId)) 
          ? { ...b, status: newStatus } 
          : b
      );
      localStorage.setItem('localconnect_network_bookings', JSON.stringify(customBookings));
    } catch (e) {}
  }
};
