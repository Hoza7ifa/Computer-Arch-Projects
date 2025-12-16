export type Register = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type OpCode =
    | 'ADD'
    | 'SUB'
    | 'MUL'
    | 'DIV'
    | 'AND'
    | 'OR'
    | 'NOT'
    | 'MOV'
    | 'LD'
    | 'ST'
    | 'NOP'
    | 'HALT';

export interface Operand {
    type: 'REG' | 'IMM';
    value: number;
}

export interface Instruction {
    id: string;
    address: number;
    opcode: OpCode;
    operands: Operand[];
    raw: string;
}

export interface LatchData {
    op1?: number;
    op2?: number;
    destReg?: number;
    aluResult?: number;
    memReadValue?: number;
    memAddress?: number;
    rs1?: number; // Source Register 1 Index
    rs2?: number; // Source Register 2 Index
}

export interface PipelineStage {
    name: 'FETCH' | 'DECODE' | 'EXECUTE' | 'MEMORY' | 'WRITE_BACK';
    instruction: Instruction | null;
    status: 'active' | 'stall' | 'bubble';
    details: string;
    latch: LatchData;
}

export interface CPUState {
    pc: number;
    registers: number[];
    dataMemory: number[];
    instructionMemory: Instruction[];
    pipeline: {
        fetch: PipelineStage;
        decode: PipelineStage;
        execute: PipelineStage;
        memory: PipelineStage;
        writeBack: PipelineStage;
    };
    clock: number;
    isRunning: boolean;
}

export type CPUAction =
    | { type: 'LOAD_PROGRAM'; code: string }
    | { type: 'STEP' }
    | { type: 'RESET' }
    | { type: 'TOGGLE_RUN' };

export const INITIAL_REGISTERS = Array(8).fill(0);
export const MEMORY_SIZE = 256;

// Move INITIAL_CPU_STATE here or keep in cpu.ts?
// To avoid circular deps, let's keep consts here if possible, but PipelineStage needs deep structure.
// I'll define a const for empty pipeline stage to reuse.

export const EMPTY_LATCH: LatchData = {};
