using fake_wiseflow_be.Models;
using fake_wiseflow_be.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Auhthorization;

namespace fake_wiseflow_be.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExamsController : ControllerBase
{
    private readonly ExamRepository _examRepository;

    public ExamsController(ExamRepository examRepository) =>
        _examRepository = examRepository;

    [HttpGet]
    public async Task<List<Exam>> Get() =>
        await _examRepository.GetAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Exam>> Get(int id)
    {
        var exam = await _examRepository.GetAsync(id);

        if (exam is null)
        {
            return NotFound();
        }

        return exam;
    }

    [HttpPost]
    [Authorize(Roles = "InstitutionAdmin")]
    public async Task<IActionResult> Post(Exam newExam)
    {
        await _examRepository.CreateAsync(newExam);

        return CreatedAtAction(nameof(Get), new { id = newExam.id }, newExam);
    }

    [HttpPut()]
    public async Task<IActionResult> Update(int id, Exam updatedExam)
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

    [HttpDelete()]
    public async Task<IActionResult> Delete(int id)
    {
        var exam = await _examRepository.GetAsync(id);

        if (exam is null)
        {
            return NotFound();
        }

        await _examRepository.RemoveAsync(id);

        return NoContent();
    }
}