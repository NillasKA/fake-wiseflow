using System.Security.Cryptography;
using System.Text;
using fake_wiseflow_be.Models;
using fake_wiseflow_be.Models.DTOs;
using Microsoft.AspNetCore.Identity;

namespace fake_wiseflow_be.Services;

public class ExaminatorService : IExaminatorService
{
    private readonly UserManager<User> _userManager;
    private readonly IPasswordGeneratorService _passwordGeneratorService;
    private readonly ILogger<ExaminatorService> _logger;

    public ExaminatorService(
        UserManager<User> userManager,
        IPasswordGeneratorService passwordGeneratorService,
        ILogger<ExaminatorService> logger)
    {
        _userManager = userManager;
        _passwordGeneratorService = passwordGeneratorService;
        _logger = logger;
    }

    public async Task<List<ExaminatorDto>> GetAllExaminatorsAsync()
    {
        var allUsers = _userManager.Users.ToList();
        var examinators = new List<ExaminatorDto>();

        foreach (var user in allUsers)
        {
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Examinator"))
            {
                examinators.Add(new ExaminatorDto
                {
                    Id = user.Id.ToString(),
                    Email = user.Email ?? string.Empty,
                    UserName = user.UserName ?? string.Empty,
                    Role = "Examinator",
                    InstitutionId = user.InstitutionId
                });
            }
        }

        return examinators;
    }

    public async Task<List<ExaminatorDto>> GetExaminatorsByInstitutionAsync(Guid institutionId)
    {
        var allUsers = _userManager.Users.Where(u => u.InstitutionId == institutionId).ToList();
        var examinators = new List<ExaminatorDto>();

        foreach (var user in allUsers)
        {
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Examinator"))
            {
                examinators.Add(new ExaminatorDto
                {
                    Id = user.Id.ToString(),
                    Email = user.Email ?? string.Empty,
                    UserName = user.UserName ?? string.Empty,
                    Role = "Examinator",
                    InstitutionId = user.InstitutionId
                });
            }
        }

        return examinators;
    }

    public async Task<ExaminatorDto?> GetExaminatorByIdAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return null;

        var roles = await _userManager.GetRolesAsync(user);
        if (!roles.Contains("Examinator")) return null;

        return new ExaminatorDto
        {
            Id = user.Id.ToString(),
            Email = user.Email ?? string.Empty,
            UserName = user.UserName ?? string.Empty,
            Role = "Examinator",
            InstitutionId = user.InstitutionId
        };
    }

    public async Task<CreateExaminatorResult> CreateExaminatorAsync(string email, string userName, Guid institutionId)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        var generatedPassword = await _passwordGeneratorService.GenerateSecurePassword();

        var examinator = new User
        {
            UserName = userName,
            Email = email,
            Role = UserRole.Examinator,
            InstitutionId = institutionId
        };

        var result = await _userManager.CreateAsync(examinator, generatedPassword);
        
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to create examinator: {errors}");
        }

        await _userManager.AddToRoleAsync(examinator, UserRole.Examinator.ToString());
        await _userManager.UpdateAsync(examinator);

        _logger.LogInformation("Examinator created: {Email} with username {UserName}", examinator.Email, examinator.UserName);

        return new CreateExaminatorResult
        {
            Id = examinator.Id.ToString(),
            Email = examinator.Email ?? string.Empty,
            UserName = examinator.UserName ?? string.Empty,
            Role = examinator.Role.ToString(),
            TemporaryPassword = generatedPassword,
            Message = "Examinator created successfully. Please share this temporary password with the user securely.",
            InstitutionId = examinator.InstitutionId
        };
    }

    public async Task<bool> DeleteExaminatorAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return false;

        var roles = await _userManager.GetRolesAsync(user);
        if (!roles.Contains("Examinator")) return false;

        var result = await _userManager.DeleteAsync(user);

        if (result.Succeeded)
        {
            _logger.LogInformation("Examinator deleted: {Id}", id);
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