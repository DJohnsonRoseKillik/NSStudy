import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Shield, Trophy, Users, Calendar, CheckCircle, ChevronRight,
  Menu, X, Plus, Edit, Trash2, LogOut, Camera, ArrowRight,
  MapPin, Phone, Mail, Star, Clock, ChevronDown
} from 'lucide-react';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

// --- COMPONENTS ---

const MagneticButton = ({ children, className = "", onClick, type = "primary", icon: Icon, href }) => {
  const Tag = href ? 'a' : 'button';
  const props = href ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: href.startsWith('http') ? 'noopener noreferrer' : undefined } : { onClick };

  return (
    <Tag
      {...props}
      className={`magnetic-btn group relative px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 overflow-hidden cursor-pointer ${type === "primary"
        ? "bg-white text-primary hover:bg-gold hover:text-primary"
        : "border border-white/20 text-white hover:border-white/40"
        } ${className} transition-all duration-300`}
    >
      <div className="relative z-10 flex items-center gap-2">
        {children}
        {Icon && <Icon size={14} className="group-hover:translate-x-1 transition-transform duration-300" />}
      </div>
    </Tag>
  );
};

const SectionLabel = ({ children, className = "" }) => (
  <span className={`inline-block font-mono text-gold/80 text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-4 ${className}`}>
    {children}
  </span>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenu]);

  const navLinks = [
    { name: 'About', href: '#features' },
    { name: 'Instructors', href: '#instructors' },
    { name: 'Schedule', href: '#book' },
    { name: 'Pricing', href: '#book' },
    { name: 'Shop', href: 'https://www.newschoolbjjlondon.co.uk/shop' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-2' : 'py-4 sm:py-6'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`glass-strong rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-500 ${scrolled ? 'shadow-2xl shadow-black/20' : ''}`}>
          <a href="#" className="flex items-center gap-3">
            <img src="/logo.png" alt="New School BJJ" className="h-8 sm:h-10 w-auto invert" />
            <span className="font-black tracking-tight text-sm sm:text-lg hidden sm:block">NEW SCHOOL BJJ</span>
          </a>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-[11px] uppercase tracking-widest font-semibold text-white/70 hover:text-white transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <MagneticButton className="!px-5 !py-2.5 !text-[10px]" onClick={() => { window.location.hash = 'book'; }}>
              Join Now
            </MagneticButton>
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-primary/98 backdrop-blur-xl z-[200] flex flex-col transition-all duration-500 ${mobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex justify-between items-center p-6">
          <span className="font-black tracking-tight text-lg">MENU</span>
          <button
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-center px-10 gap-2">
          {navLinks.map((link, i) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenu(false)}
              className="text-4xl sm:text-5xl font-black tracking-tighter py-3 hover:text-gold transition-colors duration-300 border-b border-white/5"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {link.name}
            </a>
          ))}
        </div>
        <div className="p-10">
          <MagneticButton className="w-full justify-center !py-5" onClick={() => { setMobileMenu(false); window.location.hash = 'book'; }}>
            Book Your First Class
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-content > *", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        delay: 0.3
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[100svh] w-full flex items-end pb-16 sm:pb-24 md:pb-32 px-5 sm:px-8 md:px-10 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.png"
          className="w-full h-full object-cover grayscale opacity-50"
          alt=""
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/60 to-bg-dark/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-5xl hero-content w-full">
        <SectionLabel>Brazilian Jiu-Jitsu in Brixton</SectionLabel>
        <h1 className="hero-heading text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-serif italic font-black leading-[0.85] tracking-tighter mb-6 sm:mb-8 md:mb-10 text-accent">
          Expert <br className="hidden sm:block" /> Instruction.
        </h1>
        <p className="text-silver text-sm sm:text-base md:text-lg max-w-lg mb-8 sm:mb-10 leading-relaxed">
          A transformative journey teaching discipline, resilience, and world-class technique under championship-level coaching.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <MagneticButton icon={ChevronRight} onClick={() => { window.location.hash = 'book'; }}>
            Book your first class
          </MagneticButton>
          <MagneticButton type="secondary" onClick={() => { window.location.hash = 'book'; }}>
            View Memberships
          </MagneticButton>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:block animate-bounce">
        <ChevronDown size={20} className="text-white/30" />
      </div>
    </section>
  );
};

