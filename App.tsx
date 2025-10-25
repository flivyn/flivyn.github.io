import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SOCIAL_LINKS, PROJECTS as STATIC_PROJECTS, TECH_STACK, ICONS, ABOUT_ME, EXPERTISE } from './constants';
import ParticleBackground from './ParticleBackground';
import FakeTerminal from './FakeTerminal';
import type { Project, Tech, ExpertiseItem, SocialLink } from './types';

type Theme = 'light' | 'dark';

// --- Reusable Hooks ---

const useAnimateOnScroll = (options = { threshold: 0.1, triggerOnce: true }) => {
    const [isIntersecting, setIntersecting] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIntersecting(true);
                if (options.triggerOnce && element) {
                    observer.unobserve(element);
                }
            }
        }, options);

        if (element) observer.observe(element);
        return () => { if (element) observer.unobserve(element); };
    }, [options]);

    return [elementRef, isIntersecting] as const;
};

const useTypewriter = (words: string[], speed = 100, delay = 2000) => {
    const [text, setText] = useState('');
    const wordIndex = useRef(0);
    const letterIndex = useRef(0);
    const isDeleting = useRef(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const type = () => {
            const currentWord = words[wordIndex.current];
            let newText = '';
            let typeSpeed = speed;

            if (isDeleting.current) {
                newText = currentWord.substring(0, letterIndex.current - 1);
                letterIndex.current--;
                typeSpeed /= 2;
            } else {
                newText = currentWord.substring(0, letterIndex.current + 1);
                letterIndex.current++;
            }
            setText(newText);

            if (!isDeleting.current && newText === currentWord) {
                timeoutRef.current = setTimeout(() => { isDeleting.current = true; }, delay);
            } else if (isDeleting.current && newText === '') {
                isDeleting.current = false;
                wordIndex.current = (wordIndex.current + 1) % words.length;
                letterIndex.current = 0;
            }
        };
        timeoutRef.current = setTimeout(type, speed);
        return () => { if(timeoutRef.current) clearTimeout(timeoutRef.current) };
    }, [text, words, speed, delay]);

    return text;
};

// --- Helper Components ---

const SectionHeader: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>, label: string, children?: React.ReactNode, className?: string, isAdmin?: boolean }> = ({ icon: IconComponent, label, children, className = '', isAdmin = false }) => {
    return (
        <div className={`flex flex-col md:flex-row justify-center items-center gap-4 ${className}`} role="presentation">
            <div className="flex items-center gap-4">
                 <span className="sr-only">{label}</span>
                <div className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border border-slate-300 dark:border-slate-700 rounded-2xl shadow-lg">
                    <IconComponent className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                {isAdmin && <button className="px-4 py-1.5 text-sm bg-teal-500 text-white rounded-full animate-wiggle shadow-lg">Edit</button>}
            </div>
             <div className="flex-grow md:flex-grow-0">{children}</div>
        </div>
    );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const ExternalLinkIcon = ICONS.ExternalLink;
    const StarIcon = ICONS.Star;
    const ForkIcon = ICONS.Fork;
    const CodeIcon = ICONS.Code;
    
    return (
        <div className="bg-slate-200/20 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700 p-6 rounded-lg h-full flex flex-col group transition-all duration-300 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/10 transform hover:-translate-y-2">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{project.name}</h3>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                    <ExternalLinkIcon className="w-5 h-5" />
                </a>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-grow mb-6">{project.description}</p>
            {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map(tech => (
                        <span key={tech} className="text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 px-2 py-1 rounded-full">{tech}</span>
                    ))}
                </div>
            )}
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-4 mt-auto border-t border-slate-300 dark:border-slate-700 pt-4">
                <div className="flex items-center space-x-1">
                    <span className={`w-3 h-3 rounded-full ${project.languageColor}`}></span>
                    <span>{project.language}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4" />
                    <span>{project.stats.stars} Stars</span>
                </div>
                <div className="flex items-center space-x-1">
                    <ForkIcon className="w-4 h-4" />
                    <span>{project.stats.forks} Forks</span>
                </div>
                <div className="flex items-center space-x-1 ml-auto">
                    <CodeIcon className="w-4 h-4" />
                    <span>{project.stats.codeSize} KB</span>
                </div>
            </div>
        </div>
    );
};

