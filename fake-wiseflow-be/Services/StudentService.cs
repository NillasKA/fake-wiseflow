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
    private readonly ILogger<StudentService> _logger;

    public StudentService(UserManager<User> userManager, ILogger<StudentService> logger)
    {
        _userManager = userManager;
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

        var generatedPassword = await new PswGeneratorService().GenerateSecurePassword();

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

    /*
    private static string GenerateSecurePassword(int length = 12)
    {
        if (length < 8)
            throw new ArgumentException("Password length must be at least 8 characters", nameof(length));

        const string lowercase = "abcdefghijklmnopqrstuvwxyz";
        const string uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string digits = "0123456789";
        const string special = "!@#$%^&*";
        const string allChars = lowercase + uppercase + digits + special;

        using var rng = RandomNumberGenerator.Create();
        var password = new StringBuilder();

        password.Append(GetRandomChar(lowercase, rng));
        password.Append(GetRandomChar(uppercase, rng));
        password.Append(GetRandomChar(digits, rng));
        password.Append(GetRandomChar(special, rng));

        for (int i = 4; i < length; i++)
        {
            password.Append(GetRandomChar(allChars, rng));
        }

        return Shuffle(password.ToString(), rng);
    }

    private static char GetRandomChar(string chars, RandomNumberGenerator rng)
    {
        var buffer = new byte[1];
        rng.GetBytes(buffer);
        return chars[buffer[0] % chars.Length];
    }

    private static string Shuffle(string str, RandomNumberGenerator rng)
    {
        var array = str.ToCharArray();
        for (int i = array.Length - 1; i > 0; i--)
        {
            var buffer = new byte[1];
            rng.GetBytes(buffer);
            int j = buffer[0] % (i + 1);
            (array[i], array[j]) = (array[j], array[i]);
        }
        return new string(array);
    }
    */
} 