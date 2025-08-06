using Microsoft.AspNetCore.Mvc;
using TaskManagementApp.Data;
using TaskManagementApp.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace TaskManagementApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReferencePiecesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReferencePiecesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/ReferencePieces
        [HttpPost]
        public async Task<IActionResult> PostReferencePieces([FromBody] List<ReferencePiece> referencePieces)
        {
            if (referencePieces == null || !referencePieces.Any())
            {
                return BadRequest("Aucune référence n'a été fournie.");
            }

            // Ajouter uniquement les références à la base de données sans les tâches
            foreach (var referencePiece in referencePieces)
            {
                referencePiece.Taches = null; // Ne pas inclure les tâches dans l'insertion
            }

            _context.ReferencePieces.AddRange(referencePieces);
            await _context.SaveChangesAsync();  // Sauvegarder les données

            return CreatedAtAction(nameof(GetReferencePieces), new { }, referencePieces);
        }

        // GET: api/ReferencePieces
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReferencePiece>>> GetReferencePieces()
        {
            return await _context.ReferencePieces.ToListAsync();
        }

        [HttpPost("{referenceId}/Taches")]
        public async Task<IActionResult> AjouterTachesAReference(int referenceId, [FromBody] List<int> tacheIds)
        {
            var reference = await _context.ReferencePieces
                .Include(r => r.Taches)  // Charger les tâches associées
                .FirstOrDefaultAsync(r => r.Id == referenceId);

            if (reference == null)
            {
                return NotFound("Référence non trouvée.");
            }

            // Obtenir les tâches en fonction des IDs
            var taches = await _context.Taches.Where(t => tacheIds.Contains(t.Id)).ToListAsync();

            if (taches.Count == 0)
            {
                return BadRequest("Aucune tâche valide trouvée.");
            }

            // Ajouter les tâches à la référence
            foreach (var tache in taches)
            {
                tache.ReferencePieceId = referenceId;  // Associer chaque tâche à la référence
            }

            // Sauvegarder les modifications
            await _context.SaveChangesAsync();

            return Ok(reference);  // Retourner la référence mise à jour avec les tâches
        }


        [HttpGet("calculate-and-display-total-execution-time")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CalculateAndDisplayTotalExecutionTime()
        {
            // Charger toutes les références avec leurs tâches associées
            var references = await _context.ReferencePieces
                .Include(r => r.Taches)
                .ToListAsync();

            if (!references.Any())
            {
                return NotFound("No references found.");
            }

            // Parcourir chaque référence pour calculer et mettre à jour le temps total d'exécution
            foreach (var reference in references)
            {
                if (reference.Taches != null && reference.Taches.Any())
                {
                    // Calculer la somme des ticks
                    var totalTicks = reference.Taches.Sum(t => t.TempsExecution.Ticks);

                    // Convertir les ticks en TimeSpan
                    reference.TotalExecutionTime = TimeSpan.FromTicks(totalTicks);
                }
                else
                {
                    // Si aucune tâche n'est associée, définir le temps total à zéro
                    reference.TotalExecutionTime = TimeSpan.Zero;
                }
            }

            // Sauvegarder les modifications dans la base de données
            await _context.SaveChangesAsync();

            // Préparer le résultat pour affichage
            var result = references.Select(r => new
            {
                r.Id,
                r.Code,
                TotalExecutionTime = r.TotalExecutionTime.ToString(@"hh\:mm\:ss")
            });

            // Retourner les données
            return Ok(result);
        }

        [HttpGet("all-references")]
        public async Task<IActionResult> GetAllReferencesWithExecutionTime()
        {
            var references = await _context.ReferencePieces
                .Select(r => new
                {
                    ReferenceId = r.Id,
                    ReferenceCode = r.Code,
                    TotalExecutionTime = r.TotalExecutionTime
                })
                .ToListAsync();

            return Ok(references);
        }

        [HttpPost("calculate-all")]
        public async Task<IActionResult> CalculateAndUpdateAllExecutionTimes()
        {
            var references = await _context.ReferencePieces
                .Include(r => r.Taches)
                .ToListAsync();

            foreach (var reference in references)
            {
                if (reference.Taches != null && reference.Taches.Any())
                {
                    var totalTicks = reference.Taches.Sum(t => t.TempsExecution.Ticks);
                    reference.TotalExecutionTime = TimeSpan.FromTicks(totalTicks);
                }
                else
                {
                    reference.TotalExecutionTime = TimeSpan.Zero;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Execution times updated successfully." });
        }

       

    }
}