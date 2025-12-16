import type { CPUAction, CPUState, PipelineStage, LatchData, Operand } from './types';
import { INITIAL_REGISTERS, EMPTY_LATCH } from './types';
import { parseAssembly } from './isa';

const INITIAL_STAGE_TEMPLATE = (name: PipelineStage['name']): PipelineStage => ({
    name,
    instruction: null,
    status: 'bubble',
    details: 'Idle',
    latch: { ...EMPTY_LATCH }
});

export const INITIAL_CPU_STATE: CPUState = {
    pc: 0,
    registers: [...INITIAL_REGISTERS],
    dataMemory: Array(256).fill(0),
    instructionMemory: [],
    pipeline: {
        fetch: INITIAL_STAGE_TEMPLATE('FETCH'),
        decode: INITIAL_STAGE_TEMPLATE('DECODE'),
        execute: INITIAL_STAGE_TEMPLATE('EXECUTE'),
        memory: INITIAL_STAGE_TEMPLATE('MEMORY'),
        writeBack: INITIAL_STAGE_TEMPLATE('WRITE_BACK')
    },
    clock: 0,
    isRunning: false
};

export const createInitialState = (): CPUState => structuredClone(INITIAL_CPU_STATE);

const getReg = (regs: number[], idx: number) => (regs[idx] !== undefined ? regs[idx] : 0);

export const cpuReducer = (state: CPUState, action: CPUAction): CPUState => {
    switch (action.type) {
        case 'LOAD_PROGRAM': {
            const instructions = action.code
                .split('\n')
                .map(l => l.trim())
                .filter(l => l && !l.startsWith(';'))
                .map((l, i) => parseAssembly(l, i));

            return {
                ...createInitialState(),
                instructionMemory: instructions,
            };
        }
        case 'RESET':
            return {
                ...createInitialState(),
                instructionMemory: state.instructionMemory,
            };
        case 'TOGGLE_RUN':
            return { ...state, isRunning: !state.isRunning };
        case 'STEP':
            return processCycle(state);
        default:
            return state;
    }
};

