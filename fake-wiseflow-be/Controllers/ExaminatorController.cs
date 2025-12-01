using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using fake_wiseflow_be.Services;
using fake_wiseflow_be.Models.DTOs;

namespace fake_wiseflow_be.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "InstitutionAdmin,SuperAdmin")]
public class ExaminatorController : ControllerBase
{
    private readonly IExaminatorService _examinatorService;
    private readonly ILogger<ExaminatorController> _logger;

    public ExaminatorController(IExaminatorService examinatorService, ILogger<ExaminatorController> logger)
    {
        _examinatorService = examinatorService;
        _logger = logger;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateExaminator([FromBody] CreateExaminatorRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _examinatorService.CreateExaminatorAsync(request.Email, request.UserName, request.InstitutionId.Value);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetExaminator(string id)
    {
        var examinator = await _examinatorService.GetExaminatorByIdAsync(id);

        if (examinator == null)
        {
            return NotFound(new { message = "Examinator not found." });
        }

        return Ok(examinator);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllExaminators()
    {
        var examinators = await _examinatorService.GetAllExaminatorsAsync();
        return Ok(examinators);
    }

    [HttpGet("institution/{institutionId}")]
    public async Task<IActionResult> GetExaminatorsByInstitution(Guid institutionId)
    {
        var examinators = await _examinatorService.GetExaminatorsByInstitutionAsync(institutionId);
        return Ok(examinators);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExaminator(string id)
    {
        var success = await _examinatorService.DeleteExaminatorAsync(id);

        if (!success)
        {
            return NotFound(new { message = "Examinator not found." });
        }

        return NoContent();
    }
}