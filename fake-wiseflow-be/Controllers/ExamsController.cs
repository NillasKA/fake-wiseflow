using fake_wiseflow_be.Models;
using fake_wiseflow_be.Repositories;
using fake_wiseflow_be.Services;
using Microsoft.AspNetCore.Mvc;

namespace fake_wiseflow_be.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExamsController : ControllerBase
{
    private readonly ExamRepository _examRepository;
    private readonly IExamService _examService;

    public ExamsController(ExamRepository examRepository, IExamService examService)
    {
        _examRepository = examRepository;
        _examService = examService;
    }

    [HttpGet]
    public async Task<List<Exam>> Get() =>
        await _examRepository.GetAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Exam>> Get(Guid id)
    {
        var exam = await _examRepository.GetAsync(id);

        if (exam is null)
        {
            return NotFound();
        }

        return exam;
    }
    
    [HttpGet("institution/{id}")]
    public async Task<ActionResult<List<Exam>>> GetByInstitution(Guid id)
    {
        var exams = await _examRepository.GetByInstitutionIdAsync(id);

        return exams;
    }
    
    [HttpGet("submissions/{id}")]
    public async Task<ActionResult<List<Guid>>> GetSubmissionIds(Guid id)
    {
        var submissionIds = await _examService.GetSubmissionIdsAsync(id);

        return submissionIds;
    }


    [HttpPost]
    //[Authorize(Roles = "InstitutionAdmin")]
    public async Task<IActionResult> Post(Exam newExam)
    {
        await _examRepository.CreateAsync(newExam);

        return Ok(newExam);
    }

    [HttpPut]
    public async Task<IActionResult> Update(Guid id, Exam updatedExam)
    {
        var exam = await _examRepository.GetAsync(id);

        if (exam is null)
        {
            return NotFound();
        }

        updatedExam.id = exam.id;

        await _examRepository.UpdateAsync(id, updatedExam);

        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(Guid id)
    {
        var exam = await _examRepository.GetAsync(id);

        if (exam is null)
        {
            return NotFound();
        }

        await _examRepository.RemoveAsync(id);

        return NoContent();
    }

    [HttpGet("submissions/{submissionId}")]
    public async Task<ActionResult<Exam>> GetExamBySubmissionId(Guid submissionId)
    {
        var exam = await _examService.GetExamBySubmissionIdAsync(submissionId);

        if (exam is null)
        {
            return NotFound();
        }
        
        return Ok(exam);
    }
}