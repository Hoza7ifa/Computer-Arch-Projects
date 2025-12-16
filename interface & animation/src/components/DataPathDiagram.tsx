import { useCPU } from '../context/CPUContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

// Simple Box Component for CPU Units
const Unit = ({ label, active, details, x, y, width = 100, height = 60 }: any) => (
    <div
        className={`absolute border-2 rounded-lg flex flex-col items-center justify-center transition-colors duration-300 z-10 bg-white dark:bg-slate-900
       ${active ? 'border-indigo-500 dark:border-cyan-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] dark:shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'}
    `}
        style={{ left: x, top: y, width, height }}
    >
        <span className={`text-xs font-bold ${active ? 'text-indigo-600 dark:text-cyan-100' : 'text-slate-400 dark:text-slate-500'}`}>{label}</span>
        {details && <span className="text-[9px] text-indigo-500 dark:text-cyan-300 mt-1 max-w-full truncate px-1">{details}</span>}
    </div>
);

// Animated Connection Path
const Connection = ({ start, end, active, label, strokeColor }: any) => {
    // Calculate SVG path
    const path = `M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`;

    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <path d={path} stroke={strokeColor} strokeWidth="2" fill="none" />
            {active && (
                <>
                    <motion.path
                        d={path}
                        stroke="#22d3ee"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Standard SVG Animation for the dot */}
                    <circle r="3" fill="#bef264">
                        <animateMotion
                            dur="1s"
                            repeatCount="indefinite"
                            path={path}
                        />
                    </circle>
                </>
            )}
            {label && <text x={(start[0] + end[0]) / 2} y={(start[1] + end[1]) / 2 - 5} fill="#64748b" fontSize="9">{label}</text>}
        </svg>
    );
};

export const DataPathDiagram = () => {
    const { state } = useCPU();
    const { theme } = useTheme();
    const { fetch, decode, execute, memory, writeBack } = state.pipeline;

    const strokeColor = theme === 'dark' ? '#1e293b' : '#cbd5e1'; // slate-800 vs slate-300

    return (
        <div className="relative w-[800px] h-[360px] bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mx-auto transition-colors">
            <div className="absolute top-2 left-2 text-xs text-slate-400 dark:text-slate-600 font-mono">DATA PATH</div>

            {/* Units */}
            <Unit label="PC" x={30} y={150} active={fetch.status === 'active'} details={`0x${state.pc.toString(16)}`} />
            <Unit label="Instr MEM" x={160} y={140} width={80} height={80} active={fetch.status === 'active'} details={fetch.instruction?.opcode} />
            <Unit label="Decoder" x={290} y={150} width={80} active={decode.status === 'active'} />
            <Unit label="Registers" x={410} y={130} width={80} height={100} active={decode.status === 'active' || writeBack.status === 'active'} />
            <Unit label="ALU" x={540} y={140} width={80} height={80} active={execute.status === 'active'} details={execute.latch?.aluResult?.toString()} />
            <Unit label="Data MEM" x={670} y={140} width={80} height={80} active={memory.status === 'active'} details={memory.instruction?.opcode === 'LD' || memory.instruction?.opcode === 'ST' ? 'Access' : ''} />

            {/* Connections (Active if SOURCE stage is active) */}
            {/* PC -> IMem */}
            <Connection start={[80, 180]} end={[160, 180]} active={fetch.status === 'active'} strokeColor={strokeColor} />

            {/* IMem -> Decoder */}
            <Connection start={[240, 180]} end={[290, 180]} active={fetch.status === 'active'} strokeColor={strokeColor} />

            {/* Decoder -> Regs */}
            <Connection start={[370, 180]} end={[410, 180]} active={decode.status === 'active'} strokeColor={strokeColor} />

            {/* Regs -> ALU */}
            <Connection start={[490, 180]} end={[540, 180]} active={execute.status === 'active'} strokeColor={strokeColor} />

            {/* ALU -> DMem */}
            <Connection start={[620, 180]} end={[670, 180]} active={memory.status === 'active'} strokeColor={strokeColor} />

            {/* Feedback Loops */}
            {writeBack.status === 'active' && (
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <motion.path
                        d="M 710 220 L 710 280 L 450 280 L 450 230"
                        stroke="#6366f1"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="4 4"
                        animate={{ strokeDashoffset: -20 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                </svg>
            )}

        </div>
    );
};
