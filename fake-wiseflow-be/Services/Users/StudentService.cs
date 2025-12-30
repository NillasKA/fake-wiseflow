using System.Security.Cryptography;
using System.Text;
using fake_wiseflow_be.Models;
using fake_wiseflow_be.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using fake_wiseflow_be.Services;

namespace fake_wiseflow_be.Services;

public class StudentService : IStudentService
{
    private readonly UserManager<User> _userManager;
    private readonly IPasswordGeneratorService _passwordGeneratorService;
    private readonly ILogger<StudentService> _logger;

    public StudentService(
        UserManager<User> userManager,
        IPasswordGeneratorService passwordGeneratorService,
        ILogger<StudentService> logger)
    {
        _userManager = userManager;
        _passwordGeneratorService = passwordGeneratorService;
        _logger = logger;
    }

    public async Task<List<StudentDto>> GetAllStudentsAsync()
    {
        var allUsers = _userManager.Users.ToList();
        var students = new List<StudentDto>();

        foreach (var user in allUsers)
        {
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Student"))
            {
                students.Add(new StudentDto
                {
                    Id = user.Id.ToString(),
                    Email = user.Email ?? string.Empty,
                    UserName = user.UserName ?? string.Empty,
                    Role = "Student",
                    InstitutionId = user.InstitutionId
                });
            }
        }

        return students;
    }

    public async Task<List<StudentDto>> GetStudentsByInstitutionAsync(Guid institutionId)
    {
        var allUsers = _userManager.Users.Where(u => u.InstitutionId == institutionId).ToList();
        var students = new List<StudentDto>();

        foreach (var user in allUsers)
        {
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Student"))
            {
                students.Add(new StudentDto
                {
                    Id = user.Id.ToString(),
                    Email = user.Email ?? string.Empty,
                    UserName = user.UserName ?? string.Empty,
                    Role = "Student",
                    InstitutionId = user.InstitutionId
                });
            }
        }

        return students;
    }

    public async Task<StudentDto?> GetStudentByIdAsync(Guid id)
    {
        var idString = id.ToString();
        var user = await _userManager.FindByIdAsync(idString);
        if (user == null) return null;

        var roles = await _userManager.GetRolesAsync(user);
        if (!roles.Contains("Student")) return null;

        return new StudentDto
        {
            Id = user.Id.ToString(),
            Email = user.Email ?? string.Empty,
            UserName = user.UserName ?? string.Empty,
            Role = "Student",
            InstitutionId = user.InstitutionId
        };
    }

    public async Task<CreateStudentResult> CreateStudentAsync(string email, string userName, Guid institutionId)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        var generatedPassword = await _passwordGeneratorService.GenerateSecurePassword();

        var student = new User
        {
            UserName = userName,
            Email = email,
            Role = UserRole.Student,
            InstitutionId = institutionId
        };

        var result = await _userManager.CreateAsync(student, generatedPassword);
        
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to create student: {errors}");
        }

        await _userManager.AddToRoleAsync(student, UserRole.Student.ToString());
        await _userManager.UpdateAsync(student);

        _logger.LogInformation("Student created: {Email} with username {UserName}", student.Email, student.UserName);

        return new CreateStudentResult
        {
            Id = student.Id.ToString(),
            Email = student.Email ?? string.Empty,
            UserName = student.UserName ?? string.Empty,
            Role = student.Role.ToString(),
            TemporaryPassword = generatedPassword,
            Message = "User created successfully. Please share this temporary password with the user securely.",
            InstitutionId = student.InstitutionId
        };
    }

    public async Task<bool> DeleteStudentAsync(Guid id)
    {
        var idString = id.ToString();
        var user = await _userManager.FindByIdAsync(idString);
        if (user == null) return false;

        var roles = await _userManager.GetRolesAsync(user);
        if (!roles.Contains("Student")) return false;

        var result = await _userManager.DeleteAsync(user);

        if (result.Succeeded)
        {
            _logger.LogInformation("Student deleted: {Id}", id);
            return true;
        }

        return false;
    }
} 