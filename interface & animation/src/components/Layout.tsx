import { Cpu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="h-screen w-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col overflow-hidden transition-colors duration-300">
            {/* Header */}
            <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900/50 backdrop-blur-md transition-colors duration-300 shadow-sm dark:shadow-none z-50">
                <div className="flex items-center">
                    <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-500 mr-2" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-600 dark:to-cyan-500 bg-clip-text text-transparent">
                        PipelineSim <span className="text-slate-500 dark:text-slate-500 text-sm font-normal ml-2">v1.1</span>
                    </h1>
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
};
