using LocalDrive.Entities;
using LocalDrive.Services;
using LocalDrive.WebServer.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LocalDrive.WebServer.Controllers
{
    [Route("/files")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly ILogger<FileController> _logger;
        private readonly IFileService _fileService;
        private readonly IProfileService _profileService;
        private readonly IConfiguration configuration;

        public FileController(ILogger<FileController> logger, IFileService fileService, IProfileService profileService, IConfiguration configuration)
        {
            _logger = logger;
            _fileService = fileService;
            _profileService = profileService;
            this.configuration = configuration;
        }

        [HttpGet]
        [Route("/download/{fileId}")]
        [Authorize]
        public IActionResult DownloadFile(int fileId)
        {
            var login = User.Identity!.Name!;
            var profile = _profileService.GetProfile(login);
            if (!IsOwner())
            {
                if (profile == null || !_fileService.HasAccess(profile.Id, fileId))
                {
                    return NotFound();
                }
            }

            var file = _fileService.GetFile(fileId);
            if (file == null)
            {
                return NotFound();
            }

            var root = configuration["FileRoot"];
            if (root == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            var stream = System.IO.File.OpenRead(Path.Combine(root, file.Filename!));
            if (profile != null)
            {
                _fileService.UpdateFileLastDownload(profile.Id, fileId);
            }
            return File(stream, "application/octet-stream", file.Filename);
        }

        [HttpGet]
        [Route("/shared")]
        [Authorize]
        public IActionResult GetSharedFiles()
        {
            var login = IsOwner() ? null : User.Identity!.Name;
            return Ok(_fileService.GetSharedFiles(login));
        }

        [HttpPost]
        [Route("/share")]
        [Authorize]
        [RequestSizeLimit(1024 * 1024 * 1024)]
        public IActionResult ShareFile([FromForm] ShareFileViewModel fileViewModel)
        {
            if (!IsOwner())
            {
                return Forbid();
            }
            var file = fileViewModel.FormFile;
            if (file == null)
            {
                return BadRequest();
            }

            var root = configuration["FileRoot"];
            if (root == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
            Directory.CreateDirectory(root);
            var success = _fileService.ShareFile(file.FileName, file.Length);
            if (success)
            {
                using (var stream = System.IO.File.Create(Path.Combine(root, file.FileName)))
                {
                    file.CopyTo(stream);
                }
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("/unshare")]
        [Authorize]
        public IActionResult UnshareFile([FromBody] int fileId = 0)
        {
            if (!IsOwner())
            {
                return Forbid();
            }

            var root = configuration["FileRoot"];
            if (root == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            var file = _fileService.GetFile(fileId);
            var success = _fileService.UnshareFile(fileId);
            if (success)
            {
                System.IO.File.Delete(Path.Combine(root, file!.Filename!));
                return Ok();
            }
            return BadRequest();
        }

        [HttpGet]
        [Route("/shared/{profileId}")]
        [Authorize]
        public IActionResult GetSharedFilesForUser(int profileId)
        {
            if (!IsOwner())
            {
                return Forbid();
            }

            var profile = _profileService.GetProfile(profileId);
            if (profile == null)
            {
                return BadRequest();
            }

            return Ok(new { User = profile.Login,  Files = _fileService.GetSharedFilesForUser(profileId) });
        }

        [HttpPost]
        [Route("/grant")]
        [Authorize]
        public IActionResult GrantAccess([FromBody] UpdateAccessViewModel updateAccessViewModel)
        {
            if (!IsOwner())
            {
                return Forbid();
            }
            var success = _fileService.GrantAccess(updateAccessViewModel.ProfileId, updateAccessViewModel.FileId);
            return success ? Ok() : BadRequest();
        }

        [HttpPost]
        [Route("/revoke")]
        [Authorize]
        public IActionResult RevokeAccess([FromBody] UpdateAccessViewModel updateAccessViewModel)
        {
            if (!IsOwner())
            {
                return Forbid();
            }
            var success = _fileService.RevokeAccess(updateAccessViewModel.ProfileId, updateAccessViewModel.FileId);
            return success ? Ok() : BadRequest();
        }

        private bool IsOwner()
        {
            var login = User.Identity!.Name;
            var user = _profileService.GetProfiles().FirstOrDefault(p => p.Login == login);
            return user != null && user.IsOwner;
        }
    }
}
