using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TaskManagementApp.Data;
using TaskManagementApp.Models;

namespace TaskManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskofMachineController : Controller
    {
  
            private readonly ApplicationDbContext _context;

            public TaskofMachineController(ApplicationDbContext context)
            {
                _context = context;
            }

            // POST: api/TaskofMachine
       
     
        [HttpPost]
        public async Task<IActionResult> AjouterTache([FromBody] List<TaskofMachine> taches)
        {
            if (taches == null || taches.Count == 0)
                return BadRequest("Aucune tâche envoyée.");

            _context.TaskofMachines.AddRange(taches);
            await _context.SaveChangesAsync();

            return Ok(taches);
        }

        // GET: api/TaskofMachine
        [HttpGet]
            public async Task<IActionResult> ObtenirTaches()
            {
                var taches = await _context.TaskofMachines.ToListAsync();
                return Ok(taches);
            }

           

        [HttpGet("getTasks/{machineId}")]
        public async Task<IActionResult> GetTasksByMachine(int machineId)
        {
            // Récupérer la dernière référence depuis MachineId = 1
            var latestReference = await _context.TaskofMachines
                .Where(t => t.MachineId == 2)
                .OrderByDescending(t => t.Id)
                .Select(t => t.ReferencePieceCode)
                .FirstOrDefaultAsync();

            if (string.IsNullOrEmpty(latestReference))
                return NotFound("Aucune référence active trouvée.");

            Console.WriteLine($"🔍 Machine {machineId} - Utilisation de la référence : {latestReference}");

            // Vérifier si des tâches existent pour cette machine et cette référence
            var tasks = await _context.TaskofMachines
                .Where(t => t.MachineId == machineId && t.ReferencePieceCode == latestReference)
                .ToListAsync();

            if (!tasks.Any())
            {
                Console.WriteLine($"❌ Aucune tâche trouvée pour la machine {machineId} avec la référence {latestReference}");
                return NotFound($"Aucune tâche trouvée pour la machine {machineId} avec la référence {latestReference}.");
            }

            return Ok(tasks);
        }


      

        [HttpGet("getTasks/{machineId}/{referencePieceCode}")]
        public async Task<IActionResult> GetTasksByMachineAndReference(int machineId, string referencePieceCode)
        {
            Console.WriteLine($"Machine ID reçu: {machineId}");
            Console.WriteLine($"Reference Code reçu: {referencePieceCode}");

            if (machineId <= 0 || string.IsNullOrEmpty(referencePieceCode))
                return BadRequest("ID de machine ou code de référence invalide.");

            var tasks = await _context.TaskofMachines
                .Where(t => t.MachineId == machineId && t.ReferencePieceCode == referencePieceCode)
                .ToListAsync();

            if (!tasks.Any())
                return NotFound($"Aucune tâche trouvée pour la machine {machineId} avec la référence {referencePieceCode}.");

            return Ok(tasks);
        }



    }

}
