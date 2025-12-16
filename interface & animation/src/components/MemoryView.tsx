import { useCPU } from '../context/CPUContext';

export const MemoryView = () => {
    const { state } = useCPU();

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Data Memory</h3>
            <div className="flex-1 overflow-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded transition-colors shadow-sm dark:shadow-none">
                <table className="w-full text-left text-sm font-mono border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 transition-colors">
                        <tr>
                            <th className="p-2 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500 font-semibold">Addr</th>
                            <th className="p-2 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500 font-semibold">Val</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.dataMemory.map((val, idx) => ({ val, idx }))
                            .filter(item => item.idx < 16 || item.val !== 0)
                            .map(({ val, idx }) => (
                                <tr key={`M${idx}`} className={val !== 0 ? "bg-indigo-50 dark:bg-indigo-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"}>
                                    <td className="p-1 px-3 text-slate-500 border-r border-slate-200 dark:border-slate-800">
                                        0x{idx.toString(16).padStart(2, '0').toUpperCase()}
                                    </td>
                                    <td className={`p-1 px-3 ${val !== 0 ? "text-indigo-600 dark:text-cyan-300 font-bold" : "text-slate-500 dark:text-slate-600"}`}>
                                        {val}
                                    </td>
                                </tr>
                            ))}
                        <tr>
                            <td colSpan={2} className="p-2 text-center text-xs text-slate-400 dark:text-slate-700 italic">
                                ... (Showing first 16 + active) ...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
