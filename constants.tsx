import React from 'react';
import type { Project, Tech, SocialLink, ExpertiseItem } from './types';

// Type for an Icon component
type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

// SVG ICONS as Components
export const ICONS: { [key: string]: IconComponent } = {
    Home: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Java: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M12 22s-8-4-8-10c0-5 3.5-8 8-8s8 3 8 8c0 6-8 10-8 10Z"/><path d="M12 11v-1"/><path d="M10 13c.33-2 2.33-2 2.67-2"/><path d="M12 15a2.5 2.5 0 0 0-2.5 2.5c0 1.42 1.12 2.5 2.5 2.5a2.5 2.5 0 0 0 0-5Z"/></svg>,
    JavaScript: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 18-2 6"/><path d="m2 18 14-12"/><path d="M12 2v20"/></svg>,
    Lua: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 15a6 6 0 0 0-6-6 6 6 0 0 0-6 6"/><path d="M12 3v6"/><path d="M21 15a9 9 0 0 0-18 0"/></svg>,
    Python: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16.2 3.8a2.2 2.2 0 0 1 2.7 2.7l-3.5 3.5a2.2 2.2 0 0 1-2.7-2.7z"/><path d="M10 13a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h1"/><path d="m14 14-3.5 3.5a2.2 2.2 0 0 1-2.7-2.7l3.5-3.5a2.2 2.2 0 0 1 2.7 2.7z"/><path d="M13 10a3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3v1"/></svg>,
    HTML5: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 16-4-2-4 2"/><path d="m18 8-4-2-4 2"/><path d="M12 2 4.5 6l7.5 4 7.5-4L12 2Z"/><path d="M4.5 14 12 18l7.5-4"/><path d="M4.5 10 12 14l7.5-4"/></svg>,
    TailwindCSS: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 17.5c-3.13.33-4.5-.2-4.5-2.5 0-2.5 2.5-4.5 5-4.5s5 2 5 4.5c0 2.3-1.37 2.83-4.5 2.5M9.5 12.5c-3.13.33-4.5-.2-4.5-2.5 0-2.5 2.5-4.5 5-4.5s5 2 5 4.5c0 2.3-1.37 2.83-4.5 2.5"/></svg>,
    Database: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/></svg>,
    Figma: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 12h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"/><path d="M12 6a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2Z"/><path d="M6 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2Z"/><path d="M18 12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Z"/><circle cx="12" cy="12" r="2"/></svg>,
    Trello: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><rect width="7" height="11" x="7" y="7" rx="1" ry="1"/><rect width="7" height="7" x="15" y="7" rx="1" ry="1"/></svg>,
    GitHub: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>,
    Git: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>,
    Discord: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.3 10C7.8 10.5 7.1 11 6 11h-1a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1c1.1 0 1.8.5 2.3 1"/><path d="M15.7 10c.5.5 1.2 1 2.3 1h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1c-1.1 0-1.8.5-2.3 1"/><path d="M12 11v10"/><path d="M7.5 12.5c0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5"/></svg>,
    Reddit: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M16.5 15.5c-.757 1.225-2.063 2-3.5 2s-2.743-.775-3.5-2"/><path d="M8.5 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/><path d="M16.5 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/></svg>,
    Twitch: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7" /></svg>,
    User: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    ExternalLink: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    Star: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
    Fork: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>,
    Code: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    Book: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    Mail: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    Refresh: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>,
    Server: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>,
    Browser: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M6 8h.01M10 8h.01M14 8h.01"></path></svg>,
    CodeSquare: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m10 10-2 2 2 2"/><path d="m14 14 2-2-2-2"/></svg>,
    ChevronRight: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>,
    Network: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="9" width="4" height="6"></rect><rect x="9" y="2" width="6" height="4"></rect><rect x="18" y="9" width="4" height="6"></rect><rect x="9" y="18" width="6" height="4"></rect><line x1="6" y1="12" x2="9" y2="12"></line><line x1="15" y1="12" x2="18" y2="12"></line><line x1="12" y1="6" x2="12" y2="9"></line><line x1="12" y1="15" x2="12" y2="18"></line></svg>,
    Hardware: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect><rect x="7" y="7" width="10" height="10" rx="1"></rect><line x1="12" y1="2" x2="12" y2="7"></line><line x1="12" y1="17" x2="12" y2="22"></line><line x1="2" y1="12" x2="7" y2="12"></line><line x1="17" y1="12" x2="22" y2="12"></line></svg>,
    Terminal: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>,
};

export const ABOUT_ME = {
    p1: "Hey there! I'm Flivyn. My journey in tech began with software development and Minecraft plugins, but my focus has now shifted to my apprenticeship as a Systems Integrator in Bavaria, Germany. My day-to-day is centered around hardware, networking, and server infrastructure, though I still enjoy exploring new code for personal projects.",
    p2: "Outside of technology, I'm a passionate photographer. I currently shoot with a Canon EOS 600D and am looking forward to buying either a Sony A6500 or a Nikon Z50 to further my hobby.",
    p3: "P.S. You may find some of my older projects under my previous alias, `ProxyFile` or `ProxyFileSF`."
};

