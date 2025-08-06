using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManagementApp.Migrations
{
    public partial class UpdateTacheWithSelection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Créer la table TachesSelectionnees si elle n'existe pas encore
            migrationBuilder.CreateTable(
                name: "TachesSelectionnees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReferencePieceId = table.Column<int>(type: "int", nullable: false),
                    TacheId = table.Column<int>(type: "int", nullable: false),
                    DateSelection = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
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

            // Si vous n'avez pas de colonne `TempsExecution` à ajouter ici, ne le faites pas.
            // S'il y a déjà une colonne `TempsExecution` dans `Taches`, il n'est pas nécessaire de la rajouter.

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Supprimer la table TachesSelectionnees si la migration est annulée
            migrationBuilder.DropTable(
                name: "TachesSelectionnees");

            // N'ajoutez pas 'TempsExecution' à la table 'Taches' si elle existe déjà
        }
    }
}
