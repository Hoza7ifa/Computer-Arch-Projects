import { useEffect } from 'react';
import { useCPU } from '../context/CPUContext';
import { Play, Pause, StepForward, RotateCcw, Hash } from 'lucide-react';

export const ControlPanel = () => {
    const { state, dispatch } = useCPU();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (state.isRunning) {
            interval = setInterval(() => {
                dispatch({ type: 'STEP' });
            }, 1000); // 1 sec per step
        }
        return () => clearInterval(interval);
    }, [state.isRunning, dispatch]);

    return (
        <div className="flex items-center gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-full px-6 py-3 shadow-lg dark:shadow-xl backdrop-blur-xl transition-colors">
            {/* PC Display */}
            <div className="flex items-center gap-3 px-4 border-r border-slate-200 dark:border-slate-700 mr-2">
                <Hash className="text-slate-400 dark:text-slate-500 w-4 h-4" />
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Program Counter</span>
                    <span className="font-mono text-xl text-indigo-600 dark:text-cyan-400 leading-none">
                        0x{state.pc.toString(16).padStart(4, '0').toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => dispatch({ type: 'RESET' })}
                    className="p-3 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Reset"
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    onClick={() => dispatch({ type: 'TOGGLE_RUN' })}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${state.isRunning
                        ? 'bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white shadow-lg shadow-amber-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                        }`}
                    title={state.isRunning ? "Pause" : "Auto Run"}
                >
                    {state.isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>

                <button
                    onClick={() => dispatch({ type: 'STEP' })}
                    disabled={state.isRunning}
                    className="p-3 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-slate-500 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Step Forward"
                >
                    <StepForward size={24} />
                </button>
            </div>

            <div className="flex flex-col ml-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Clock</span>
                <span className="font-mono text-sm text-slate-900 dark:text-slate-300 leading-none">
                    {state.clock} cycles
                </span>
            </div>
        </div>
    );
};
