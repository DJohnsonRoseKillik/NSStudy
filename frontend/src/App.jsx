import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Instagram, Facebook, Twitter, Shield, Trophy, Users,
  Calendar, CheckCircle, ChevronRight, Menu, X,
  Plus, Edit, Trash2, LogOut, Camera, ExternalLink, ArrowRight
} from 'lucide-react';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

// --- UTILS ---

// --- COMPONENTS ---

const MagneticButton = ({ children, className = "", onClick, type = "primary", icon: Icon }) => (
  <button
    onClick={onClick}
    className={`magnetic-btn group relative px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 overflow-hidden ${type === "primary" ? "bg-white text-primary" : "border border-white/20 text-white"
      } ${className}`}
  >
    <span className="absolute inset-0 bg-white group-hover:bg-accent group-hover:scale-x-100 scale-x-0 origin-left transition-transform duration-500"></span>
    <div className="relative z-10 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
      {children}
      {Icon && <Icon size={16} className="group-hover:translate-x-1 transition-transform" />}
    </div>
  </button>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Schedule', href: '#schedule' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Book', href: '#book' },
    { name: 'Shop', href: 'https://www.newschoolbjjlondon.co.uk/shop' },
    { name: 'Blogs', href: 'https://www.newschoolbjjlondon.co.uk/blogs' },
  ];

  return (
    <nav className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 w-[95%] max-w-5xl ${scrolled ? 'top-4' : 'top-8'
      }`}>
      <div className={`glass rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 ${scrolled ? 'py-2 px-4 shadow-2xl border-white/20' : ''
        }`}>
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="NSBJJ" className="h-10 w-auto invert" />
          <span className="font-black tracking-tighter text-xl hidden md:block">NEW SCHOOL BJJ</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-widest font-bold hover:text-silver transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a href="#signup" className="hidden sm:block text-xs uppercase tracking-widest font-bold hover:text-silver transition-colors">Login</a>
          <MagneticButton className="!px-6 !py-2.5 !text-[10px]" onClick={() => window.location.hash = 'book'}>
            JOIN NOW
          </MagneticButton>
          <button className="md:hidden" onClick={() => setMobileMenu(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-primary z-[200] flex flex-col items-center justify-center gap-8 transition-transform duration-700 ${mobileMenu ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <button className="absolute top-10 right-10" onClick={() => setMobileMenu(false)}>
          <X size={32} />
        </button>
        {navLinks.map(link => (
          <a
            key={link.name}
            href={link.href}
            onClick={() => setMobileMenu(false)}
            className="text-3xl font-black tracking-tighter hover:italic hover:text-accent transition-all"
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-content > *", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex items-end pb-32 px-10 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/hero.png" className="w-full h-full object-cover grayscale opacity-60" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-5xl hero-content">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest mb-4">Transformative resilience is the</h2>
        <h1 className="text-7xl md:text-[9rem] font-serif italic font-black leading-[0.85] tracking-tighter mb-10 text-accent">
          Expert <br /> Instruction.
        </h1>
        <div className="flex flex-col sm:flex-row gap-6">
          <MagneticButton icon={ChevronRight} onClick={() => window.location.hash = 'book'}>Book your first class</MagneticButton>
          <MagneticButton type="secondary" onClick={() => window.location.hash = 'pricing'}>View Memberships</MagneticButton>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const containerRef = useRef();

  // Card 1: Diagnostic Shuffler
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const shufflerItems = [
    "Beginner Fundamentals",
    "Advanced Techniques",
    "Competition Prep"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setShuffleIndex(prev => (prev + 1) % shufflerItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Card 2: Telemetry Typewriter
  const [typedText, setTypedText] = useState("");
  const fullText = "Transformative journey teaching discipline, resilience, and valuable life lessons... [SYSTEM OPERATIONAL]";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) i = 0;
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="features" ref={containerRef} className="py-32 px-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
        {/* Card 1: Shuffler */}
        <div className="glass rounded-[3rem] p-10 flex flex-col h-[500px] relative overflow-hidden group">
          <h3 className="text-sm font-black uppercase tracking-widest mb-10 flex items-center gap-2">
            <Shield size={16} className="text-accent" /> Structured Curriculum
          </h3>
          <div className="flex-1 relative flex items-center justify-center">
            {shufflerItems.map((item, idx) => {
              const diff = (idx - shuffleIndex + shufflerItems.length) % shufflerItems.length;
              return (
                <div
                  key={item}
                  className="absolute w-full p-8 rounded-[2rem] border border-white/10 bg-white/5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{
                    transform: `translateY(${diff * 20}px) scale(${1 - diff * 0.05})`,
                    zIndex: shufflerItems.length - diff,
                    opacity: 1 - diff * 0.4
                  }}
                >
                  <p className="text-2xl font-serif italic">{item}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-10 text-silver text-sm">Designed for all levels, from beginners to advanced athletes.</p>
        </div>

        {/* Card 2: Typewriter */}
        <div className="glass rounded-[3rem] p-10 flex flex-col h-[500px]">
          <h3 className="text-sm font-black uppercase tracking-widest mb-10 flex items-center gap-2">
            <Users size={16} className="text-accent" /> Strong Community
          </h3>
          <div className="flex-1 bg-black/40 rounded-2xl p-6 font-mono text-sm leading-relaxed border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-green-500 font-black uppercase">Live Feed</span>
            </div>
            {typedText}<span className="inline-block w-2 h-4 bg-accent animate-pulse ml-1"></span>
          </div>
          <p className="mt-10 text-silver text-sm">Members support each other both on and off the mats.</p>
        </div>

        {/* Card 3: Scheduler */}
        <div className="glass rounded-[3rem] p-10 flex flex-col h-[500px]">
          <h3 className="text-sm font-black uppercase tracking-widest mb-10 flex items-center gap-2">
            <Calendar size={16} className="text-accent" /> Expert Instruction
          </h3>
          <div className="flex-1 grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-xl border border-white/5 ${i === 1 || i === 3 || i === 5 ? 'bg-accent text-primary' : 'bg-white/5'}`}>
                <span className="text-[10px] font-black">{day}</span>
                {(i === 1 || i === 3 || i === 5) && <CheckCircle size={12} className="mt-1" />}
              </div>
            ))}
            <div className="col-span-7 mt-6 p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono opacity-50">PROTOCOL_ACTIVE</span>
              <span className="text-[10px] font-black uppercase">Weekly Flow</span>
            </div>
          </div>
          <p className="mt-10 text-silver text-sm">Focused on technical development, fitness, and self-defense.</p>
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  const sectionRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-40 px-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img src="/hero.png" className="w-full h-full object-cover scale-150 blur-xl" style={{ transform: 'translateY(100px)' }} />
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <p className="reveal-item text-silver uppercase tracking-[0.3em] font-black text-xs mb-10">The Manifesto</p>
        <p className="reveal-item text-3xl md:text-4xl font-light mb-12 max-w-3xl leading-snug">
          Most academies focus on: <span className="opacity-40 italic">unstructured rolling and generic fitness.</span>
        </p>
        <p className="reveal-item text-4xl md:text-7xl font-serif italic text-white leading-tight">
          We focus on: a transformative journey teaching <span className="text-accent underline decoration-1 underline-offset-8">discipline</span> and <span className="text-accent underline decoration-1 underline-offset-8">resilience.</span>
        </p>
      </div>
    </section>
  );
};

