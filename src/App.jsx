import React, { useEffect, useState, useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue,
  AnimatePresence
} from 'framer-motion';
import { ArrowUpRight, Menu, ChevronDown, X, Cpu } from 'lucide-react'; // Added Cpu here
import './App.css';
import emailjs from '@emailjs/browser'; // Import EmailJS
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
                className={`fixed w-full top-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'mix-blend-difference'}`}
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
                
                <button 
                    className="md:hidden text-white z-50 relative"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </motion.nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed inset-0 bg-black z-40 flex flex-col justify-center items-center gap-8 md:hidden"
                    >
                        {['Work', 'Services', 'Team', 'Contact'].map((item) => (
                            <a 
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-4xl font-black text-white uppercase tracking-tighter"
                            >
                                {item}
                            </a>
                        ))}
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

/* --- WORK GALLERY (Vertical Parallax) --- */

const ProjectItem = ({ title, category, url, align }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div 
            ref={ref} 
            className={`flex w-full mb-20 md:mb-32 relative ${align === 'right' ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`relative w-full md:w-[65vw] h-[45vh] md:h-[70vh] group ${align === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}>
                
                <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
                    <div className="overflow-hidden w-full h-full relative border border-white/20 bg-neutral-900 rounded-sm">
                        <motion.div 
                            style={{ y }}
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
                        <div className="hidden md:block absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
                    </div>

                    <div className={`absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 pointer-events-none`}>
                        <h3 className="text-4xl md:text-8xl font-black uppercase text-white leading-[0.8] drop-shadow-xl mb-4 md:mb-6">
                            {title}
                        </h3>
                        
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
                    <ProjectItem title="Jepto" category="Real Estate Platform" url="https://jepto.vercel.app/" align="left" />
                    <ProjectItem title="Lush Virtuals" category="Digital Strategy" url="https://lush-virtuals.vercel.app/" align="right" />
                    <ProjectItem title="Tollis" category="E-Commerce System" url="https://tollis.vercel.app/" align="left" />
                </div>
            </div>
        </section>
    )
}

/* --- SERVICES --- */

const ServiceCard = ({ number, title, desc, svg: SvgIcon }) => {
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
                animate={{ height: hovered ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full bg-white z-0 flex items-center justify-center overflow-hidden pointer-events-none"
            >
                 <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 text-black">
                    <SvgIcon />
                 </div>
            </motion.div>
        </div>
    );
};

const SchematicGlobe = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none stroke-1">
        <circle cx="50" cy="50" r="45" opacity="0.2"/>
        <path d="M50 5 L50 95 M5 50 L95 50" opacity="0.2"/>
        <motion.path d="M50 5 A 45 45 0 0 1 50 95 A 45 45 0 0 1 50 5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }} />
    </svg>
);
const SchematicCpu = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none stroke-1">
        <rect x="20" y="20" width="60" height="60" opacity="0.2"/>
        <motion.rect x="30" y="30" width="40" height="40" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }}/>
    </svg>
);
const SchematicZap = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none stroke-1">
         <circle cx="50" cy="50" r="40" strokeDasharray="4 4" opacity="0.3" />
         <motion.path d="M55 25 L35 55 L50 55 L45 80 L65 50 L50 50 L55 25 Z" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />
    </svg>
);

const Services = () => {
    return (
        <section className="bg-black text-white py-20 md:py-24 min-h-screen" id="services">
            <div className="container mx-auto px-4 md:px-6 mb-12 md:mb-20">
                <h2 className="text-xs md:text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">Our Architecture</h2>
            </div>
            <div className="flex flex-col">
                <ServiceCard number="1" title="Websites" desc="Award-winning visuals. High-performance marketing sites." svg={SchematicGlobe} />
                <ServiceCard number="2" title="Platforms" desc="Scalable SaaS architectures. Backend complexity handled." svg={SchematicCpu} />
                <ServiceCard number="3" title="Systems" desc="Internal tools and blockchain integrations." svg={SchematicZap} />
            </div>
        </section>
    );
};

/* --- TEAM SECTION (Restored "Tactical Cards" with Colorful Images) --- */