const Features = () => {
  const containerRef = useRef();
  const [shuffleIndex, setShuffleIndex] = useState(0);

  const shufflerItems = [
    { label: "Beginner Fundamentals", sub: "Build your base" },
    { label: "Advanced Techniques", sub: "Sharpen your game" },
    { label: "Competition Prep", sub: "Ready to compete" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setShuffleIndex(prev => (prev + 1) % shufflerItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={containerRef} className="py-20 sm:py-28 md:py-32 px-5 sm:px-8 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-12 sm:mb-16 md:mb-20">
        <SectionLabel>Why New School</SectionLabel>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter">
          Built Different
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        {/* Card 1: Shuffler */}
        <div className="feature-card card-glow glass rounded-2xl sm:rounded-3xl p-7 sm:p-9 md:p-10 flex flex-col min-h-[380px] sm:min-h-[420px] md:h-[500px] relative overflow-hidden group">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest mb-8 sm:mb-10 flex items-center gap-2">
            <Shield size={16} className="text-gold" /> Structured Curriculum
          </h3>
          <div className="flex-1 relative flex items-center justify-center">
            {shufflerItems.map((item, idx) => {
              const diff = (idx - shuffleIndex + shufflerItems.length) % shufflerItems.length;
              return (
                <div
                  key={item.label}
                  className="absolute w-full p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{
                    transform: `translateY(${diff * 18}px) scale(${1 - diff * 0.05})`,
                    zIndex: shufflerItems.length - diff,
                    opacity: 1 - diff * 0.4
                  }}
                >
                  <p className="text-xl sm:text-2xl font-serif italic">{item.label}</p>
                  <p className="text-silver text-xs mt-2">{item.sub}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-8 sm:mt-10 text-silver text-xs sm:text-sm">Designed for all levels, from beginners to advanced athletes.</p>
        </div>

        {/* Card 2: Community */}
        <div className="feature-card card-glow glass rounded-2xl sm:rounded-3xl p-7 sm:p-9 md:p-10 flex flex-col min-h-[380px] sm:min-h-[420px] md:h-[500px]">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest mb-8 sm:mb-10 flex items-center gap-2">
            <Users size={16} className="text-gold" /> Strong Community
          </h3>
          <div className="flex-1 flex flex-col gap-3">
            {[
              { stat: "500+", label: "Active Members" },
              { stat: "11", label: "Expert Instructors" },
              { stat: "6", label: "Classes Daily" },
              { stat: "7", label: "Days a Week" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-2xl sm:text-3xl font-black tracking-tighter">{item.stat}</span>
                <span className="text-[10px] sm:text-xs text-silver uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 sm:mt-10 text-silver text-xs sm:text-sm">Members support each other both on and off the mats.</p>
        </div>

        {/* Card 3: Schedule */}
        <div className="feature-card card-glow glass rounded-2xl sm:rounded-3xl p-7 sm:p-9 md:p-10 flex flex-col min-h-[380px] sm:min-h-[420px] md:h-[500px]">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest mb-8 sm:mb-10 flex items-center gap-2">
            <Calendar size={16} className="text-gold" /> Expert Instruction
          </h3>
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-6">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg sm:rounded-xl border transition-all duration-300 ${i === 1 || i === 3 || i === 5
                    ? 'bg-gold/20 border-gold/30 text-gold'
                    : 'bg-white/5 border-white/5'
                    }`}
                >
                  <span className="text-[10px] font-black">{day}</span>
                  {(i === 1 || i === 3 || i === 5) && <CheckCircle size={10} className="mt-0.5" />}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {["Morning Gi", "Lunchtime No-Gi", "Evening Fundamentals"].map(cls => (
                <div key={cls} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold">{cls}</span>
                  <Clock size={12} className="text-silver" />
                </div>
              ))}
            </div>
          </div>
          <p className="mt-8 sm:mt-10 text-silver text-xs sm:text-sm">Focused on technical development, fitness, and self-defense.</p>
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
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
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
    <section ref={sectionRef} className="bg-black py-24 sm:py-32 md:py-40 px-5 sm:px-8 md:px-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <img src="/hero.png" className="w-full h-full object-cover scale-150 blur-2xl" alt="" loading="lazy" />
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <SectionLabel className="reveal-item">The Manifesto</SectionLabel>
        <p className="reveal-item text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-8 sm:mb-12 max-w-3xl leading-snug">
          Most academies focus on: <span className="opacity-40 italic">unstructured rolling and generic fitness.</span>
        </p>
        <p className="reveal-item text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif italic text-white leading-tight">
          We focus on: a transformative journey teaching{' '}
          <span className="text-gold underline decoration-gold/40 decoration-1 underline-offset-8">discipline</span> and{' '}
          <span className="text-gold underline decoration-gold/40 decoration-1 underline-offset-8">resilience.</span>
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
            const scale = 1 - (self.progress * 0.08);
            const opacity = 1 - (self.progress * 0.5);
            const blur = self.progress * 15;
            gsap.to(card, { scale, opacity, filter: `blur(${blur}px)`, duration: 0.1 });
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      step: "01",
      title: "Learn the Foundations",
      desc: "Master the fundamental movements and entries that define elite Brazilian Jiu-Jitsu.",
    },
    {
      step: "02",
      title: "Build Your Resilience",
      desc: "Develop the mental fortitude and physical stamina to thrive in high-pressure scenarios.",
    },
    {
      step: "03",
      title: "Master the Application",
      desc: "Apply your skills in real-time sparring and competition scenarios with technical precision.",
    }
  ];

  return (
    <section ref={containerRef} className="relative">
      {steps.map((step, i) => (
        <div key={i} className="protocol-card min-h-[100svh] w-full sticky top-0 flex items-center justify-center bg-bg-dark border-t border-white/5 px-5 sm:px-8 md:px-10">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <span className="text-[20rem] sm:text-[30rem] md:text-[40rem] font-black text-white leading-none select-none">
              {step.step}
            </span>
          </div>
          <div className="max-w-4xl text-center relative z-10">
            <span className="font-mono text-gold text-xs tracking-widest block mb-4 sm:mb-6">STEP {step.step}</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-5 sm:mb-8 leading-none">
              {step.title}
            </h2>
            <p className="text-silver text-sm sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed">{step.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef();

  useEffect(() => {
    axios.get('/api/instructors')
      .then(res => {
        if (Array.isArray(res.data)) {
          setInstructors(res.data);
        } else {
          console.error('API did not return an array:', res.data);
          setInstructors([]);
        }
      })
      .catch(() => setInstructors([]))
      .finally(() => setLoading(false));
  }, []);

  useLayoutEffect(() => {
    if (loading) return;
    let ctx = gsap.context(() => {
      gsap.from(".instructor-card", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <section id="instructors" ref={sectionRef} className="py-20 sm:py-28 md:py-32 px-5 sm:px-8 md:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 md:mb-20 gap-6">
        <div>
          <SectionLabel>The Team</SectionLabel>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
            Expert <br /> Lineup
          </h2>
        </div>
        <p className="max-w-md text-silver text-sm leading-relaxed">
          Benefit from elite instruction led by World Champion Reiss Bailey and our team of dedicated practitioners.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-2xl sm:rounded-3xl p-4 pb-8 animate-pulse">
              <div className="aspect-[4/5] rounded-xl sm:rounded-2xl bg-white/5 mb-6"></div>
              <div className="px-3">
                <div className="h-3 w-20 bg-white/10 rounded mb-3"></div>
                <div className="h-5 w-32 bg-white/10 rounded mb-2"></div>
                <div className="h-3 w-40 bg-white/5 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : instructors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {instructors.map(inst => (
            <div key={inst.id} className="instructor-card group relative glass card-glow rounded-2xl sm:rounded-3xl p-3 sm:p-4 pb-8 sm:pb-10 transition-all duration-500 hover:scale-[1.01] hover:border-white/15">
              <div className="aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden mb-5 sm:mb-8 relative">
                <img
                  src={inst.profile_picture_url ? `/${inst.profile_picture_url}` : 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop'}
                  alt={inst.name}
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                {inst.instagram_handle && (
                  <a
                    href={`https://instagram.com/${inst.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-primary transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-gold"
                    aria-label={`${inst.name} on Instagram`}
                  >
                    <i className="fa-brands fa-instagram text-lg"></i>
                  </a>
                )}
              </div>
              <div className="px-2 sm:px-4">
                <span className="font-mono text-gold/70 text-[10px] uppercase tracking-widest">{inst.bjj_rank || 'Instructor'}</span>
                <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tighter mt-1">{inst.name}</h3>
                {inst.achievements && (
                  <p className="text-silver text-xs mt-2 flex items-center gap-1.5">
                    <Trophy size={12} className="text-gold/60" />
                    {inst.achievements}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-silver">
          <Users size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">Instructor profiles coming soon.</p>
        </div>
      )}
    </section>
  );
};

const GymdeskWidgetSection = () => (
  <section id="book" className="mx-3 sm:mx-5 md:mx-8 lg:mx-10 my-8">
    <div className="bg-white text-primary rounded-2xl sm:rounded-3xl md:rounded-[3rem] py-16 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <span className="inline-block font-mono text-primary/40 text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-4">
            Memberships & Booking
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-4 sm:mb-6">
            Start Your<br />Journey
          </h2>
          <p className="max-w-xl mx-auto text-primary/50 text-sm sm:text-base">
            Join our community in Brixton. Select a plan and begin training today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-16 sm:mb-20">
          {[
            { name: "1 Month Trial", price: "£20", desc: "1 month unlimited fundamentals program. Perfect for trying us out.", popular: false },
            { name: "2 Classes / Week", price: "£70", desc: "Ongoing access to advanced and fundamentals classes.", popular: true },
            { name: "Unlimited", price: "£95", desc: "Full ongoing access to all sessions at Brixton.", popular: false }
          ].map(plan => (
            <div
              key={plan.name}
              className={`relative p-7 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${plan.popular
                ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/20'
                : 'bg-transparent border-primary/10 hover:border-primary/20'
                }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-primary text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-sm sm:text-base font-black uppercase mb-3 sm:mb-4">{plan.name}</h3>
              <p className="text-3xl sm:text-4xl font-serif italic mb-4 sm:mb-6">
                {plan.price}
                <span className="text-[10px] sm:text-xs uppercase font-sans font-black opacity-40 ml-2">/ month</span>
              </p>
              <p className={`text-xs sm:text-sm mb-8 sm:mb-10 leading-relaxed ${plan.popular ? 'text-white/50' : 'text-primary/50'}`}>
                {plan.desc}
              </p>
              <a
                href="https://www.newschoolbjjlondon.co.uk/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3.5 sm:py-4 rounded-full font-black uppercase tracking-widest text-[10px] sm:text-xs text-center transition-all duration-300 ${plan.popular
                  ? 'bg-white text-primary hover:bg-gold'
                  : 'bg-primary text-white hover:bg-primary/80'
                  }`}
              >
                Select Plan
              </a>
            </div>
          ))}
        </div>

        <div className="bg-primary/[0.03] rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-6 sm:p-10 md:p-16 lg:p-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
            <div>
              <span className="font-mono text-primary/30 text-[10px] tracking-widest uppercase block mb-2">This Week</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight">
                Weekly Schedule
              </h3>
            </div>
            <a
              href="https://www.newschoolbjjlondon.co.uk/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black uppercase flex items-center gap-2 text-primary/60 hover:text-primary transition-colors"
            >
              Full Schedule <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {[
              { time: "07:00 AM", title: "Gi Fundamentals", coach: "Leonardo Neves", spots: 12 },
              { time: "11:00 AM", title: "Gi Advanced", coach: "Leonardo Neves", spots: 8 },
              { time: "06:00 PM", title: "Beginners", coach: "Reiss Bailey", spots: 15 },
              { time: "07:00 PM", title: "Gi Fundamentals", coach: "Reiss Bailey", spots: 10 },
              { time: "08:00 PM", title: "No-Gi Advanced", coach: "Reiss Bailey", spots: 6 },
              { time: "12:00 PM", title: "Open Mat", coach: "All Instructors", spots: 20 }
            ].map(item => (
              <div
                key={item.time + item.title}
                className="bg-white border border-primary/5 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl flex justify-between items-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock size={12} className="text-primary/30 flex-shrink-0" />
                    <span className="font-mono text-[10px] sm:text-[11px] text-primary/40">{item.time}</span>
                    <span className="text-[10px] text-primary/20">|</span>
                    <span className="text-[10px] text-primary/30">{item.spots} spots</span>
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-black uppercase truncate">{item.title}</h4>
                  <p className="text-[10px] sm:text-xs text-primary/50 mt-0.5">{item.coach}</p>
                </div>
                <a
                  href="https://www.newschoolbjjlondon.co.uk/schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 ml-3 px-4 sm:px-6 py-2 border border-primary/10 rounded-full text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-all duration-300 group-hover:border-primary/20"
                >
                  Book
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="pt-20 sm:pt-28 md:pt-32 pb-8 sm:pb-10 px-5 sm:px-8 md:px-10">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-16 mb-16 sm:mb-24 md:mb-32">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <img src="/logo.png" className="h-10 sm:h-12 w-auto invert" alt="New School BJJ" />
            <span className="text-xl sm:text-2xl font-black tracking-tighter">NEW SCHOOL BJJ</span>
          </div>
          <p className="text-silver text-sm max-w-sm mb-8 sm:mb-10 leading-relaxed">
            A transformative journey through Brazilian Jiu-Jitsu in the heart of Brixton. Expert instruction, elite discipline.
          </p>
          <div className="flex gap-3">
            {[
              { icon: 'fa-instagram', href: 'https://www.instagram.com/newschoolbjj/', label: 'Instagram' },
              { icon: 'fa-x-twitter', href: 'https://twitter.com/_nsbjj', label: 'Twitter/X' },
              { icon: 'fa-facebook', href: 'https://www.facebook.com/NewSchoolBJJ/', label: 'Facebook' },
            ].map(social => (
              <a
                key={social.icon}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-white/10 flex items-center justify-center text-white/60 hover:bg-white hover:text-primary hover:border-transparent transition-all duration-300"
                aria-label={social.label}
              >
                <i className={`fa-brands ${social.icon}`}></i>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest mb-6 sm:mb-8 text-gold/70">Contact</h4>
          <ul className="space-y-4 text-silver text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={14} className="text-white/20 mt-0.5 flex-shrink-0" />
              <span>130 Brixton Hill,<br />London SW2 1RS</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={14} className="text-white/20 flex-shrink-0" />
              <a href="tel:07460351906" className="hover:text-white transition-colors">07460 351 906</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={14} className="text-white/20 flex-shrink-0" />
              <a href="mailto:Reiss@newschoolbjj.com" className="hover:text-white transition-colors">Reiss@newschoolbjj.com</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest mb-6 sm:mb-8 text-gold/70">Status</h4>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full pulse-ring"></div>
            <span className="font-mono text-[10px] uppercase text-green-500/80">Operational</span>
          </div>
          <div className="space-y-3">
            <a
              href="https://www.newschoolbjjlondon.co.uk/blogs"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-silver hover:text-white transition-colors"
            >
              Blog
            </a>
            <a
              href="https://www.newschoolbjjlondon.co.uk/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-silver hover:text-white transition-colors"
            >
              Shop
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-8 sm:pt-10 flex flex-col sm:flex-row justify-between gap-4 text-[10px] text-silver/60 font-mono uppercase tracking-widest">
        <span>&copy; {new Date().getFullYear()} New School BJJ Brixton</span>
        <span>Powered by Gymdesk</span>
      </div>
    </div>
  </footer>
);

// --- ADMIN PAGES ---

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/login', credentials);
      if (res.data.status === 'success') {
        localStorage.setItem('adminToken', res.data.token);
        onLogin();
        navigate('/admin/dashboard');
      }
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] flex items-center justify-center p-5 sm:p-10">
      <div className="glass-strong p-8 sm:p-10 rounded-2xl sm:rounded-3xl w-full max-w-md">
        <a href="/" className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="NSBJJ" className="h-8 w-auto invert" />
          <span className="font-black tracking-tight text-sm">NEW SCHOOL BJJ</span>
        </a>
        <h2 className="text-2xl sm:text-3xl font-black uppercase mb-2">Admin Access</h2>
        <p className="text-silver text-xs mb-8">Enter your credentials to access the dashboard.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="text-[10px] font-black uppercase text-silver block mb-2">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 focus:border-gold/50 outline-none transition-all text-sm"
              value={credentials.username}
              onChange={e => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-[10px] font-black uppercase text-silver block mb-2">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 focus:border-gold/50 outline-none transition-all text-sm"
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          {error && (
            <div className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-white text-primary font-black uppercase tracking-widest text-xs hover:bg-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
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
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchInstructors = useCallback(() => {
    axios.get('/api/instructors')
      .then(res => {
        if (Array.isArray(res.data)) setInstructors(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchInstructors(); }, [fetchInstructors]);

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

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', title: '', bjj_rank: '', achievements: '', instagram_handle: '' });
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (image) formData.append('image', image);

      if (editing) {
        formData.append('_method', 'PUT');
        await axios.post(`/api/instructor?id=${editing.id}`, formData);
      } else {
        await axios.post('/api/instructors', formData);
      }
      resetForm();
      fetchInstructors();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteInstructor = async (id) => {
    if (confirm('Are you sure you want to remove this instructor?')) {
      await axios.delete(`/api/instructor?id=${id}`);
      fetchInstructors();
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
          <div>
            <a href="/" className="text-xs text-silver hover:text-white transition-colors font-mono uppercase mb-2 inline-block">&larr; Back to site</a>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase">Command Center</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-silver hover:text-white font-mono text-xs uppercase px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="glass-strong p-6 sm:p-8 rounded-2xl sm:rounded-3xl lg:sticky lg:top-6">
              <h2 className="text-lg sm:text-xl font-black uppercase mb-5 sm:mb-6">
                {editing ? 'Edit Instructor' : 'Add Instructor'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="relative aspect-square rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 border-dashed flex items-center justify-center overflow-hidden mb-3 sm:mb-4 cursor-pointer hover:border-white/20 transition-all group">
                  {preview || (editing && editing.profile_picture_url) ? (
                    <img src={preview || `/${editing.profile_picture_url}`} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center">
                      <Camera className="mx-auto opacity-20 mb-2 group-hover:opacity-30 transition-opacity" size={36} />
                      <span className="text-[10px] text-silver/50 uppercase tracking-wider">Upload Photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    aria-label="Upload instructor photo"
                  />
                </div>
                {['name', 'title', 'bjj_rank', 'achievements', 'instagram_handle'].map(field => (
                  <input
                    key={field}
                    placeholder={
                      field === 'name' ? 'Name' :
                      field === 'title' ? 'Title (e.g. Head Instructor)' :
                      field === 'bjj_rank' ? 'BJJ Rank' :
                      field === 'achievements' ? 'Achievements' :
                      'Instagram Handle'
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-gold/30 transition-all text-sm placeholder:text-white/20"
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    required={field === 'name'}
                  />
                ))}
                <div className="flex gap-2 pt-3 sm:pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3.5 rounded-full bg-white text-primary font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-gold transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editing ? 'Update' : 'Add Instructor'}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 rounded-full border border-white/10 text-[10px] font-black uppercase hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="space-y-3 sm:space-y-4">
              {instructors.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <Users size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-silver text-sm">No instructors yet. Add your first one.</p>
                </div>
              ) : (
                instructors.map(inst => (
                  <div key={inst.id} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 flex items-center justify-between gap-4 hover:border-white/15 transition-all">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <img
                        src={inst.profile_picture_url ? `/${inst.profile_picture_url}` : 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=200&auto=format&fit=crop'}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover grayscale flex-shrink-0"
                        alt={inst.name}
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-lg font-black uppercase truncate">{inst.name}</h3>
                        <p className="text-[10px] sm:text-xs text-silver font-mono truncate">
                          {[inst.bjj_rank, inst.title].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setEditing(inst); setForm({ name: inst.name, title: inst.title || '', bjj_rank: inst.bjj_rank || '', achievements: inst.achievements || '', instagram_handle: inst.instagram_handle || '' }); setPreview(null); }}
                        className="p-2.5 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-blue-500/20 transition-all text-blue-400"
                        aria-label={`Edit ${inst.name}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteInstructor(inst.id)}
                        className="p-2.5 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-red-500/20 transition-all text-red-400"
                        aria-label={`Delete ${inst.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
