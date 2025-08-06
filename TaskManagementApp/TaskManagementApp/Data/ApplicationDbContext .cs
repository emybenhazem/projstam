
    using TaskManagementApp.Models;
    using Microsoft.EntityFrameworkCore; 
    namespace TaskManagementApp.Data;
    using Microsoft.EntityFrameworkCore;


public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Tache> Taches { get; set; }
            public DbSet<ReferencePiece> ReferencePieces { get; set; }
            public DbSet<TaskofMachine> TaskofMachines { get; set; }

    public DbSet<TachesSelectionnees> TachesSelectionnees { get; set; }

            public DbSet<Models.Task> Tasks { get; set; }
    public DbSet<AppUser> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Relation entre ReferencePiece et Tache
        modelBuilder.Entity<ReferencePiece>()
            .HasMany(r => r.Taches)
            .WithOne(t => t.ReferencePiece)
            .HasForeignKey(t => t.ReferencePieceId)
            .OnDelete(DeleteBehavior.Cascade); // Supprimer les tâches lorsque la référence est supprimée

        // Relation entre TachesSelectionnees et ReferencePiece
        modelBuilder.Entity<TachesSelectionnees>()
            .HasOne(ts => ts.ReferencePiece)
            .WithMany() // Une ReferencePiece peut avoir plusieurs TachesSelectionnees
            .HasForeignKey(ts => ts.ReferencePieceId)
            .OnDelete(DeleteBehavior.Restrict); // Restriction de suppression pour préserver les enregistrements liés

        // Relation entre TachesSelectionnees et Tache
        modelBuilder.Entity<TachesSelectionnees>()
            .HasOne(ts => ts.Tache)
            .WithMany() // Une Tache peut être liée à plusieurs TachesSelectionnees
            .HasForeignKey(ts => ts.TacheId)
            .OnDelete(DeleteBehavior.Restrict); // Restriction de suppression pour préserver les enregistrements liés

        modelBuilder.Entity<ReferencePiece>()
               .HasIndex(rp => rp.Code)
               .IsUnique()
               .HasDatabaseName("IX_Unique_Code"); // Nom optionnel pour l'index
                base.OnModelCreating(modelBuilder); // Appel à la méthode de base
        modelBuilder.Entity<Tache>()
              .HasMany(t => t.TachesSelectionnees)
              .WithOne(ts => ts.Tache) // Chaque TachesSelectionnees se lie à une Tache
              .HasForeignKey(ts => ts.TacheId);

         modelBuilder.Entity<Models.Task>(entity =>
            {
                entity.Property(e => e.Description)
       .IsRequired()
       .HasMaxLength(255);

                entity.Property(e => e.TempsExecution)
                    .IsRequired();

                entity.Property(e => e.MachineId)
                    .IsRequired();
            });

        modelBuilder.Entity<TaskofMachine>(entity =>
        {
            entity.HasKey(t => t.Id); // Clé primaire

            entity.Property(t => t.Id)
                  .ValueGeneratedOnAdd(); // Auto-incrément

            entity.Property(t => t.TempsTotal)
                  .HasColumnType("time"); // Stocker comme TIME en SQL
        });
    }

}











