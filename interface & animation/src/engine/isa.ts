import type { OpCode, Instruction } from './types';

// Helper to parse assembly line (Simplified)
export const parseAssembly = (line: string, address: number): Instruction => {
    const parts = line.replace(/,/g, ' ').trim().split(/\s+/);
    const opcode = parts[0].toUpperCase() as OpCode;
    const operands = parts.slice(1).map(p => {
        if (p.startsWith('R')) return { type: 'REG' as const, value: parseInt(p.substring(1)) };
        if (p.startsWith('0x')) return { type: 'IMM' as const, value: parseInt(p, 16) };
        return { type: 'IMM' as const, value: parseInt(p) };
    });

    return {
        id: crypto.randomUUID(),
        address,
        opcode,
        operands: operands.filter(n => !isNaN(n.value)),
        raw: line
    };
};

export const INSTRUCTION_SET: Record<OpCode, string> = {
    ADD: 'ADD Rd, Rs1, Rs2 : Rd = Rs1 + Rs2',
    SUB: 'SUB Rd, Rs1, Rs2 : Rd = Rs1 - Rs2',
    MUL: 'MUL Rd, Rs1, Rs2 : Rd = Rs1 * Rs2',
    DIV: 'DIV Rd, Rs1, Rs2 : Rd = Rs1 / Rs2',
    AND: 'AND Rd, Rs1, Rs2 : Rd = Rs1 & Rs2',
    OR: 'OR Rd, Rs1, Rs2  : Rd = Rs1 | Rs2',
    NOT: 'NOT Rd, Rs       : Rd = ~Rs',
    MOV: 'MOV Rd, Imm : Rd = Imm',
    LD: 'LD Rd, Addr : Rd = MEM[Addr]',
    ST: 'ST Rs, Addr : MEM[Addr] = Rs',
    NOP: 'NOP : No Operation',
    HALT: 'HALT : Stop Simulation'
};
