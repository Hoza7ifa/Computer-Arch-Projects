module RegisterFile (
  input clk,
  input reset,
  input RegWrite,
  input [1:0] read_addr1,
  input [1:0] read_addr2,
  input [1:0] write_addr,
  input [7:0] write_data,
  output [7:0] read_data1,
  output [7:0] read_data2
);

reg [7:0] reg_file [0:3];

always @(posedge clk or posedge reset) begin
  if (reset) begin
    reg_file[0] <= 8'b0;
    reg_file[1] <= 8'b0;
    reg_file[2] <= 8'b0;
    reg_file[3] <= 8'b0;
  end else if (RegWrite) begin
    reg_file[write_addr] <= write_data;
  end
end

assign read_data1 = reg_file[read_addr1];
assign read_data2 = reg_file[read_addr2];
endmodule 