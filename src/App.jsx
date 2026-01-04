import React, { useEffect, useState, useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue,
  useMotionTemplate,
  AnimatePresence
} from 'framer-motion';
import { ArrowUpRight, Menu, ChevronDown, X } from 'lucide-react';
import './App.css';
import logo from './assets/WhatsApp Image 2026-01-03 at 2.33.59 PM.jpeg';

/* --- 1. UTILITY COMPONENTS --- */

const MagneticButton = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    position.x.set(middleX * 0.15); 
    position.y.set(middleY * 0.15);
  };

  const reset = () => {
    position.x.set(0);
    position.y.set(0);
  };

  const { x, y } = position;
  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const SchematicGlobe = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none stroke-1">
        <circle cx="50" cy="50" r="45" opacity="0.2"/>
        <path d="M50 5 L50 95 M5 50 L95 50" opacity="0.2"/>
        <motion.path 
            d="M50 5 A 45 45 0 0 1 50 95 A 45 45 0 0 1 50 5" 
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }}
        />
        <motion.circle cx="50" cy="50" r="20" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.5 }} />
    </svg>
);

const SchematicCpu = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none stroke-1">
        <rect x="20" y="20" width="60" height="60" opacity="0.2"/>
        <motion.rect x="30" y="30" width="40" height="40" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }}/>
        <motion.path d="M50 30 L50 20 M50 70 L50 80 M30 50 L20 50 M70 50 L80 50" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1 }} />
    </svg>
);

const SchematicZap = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none stroke-1">
         <circle cx="50" cy="50" r="40" strokeDasharray="4 4" opacity="0.3">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite"/>
         </circle>
         <motion.path d="M55 25 L35 55 L50 55 L45 80 L65 50 L50 50 L55 25 Z" initial={{ pathLength: 0, fill: "transparent" }} whileInView={{ pathLength: 1, fill: "rgba(255,255,255,0.1)" }} transition={{ duration: 1 }} />
    </svg>
);

/* --- 2. LAYOUT & SECTIONS --- */

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <motion.nav 
                className={`fixed w-full top-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'mix-blend-difference'}`}
            >
                <div className="flex items-center gap-3">
                    <motion.img 
                        src={logo} 
                        alt="Cal-Tech"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover invert border border-white/30" 
                    />
                    <div className="text-lg md:text-xl font-black tracking-tighter uppercase text-white">Cal-Tech.</div>
                </div>

                <MagneticButton className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hidden md:block hover:bg-gray-200 transition-colors">
                    Start Project
                </MagneticButton>
                
                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-white z-50 relative"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed inset-0 bg-black z-40 flex flex-col justify-center items-center gap-8 md:hidden"
                    >
                        {['Work', 'Services', 'Contact'].map((item) => (
                            <a 
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-4xl font-black text-white uppercase tracking-tighter"
                            >
                                {item}
                            </a>
                        ))}
                        <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest mt-8">
                            Start Project
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Hero = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);
    const y = useTransform(scrollY, [0, 500], [0, 200]);

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX / width) - 0.5);
        mouseY.set((clientY / height) - 0.5);
    };

    return (
        <motion.section 
            onMouseMove={handleMouseMove}
            style={{ opacity }}
            className="h-screen w-full bg-black text-white flex flex-col justify-center items-center relative overflow-hidden perspective-1000 px-4"
        >
            <motion.div 
                className="absolute inset-[-50%] opacity-30"
                style={{
                    backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
                    backgroundSize: '4rem 4rem',
                    transform: useTransform(mouseY, (value) => `perspective(1000px) rotateX(${60 + value * 10}deg) scale(1.5)`),
                }}
            />

            <motion.div style={{ y }} className="z-10 text-center pointer-events-none w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 1 }}
                    className="flex items-center justify-center gap-4 mb-6"
                >
                    <div className="h-[1px] w-8 md:w-12 bg-white/50"></div>
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em]">Future Engineering</span>
                    <div className="h-[1px] w-8 md:w-12 bg-white/50"></div>
                </motion.div>
                
                {/* Responsive Font Sizes */}
                <h1 className="text-[14vw] md:text-[10vw] leading-[0.85] font-black uppercase tracking-tighter mix-blend-exclusion">
                    Constructing <br/>
                    <span className="text-stroke text-transparent">Digital</span> <br/>
                    Reality
                </h1>
            </motion.div>
            
            <motion.div 
                className="absolute bottom-10 mix-blend-difference"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <ChevronDown className="text-white opacity-50" />
            </motion.div>
        </motion.section>
    );
};

