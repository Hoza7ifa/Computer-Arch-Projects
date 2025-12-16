`timescale 1ns / 1ps

module SimpleCPU_tb;

reg clk;
reg reset; 
wire [7:0] alu_result;

// Additional wires for verification (connect to internal signals if needed, or observe outputs)
wire [7:0] pc_address;
wire [7:0] instruction;
wire Zero;
wire Carry;
wire [7:0] mem_data;  // Assume you add output for dm.read_data in SimpleCPU

// Instantiate the unit under test (UUT)
SimpleCPU uut (
  .clk(clk),
  .reset(reset),
  .alu_result(alu_result)
  // Add more outputs if you expose them in SimpleCPU.v for testing
);

// Clock generation (10ns period)
always #5 clk = ~clk;

// Dump waves for ModelSim
initial begin
  $dumpfile("simplecpu_tb.vcd");
  $dumpvars(0, SimpleCPU_tb);
end

initial begin
  // Initialize signals
  clk = 0;
  reset = 1;

  // Test 1: Apply reset and check PC=0, all regs=0
  #10;
  reset = 0;
  #10;  // Wait one cycle after reset
  if (pc_address !== 8'b0) $display("Test Failed: PC not reset to 0");
  else $display("Test Passed: Reset successful");

  // Run simulation for multiple cycles to test all instructions
  repeat (20) begin  // Run 20 cycles (enough for the preload program)
    #10;  // Wait one full cycle

    // Example assertions based on preload program in InstructionMemory
    case (pc_address)
      8'h00: begin  // LOAD R0, 2
        if (instruction !== 8'b10100010) $display("Test Failed: Wrong instruction at PC=0");
        #10;  // Wait for execute
        if (alu_result !== 8'h02) $display("Test Failed: LOAD failed, alu_result=%h", alu_result);
        else $display("Test Passed: LOAD R0=2");
      end
      8'h01: begin  // LOAD R1, 3
        #10;
        if (alu_result !== 8'h03) $display("Test Failed: LOAD R1=3");
        else $display("Test Passed: LOAD R1=3");
      end
      8'h02: begin  // ADD R1, R0 (R1 = 3 + 2 = 5)
        #10;
        if (alu_result !== 8'h05 || Carry !== 0 || Zero !== 0) $display("Test Failed: ADD result=%h, C=%b, Z=%b", alu_result, Carry, Zero);
        else $display("Test Passed: ADD R1=5");
      end
      8'h03: begin  // STORE [0], R1 (Mem[0] = 5)
        #10;
        if (mem_data !== 8'h05) $display("Test Failed: STORE Mem[0]=%h", mem_data);
        else $display("Test Passed: STORE Mem[0]=5");
      end
      8'h04: begin  // SUB R0, R1 (R0 = 2 - 5 = FD (negative), Carry=1)
        #10;
        if (alu_result !== 8'hFD || Carry !== 1 || Zero !== 0) $display("Test Failed: SUB result=%h, C=%b, Z=%b", alu_result, Carry, Zero);
        else $display("Test Passed: SUB R0=FD");
      end
      8'h05: begin  // JZ 2 (Zero=0, so no jump, PC=6)
        #10;
        if (pc_address !== 8'h06) $display("Test Failed: JZ should not branch");
        else $display("Test Passed: No branch on JZ");
      end
      default: $display("Simulation at PC=%h, instruction=%b, alu_result=%h", pc_address, instruction, alu_result);
    endcase
  end

  // Additional test: Force a branch by setting Zero manually (for demo, in real sim use stimulus)
  // But since it's single-cycle, we can add more cycles or stimuli if needed

  $display("All tests completed.");
  $stop;  // End simulation
end

endmodule