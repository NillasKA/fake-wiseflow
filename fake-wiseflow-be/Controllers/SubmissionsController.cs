using fake_wiseflow_be.Identity;
using fake_wiseflow_be.Models;
using fake_wiseflow_be.Models.DTOs;
using fake_wiseflow_be.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


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
    [Authorize(Roles = "Examiner")]
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