/* --- FIXED VISIBILITY GALLERY --- */

const ProjectItem = ({ title, category, url, align }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

    return (
        <div 
            ref={ref} 
            className={`flex w-full mb-20 md:mb-32 relative ${align === 'right' ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`relative w-full md:w-[65vw] h-[45vh] md:h-[70vh] group ${align === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}>
                
                <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
                    
                    {/* Frame Container */}
                    <div className="overflow-hidden w-full h-full relative border border-white/20 bg-neutral-900 rounded-sm">
                        
                        <motion.div 
                            style={{ y }} // Subtle parallax on mobile/desktop
                            className="absolute inset-0 w-full h-[120%] -top-[10%]"
                        >
                            <iframe 
                                src={url}
                                title={title}
                                loading="lazy"
                                scrolling="no"
                                className="w-full h-full border-0 pointer-events-none scale-100"
                            />
                        </motion.div>

                        {/* HOVER REVEAL - Desktop Only */}
                        <div className="hidden md:block absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                        
                        {/* THE FIX: CONTRAST GRADIENT (The "Scrim")
                           This sits *behind* the text but *above* the iframe. 
                           It ensures white text is readable even if the website is white.
                        */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

                    </div>

                    {/* Text Overlay - Positioned securely over the gradient */}
                    <div className={`absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 pointer-events-none`}>
                        {/* Title: Pure White, Drop Shadow for safety */}
                        <h3 className="text-4xl md:text-8xl font-black uppercase text-white leading-[0.8] drop-shadow-xl mb-4 md:mb-6">
                            {title}
                        </h3>
                        
                        {/* Info Bar */}
                        <div className="flex items-center gap-3 md:gap-4 bg-white/10 backdrop-blur-md p-3 md:p-4 border border-white/20 w-fit pointer-events-auto rounded-sm">
                            <span className="font-mono text-[10px] md:text-sm text-gray-200 uppercase tracking-widest">{category}</span>
                            <div className="w-4 md:w-8 h-[1px] bg-white/50"></div>
                            <span className="text-white text-xs md:text-base font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                Visit Live <ArrowUpRight size={16} />
                            </span>
                        </div>
                    </div>

                </a>
            </div>
        </div>
    )
}

const WorkGallery = () => {
    return (
        <section className="bg-black py-20 md:py-32 px-4 md:px-6 overflow-hidden" id="work">
            <div className="container mx-auto">
                <div className="mb-16 md:mb-24 max-w-2xl">
                    <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-4 md:mb-6">Selected Works</h2>
                    <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
                        A showcase of technical precision. These are live environments—click to explore.
                    </p>
                </div>

                <div className="flex flex-col">
                    <ProjectItem 
                        title="Jepto" 
                        category="Real Estate Platform" 
                        url="https://jepto.vercel.app/" 
                        align="left"
                    />
                    <ProjectItem 
                        title="Lush Virtuals" 
                        category="Digital Strategy" 
                        url="https://lush-virtuals.vercel.app/" 
                        align="right"
                    />
                    <ProjectItem 
                        title="Tollis" 
                        category="E-Commerce System" 
                        url="https://tollis.vercel.app/" 
                        align="left"
                    />
                </div>
            </div>
        </section>
    )
}

const ServiceCard = ({ number, title, desc, icon }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div 
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
            className="border-t border-white/20 py-12 md:py-20 group relative overflow-hidden cursor-none"
        >
            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-baseline gap-4 md:gap-8 transition-transform duration-500 group-hover:translate-x-4">
                    <span className="font-mono text-xs md:text-sm text-gray-500 transition-colors duration-300 group-hover:text-black/50">
                        0{number}
                    </span>
                    <h3 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter text-white transition-colors duration-300 group-hover:text-black">
                        {title}
                    </h3>
                </div>
                
                <div className="mt-6 md:mt-0 max-w-sm relative">
                    <p className="text-sm leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-black/80">
                        {desc}
                    </p>
                </div>
            </div>

            <motion.div 
                initial={false}
                animate={{ 
                    height: hovered ? '100%' : '0%',
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full bg-white z-0 flex items-center justify-center overflow-hidden pointer-events-none"
            >
                 <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 text-black">
                    {icon}
                 </div>
            </motion.div>
        </div>
    );
};

const Services = () => {
    return (
        <section className="bg-black text-white py-20 md:py-24 min-h-screen" id="services">
            <div className="container mx-auto px-4 md:px-6 mb-12 md:mb-20">
                <h2 className="text-xs md:text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">Our Architecture</h2>
            </div>
            <div className="flex flex-col">
                <ServiceCard 
                    number="1" 
                    title="Websites" 
                    desc="We build award-winning visuals. High-performance marketing sites that dominate search engines."
                    icon={<SchematicGlobe />}
                />
                <ServiceCard 
                    number="2" 
                    title="Platforms" 
                    desc="Scalable SaaS architectures. We handle the complexity of backend, security, and real-time data."
                    icon={<SchematicCpu />}
                />
                <ServiceCard 
                    number="3" 
                    title="Systems" 
                    desc="Internal tools and blockchain integrations. If it has an API, we can build a world around it."
                    icon={<SchematicZap />}
                />
            </div>
        </section>
    );
};

const Contact = () => {
    return (
        <section className="bg-neutral-900 text-white py-20 md:py-32 px-4 md:px-6 relative overflow-hidden" id="contact">
            <div className="container mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div>
                    <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-4 md:mb-8 leading-none">
                        Have an <br/> <span className="text-gray-500">Impossible</span> <br/> Idea?
                    </h2>
                    <p className="text-base md:text-xl text-gray-400 max-w-md">
                        We skip the small talk. Tell us the technical challenge, the deadline, and the vision. We handle the rest.
                    </p>
                </div>

                <form className="flex flex-col gap-6 md:gap-8 relative z-10" onSubmit={e => e.preventDefault()}>
                    {['Name', 'Email', 'Project Details'].map((label, i) => (
                        <div key={i} className="group relative">
                            <input 
                                type={label === 'Email' ? 'email' : 'text'} 
                                required
                                placeholder=" "
                                className="peer w-full bg-transparent border-b border-white/20 py-3 md:py-4 text-lg md:text-xl outline-none focus:border-white transition-all text-white placeholder-transparent"
                            />
                            <label className="absolute left-0 top-3 md:top-4 text-gray-500 text-xs md:text-sm font-mono uppercase transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white peer-valid:-top-4 peer-valid:text-xs peer-valid:text-white pointer-events-none">
                                {label}
                            </label>
                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-500 peer-focus:w-full"></div>
                        </div>
                    ))}
                    
                    <div className="mt-4 md:mt-8 flex justify-start">
                        <MagneticButton className="bg-white text-black px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl font-bold uppercase tracking-tight hover:bg-gray-200 transition-colors flex items-center gap-4 group">
                            Send Transmission
                            <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        </MagneticButton>
                    </div>
                </form>
            </div>
            <div className="absolute right-0 bottom-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
        </section>
    );
};

const App = () => {
    const [cursorXY, setCursorXY] = useState({ x: -100, y: -100 });
    const [cursorVariant, setCursorVariant] = useState('default');

    useEffect(() => {
        const moveCursor = (e) => setCursorXY({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    const variants = {
        default: { height: 16, width: 16, x: cursorXY.x - 8, y: cursorXY.y - 8, backgroundColor: "#fff", mixBlendMode: "difference" },
        text: { height: 100, width: 100, x: cursorXY.x - 50, y: cursorXY.y - 50, backgroundColor: "#fff", mixBlendMode: "difference" }
    };

    return (
        <div className="bg-black min-h-screen cursor-none selection:bg-white selection:text-black font-sans overflow-x-hidden">
            {/* Hide custom cursor on mobile to prevent touch interference */}
            <motion.div
                className="hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                variants={variants}
                animate={cursorVariant}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />

            <Navbar />
            
            <main>
                <Hero />
                <WorkGallery />
                <Services />
                <Contact />
            </main>

            <footer className="bg-black text-gray-600 py-8 px-6 text-center font-mono text-xs uppercase border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <span>© {new Date().getFullYear()} Cal-Tech Studios</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;