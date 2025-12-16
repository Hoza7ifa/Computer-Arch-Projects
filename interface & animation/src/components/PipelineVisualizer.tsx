import React from 'react';
import type { PipelineStage } from '../engine/types';
import { useCPU } from '../context/CPUContext';
import { motion, AnimatePresence } from 'framer-motion';

const StageCard = ({ stage }: { stage: PipelineStage }) => {
    const isActive = stage.status === 'active';
    const isStall = stage.status === 'stall';

    return (
        <div className={`flex-1 flex flex-col items-center relative group`}>
            {/* Connector Line */}
            <div className={`absolute top-1/2 -right-[50%] w-full h-0.5 z-0 ${isActive ? 'bg-indigo-500/50' : 'bg-slate-300 dark:bg-slate-800'}`} />

            {/* Stage Bubble */}
            <div className={`
         relative z-10 w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center p-2 text-center transition-all duration-300 bg-white dark:bg-slate-950
         ${isActive ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-600'}
         ${isStall ? 'border-amber-500' : ''}
       `}>
                <span className="text-[10px] font-bold tracking-wider mb-1">{stage.name}</span>

                <AnimatePresence mode='wait'>
                    {stage.instruction ? (
                        <motion.div
                            key={stage.instruction.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center"
                        >
                            <span className={`text-xs font-mono font-bold ${isActive ? 'text-indigo-600 dark:text-cyan-300' : 'text-slate-400 dark:text-slate-500'}`}>
                                {stage.instruction.opcode}
                            </span>
                            <span className="text-[9px] text-slate-500 truncate max-w-[80px]">
                                {stage.details}
                            </span>
                        </motion.div>
                    ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-700 font-mono">IDLE</span>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export const PipelineVisualizer = () => {
    const { state } = useCPU();
    const stages = [
        state.pipeline.fetch,
        state.pipeline.decode,
        state.pipeline.execute,
        state.pipeline.memory,
        state.pipeline.writeBack
    ];

    return (
        <div className="flex items-center justify-between h-full px-8 gap-4 overflow-hidden">
            {stages.map((stage) => (
                <React.Fragment key={stage.name}>
                    <StageCard stage={stage} />
                </React.Fragment>
            ))}
        </div>
    );
};
