using Microsoft.AspNetCore.Mvc;
using TaskManagementApp.Models;
using TaskManagementApp.Services;

namespace TaskManagementApp.Controllers
{
    public class OrdonnancementController : Controller
    {
        private readonly OrdonnancementService _service;

        public OrdonnancementController(OrdonnancementService service)
        {
            _service = service;
        }

        [HttpPost("repartir-taches")]
        public IActionResult RepartirTaches([FromBody] List<Models.Task> tachesSelectionnees)
        {
            var tachesReparties = _service.SynchroniserTaches(tachesSelectionnees);
            return Ok(tachesReparties);
        }
    }
}