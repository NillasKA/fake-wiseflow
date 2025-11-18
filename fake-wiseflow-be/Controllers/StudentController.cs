using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using fake_wiseflow_be.Services;

namespace fake_wiseflow_be.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "InstitutionAdmin,SuperAdmin")]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;
    private readonly ILogger<StudentController> _logger;

    public StudentController(IStudentService studentService, ILogger<StudentController> logger)
    {
        _studentService = studentService;
        _logger = logger;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateStudent([FromBody] CreateStudentRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result = await _studentService.CreateStudentAsync(request.Email);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudent(string id)
    {
        var student = await _studentService.GetStudentByIdAsync(id);

        if (student == null)
        {
            return NotFound(new { message = "Student not found." });
        }

        return Ok(student);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllStudents()
    {
        var students = await _studentService.GetAllStudentsAsync();
        return Ok(students);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(string id)
    {
        var success = await _studentService.DeleteStudentAsync(id);

        if (!success)
        {
            return NotFound(new { message = "Student not found." });
        }

        return NoContent();
    }
}

public class CreateStudentRequest
{
    public string Email { get; set; } = default!;
}
