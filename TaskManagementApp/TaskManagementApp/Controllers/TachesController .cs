using Microsoft.AspNetCore.Mvc;
using TaskManagementApp.Data;
using TaskManagementApp.Models;
using Microsoft.EntityFrameworkCore;

namespace TaskManagementApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TachesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TachesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Taches
        [HttpPost]
        public async Task<IActionResult> PostTache([FromBody] Tache tache)
        {
            if (tache == null)
            {
                return BadRequest("Les données de la tâche sont invalides.");
            }

            // Vérification que la référence existe
            var referencePiece = await _context.ReferencePieces.FindAsync(tache.ReferencePieceId);
            if (referencePiece == null)
            {
                return BadRequest("La référence associée à cette tâche n'existe pas.");
            }

            // Ajouter la nouvelle tâche à la base de données
            _context.Taches.Add(tache);
            await _context.SaveChangesAsync();

            // Retourner une réponse avec un code 201 (créé) et l'objet de la tâche
            return CreatedAtAction(nameof(GetTache), new { id = tache.Id }, tache);
        }

        // Méthode pour obtenir une tâche (pour la vérification après ajout, par exemple)
        [HttpGet("{id}")]
        public async Task<ActionResult<Tache>> GetTache(int id)
        {
            var tache = await _context.Taches.FindAsync(id);

            if (tache == null)
            {
                return NotFound();
            }

            return tache;
        }

        // Méthode pour obtenir toutes les tâches
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tache>>> GetTaches()
        {

            var taches = await _context.Taches.Include(t => t.ReferencePiece).ToListAsync();

            return Ok(taches);
        }

        [HttpPost("assignTasks")]
        public async Task<IActionResult> AssignTasks([FromBody] AssignTasksRequest request)
        {
            if (request == null || request.Tasks == null || !request.Tasks.Any())
            {
                return BadRequest("Les données des tâches sont invalides.");
            }

            var referencePiece = await _context.ReferencePieces
                .FirstOrDefaultAsync(r => r.Id == request.ReferenceId);

            if (referencePiece == null)
            {
                return NotFound("La référence spécifiée n'a pas été trouvée.");
            }

            // Créer et enregistrer les tâches pour cette référence
            foreach (var taskPayload in request.Tasks)
            {
                var task = new Tache
                {
                    Description = taskPayload.Description,
                    TempsExecution = TimeSpan.FromMinutes(taskPayload.Time),  // Enregistrement du temps d'exécution
                    ReferencePieceId = request.ReferenceId  // Lien avec la référence
                };

                _context.Taches.Add(task);
            }

            await _context.SaveChangesAsync(); // Sauvegarde les tâches dans la base de données

            return Ok("Les tâches ont été affectées avec succès.");
        }
        [HttpPost("AddTache")]
        public IActionResult AddTache([FromBody] Tache newTache)
        {
            if (newTache == null)
            {
                return BadRequest("Invalid data.");
            }

            _context.Taches.Add(newTache);
            _context.SaveChanges();

            return Ok("Tâche ajoutée avec succès.");
        }

        [HttpGet("ExecutionTimes")]
        public IActionResult GetGroupedTaches()
        {
            var groupedTaches = _context.Taches
                .AsEnumerable() // Effectuer le traitement côté client
                .GroupBy(t => t.ReferencePieceId)
                .Select(g => new
                {
                    ReferencePieceId = g.Key,
                    TotalTaches = g.Count(),
                    TotalExecutionTime = g.Sum(t => t.TempsExecution.Ticks) // Temps en ticks
                })
                .Select(result => new
                {
                    result.ReferencePieceId,
                    result.TotalTaches,
                    TotalExecutionTime = TimeSpan.FromTicks(result.TotalExecutionTime) // Convertir en TimeSpan
                })
                .ToList();

            return Ok(groupedTaches);
        }

        [HttpPost("AddTache2")]
        public async Task<IActionResult> AddTache2([FromBody] Tache tache)
        {
            if (string.IsNullOrEmpty(tache.Description) || tache.TempsExecution.TotalMinutes <= 0)
            {
                return BadRequest("Données invalides.");
            }

            _context.Taches.Add(tache);
            await _context.SaveChangesAsync();
            return Ok(tache);
        }



    }
}


