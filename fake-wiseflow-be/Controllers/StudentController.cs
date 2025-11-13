using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using fake_wiseflow_be.Models;
using System.Security.Cryptography;
using System.Text;

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

        // Generate a secure random password
        var generatedPassword = GenerateSecurePassword();

        var student = new User
        {
            UserName = request.Email,
            Email = request.Email,
            Role = UserRole.Student
        };

        var result = await _userManager.CreateAsync(student, generatedPassword);
        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(student, UserRole.Student.ToString());

            _logger.LogInformation("Student created: {Email}", student.Email);
            
            // Return the generated password so admin can communicate it to the user
            return Ok(new
            {
                id = student.Id,
                email = student.Email,
                userName = student.UserName,
                role = student.Role.ToString(),
                temporaryPassword = generatedPassword,
                message = "User created successfully. Please share this temporary password with the user securely."
            });
        }

        return BadRequest(new { Errors = result.Errors });

    }

    private static string GenerateSecurePassword(int length = 12)
    {
        const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
        var password = new StringBuilder();
        
        using (var rng = RandomNumberGenerator.Create())
        {
            var buffer = new byte[length];
            rng.GetBytes(buffer);
            
            foreach (var b in buffer)
            {
                password.Append(validChars[b % validChars.Length]);
            }
        }
        
        return password.ToString();
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

    [HttpGet("all")]
    public async Task<IActionResult> GetAllStudents()
    {
        var students = _userManager.Users
            .Where(u => u.Role == UserRole.Student)
            .Select(u => new
            {
                id = u.Id,
                email = u.Email,
                userName = u.UserName,
                role = u.Role.ToString()
            })
            .ToList();

        return Ok(students);
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
    public string Password { get; set; } = default!; // Keep for backwards compatibility but make optional
}
