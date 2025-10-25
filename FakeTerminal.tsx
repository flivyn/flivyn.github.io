import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { FileSystemNode } from './types';

// --- THEMES ---
const THEMES = {
    dark: { bg: 'bg-slate-900/70', titlebar: 'bg-slate-800/80', text: 'text-slate-200', prompt: 'text-teal-400', scrollbarThumb: '#4a5568', scrollbarTrack: '#1e293b', },
    light: { bg: 'bg-slate-100/70', titlebar: 'bg-slate-200/80', text: 'text-slate-800', prompt: 'text-teal-600', scrollbarThumb: '#94a3b8', scrollbarTrack: '#e2e8f0', },
    retro: { bg: 'bg-black/90', titlebar: 'bg-gray-900/90', text: 'text-green-400', prompt: 'text-green-400', scrollbarThumb: '#3f3f46', scrollbarTrack: '#18181b', },
    ocean: { bg: 'bg-blue-900/70', titlebar: 'bg-blue-800/80', text: 'text-cyan-200', prompt: 'text-yellow-300', scrollbarThumb: '#2563eb', scrollbarTrack: '#1e3a8a', }
};
type ThemeName = keyof typeof THEMES;

// --- VFS (Virtual File System) ---
const initialVfs: FileSystemNode = {
    type: 'directory',
    children: {
        'about.txt': { type: 'file', content: `Hey, I'm Flivyn, a Systems Integrator apprentice from Germany.\n\nThis terminal is a fun feature of my portfolio.\nType 'help' to see all available commands.` },
        'contact.md': { type: 'file', content: `# Contact Information\n- **Email:** [contact@flivyn.dev](mailto:contact@flivyn.dev)\n- **GitHub:** [github.com/flivyn](https://github.com/flivyn)\n- **Discord:** flivyn` },
        'projects': { type: 'directory', children: { 'README.md': { type: 'file', content: 'This directory contains links to my projects. For now, check out the main portfolio page!' } } },
        'games': { type: 'directory', children: { 'snake': { type: 'file', content: "Executable snake game. Type 'snake' to play." } } }
    }
};

// --- Terminal Component ---
interface FakeTerminalProps { isOpen: boolean; onClose: () => void; onAdminChange: (isAdmin: boolean) => void; }

