using LocalDrive.Services;
using LocalDrive.WebServer.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LocalDrive.WebServer.Controllers
{
    [Route("profiles")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly ILogger<ProfileController> _logger;
        private readonly IFileService _fileService;
        private readonly IProfileService _profileService;
        private readonly IConfiguration configuration;

        public ProfileController(ILogger<ProfileController> logger, IFileService fileService, IProfileService profileService, IConfiguration configuration)
        {
            _logger = logger;
            _fileService = fileService;
            _profileService = profileService;
            this.configuration = configuration;
        }

        [HttpGet]
        [Route("/all")]
        [Authorize]
        public IActionResult GetProfiles()
        {
            if (!IsOwner())
            {
                return Forbid();
            }
            return Ok(_profileService.GetProfiles());
        }

        [HttpPost]
        [Route("/create")]
        [Authorize]
        public IActionResult CreateProfile([FromBody] CreateProfileViewModel createProfileViewModel)
        {
            if (!IsOwner())
            {
                return Forbid();
            }
            if (string.IsNullOrEmpty(createProfileViewModel.Login) || string.IsNullOrEmpty(createProfileViewModel.Password))
            {
                return BadRequest();
            }
            var success = _profileService.CreateProfile(createProfileViewModel.Login, createProfileViewModel.Password);
            return success ? Ok() : BadRequest();
        }

        [HttpPost]
        [Route("/delete")]
        [Authorize]
        public IActionResult DeleteProfile([FromBody] int id = 0)
        {
            if (!IsOwner())
            {
                return Forbid();
            }
            var success = _profileService.DeleteProfile(id);
            return success ? Ok() : BadRequest();
        }

        [HttpPost]
        [Route("/update")]
        [Authorize]
        public IActionResult UpdateProfile(UpdateProfileViewModel updateProfileViewModel)
        {
            if (!IsOwner())
            {
                return Forbid();
            }
            if (string.IsNullOrEmpty(updateProfileViewModel.Login) || string.IsNullOrEmpty(updateProfileViewModel.Password))
            {
                return BadRequest();
            }
            var success = _profileService.UpdateProfile(
                updateProfileViewModel.Id,
                updateProfileViewModel.Login,
                updateProfileViewModel.Password);
            return success ? Ok() : BadRequest();
        }

        [HttpPost]
        [Route("/login")]
        public IActionResult Login([FromBody] LoginViewModel loginViewModel)
        {
            var login = loginViewModel.Login;
            if (string.IsNullOrEmpty(login) || string.IsNullOrEmpty(loginViewModel.Password))
            {
                return BadRequest();
            }
            if (_profileService.CheckCredentials(login, loginViewModel.Password))
            {
                var profile = _profileService.GetProfile(login);
                _profileService.UpdateProfileLastLogin(profile!.Id);
                var token = CreateToken(login);
                return Ok(new { 
                    access_token = token.Item1,
                    expired_at = token.Item2,
                    name = login,
                    role = profile!.IsOwner ? "Owner" : "User",
                });
            }
            return BadRequest();
        }

        private (string, long) CreateToken(string login)
        {
            var authClaims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, login),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]!));

            var period = int.TryParse(configuration["JWT:TimeToLive"], out int @unchecked) ? @unchecked : 240;
            var expires = DateTime.Now.AddMinutes(period);
            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                expires: expires,
                claims: authClaims,
                signingCredentials: new(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
            return (new JwtSecurityTokenHandler().WriteToken(token), expires.Ticks);
        }

        private bool IsOwner()
        {
            var login = User.Identity!.Name;
            var user = _profileService.GetProfiles().FirstOrDefault(p => p.Login == login);
            return user != null && user.IsOwner;
        }
    }
}
