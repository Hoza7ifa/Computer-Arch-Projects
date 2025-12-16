module ALU (
  input [7:0] A,  // Operand A
  input [7:0] B,  // Operand B
  input [2:0] ALUOp,  // Operation select
  output reg [7:0] Result,  // Output
  output reg Zero,  // Zero flag
  output reg Carry  // Carry/Overflow flag
);

always @(*) begin
  Carry = 0;
  case (ALUOp)
    3'b000: {Carry, Result} = A + B;  // Addition with carry
    3'b001: {Carry, Result} = A - B;  // Subtraction with borrow (Carry=1 if borrow)
    3'b010: Result = A & B;  // AND
    3'b011: Result = A | B;  // OR
    3'b100: Result = A ^ B;  // XOR (added)
    3'b101: Result = ~A;  // NOT (moved from 100 to 101 if needed, but kept for compatibility)
    default: Result = 8'b0;
  endcase
  Zero = (Result == 8'b0);
end
endmodule 