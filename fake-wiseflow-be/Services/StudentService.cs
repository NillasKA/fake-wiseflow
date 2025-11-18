using System.Security.Cryptography;
using System.Text;
using fake_wiseflow_be.Models;
using Microsoft.AspNetCore.Identity;

namespace fake_wiseflow_be.Services;

public class StudentService : IStudentService
{
    private readonly UserManager<User> _userManager;
    private readonly ILogger<StudentService> _logger;

    public StudentService(UserManager<User> userManager, ILogger<StudentService> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    public async Task<List<StudentDto>> GetAllStudentsAsync()
    {
        var students = _userManager.Users
            .Where(u => u.Role == UserRole.Student)
            .Select(u => new StudentDto
            {
                Id = u.Id.ToString(),
                Email = u.Email ?? string.Empty,
                UserName = u.UserName ?? string.Empty,
                Role = u.Role.ToString()
            })
            .ToList();

        return students;
    }

    public async Task<StudentDto?> GetStudentByIdAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null || user.Role != UserRole.Student)
        {
            return null;
        }

        return new StudentDto
        {
            Id = user.Id.ToString(),
            Email = user.Email ?? string.Empty,
            UserName = user.UserName ?? string.Empty,
            Role = user.Role.ToString()
        };
    }

    public async Task<CreateStudentResult> CreateStudentAsync(string email)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        var generatedPassword = GenerateSecurePassword();

        var student = new User
        {
            UserName = email,
            Email = email,
            Role = UserRole.Student
        };

        var result = await _userManager.CreateAsync(student, generatedPassword);
        
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to create student: {errors}");
        }

        await _userManager.AddToRoleAsync(student, UserRole.Student.ToString());

        _logger.LogInformation("Student created: {Email}", student.Email);

        return new CreateStudentResult
        {
            Id = student.Id.ToString(),
            Email = student.Email ?? string.Empty,
            UserName = student.UserName ?? string.Empty,
            Role = student.Role.ToString(),
            TemporaryPassword = generatedPassword,
            Message = "User created successfully. Please share this temporary password with the user securely."
        };
    }

    public async Task<bool> DeleteStudentAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null || user.Role != UserRole.Student)
        {
            return false;
        }

        var result = await _userManager.DeleteAsync(user);

        if (result.Succeeded)
        {
            _logger.LogInformation("Student deleted: {Id}", id);
            return true;
        }

        return false;
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
}