using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "InstitutionAdmin,SuperAdmin")]
public class StudentController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ILogger<StudentController> _logger;

    public StudentController(UserManager<User> userManager, ILogger<StudentController> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateStudent([FromBody] CreateStudentRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest("A user with this email already exists.");

        var student = new User
        {
            UserName = request.Email, // Identity requires Username, so im passing the email as a username for now
            Email = request.Email,
            Role = UserRole.Student
        };

        var result = await _userManager.CreateAsync(student, request.Password);
        if (result.Succeeded)
        {
            _logger.LogInformation("Student created: {Email}", student.Email);
            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        return BadRequest(new { Errors = result.Errors });

    }



    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudent(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null || user.Role != UserRole.Student)
        {
            return NotFound(new { message = "Student not found." });
        }

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            role = user.Role.ToString()
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null || user.Role != UserRole.Student)
        {
            return NotFound(new { message = "Student not found." });
        }

        var result = await _userManager.DeleteAsync(user);

        if (result.Succeeded)
        {
            _logger.LogInformation("Student deleted: {Id}", id);
            return NoContent();
        }

        return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
    }
}

    





public class CreateStudentRequest
{
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
}