const TechCategoryCard: React.FC<{ category: { title: string; techs: Tech[] } }> = ({ category }) => (
    <div className="bg-slate-200/20 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700 p-6 rounded-lg h-full">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">{category.title}</h3>
        <div className="grid grid-cols-3 gap-4">
            {category.techs.map((tech) => {
                const IconComponent = tech.icon;
                return (
                    <div key={tech.name} className="flex flex-col items-center justify-center text-center p-2 space-y-2 bg-slate-200/50 dark:bg-slate-800 rounded-lg transition-all duration-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 hover:scale-105">
                        <div className="text-slate-700 dark:text-slate-300">
                           <IconComponent className="w-8 h-8" />
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{tech.name}</span>
                    </div>
                );
            })}
        </div>
    </div>
);

const ExpertiseCard: React.FC<{ item: ExpertiseItem }> = ({ item }) => {
    const IconComponent = item.icon;
    return (
        <div className="bg-slate-200/20 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700 p-6 rounded-lg h-full group transition-all duration-300 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/10 transform hover:-translate-y-2">
            <div className={`mb-4 inline-block p-3 bg-slate-200 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 ${item.color}`}>
                <IconComponent className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{item.title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
        </div>
    );
};

const SocialLinkCard: React.FC<{ link: SocialLink }> = ({ link }) => {
    const IconComponent = link.icon;
    const ChevronRightIcon = ICONS.ChevronRight;
    
    return (
        <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-slate-200/20 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700 p-6 rounded-lg flex items-center space-x-4 transition-all duration-300 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/10 transform hover:-translate-y-1"
        >
            <div className="flex-shrink-0 text-slate-600 dark:text-slate-300">
                <IconComponent className="w-8 h-8" />
            </div>
            <div className="flex-grow">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{link.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{link.description}</p>
            </div>
            <div className="flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                <ChevronRightIcon className="w-6 h-6" />
            </div>
        </a>
    );
};


// Main App Component
function App() {
    const [theme, setTheme] = useState<Theme>('dark');
    const [heroVisible, setHeroVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    
    // GitHub API State
    const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Refs for each section
    const homeRef = useRef<HTMLElement>(null);
    const aboutRef = useRef<HTMLElement>(null);
    const expertiseRef = useRef<HTMLElement>(null);
    const projectsRef = useRef<HTMLElement>(null);
    const skillsRef = useRef<HTMLElement>(null);
    const contactRef = useRef<HTMLElement>(null);
    
    // Ref for the navigation container and state for its glider
    const navContainerRef = useRef<HTMLDivElement>(null);
    const [gliderStyle, setGliderStyle] = useState<React.CSSProperties>({ opacity: 0 });

    const isScrollingProgrammatically = useRef(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Refs for section animations
    const [aboutAnimRef, isAboutVisible] = useAnimateOnScroll();
    const [expertiseAnimRef, isExpertiseVisible] = useAnimateOnScroll();
    const [projectsAnimRef, isProjectsVisible] = useAnimateOnScroll();
    const [skillsAnimRef, isSkillsVisible] = useAnimateOnScroll();
    
    const typewriterText = useTypewriter(['A Systems Integrator apprentice.', 'A passionate developer from Germany.', 'Exploring the world of hardware and code.'], 100, 2000);

    const fetchRepoStats = useCallback(async () => {
        setIsLoading(true);
        const updatedProjects = await Promise.all(
            STATIC_PROJECTS.map(async (project) => {
                try {
                    const url = new URL(project.url);
                    const pathParts = url.pathname.slice(1).split('/');
                    if (pathParts.length < 2) return project;
                    const [owner, repo] = pathParts;

                    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
                    if (!response.ok) {
                        console.error(`Failed to fetch ${owner}/${repo}: ${response.statusText}`);
                        return project;
                    }
                    const data = await response.json();
                    return {
                        ...project,
                        stats: {
                            ...project.stats,
                            stars: data.stargazers_count,
                            forks: data.forks_count,
                        },
                    };
                } catch (error) {
                    console.error('Error fetching repo stats for', project.name, error);
                    return project;
                }
            })
        );
        setProjects(updatedProjects);
        setLastUpdated(new Date().toLocaleString());
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchRepoStats();
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) setTheme(savedTheme);
        const timer = setTimeout(() => setHeroVisible(true), 100);
        return () => {
            clearTimeout(timer);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [fetchRepoStats]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.body.className = theme === 'dark' ? 'text-slate-300' : 'text-slate-700';
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    useEffect(() => {
        const sections = [
            { id: 'home', ref: homeRef },
            { id: 'about', ref: aboutRef },
            { id: 'expertise', ref: expertiseRef },
            { id: 'projects', ref: projectsRef },
            { id: 'skills', ref: skillsRef },
            { id: 'contact', ref: contactRef },
        ];

        let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

        const handleScroll = () => {
            if (isScrollingProgrammatically.current) return;

            const viewportCenterY = window.innerHeight / 2;

            let closestSectionId = '';
            let minDistance = Infinity;

            sections.forEach(({ id, ref }) => {
                if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    const sectionCenterY = rect.top + rect.height / 2;
                    const distance = Math.abs(viewportCenterY - sectionCenterY);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSectionId = id;
                    }
                }
            });

            if (closestSectionId) {
                setActiveSection(closestSectionId);
            }
        };

        const throttledScrollHandler = () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(handleScroll, 100);
        };

        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
        handleScroll(); // Initial check on load

        return () => {
            window.removeEventListener('scroll', throttledScrollHandler);
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
        };
    }, []);

    const updateGliderPosition = useCallback(() => {
        if (!navContainerRef.current) return;
        const activeItem = navContainerRef.current.querySelector(`[data-section-id="${activeSection}"]`) as HTMLElement;
        if (activeItem) {
            const navRect = navContainerRef.current.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();
            setGliderStyle({
                left: `${itemRect.left - navRect.left}px`,
                width: `${itemRect.width}px`,
                height: `${itemRect.height}px`,
                opacity: 1,
            });
        }
    }, [activeSection]);
    
    useEffect(() => {
        updateGliderPosition();
        window.addEventListener('resize', updateGliderPosition);
        return () => window.removeEventListener('resize', updateGliderPosition);
    }, [updateGliderPosition]);

    const toggleTheme = () => setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');

    const navItems = [
        { id: 'home', icon: ICONS.Home, label: 'Home' },
        { id: 'about', icon: ICONS.User, label: 'About' },
        { id: 'expertise', icon: ICONS.Git, label: 'Core Skills' },
        { id: 'projects', icon: ICONS.GitHub, label: 'Projects' },
        { id: 'skills', icon: ICONS.Book, label: 'Skills' },
        { id: 'contact', icon: ICONS.Mail, label: 'Contact' },
    ];

    const handleNavClick = (id: string) => {
        setActiveSection(id);
        isScrollingProgrammatically.current = true;
        
        const element = document.getElementById(id);
        if (element) {
            const block = id === 'home' ? 'start' : 'center';
            element.scrollIntoView({ behavior: 'smooth', block });
        }

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
            isScrollingProgrammatically.current = false;
        }, 1000);
    };

    return (
        <div className="min-h-screen font-sans overflow-x-hidden relative">
            <ParticleBackground theme={theme} />
            
            <div className="relative z-10">
                <header className="fixed top-0 left-0 right-0 z-50 flex justify-end p-4">
                     <div className="flex items-center space-x-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border border-slate-300 dark:border-slate-700 rounded-full shadow-lg px-2 py-2">
                         <button onClick={toggleTheme} className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-full transition-colors" aria-label="Toggle theme">
                            {theme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                            )}
                        </button>
                    </div>
                </header>
                
                <main id="home" ref={homeRef} className="relative flex flex-col items-center justify-center h-screen text-center p-4">
                     <div className={`transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-4">
                            Hey, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">Flivyn</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 min-h-[56px] md:min-h-[32px]">
                            {typewriterText}
                            <span className="opacity-75 animate-ping">|</span>
                        </p>
                        <button
                          onClick={() => handleNavClick('about')}
                          className="px-8 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
                        >
                          Explore My Work
                        </button>
                    </div>
                </main>

                <div className="pb-10 px-4 space-y-24">
                    <div ref={aboutAnimRef} className={`transition-opacity duration-700 ease-out ${isAboutVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="max-w-7xl mx-auto bg-slate-900/20 dark:bg-slate-900/40 backdrop-blur-xl ring-1 ring-inset ring-slate-100/10 dark:ring-white/10 rounded-2xl p-8 md:p-12">
                            <section id="about" ref={aboutRef} className="space-y-8 scroll-mt-20">
                                <SectionHeader icon={ICONS.User} label="About Me" isAdmin={isAdmin} className={`mb-12 transition-all duration-500 ease-out ${isAboutVisible ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-5'}`} />
                                <div className="max-w-3xl mx-auto text-center space-y-4">
                                    <p className={`text-lg text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-500 ease-out ${isAboutVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-5'}`}>{ABOUT_ME.p1}</p>
                                    <p className={`text-lg text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-500 ease-out ${isAboutVisible ? 'opacity-100 translate-y-0 delay-400' : 'opacity-0 translate-y-5'}`}>{ABOUT_ME.p2}</p>
                                    <p className={`text-md text-slate-500 dark:text-slate-400 italic transition-all duration-500 ease-out ${isAboutVisible ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-5'}`}>{ABOUT_ME.p3}</p>
                                </div>
                            </section>
                        </div>
                    </div>
                    
                    <div ref={expertiseAnimRef} className={`transition-opacity duration-700 ease-out ${isExpertiseVisible ? 'opacity-100' : 'opacity-0'}`}>
                         <div className="max-w-7xl mx-auto bg-slate-900/20 dark:bg-slate-900/40 backdrop-blur-xl ring-1 ring-inset ring-slate-100/10 dark:ring-white/10 rounded-2xl p-8 md:p-12">
                            <section id="expertise" ref={expertiseRef} className="space-y-8 scroll-mt-20">
                                <SectionHeader icon={ICONS.Git} label="Core Skills" isAdmin={isAdmin} className="mb-12" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {EXPERTISE.map((item, index) => (
                                        <div key={item.title} className={`transition-all duration-500 ease-out ${isExpertiseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                                            <ExpertiseCard item={item} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    <div ref={projectsAnimRef} className={`transition-opacity duration-700 ease-out ${isProjectsVisible ? 'opacity-100' : 'opacity-0'}`}>
                         <div className="max-w-7xl mx-auto bg-slate-900/20 dark:bg-slate-900/40 backdrop-blur-xl ring-1 ring-inset ring-slate-100/10 dark:ring-white/10 rounded-2xl p-8 md:p-12">
                            <section id="projects" ref={projectsRef} className="space-y-8 scroll-mt-20">
                                <SectionHeader icon={ICONS.GitHub} label="My Projects" isAdmin={isAdmin} className="mb-12">
                                     <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                         {lastUpdated && <span>Last updated: {lastUpdated}</span>}
                                         <button onClick={fetchRepoStats} disabled={isLoading} className="disabled:opacity-50 disabled:cursor-not-allowed p-1 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                             <ICONS.Refresh className={isLoading ? 'animate-spin' : ''} />
                                         </button>
                                     </div>
                                </SectionHeader>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {projects.map((project, index) => (
                                        <div key={project.name} className={`transition-all duration-500 ease-out ${isProjectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                                            <ProjectCard project={project} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    <div ref={skillsAnimRef} className={`transition-opacity duration-700 ease-out ${isSkillsVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="max-w-7xl mx-auto bg-slate-900/20 dark:bg-slate-900/40 backdrop-blur-xl ring-1 ring-inset ring-slate-100/10 dark:ring-white/10 rounded-2xl p-8 md:p-12">
                            <section id="skills" ref={skillsRef} className="space-y-8 scroll-mt-20">
                                <SectionHeader icon={ICONS.Book} label="Tech Stack" isAdmin={isAdmin} className="mb-12" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {TECH_STACK.map((category, index) => (
                                       <div key={category.title} className={`transition-all duration-500 ease-out ${isSkillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                                          <TechCategoryCard category={category} />
                                       </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <footer id="contact" ref={contactRef} className="min-h-screen flex flex-col justify-center items-center py-20 px-4">
                    <div className="max-w-3xl w-full mx-auto text-center space-y-12">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">
                                Get In Touch
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                I'm always open to new opportunities and conversations. You can find me on these platforms.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            {SOCIAL_LINKS.map(link => <SocialLinkCard key={link.name} link={link} />)}
                        </div>
                    </div>
                </footer>
            </div>
            
            <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center">
                 <nav ref={navContainerRef} className="relative flex items-center space-x-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border border-slate-300 dark:border-slate-700 rounded-full shadow-lg px-3 py-2">
                    <div className="absolute rounded-xl bg-teal-100 dark:bg-teal-800/50 transition-all duration-300 ease-in-out" style={gliderStyle} />
                    {navItems.map(item => {
                        const IconComponent = item.icon;
                        return (
                            <button 
                                key={item.id}
                                data-section-id={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`relative z-10 p-2 rounded-xl transition-colors duration-200 ${ activeSection === item.id ? 'text-teal-600 dark:text-teal-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
                                aria-label={`Scroll to ${item.label}`}
                                title={item.label}
                            >
                                <IconComponent className="w-5 h-5" />
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="fixed bottom-6 right-6 z-40">
                <button 
                    onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                    className="p-2 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border border-slate-300 dark:border-slate-700 shadow-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                    aria-label="Toggle Terminal"
                    title="Toggle Terminal"
                >
                    <ICONS.Terminal className="w-5 h-5" />
                </button>
            </div>

            <FakeTerminal 
                isOpen={isTerminalOpen} 
                onClose={() => setIsTerminalOpen(false)} 
                onAdminChange={setIsAdmin} 
            />
        </div>
    );
}

export default App;