const processCycle = (state: CPUState): CPUState => {
    const nextState = structuredClone(state);
    nextState.clock++;

    // Order: WB <- MEM <- EX <- ID <- IF (Simulate parallel properly by reading previous state)
    // Actually, 'state' IS the previous state. 'nextState' is the new one. 
    // We can process in any order as long as we read from 'state' and write to 'nextState'.

    // --- WRITE BACK STAGE ---
    const memStage = state.pipeline.memory;
    nextState.pipeline.writeBack = {
        name: 'WRITE_BACK',
        instruction: memStage.instruction,
        status: memStage.status,
        latch: { ...memStage.latch },
        details: 'Idle'
    };

    if (memStage.instruction && memStage.status === 'active') {
        const { latch } = nextState.pipeline.writeBack;
        const { opcode } = memStage.instruction;
        let written = false;

        if (latch.destReg !== undefined && latch.destReg !== null) {
            let value = 0;
            if (opcode === 'LD') {
                value = latch.memReadValue ?? 0;
            } else {
                value = latch.aluResult ?? 0;
            }

            if (latch.destReg >= 0 && latch.destReg < 8) {
                nextState.registers[latch.destReg] = value;
                nextState.pipeline.writeBack.details = `R${latch.destReg} <- ${value}`;
                written = true;
            }
        }

        if (!written) {
            if (opcode === 'HALT') {
                nextState.isRunning = false;
                nextState.pipeline.writeBack.details = 'HALT';
            } else {
                nextState.pipeline.writeBack.details = 'No Write';
            }
        }
    }


    // --- MEMORY STAGE ---
    const exStage = state.pipeline.execute;
    nextState.pipeline.memory = {
        name: 'MEMORY',
        instruction: exStage.instruction,
        status: exStage.status,
        latch: { ...exStage.latch },
        details: 'Idle'
    };

    if (exStage.instruction && exStage.status === 'active') {
        const { opcode } = exStage.instruction;
        const { latch } = nextState.pipeline.memory;

        if (opcode === 'LD') {
            const addr = latch.aluResult ?? 0;
            const val = state.dataMemory[addr] ?? 0;
            latch.memReadValue = val;
            nextState.pipeline.memory.details = `Read [${addr}] = ${val}`;
        } else if (opcode === 'ST') {
            const addr = latch.aluResult ?? 0;
            const val = latch.op1 ?? 0; // ST uses Rs (op1) to store
            nextState.dataMemory[addr] = val;
            nextState.pipeline.memory.details = `Write [${addr}] = ${val}`;
        } else {
            nextState.pipeline.memory.details = 'Pass-through';
        }
    }


    // --- EXECUTE STAGE ---
    const idStage = state.pipeline.decode;
    nextState.pipeline.execute = {
        name: 'EXECUTE',
        instruction: idStage.instruction,
        status: idStage.status,
        latch: { ...idStage.latch },
        details: 'Idle'
    };

    if (idStage.instruction && idStage.status === 'active') {
        const { opcode } = idStage.instruction;
        const { latch } = nextState.pipeline.execute;

        // FORWARDING LOGIC
        // Check if sources (rs1, rs2) match destinations in MEM or WB stages of CURRENT state.
        // Sources:
        // MEM Stage (Instruction ahead by 1 cycle) -> state.pipeline.memory
        // WB Stage (Instruction ahead by 2 cycles) -> state.pipeline.writeBack

        const resolveForwarding = (originalVal: number, regIdx?: number): number => {
            if (regIdx === undefined || regIdx === null) return originalVal;

            // 1. Check MEMORY Stage (Youngest, Highest Priority)
            const memStage = state.pipeline.memory;
            if (memStage.status === 'active' && memStage.latch.destReg === regIdx) {
                // Forward from ALU Result (or Mem Read if ready?)
                // If Load, data might not be ready unless we stall. (Load-Use Hazard).
                // For now, if NOT load, forward ALU. 
                if (memStage.instruction?.opcode !== 'LD') {
                    return memStage.latch.aluResult ?? originalVal;
                }
                // If it IS load, real hardware stalls. We'll cheat and try to peek? No, memory access happens in MEM.
                // So if dependent on Load, we use old value (hazard!) or stall.
                // For simplicity in this non-stalling sim, we might fail here.
            }

            // 2. Check WRITE BACK Stage
            const wbStage = state.pipeline.writeBack;
            if (wbStage.status === 'active' && wbStage.latch.destReg === regIdx) {
                if (wbStage.instruction?.opcode === 'LD') {
                    return wbStage.latch.memReadValue ?? originalVal;
                }
                return wbStage.latch.aluResult ?? originalVal;
            }

            // 3. Fallback: Re-read Register File (Fixes stale Decode reads)
            // If the value was written in a previous cycle (finished WB), it's in state.registers now.
            // The value in 'originalVal' (from Decode latch) might be stale if WB happened between Decode and Execute.
            return getReg(state.registers, regIdx);
        };

        const op1 = resolveForwarding(latch.op1 ?? 0, latch.rs1);
        const op2 = resolveForwarding(latch.op2 ?? 0, latch.rs2);

        switch (opcode) {
            case 'ADD':
                latch.aluResult = op1 + op2;
                nextState.pipeline.execute.details = `${op1} + ${op2} = ${latch.aluResult}`;
                break;
            case 'SUB':
                latch.aluResult = op1 - op2;
                nextState.pipeline.execute.details = `${op1} - ${op2} = ${latch.aluResult}`;
                break;
            case 'MUL':
                latch.aluResult = op1 * op2;
                nextState.pipeline.execute.details = `${op1} * ${op2} = ${latch.aluResult}`;
                break;
            case 'DIV':
                latch.aluResult = Math.floor(op1 / (op2 === 0 ? 1 : op2));
                nextState.pipeline.execute.details = `${op1} / ${op2} = ${latch.aluResult}`;
                break;
            case 'AND':
                latch.aluResult = op1 & op2;
                nextState.pipeline.execute.details = `${op1} & ${op2} = ${latch.aluResult}`;
                break;
            case 'OR':
                latch.aluResult = op1 | op2;
                nextState.pipeline.execute.details = `${op1} | ${op2} = ${latch.aluResult}`;
                break;
            case 'NOT':
                latch.aluResult = ~op1;
                nextState.pipeline.execute.details = `~${op1} = ${latch.aluResult}`;
                break;
            case 'MOV':
                latch.aluResult = op1;
                nextState.pipeline.execute.details = `Val = ${op1}`;
                break;
            case 'LD':
                latch.aluResult = op1;
                nextState.pipeline.execute.details = `Addr = ${op1}`;
                break;
            case 'ST':
                latch.aluResult = op2; // Address
                latch.op1 = op1; // Value to store (update latch with forwarded val)
                nextState.pipeline.execute.details = `Addr = ${op2}`;
                break;
            case 'HALT':
                nextState.pipeline.execute.details = 'HALT';
                break;
            default:
                nextState.pipeline.execute.details = 'NOP';
        }
    }

    // --- DECODE STAGE ---
    const ifStage = state.pipeline.fetch;
    nextState.pipeline.decode = {
        name: 'DECODE',
        instruction: ifStage.instruction,
        status: ifStage.status,
        latch: {},
        details: 'Idle'
    };

    if (ifStage.instruction && ifStage.status === 'active') {
        const inst = ifStage.instruction;
        const { opcode, operands } = inst;
        const latch: LatchData = {};

        // Resolve: Check Type. If REG, store Index in rs1/rs2 AND fetch current value.
        const resolve = (op: Operand, isSource: boolean): { val: number, reg?: number } => {
            if (!op) return { val: 0 };
            if (op.type === 'IMM') return { val: op.value };

            // REG
            if (isSource) {
                return { val: getReg(state.registers, op.value), reg: op.value };
            }
            return { val: op.value, reg: op.value }; // DEST
        };

        if (['ADD', 'SUB', 'MUL', 'DIV', 'AND', 'OR'].includes(opcode)) {
            // ADD Rd, Rs1, Rs2
            latch.destReg = operands[0]?.value;

            const r1 = resolve(operands[1], true);
            latch.op1 = r1.val;
            latch.rs1 = r1.reg;

            const r2 = resolve(operands[2], true);
            latch.op2 = r2.val;
            latch.rs2 = r2.reg;

            nextState.pipeline.decode.details = `Rs1:R${latch.rs1}, Rs2:R${latch.rs2}`;
        } else if (opcode === 'NOT') {
            latch.destReg = operands[0]?.value;
            const r1 = resolve(operands[1], true);
            latch.op1 = r1.val;
            latch.rs1 = r1.reg;
            nextState.pipeline.decode.details = `Rs1:R${latch.rs1}`;
        } else if (opcode === 'MOV') {
            latch.destReg = operands[0]?.value;
            const r1 = resolve(operands[1], true); // Source (Imm or Reg)
            latch.op1 = r1.val;
            latch.rs1 = r1.reg;
            nextState.pipeline.decode.details = `Imm/Reg ${latch.op1}`;
        } else if (opcode === 'LD') {
            latch.destReg = operands[0]?.value;
            const r1 = resolve(operands[1], true); // Addr
            latch.op1 = r1.val;
            latch.rs1 = r1.reg;
            nextState.pipeline.decode.details = `Addr ${latch.op1}`;
        } else if (opcode === 'ST') {
            // ST Rs, Addr (Rs is Source, Addr is Source)
            const r1 = resolve(operands[0], true); // Value
            latch.op1 = r1.val;
            latch.rs1 = r1.reg;

            const r2 = resolve(operands[1], true); // Addr
            latch.op2 = r2.val;
            latch.rs2 = r2.reg;

            nextState.pipeline.decode.details = `Store R${latch.rs1} -> [${latch.op2}]`;
        } else if (opcode === 'HALT') {
            nextState.pipeline.decode.details = 'HALT';
        }

        nextState.pipeline.decode.latch = latch;
    }

    // --- FETCH STAGE ---
    const currentPC = state.pc;
    const nextInst = state.instructionMemory.find(i => i.address === currentPC);

    if (nextInst) {
        nextState.pipeline.fetch = {
            name: 'FETCH',
            instruction: nextInst,
            status: 'active',
            details: `PC=${currentPC}: ${nextInst.opcode}`,
            latch: {}
        };
        nextState.pc = currentPC + 1;
    } else {
        nextState.pipeline.fetch = {
            name: 'FETCH',
            instruction: null,
            status: 'bubble',
            details: 'End',
            latch: {}
        };
    }

    return nextState;
};