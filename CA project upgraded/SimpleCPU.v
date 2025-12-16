module SimpleCPU (
  input clk,
  input reset,
  output [7:0] alu_result  // For observation
);

wire [7:0] pc_address;
wire [7:0] instruction;
wire [2:0] opcode = instruction[7:5];
wire [1:0] dst_reg = instruction[4:3];
wire [2:0] src_imm = instruction[2:0];  // Src reg or imm/addr

wire [2:0] alu_op;
wire RegWrite, MemWrite, Branch;
wire Zero, Carry;

wire [7:0] reg_data1, reg_data2;
wire [7:0] alu_in2 = (opcode == 3'b101) ? {5'b0, src_imm} : reg_data2;  // Imm for LOAD

// Instruction Fetch
InstructionMemory im (
  .address(pc_address),
  .instruction(instruction)
);

// Control Unit
ControlUnit cu (
  .opcode(opcode),
  .alu_op(alu_op),
  .RegWrite(RegWrite),
  .MemWrite(MemWrite),
  .Branch(Branch)
);

// Register File
RegisterFile rf (
  .clk(clk),
  .reset(reset),
  .RegWrite(RegWrite),
  .read_addr1(dst_reg),  // Dst as read1 for ALU A
  .read_addr2(src_imm[1:0]),  // Src as read2 for ALU B (assume src is reg for arithmetic)
  .write_addr(dst_reg),
  .write_data(alu_result),  // From ALU or Mem? Here from ALU
  .read_data1(reg_data1),
  .read_data2(reg_data2)
); 

// ALU
ALU alu (
  .A(reg_data1),
  .B(alu_in2),
  .ALUOp(alu_op),
  .Result(alu_result),
  .Zero(Zero),
  .Carry(Carry)
);

// Data Memory
wire [7:0] mem_read;
DataMemory dm (
  .clk(clk),
  .MemWrite(MemWrite),
  .address({5'b0, src_imm}),  // Addr from instruction
  .write_data(reg_data1),     // Write from reg_data1 (Dst value)
  .read_data(mem_read)
);

// Program Counter with branch
ProgramCounter pc (
  .clk(clk),
  .reset(reset),
  .Branch(Branch),
  .Zero(Zero),
  .branch_addr({5'b0, src_imm}),  // Addr from instruction
  .pc_address(pc_address)
);

endmodule