using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManagementApp.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReferencePieces",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TotalExecutionTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReferencePieces", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Taches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TempsExecution = table.Column<TimeSpan>(type: "time", nullable: false),
                    ReferencePieceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Taches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Taches_ReferencePieces_ReferencePieceId",
                        column: x => x.ReferencePieceId,
                        principalTable: "ReferencePieces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TachesSelectionnees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReferencePieceId = table.Column<int>(type: "int", nullable: false),
                    TacheId = table.Column<int>(type: "int", nullable: false),
                    DateSelection = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TachesSelectionnees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TachesSelectionnees_ReferencePieces_ReferencePieceId",
                        column: x => x.ReferencePieceId,
                        principalTable: "ReferencePieces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TachesSelectionnees_Taches_TacheId",
                        column: x => x.TacheId,
                        principalTable: "Taches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Unique_Code",
                table: "ReferencePieces",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Taches_ReferencePieceId",
                table: "Taches",
                column: "ReferencePieceId");

            migrationBuilder.CreateIndex(
                name: "IX_TachesSelectionnees_ReferencePieceId",
                table: "TachesSelectionnees",
                column: "ReferencePieceId");

            migrationBuilder.CreateIndex(
                name: "IX_TachesSelectionnees_TacheId",
                table: "TachesSelectionnees",
                column: "TacheId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TachesSelectionnees");

            migrationBuilder.DropTable(
                name: "Taches");

            migrationBuilder.DropTable(
                name: "ReferencePieces");
        }
    }
}