const FakeTerminal: React.FC<FakeTerminalProps> = ({ isOpen, onClose, onAdminChange }) => {
    const [vfs, setVfs] = useState<FileSystemNode>(JSON.parse(JSON.stringify(initialVfs))); // Deep copy
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>(['Welcome to FlivynTerm! Type `help` to get started.']);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isSnakeRunning, setSnakeRunning] = useState(false);
    const [isVimOpen, setVimOpen] = useState(false);
    const [vimFile, setVimFile] = useState({ path: '', name: '', content: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPasswordPrompt, setPasswordPrompt] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [theme, setTheme] = useState<ThemeName>('dark');

    const inputRef = useRef<HTMLInputElement>(null);
    const endOfHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => { onAdminChange(isAdmin); }, [isAdmin, onAdminChange]);
    useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen, isVimOpen, isSnakeRunning]);
    useEffect(() => { endOfHistoryRef.current?.scrollIntoView({ behavior: 'auto' }); }, [history, isBusy]);

    const resolvePath = useCallback((path: string, startNode: FileSystemNode = vfs): { node: FileSystemNode | null, parent: FileSystemNode | null, finalPart: string } => {
        const parts = path.split('/').filter(p => p);
        let currentNode: FileSystemNode = startNode;
        let parent: FileSystemNode | null = null;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (currentNode.type !== 'directory' || !currentNode.children[part]) {
                return { node: null, parent: currentNode, finalPart: part };
            }
            parent = currentNode;
            currentNode = currentNode.children[part];
        }
        return { node: currentNode, parent, finalPart: parts[parts.length - 1] || '' };
    }, [vfs]);
    
    const runAsyncTask = async (lines: { text: string; delay: number }[]) => {
        setIsBusy(true);
        for (const line of lines) {
            await new Promise(res => setTimeout(res, line.delay));
            setHistory(h => [...h, line.text]);
        }
        setIsBusy(false);
    };

    const handleCommand = (command: string): string[] => {
        const [cmd, ...args] = command.trim().split(' ');
        const fullPath = (parts: string[]) => parts.join('/');
        
        switch (cmd.toLowerCase()) {
            case 'help': return [ 'Available commands:', '  help, ls, cd, cat, whoami, date, neofetch, clear, exit', '  mkdir, touch, rm, pwd, echo, history, man, theme', '  vim, snake, apt, cowsay, sl, reboot' ];
            case 'ls': {
                const { node } = resolvePath(fullPath(currentPath), vfs);
                if (node?.type === 'directory') {
                    const entries = Object.keys(node.children);
                    return entries.length > 0 ? entries.map(e => node.children[e].type === 'directory' ? `<span class="text-blue-400">${e}/</span>` : e) : [];
                }
                return [`ls: cannot access '${fullPath(currentPath)}': Not a directory`];
            }
            case 'cd': {
                const newPathStr = args[0] || '';
                if (newPathStr === '..') { setCurrentPath(p => p.slice(0, -1)); return []; }
                if (newPathStr === '' || newPathStr === '~' || newPathStr === '/') { setCurrentPath([]); return []; }
                const targetPath = [...currentPath, ...newPathStr.split('/')].filter(p => p);
                const { node } = resolvePath(fullPath(targetPath), vfs);
                if (node?.type === 'directory') setCurrentPath(targetPath);
                else return [`cd: no such file or directory: ${newPathStr}`];
                return [];
            }
            case 'cat': {
                if (!args[0]) return ['cat: missing operand'];
                const { node } = resolvePath(fullPath([...currentPath, args[0]]), vfs);
                if (node?.type === 'file') return node.content.split('\n');
                return [`cat: ${args[0]}: No such file or directory`];
            }
            case 'mkdir': {
                if (!args[0]) return ['mkdir: missing operand'];
                const { node, parent, finalPart } = resolvePath(fullPath([...currentPath, args[0]]), vfs);
                if (node) return [`mkdir: cannot create directory ‘${args[0]}’: File exists`];
                if(parent?.type === 'directory') {
                    parent.children[finalPart] = { type: 'directory', children: {} };
                    setVfs({...vfs});
                }
                return [];
            }
            case 'touch': {
                if (!args[0]) return ['touch: missing operand'];
                const { node, parent, finalPart } = resolvePath(fullPath([...currentPath, args[0]]), vfs);
                if(node) return []; // Already exists, do nothing
                if (parent?.type === 'directory') {
                    parent.children[finalPart] = { type: 'file', content: '' };
                    setVfs({...vfs});
                }
                return [];
            }
            case 'rm': {
                const isRecursive = args[0] === '-r';
                const targetName = args[isRecursive ? 1 : 0];
                if (!targetName) return ['rm: missing operand'];
                const { node, parent } = resolvePath(fullPath([...currentPath, targetName]), vfs);
                if (!node) return [`rm: cannot remove '${targetName}': No such file or directory`];
                if (node.type === 'directory' && !isRecursive) return [`rm: cannot remove '${targetName}': Is a directory`];
                if (parent?.type === 'directory') {
                    delete parent.children[targetName];
                    setVfs({...vfs});
                }
                return [];
            }
            case 'vim': {
                if (!args[0]) return ['vim: missing file operand'];
                const filePath = fullPath([...currentPath, args[0]]);
                const { node } = resolvePath(filePath, vfs);
                if (node?.type !== 'file') return [`vim: can't open '${args[0]}'. Not a file.`];
                setVimFile({ path: filePath, name: args[0], content: node.content });
                setVimOpen(true);
                return [];
            }
            case 'theme': {
                const themeName = args[0] as ThemeName;
                if (THEMES[themeName]) { setTheme(themeName); return [`Theme set to ${themeName}.`]; }
                return [`Usage: theme [${Object.keys(THEMES).join('|')}]`];
            }
            case 'apt': {
                if (args[0] === 'update') runAsyncTask([{ text: 'Reading package lists... Done', delay: 400 }]);
                else if (args[0] === 'install') runAsyncTask([{ text: `Installing ${args[1] || 'cool-package'}... Done`, delay: 800 }]);
                else return ['apt: command not found. Did you mean `apt update` or `apt install`?'];
                return [];
            }
            case 'history': return commandHistory;
            case 'echo': return [args.join(' ')];
            case 'pwd': return ['/' + fullPath(currentPath)];
            case 'uname': return args[0] === '-a' ? ['Linux flivyn-portfolio 5.4.0 x86_64 GNU/Linux'] : ['Linux'];
            case 'man': return [`No manual entry for ${args[0] || 'anything'}`];
            case 'cowsay': { const msg = args.join(' ') || 'Moo!'; return [ ` < ${msg} >`, ` ${'-'.repeat(msg.length + 2)}`, `        \\   ^__^`, `         \\  (oo)\\_______`, `            (__)\\       )\\/\\`, `                ||----w |`, `                ||     ||`]; }
            case 'sl': runAsyncTask([ { text: "      =     _\\-~-/", delay: 200 }, { text: "     |\\__/..|      ", delay: 200 }, { text: "     \\/      |      ", delay: 200 }, { text: "     /        \\_____", delay: 200 }, { text: "     |___________|  ", delay: 200 } ]); return [];
            case 'reboot': runAsyncTask([{ text: 'Rebooting...', delay: 500 }]).then(onClose); return [];
            case 'whoami': return [isAdmin ? 'admin' : 'guest'];
            case 'date': return [new Date().toString()];
            case 'neofetch': return `    ,-.       <span class="text-teal-400">${isAdmin ? 'admin' : 'guest'}@portfolio</span>
    ./(       --------------
    (_=       <span class="text-teal-400">OS</span>: Web Browser
     ||       <span class="text-teal-400">Shell</span>: FlivynTerm
    ,(_).      
   ((_  )      
    *""*`.split('\n');
            case 'snake': setSnakeRunning(true); return [];
            case 'su':
                if (args.join(' ') === '- admin') { setPasswordPrompt(true); return ['Password:']; }
                if (args.join(' ') === '- guest') { if (isAdmin) { setIsAdmin(false); return ["Logged out."]; } return ["Already guest."]; }
                return ['su: invalid user'];
            case 'clear': setHistory([]); return [];
            case 'exit': 
                if (isAdmin) { setIsAdmin(false); return ["Exited admin mode."]; }
                onClose(); return [];
            case '': return [];
            default: return [`command not found: ${cmd}`];
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const command = input.trim();
        setInput('');
        setHistoryIndex(-1);

        if (isPasswordPrompt) {
            setHistory(h => [...h, 'Password:']);
            setPasswordPrompt(false);
            if(command === 'admin123') {
                setIsAdmin(true);
                setHistory(h => [...h, 'Authentication successful. Welcome, admin.']);
            } else {
                setHistory(h => [...h, 'Authentication failed.']);
            }
            return;
        }

        const user = isAdmin ? 'admin' : 'guest';
        const prompt = `<span class="${THEMES[theme].prompt}">${user}@flivyn</span>:<span class="text-blue-400">~/${currentPath.join('/')}</span>$ ${command}`;
        
        if (command) setCommandHistory(prev => [...prev, command]);
        
        const output = handleCommand(command);
        setHistory(h => [...h, prompt, ...output]);
    };
    
    const handleVimSave = (content: string) => {
        const { parent, finalPart } = resolvePath(vimFile.path, vfs);
        if(parent?.type === 'directory' && parent.children[finalPart]?.type === 'file') {
            parent.children[finalPart] = { type: 'file', content };
            setVfs({...vfs});
            setHistory(h => [...h, `"${vimFile.name}" written.`]);
        }
        setVimOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') { e.preventDefault(); const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1); if (newIndex >= 0) { setInput(commandHistory[commandHistory.length - 1 - newIndex]); setHistoryIndex(newIndex); } }
        else if (e.key === 'ArrowDown') { e.preventDefault(); const newIndex = Math.max(-1, historyIndex - 1); if (newIndex >= 0) setInput(commandHistory[commandHistory.length - 1 - newIndex]); else setInput(''); setHistoryIndex(newIndex); }
        else if (e.key === 'c' && e.ctrlKey) { setHistory(prev => [...prev, `<span>...$ ${input}</span>`, '^C']); setInput(''); setPasswordPrompt(false); }
    };
    
    const currentTheme = THEMES[theme];
    const user = isAdmin ? 'admin' : 'guest';
    const promptText = isPasswordPrompt ? '' : `<span><span class="${currentTheme.prompt}">${user}@flivyn</span>:<span class="text-blue-400">~/${currentPath.join('/')}</span>$ </span>`;

    return (
        <>
            <style>{`.terminal-scrollbar::-webkit-scrollbar{width:8px;}.terminal-scrollbar::-webkit-scrollbar-track{background:${currentTheme.scrollbarTrack};}.terminal-scrollbar::-webkit-scrollbar-thumb{background:${currentTheme.scrollbarThumb};border-radius:10px;}`}</style>
            <div className={`fixed bottom-0 right-0 h-full md:h-2/3 w-full md:max-w-3xl ${currentTheme.bg} ${currentTheme.text} backdrop-blur-xl text-sm font-mono shadow-2xl transition-transform duration-300 ease-in-out z-50 rounded-tl-lg border-l border-t border-white/10 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={() => inputRef.current?.focus()}>
                <div className={`${currentTheme.titlebar} p-2 flex items-center justify-between select-none`}><span>/bin/bash - flivyn.dev</span><button onClick={onClose} className="px-2 py-0.5 bg-red-500 rounded-full text-xs hover:bg-red-600">x</button></div>
                <div className="p-4 overflow-y-auto h-[calc(100%-40px)] terminal-scrollbar">
                    { !isVimOpen && !isSnakeRunning && history.map((line, index) => <div key={index} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: line }}></div>)}
                    { isVimOpen && <VimEditor file={vimFile} onSave={handleVimSave} onExit={() => setVimOpen(false)} /> }
                    { isSnakeRunning && <SnakeGame onExit={() => setSnakeRunning(false)} /> }
                    { !isBusy && !isVimOpen && !isSnakeRunning && (
                         <div className="flex"><span dangerouslySetInnerHTML={{ __html: promptText }} /><form onSubmit={handleSubmit} className="flex-1"><input ref={inputRef} type={isPasswordPrompt ? 'password' : 'text'} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="bg-transparent border-none w-full focus:outline-none" autoComplete="off" autoCapitalize="off" autoCorrect="off" /></form></div>
                    )}
                    <div ref={endOfHistoryRef} />
                </div>
            </div>
        </>
    );
};

// --- Vim Editor Component ---
const VimEditor: React.FC<{file: {name: string, content: string}, onSave: (content: string) => void, onExit: () => void}> = ({ file, onSave, onExit }) => {
    const [buffer, setBuffer] = useState(file.content);
    const [mode, setMode] = useState<'NORMAL' | 'INSERT'>('NORMAL');
    const [command, setCommand] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (mode === 'NORMAL') {
                if (e.key === 'i') { setMode('INSERT'); setCommand(''); }
                else if (e.key === ':') { setCommand(':'); }
                else if (command.startsWith(':')) {
                    if (e.key === 'Enter') {
                        if (command === ':wq') onSave(buffer);
                        else if (command === ':q') onExit();
                        setCommand('');
                    } else if (e.key === 'Backspace') setCommand(c => c.slice(0, -1));
                    else if (e.key.length === 1) setCommand(c => c + e.key);
                } else if (e.key === 'Escape') setCommand('');
            } else if (mode === 'INSERT') {
                if (e.key === 'Escape') { setMode('NORMAL'); textareaRef.current?.blur(); }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, command, buffer, onSave, onExit]);
    
    useEffect(() => { if (mode === 'INSERT') textareaRef.current?.focus(); }, [mode]);

    return (
        <div className="h-full flex flex-col">
            <textarea ref={textareaRef} value={buffer} onChange={(e) => setBuffer(e.target.value)} spellCheck="false" className="flex-grow w-full bg-transparent text-inherit outline-none resize-none" />
            <div className="flex-shrink-0 flex justify-between">
                <span className="bg-blue-800 text-white font-bold px-2">{mode === 'INSERT' ? '-- INSERT --' : ''}</span>
                <span>{command || `"${file.name}" ${buffer.split('\n').length}L`}</span>
            </div>
        </div>
    );
};

// --- Snake Game Component ---
const GRID_SIZE = 20;
const TICK_RATE = 150;
const SnakeGame: React.FC<{onExit: () => void}> = ({ onExit }) => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const generateFood = useCallback(() => {
        let newFoodPos;
        do { newFoodPos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }; }
        while (snake.some(s => s.x === newFoodPos.x && s.y === newFoodPos.y));
        setFood(newFoodPos);
    }, [snake]);

    const tick = useCallback(() => {
        if (gameOver) return;
        setSnake(prevSnake => {
            const newSnake = [...prevSnake];
            const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };
            if (head.x<0 || head.x>=GRID_SIZE || head.y<0 || head.y>=GRID_SIZE || newSnake.some(s=>s.x===head.x && s.y===head.y)) { setGameOver(true); return newSnake; }
            newSnake.unshift(head);
            if (head.x === food.x && head.y === food.y) { setScore(s => s + 1); generateFood(); }
            else newSnake.pop();
            return newSnake;
        });
    }, [direction, food, gameOver, generateFood]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'q') onExit();
            else if (e.key === 'ArrowUp' && direction.y === 0) setDirection({ x: 0, y: -1 });
            else if (e.key === 'ArrowDown' && direction.y === 0) setDirection({ x: 0, y: 1 });
            else if (e.key === 'ArrowLeft' && direction.x === 0) setDirection({ x: -1, y: 0 });
            else if (e.key === 'ArrowRight' && direction.x === 0) setDirection({ x: 1, y: 0 });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, onExit]);

    useEffect(() => { const gameInterval = setInterval(tick, TICK_RATE); return () => clearInterval(gameInterval); }, [tick]);

    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(' '));
    snake.forEach((s, i) => { if(grid[s.y]) grid[s.y][s.x] = i === 0 ? 'O' : 'o'; });
    if(grid[food.y]) grid[food.y][food.x] = 'X';

    return (
        <div className="flex flex-col items-center justify-center">
            <pre className="leading-tight text-lg text-green-400">{grid.map(row => row.join('')).join('\n')}</pre>
            <p className="mt-2">Score: {score}</p>
            {gameOver && <p className="mt-1 text-red-500 text-xl animate-pulse">GAME OVER</p>}
            <p className="mt-2 text-xs text-slate-400">Arrow keys to move. 'q' to quit.</p>
        </div>
    );
};

export default FakeTerminal;