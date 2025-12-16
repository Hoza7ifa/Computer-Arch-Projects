module DataMemory (
  input clk,
  input MemWrite,
  input [7:0] address,
  input [7:0] write_data,
  output reg [7:0] read_data
);

reg [7:0] memory [0:255];  // 256x8 RAM

always @(posedge clk) begin
  if (MemWrite) memory[address] <= write_data;
end

always @(*) begin
  read_data = memory[address];
end
endmodule