using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using fake_wiseflow_be.Identity;
using fake_wiseflow_be.Models;
using fake_wiseflow_be.Models.DTOs;
using fake_wiseflow_be.Services;
using Microsoft.AspNetCore.Mvc;

namespace fake_wiseflow_be.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubmissionsController : ControllerBase
{
    private readonly ISubmissionService _submissionService;
    private readonly ISubmissionExamCoordinatorService _submissionExamCoordinatorService;

    public SubmissionsController(ISubmissionService submissionService, ISubmissionExamCoordinatorService submissionExamCoordinatorService)
    {
        _submissionService = submissionService;
        _submissionExamCoordinatorService = submissionExamCoordinatorService;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<Submission>>> Get()
    {
        return await _submissionService.GetAllAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Submission>> Get(Guid id)
    {
        var submission = await _submissionService.GetByIdAsync(id);

        if (submission is null)
        {
            return NotFound();
        }
        
        return submission;
    }

    [HttpGet("exam/{examId}")]
    public async Task<ActionResult<List<Submission>>> GetByExamId(Guid examId)
    {
        var submissions = await _submissionExamCoordinatorService.GetSubmissionsAsync(examId);
        return Ok(submissions);
    }

    [HttpPost]
    public async Task<ActionResult> Post(SubmissionRequest submissionRequest)
    {
        await _submissionExamCoordinatorService.CreateSubmissionAsync(submissionRequest.ExamId, submissionRequest.Submission);
        return Ok();
    }

    [HttpPost("bulk")]
    public async Task<ActionResult> PostBulk(BulkSubmissionRequest bulkSubmissionRequest)
    {
        await _submissionExamCoordinatorService.CreateSubmissionsInBulkAsync(bulkSubmissionRequest.ExamId, bulkSubmissionRequest.Submissions);
        return Ok();
    }

    [HttpPost("upload")]
    [Authorize]
    public async Task<ActionResult> PostUpload([FromForm] Guid? ExamId, [FromForm] IFormFile? File)
    {
        if (ExamId == null)
        {
            return BadRequest("ExamId is required.");
        }

        if (File == null || File.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
             return Unauthorized("Invalid user ID in token.");
        }

        using var memoryStream = new MemoryStream();
        await File.CopyToAsync(memoryStream);

        var submission = new Submission
        {
            userId = userId,
            FileData = memoryStream.ToArray(),
            FileName = File.FileName,
            ContentType = File.ContentType,
            uploadDate = DateTime.UtcNow,
            status = SubmissionStatus.Pending
        };

        try 
        {
            await _submissionExamCoordinatorService.CreateSubmissionAsync(ExamId.Value, submission);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return Ok();
    }

    [HttpGet("{examId}/file")]
    [Authorize]
    public async Task<IActionResult> GetSubmissionFile(Guid examId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
             return Unauthorized("Invalid user ID in token.");
        }

        var submission = await _submissionExamCoordinatorService.GetStudentSubmissionAsync(examId, userId);

        if (submission == null || submission.FileData == null || submission.FileData.Length == 0)
        {
            return NotFound("Submission file not found.");
        }

        return File(submission.FileData, submission.ContentType ?? "application/octet-stream", submission.FileName ?? "download");
    }

    [HttpPut]
    public async Task<ActionResult> Put(Guid id, Submission submission)
    {
        await _submissionService.UpdateAsync(id, submission);
        return Ok();
    }

    [HttpDelete]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _submissionService.RemoveAsync(id);
        return Ok();
    }
}