export const DEFAULT_USER_STATS = { followers: 2, public_repos: 10 };

export const PROJECTS: Project[] = [
  {
    name: "SimplyChest",
    description: "Minecraft's default Ender Chest offers limited storage. To solve this for players and server admins, I developed SimplyChest to provide expandable, database-backed storage with a seamless migration path between SQLite and MySQL.",
    language: "Java",
    languageColor: "bg-orange-400",
    url: "https://github.com/ProxyFileSF/SimplyChest",
    stats: { codeSize: 25, forks: 0, stars: 1 },
    technologies: ["Java", "Spigot API", "MySQL", "SQLite"],
  },
  {
    name: "pyChat",
    description: "A lightweight yet powerful chat management plugin for Spigot/Paper servers. pyChat offers a fully customizable chat format, effective spam and advertisement protection, a configurable word blacklist, custom join/leave messages, and integration with Discord via webhooks for seamless cross-platform communication.",
    language: "Java",
    languageColor: "bg-orange-400",
    url: "https://github.com/flivyn/pyChat",
    stats: { codeSize: 45, forks: 0, stars: 0 },
    technologies: ["Java", "Spigot API", "Discord Webhooks"],
  },
  {
    name: "Money-Wash",
    description: "An open-source money laundering resource for FiveM servers, designed with a clean and modern user interface. While currently unmaintained, it provides a solid foundation for server owners to implement a configurable money-washing system with adjustable rates and locations.",
    language: "Lua",
    languageColor: "bg-blue-400",
    url: "https://github.com/ProxyFileSF/Money-Wash",
    stats: { codeSize: 5, forks: 0, stars: 0 },
    technologies: ["Lua", "FiveM"],
  },
  {
    name: "Revive-Station",
    description: "A simple and intuitive Revive Station resource for FiveM. This script offers a lightweight alternative to complex medical systems, allowing players to self-revive at a designated, configurable location. It's designed to be easily integrated into any server with minimal setup.",
    language: "Lua",
    languageColor: "bg-blue-400",
    url: "https://github.com/ProxyFileSF/Revive-Station",
    stats: { codeSize: 4, forks: 0, stars: 0 },
    technologies: ["Lua", "FiveM"],
  },
  {
    name: "Profile",
    description: "The repository containing the README and configuration for my personal GitHub profile. It serves as a central hub to showcase my skills, projects, and contributions in the developer community.",
    language: "Markdown",
    languageColor: "bg-gray-400",
    url: "https://github.com/flivyn/flivyn",
    stats: { codeSize: 2, forks: 0, stars: 0 },
    technologies: ["Markdown", "GitHub Actions"],
  },
];

export const EXPERTISE: ExpertiseItem[] = [
    {
        title: "Server & Network Administration",
        description: "Managing and maintaining server hardware, operating systems (Linux/Windows), and designing robust network infrastructures.",
        icon: ICONS.Network,
        color: "text-sky-500",
    },
    {
        title: "Hardware & Virtualization",
        description: "Assembling, troubleshooting, and upgrading physical systems. Implementing and managing virtual environments like VMware or Proxmox.",
        icon: ICONS.Hardware,
        color: "text-purple-500",
    },
    {
        title: "Scripting & Automation",
        description: "Automating routine tasks and managing systems at scale using scripting languages like PowerShell and Bash.",
        icon: ICONS.CodeSquare,
        color: "text-green-500",
    },
];

export const TECH_STACK: { title: string; techs: Tech[] }[] = [
    {
        title: "Development",
        techs: [
            { name: "Java", icon: ICONS.Java },
            { name: "JavaScript", icon: ICONS.JavaScript },
            { name: "Lua", icon: ICONS.Lua },
            { name: "Python", icon: ICONS.Python },
            { name: "HTML5", icon: ICONS.HTML5 },
            { name: "TailwindCSS", icon: ICONS.TailwindCSS },
        ],
    },
    {
        title: "Databases",
        techs: [
            { name: "MariaDB", icon: ICONS.Database },
            { name: "SQLite", icon: ICONS.Database },
            { name: "MySQL", icon: ICONS.Database },
        ],
    },
    {
        title: "Tools & Software",
        techs: [
            { name: "Figma", icon: ICONS.Figma },
            { name: "Trello", icon: ICONS.Trello },
            { name: "Git & GitHub", icon: ICONS.Git },
        ],
    },
];

export const SOCIAL_LINKS: SocialLink[] = [
    { name: "GitHub", url: "https://github.com/flivyn", icon: ICONS.GitHub, description: "Explore my code and projects." },
    { name: "Email", url: "mailto:contact@flivyn.dev", icon: ICONS.Mail, description: "Reach out for opportunities or inquiries." },
    { name: "Discord", url: "https://discord.com/users/896823225378545685", icon: ICONS.Discord, description: "Let's chat about tech and gaming." },
    { name: "Twitch", url: "https://www.twitch.tv/flivyn", icon: ICONS.Twitch, description: "Catch me live streaming (occasionally)." },
    { name: "Reddit", url: "https://www.reddit.com/user/ProxyFileSF/", icon: ICONS.Reddit, description: "See what I'm up to in the community." },
];