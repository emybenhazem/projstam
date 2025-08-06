namespace TaskManagementApp.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity.Data;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.IdentityModel.Tokens;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;
    using TaskManagementApp.Data;
    using TaskManagementApp.Models;

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;
        public AuthController(IConfiguration config, ApplicationDbContext context)
        {
            _config = config;
            _context = context;
        }

       

        // Génération de tokens pour tests ou configuration manuelle
        [HttpGet("poste1-token")]
        public IActionResult GetPoste1Token()
        {
            var user = new AppUser { Username = "poste1", Role = "poste1" };
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        [HttpGet("poste2-token")]
        public IActionResult GetPoste2Token()
        {
            var user = new AppUser { Username = "poste2", Role = "poste2" };
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        [HttpGet("poste3-token")]
        public IActionResult GetPoste3Token()
        {
            var user = new AppUser { Username = "poste3", Role = "poste3" };
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        [HttpGet("poste4-token")]
        public IActionResult GetPoste4Token()
        {
            var user = new AppUser { Username = "poste4", Role = "poste4" };
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        [HttpGet("poste5-token")]
        public IActionResult GetPoste5Token()
        {
            var user = new AppUser { Username = "poste5", Role = "poste5" };
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        // Endpoints sécurisés
        [Authorize(Roles = "poste1")]
        [HttpGet("poste1/tasks")]
        public IActionResult GetTasksForPoste1()
        {
            return Ok("Tâches pour poste 1");
        }

        [Authorize(Roles = "admin")]
        [HttpGet("admin/dashboard")]
        public IActionResult AdminDashboard()
        {
            return Ok("Admin only");
        }

        private string GenerateJwtToken(AppUser user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Loginn([FromBody] AppUser model)
        {
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
                return BadRequest("Nom d'utilisateur ou mot de passe manquant");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == model.Username && u.Password == model.Password);

            if (user == null)






  
                return Unauthorized("Utilisateur non trouvé ou mot de passe incorrect");

            var token = GenerateJwtToken(user);

            return Ok(new { token, username = user.Username, role = user.Role }); // ✅ le rôle est bien inclus
        }






    }
}