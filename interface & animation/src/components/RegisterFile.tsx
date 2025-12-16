import { useCPU } from '../context/CPUContext';

export const RegisterFile = () => {
    const { state } = useCPU();

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Registers</h3>
            <div className="flex-1 overflow-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded transition-colors shadow-sm dark:shadow-none">
                <table className="w-full text-left text-sm font-mono border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 transition-colors">
                        <tr>
                            <th className="p-2 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500 font-semibold">Reg</th>
                            <th className="p-2 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500 font-semibold">Value (Dec)</th>
                            <th className="p-2 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500 font-semibold">Hex</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.registers.map((val, idx) => (
                            <tr key={`R${idx}`} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-indigo-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-1 px-2 text-indigo-600 dark:text-indigo-400 font-bold">R{idx}</td>
                                <td className="p-1 px-2 text-slate-900 dark:text-slate-300">{val}</td>
                                <td className="p-1 px-2 text-slate-500">0x{Math.abs(val).toString(16).toUpperCase()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
