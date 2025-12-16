module ProgramCounter (
  input clk,
  input reset,
  input Branch,         // From ControlUnit
  input Zero,           // From ALU
  input [7:0] branch_addr,  // From instruction
  output reg [7:0] pc_address
);

wire [7:0] next_pc = pc_address + 1;  // Normal increment
wire take_branch = Branch & Zero;     // Branch if enabled and Zero

always @(posedge clk or posedge reset) begin
  if (reset) pc_address <= 8'b0;
  else pc_address <= take_branch ? branch_addr : next_pc;
end
endmodule