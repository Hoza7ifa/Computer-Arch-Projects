import { INSTRUCTION_SET } from '../engine/isa';

export const InstructionLibrary = () => {
    return (
        <div className="flex flex-col h-full">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Instructions</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                {Object.entries(INSTRUCTION_SET).map(([op, desc]) => (
                    <div key={op} className="group p-2 rounded bg-white dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-200 dark:border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all cursor-help shadow-sm dark:shadow-none">
                        <div className="font-mono text-xs font-bold text-indigo-600 dark:text-cyan-400">{op}</div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">{desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
