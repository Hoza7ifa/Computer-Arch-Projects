module InstructionMemory (
  input [7:0] address,
  output reg [7:0] instruction
);

reg [7:0] memory [0:255];  // Increased to 256 instructions

initial begin
  // Preload example instructions (using new ISA)
  memory[0] = 8'b10100010;  // LOAD R0, 2 (Dst=R0, Imm=2)
  memory[1] = 8'b10101011;  // LOAD R1, 3 (Dst=R1, Imm=3)
  memory[2] = 8'b00001000;  // ADD R1, R0 (Dst=R1, Src=R0)
  memory[3] = 8'b11010000;  // STORE [0], R1 (Addr=0, Dst=R1 unused for store)
  memory[4] = 8'b00100001;  // SUB R0, R1 (Dst=R0, Src=R1)
  memory[5] = 8'b11100010;  // JZ 2 (if Zero, jump to addr=2)
  memory[6] = 8'b00000000;  // HLT (all zero as NOP/HLT)
  // Add more as needed
end

always @(*) begin
  instruction = memory[address];
end
endmodule 