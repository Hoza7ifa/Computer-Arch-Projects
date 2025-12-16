import { useState, useEffect } from 'react';
import { useCPU } from '../context/CPUContext';
import { Play } from 'lucide-react';

const DEFAULT_PROGRAM = `MOV R1, 10
MOV R2, 20
ADD R3, R1, R2
ST R3, 0x05
HALT`;

export const CodeEditor = () => {
    const { dispatch } = useCPU();
    const [code, setCode] = useState(DEFAULT_PROGRAM);

    const handleLoad = () => {
        dispatch({ type: 'LOAD_PROGRAM', code });
    };

    // Load default program on mount
    useEffect(() => {
        handleLoad();
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    return (
        <div className="flex flex-col h-full gap-2">
            <textarea
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md p-3 font-mono text-sm text-slate-900 dark:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none leading-relaxed transition-colors shadow-inner"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
            />
            <button
                onClick={handleLoad}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
            >
                <Play size={16} /> Load & Initialize
            </button>
        </div>
    );
};