const Protocol = () => {
  const containerRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".protocol-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          pin: true,
          pinSpacing: false,
          scrub: true,
          onUpdate: (self) => {
            const scale = 1 - (self.progress * 0.1);
            const opacity = 1 - (self.progress * 0.5);
            const blur = self.progress * 20;
            gsap.to(card, { scale, opacity, filter: `blur(${blur}px)`, duration: 0.1 });
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      title: "Learn the Foundations", desc: "Master the fundamental movements and entries that define elite Brazilian Jiu-Jitsu.", icon: () => (
        <svg className="w-full h-full opacity-20 animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" />
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 50 50)" />
        </svg>
      )
    },
    {
      title: "Build Your Resilience", desc: "Develop the mental fortitude and physical stamina to thrive in high-pressure scenarios.", icon: () => (
        <div className="w-full h-full relative opacity-20 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white animate-[scan_3s_ease-in-out_infinite]"></div>
          <div className="grid grid-cols-10 grid-rows-10 w-full h-full gap-2 p-4">
            {[...Array(100)].map((_, i) => <div key={i} className="bg-white/40 rounded-full"></div>)}
          </div>
        </div>
      )
    },
    {
      title: "Master the Application", desc: "Apply your skills in real-time sparring and competition scenarios with technical precision.", icon: () => (
        <div className="w-full h-full flex items-center justify-center opacity-20">
          <svg className="w-4/5 h-20" viewBox="0 0 400 100">
            <path d="M0 50 L150 50 L160 30 L175 70 L190 20 L205 80 L215 50 L400 50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000" className="animate-[pulse_4s_linear_infinite]" />
          </svg>
        </div>
      )
    }
  ];

  return (
    <section ref={containerRef} className="relative">
      {steps.map((step, i) => (
        <div key={i} className="protocol-card h-screen w-full sticky top-0 flex items-center justify-center bg-bg-dark border-t border-white/5 px-10">
          <div className="absolute inset-0 z-0">
            {step.icon()}
          </div>
          <div className="max-w-4xl text-center relative z-10">
            <span className="font-mono text-accent text-xs tracking-tighter block mb-6">PROTOCOL.STEP_0{i + 1}</span>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">{step.title}</h2>
            <p className="text-silver text-lg md:text-xl max-w-xl mx-auto">{step.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    axios.get('/api/instructors').then(res => {
      if (Array.isArray(res.data)) {
        setInstructors(res.data);
      } else {
        console.error('API did not return an array:', res.data);
        setInstructors([]);
      }
    });
  }, []);

  return (
    <section id="instructors" className="py-32 px-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <span className="font-mono text-accent text-xs tracking-tight block mb-4">THE_TEAM</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Expert <br /> Lineup</h2>
        </div>
        <p className="max-w-md text-silver text-sm">
          Benefit from elite instruction led by World Champion Reiss Bailey and our team of dedicated practitioners.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {instructors.map(inst => (
          <div key={inst.id} className="group relative glass rounded-[2.5rem] p-4 pb-10 transition-all duration-500 hover:scale-[1.02]">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 relative">
              <img
                src={inst.profile_picture_url ? `/${inst.profile_picture_url}` : 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop'}
                alt={inst.name}
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              {inst.instagram_handle && (
                <a
                  href={`https://instagram.com/${inst.instagram_handle}`}
                  className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                >
                  <i className="fa-brands fa-instagram text-xl"></i>
                </a>
              )}
            </div>
            <div className="px-4">
              <span className="font-mono text-accent text-[10px] uppercase tracking-widest">{inst.bjj_rank || 'Instructor'}</span>
              <h3 className="text-2xl font-black uppercase tracking-tighter mt-1">{inst.name}</h3>
              <p className="text-silver text-xs mt-2 font-serif italic">{inst.achievements}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const GymdeskWidgetSection = () => {
  // Note: In a real app, you'd paste the actual widget script tags or use the extracted components.
  // Here we'll show the pricing and schedule based on the extracted components but rendered with this site's UI tokens.

  return (
    <section id="book" className="py-32 px-10 bg-white text-primary rounded-[4rem]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">Memberships <br /> & Booking</h2>
          <p className="max-w-2xl mx-auto text-primary/60">
            Join our community in Brixton. Select a plan and start your journey today.
            Live schedule and secure booking powered by Gymdesk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { name: "1 Month Trial", price: "£20", desc: "1 month unlimited fundamentals program." },
            { name: "2 Classes / Week", price: "£70", desc: "Ongoing access to advanced and fundamentals.", accent: true },
            { name: "Unlimited Brixton", price: "£95", desc: "Full ongoing access to all sessions." }
          ].map(plan => (
            <div key={plan.name} className={`p-10 rounded-[3rem] border ${plan.accent ? 'bg-primary text-white' : 'bg-transparent border-primary/10'}`}>
              <h3 className="text-lg font-black uppercase mb-4">{plan.name}</h3>
              <p className="text-4xl font-serif italic mb-6">{plan.price}<span className="text-xs uppercase font-sans font-black opacity-50 ml-2">/ month</span></p>
              <p className={`text-sm mb-10 ${plan.accent ? 'text-white/60' : 'text-primary/60'}`}>{plan.desc}</p>
              <button className={`w-full py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all ${plan.accent ? 'bg-white text-primary hover:bg-silver' : 'bg-primary text-white hover:bg-primary/80'}`}>
                Select Plan
              </button>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 rounded-[4rem] p-10 md:p-20">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Weekly <br /> Schedule</h3>
            <a href="https://www.newschoolbjjlondon.co.uk/" target="_blank" className="text-xs font-black uppercase flex items-center gap-2">View Full <ArrowRight size={16} /></a>
          </div>
          {/* Simulated Schedule Component */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { time: "07:00 AM", title: "Gi- Fundamentals", coach: "Leonardo Neves" },
              { time: "11:00 AM", title: "Gi Advanced", coach: "Leonardo Neves" },
              { time: "06:00 PM", title: "Beginners", coach: "Reiss Bailey" },
              { time: "07:00 PM", title: "Gi Fundamentals", coach: "Reiss Bailey" }
            ].map(item => (
              <div key={item.time + item.title} className="bg-white border border-primary/5 p-6 rounded-[2rem] flex justify-between items-center transition-all hover:shadow-xl hover:-translate-y-1">
                <div>
                  <span className="font-mono text-[10px] text-primary/40 block mb-1">{item.time}</span>
                  <h4 className="text-lg font-black uppercase">{item.title}</h4>
                  <p className="text-xs text-primary/60">Coach: {item.coach}</p>
                </div>
                <button className="px-6 py-2 border border-primary/10 rounded-full text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-colors">Book</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="pt-32 pb-10 px-10 bg-black rounded-t-[4rem]">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-4 mb-8">
          <img src="/logo.png" className="h-12 w-auto invert" alt="NSBJJ" />
          <span className="text-2xl font-black tracking-tighter">NEW SCHOOL BJJ</span>
        </div>
        <p className="text-silver text-sm max-w-sm mb-10">
          A transformative journey through Brazilian Jiu-Jitsu in the heart of Brixton. Expert instruction, elite discipline.
        </p>
        <div className="flex gap-4">
          <a href="https://www.instagram.com/newschoolbjj/" target="_blank" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://twitter.com/_nsbjj" target="_blank" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
            <i className="fa-brands fa-x-twitter"></i>
          </a>
          <a href="https://www.facebook.com/NewSchoolBJJ/" target="_blank" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
            <i className="fa-brands fa-facebook"></i>
          </a>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-accent">Contact</h4>
        <ul className="space-y-4 text-silver text-sm">
          <li>130 Brixton Hill, London SW2 1RS</li>
          <li>07460 351 906</li>
          <li>Reiss@newschoolbjj.com</li>
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-accent">Status</h4>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-mono text-[10px] uppercase text-green-500">System Operational</span>
        </div>
      </div>
    </div>
    <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between gap-4 text-[10px] text-silver font-mono uppercase tracking-widest">
      <span>© 2026 New School BJJ Brixton</span>
      <span>Powered by Gymdesk & Antigravity</span>
      <span>All Rights Reserved</span>
    </div>
  </footer>
);

// --- ADMIN PAGES ---

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', credentials);
      if (res.data.status === 'success') {
        localStorage.setItem('adminToken', res.data.token);
        onLogin();
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-10">
      <div className="glass p-10 rounded-[3rem] w-full max-w-md">
        <h2 className="text-3xl font-black uppercase mb-8">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase opacity-50 block mb-2">Username</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-all"
              value={credentials.username}
              onChange={e => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase opacity-50 block mb-2">Password</label>
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-all"
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          {error && <p className="text-red-500 text-xs font-mono">{error}</p>}
          <MagneticButton className="w-full justify-center">Enter Dashboard</MagneticButton>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [instructors, setInstructors] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', title: '', bjj_rank: '', achievements: '', instagram_handle: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const fetchInstructors = () => axios.get('/api/instructors').then(res => setInstructors(res.data));

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (image) formData.append('image', image);

    if (editing) {
      formData.append('_method', 'PUT');
      await axios.post(`/api/instructor&id=${editing.id}`, formData);
    } else {
      await axios.post('/api/instructors', formData);
    }

    setEditing(null);
    setForm({ name: '', title: '', bjj_rank: '', achievements: '', instagram_handle: '' });
    setImage(null);
    setPreview(null);
    fetchInstructors();
  };

  const deleteInstructor = async (id) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`/api/instructor&id=${id}`);
      fetchInstructors();
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark p-10">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black uppercase">Command Center</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-silver hover:text-white font-mono text-xs uppercase"><LogOut size={16} /> Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-[2.5rem] sticky top-10">
            <h2 className="text-xl font-black uppercase mb-6">{editing ? 'Edit Instructor' : 'Add New Asset'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden mb-4">
                {preview || (editing && editing.profile_picture_url) ? (
                  <img src={preview || `/${editing.profile_picture_url}`} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="opacity-20" size={48} />
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
              </div>
              <input placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Title (e.g. Head Instructor)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <input placeholder="BJJ Rank" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" value={form.bjj_rank} onChange={e => setForm({ ...form, bjj_rank: e.target.value })} />
              <input placeholder="Achievements" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" value={form.achievements} onChange={e => setForm({ ...form, achievements: e.target.value })} />
              <input placeholder="Instagram Handle" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" value={form.instagram_handle} onChange={e => setForm({ ...form, instagram_handle: e.target.value })} />
              <div className="flex gap-2 pt-4">
                <MagneticButton className="flex-1 justify-center">{editing ? 'Update' : 'Deploy'}</MagneticButton>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', title: '', bjj_rank: '', achievements: '', instagram_handle: '' }); setPreview(null); }} className="px-6 rounded-full border border-white/10 text-[10px] font-black uppercase">Cancel</button>}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {instructors.map(inst => (
              <div key={inst.id} className="glass p-6 rounded-[2rem] flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <img src={inst.profile_picture_url ? `/${inst.profile_picture_url}` : 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop'} className="w-16 h-16 rounded-2xl object-cover grayscale" />
                  <div>
                    <h3 className="text-lg font-black uppercase">{inst.name}</h3>
                    <p className="text-xs text-silver font-mono">{inst.bjj_rank} | {inst.title}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(inst); setForm({ ...inst }); }} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-blue-400"><Edit size={18} /></button>
                  <button onClick={() => deleteInstructor(inst.id)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN WRAPPER ---

const MainLanding = () => (
  <main>
    <Navbar />
    <Hero />
    <Features />
    <Philosophy />
    <Protocol />
    <Instructors />
    <GymdeskWidgetSection />
    <Footer />
  </main>
);

const App = () => {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('adminToken'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLanding />} />
        <Route path="/admin" element={<AdminLogin onLogin={() => setIsAdmin(true)} />} />
        <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
};

export default App;
