module ControlUnit (
  input [2:0] opcode,
  output reg [2:0] alu_op,
  output reg RegWrite,  // Write to register
  output reg MemWrite,  // Write to data memory
  output reg Branch     // Branch if Zero
);

always @(*) begin
  case (opcode)
    3'b000: begin  // ADD
      alu_op = 3'b000;
      RegWrite = 1;
      MemWrite = 0;
      Branch = 0;
    end
    3'b001: begin  // SUB
      alu_op = 3'b001;
      RegWrite = 1;
      MemWrite = 0;
      Branch = 0;
    end
    3'b010: begin  // AND
      alu_op = 3'b010;
      RegWrite = 1;
      MemWrite = 0;
      Branch = 0;
    end
    3'b011: begin  // OR
      alu_op = 3'b011;
      RegWrite = 1;
      MemWrite = 0;
      Branch = 0;
    end
    3'b100: begin  // XOR
      alu_op = 3'b100;
      RegWrite = 1;
      MemWrite = 0;
      Branch = 0;
    end
    3'b101: begin  // LOAD
      alu_op = 3'b000;  // Not used
      RegWrite = 1;
      MemWrite = 0;
      Branch = 0;
    end
    3'b110: begin  // STORE
      alu_op = 3'b000;  // Not used
      RegWrite = 0;
      MemWrite = 1;
      Branch = 0;
    end
    3'b111: begin  // JZ
      alu_op = 3'b000;
      RegWrite = 0;
      MemWrite = 0;
      Branch = 1;
    end
    default: begin
      alu_op = 3'b000;
      RegWrite = 0;
      MemWrite = 0;
      Branch = 0;
    end
  endcase
end
endmodule 