using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManagementApp.Migrations
{
    /// <inheritdoc />
    public partial class AddPlaceAndDependenceAndPriorityToTache : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DependenceId",
                table: "Taches",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Place",
                table: "Taches",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Priorite",
                table: "Taches",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DependenceId",
                table: "Taches");

            migrationBuilder.DropColumn(
                name: "Place",
                table: "Taches");

            migrationBuilder.DropColumn(
                name: "Priorite",
                table: "Taches");
        }
    }
}
