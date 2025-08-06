using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManagementApp.Migrations
{
    /// <inheritdoc />
    public partial class RenamePlaceToMachineId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Place",
                table: "TaskofMachines");

            migrationBuilder.AddColumn<int>(
                name: "MachineId",
                table: "TaskofMachines",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MachineId",
                table: "TaskofMachines");

            migrationBuilder.AddColumn<string>(
                name: "Place",
                table: "TaskofMachines",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
