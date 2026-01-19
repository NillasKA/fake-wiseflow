using Microsoft.AspNetCore.Mvc;
using fake_wiseflow_be.Services;
using fake_wiseflow_be.Models;
using fake_wiseflow_be.Models.DTOs;

namespace fake_wiseflow_be.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "InstitutionAdmin,SuperAdmin")]
public class ExaminatorController : ControllerBase
{
    private readonly IExaminatorService _examinatorService;
    private readonly IExamService _examService;
    private readonly ISubmissionExamCoordinatorService _submissionExamCoordinatorService;
    private readonly ILogger<ExaminatorController> _logger;

    public ExaminatorController(IExaminatorService examinatorService, IExamService examService, ISubmissionExamCoordinatorService submissionExamCoordinatorService, ILogger<ExaminatorController> logger)
    {
        _examinatorService = examinatorService;
        _examService = examService;
        _submissionExamCoordinatorService = submissionExamCoordinatorService;
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

    [HttpGet("{id}/exams")]
    public async Task<IActionResult> GetExamsForExaminator(string id)
    {
        if (!Guid.TryParse(id, out var examinatorId))
        {
            return BadRequest("Invalid ID format.");
        }
        var exams = await _examService.GetExamsByExaminatorIdAsync(examinatorId);
        return Ok(exams);
    }

    [HttpGet("exams/{examId}/submissions")]
    public async Task<IActionResult> GetSubmittedSubmissionsForExam(Guid examId)
    {
        var submissions = await _submissionExamCoordinatorService.GetSubmissionsAsync(examId);
        var relevantSubmissions = submissions.Where(s => s.status == SubmissionStatus.Submitted || s.status == SubmissionStatus.Graded).ToList();
        return Ok(relevantSubmissions);
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