const TeamMember = ({ name, role, img, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="group relative w-full aspect-[3/4] bg-neutral-900 border border-white/10 overflow-hidden hover:border-white/60 transition-colors duration-500 cursor-none"
  >
    {/* Image Container - Grayscale to Color on hover */}
    <div className="absolute inset-0 grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-700">
      <img src={img} alt={name} className="w-full h-full object-cover" />
    </div>
    
    {/* Overlay Data */}
    <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-b from-transparent via-transparent to-black/90">
      <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Cpu size={20} className="text-white animate-spin-slow" />
        <span className="text-[10px] font-mono border border-white/30 px-2 py-1 rounded text-white bg-black/50 backdrop-blur-sm">AUTH: {name.split(' ')[0].toUpperCase()}</span>
      </div>
      
      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-3xl font-black uppercase text-white leading-none mb-1">{name}</h3>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">{role}</p>
      </div>
    </div>
  </motion.div>
);

const Team = () => (
  <section id="team" className="py-32 px-6">
    <div className="container mx-auto">
      <h2 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-12">/ Personnel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Using specific colorful backgrounds as requested */}
        <TeamMember name="Elvis" role="Founder" delay={0} img="https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4" />
        <TeamMember name="Godswill" role="Lead Dev" delay={0.1} img="https://api.dicebear.com/9.x/notionists/svg?seed=Aneka&backgroundColor=c0aede" />
        <TeamMember name="Brendan" role="Frontend" delay={0.2} img="https://api.dicebear.com/9.x/notionists/svg?seed=Gizmo&backgroundColor=ffdfbf" />
        <TeamMember name="Desnan" role="Product Design" delay={0.3} img="https://api.dicebear.com/9.x/notionists/svg?seed=Milo&backgroundColor=d1d4f9" />
      </div>
    </div>
  </section>
);

/* --- CONTACT --- */

const Contact = () => {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true);

        // Replace these with your actual IDs from Step 2
        const SERVICE_ID = "service_vhnmjpo"; 
        const TEMPLATE_ID = "template_thcr0kl";
        const PUBLIC_KEY = "8KMDI_mf5yHPqTV1k";

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then((result) => {
                console.log(result.text);
                setLoading(false);
                alert("Transmission Received. We will be in touch."); // You can replace this with a toast notification
                e.target.reset();
            }, (error) => {
                console.log(error.text);
                setLoading(false);
                alert("Transmission Failed. Please try again.");
            });
    };

    // Configuration for inputs to ensure EmailJS gets the right data
    const formFields = [
        { label: 'Name', name: 'user_name', type: 'text' },
        { label: 'Email', name: 'user_email', type: 'email' },
        { label: 'Project Details', name: 'message', type: 'text' }
    ];

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

                {/* Attached ref and onSubmit handler */}
                <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-6 md:gap-8 relative z-10">
                    {formFields.map((field, i) => (
                        <div key={i} className="group relative">
                            <input 
                                type={field.type} 
                                name={field.name} // Important: This connects to EmailJS template
                                required
                                placeholder=" "
                                className="peer w-full bg-transparent border-b border-white/20 py-3 md:py-4 text-lg md:text-xl outline-none focus:border-white transition-all text-white placeholder-transparent"
                            />
                            <label className="absolute left-0 top-3 md:top-4 text-gray-500 text-xs md:text-sm font-mono uppercase transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white peer-valid:-top-4 peer-valid:text-xs peer-valid:text-white pointer-events-none">
                                {field.label}
                            </label>
                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-500 peer-focus:w-full"></div>
                        </div>
                    ))}
                    
                    <div className="mt-4 md:mt-8 flex justify-start">
                        {/* Changed Button to type="submit" */}
                        <MagneticButton className="bg-white text-black px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl font-bold uppercase tracking-tight hover:bg-gray-200 transition-colors flex items-center gap-4 group">
                            <button type="submit" disabled={loading} className="flex items-center gap-4 w-full h-full">
                                {loading ? 'Transmitting...' : 'Send Transmission'}
                                {!loading && <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                            </button>
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
                <Team />
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