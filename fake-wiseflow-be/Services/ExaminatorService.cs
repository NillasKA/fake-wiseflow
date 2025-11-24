using System.Security.Cryptography;
using System.Text;
using fake_wiseflow_be.Models;
using fake_wiseflow_be.Models.DTOs;
using Microsoft.AspNetCore.Identity;

namespace fake_wiseflow_be.Services;

public class ExaminatorService : IExaminatorService
{
    private readonly UserManager<User> _userManager;
    private readonly ILogger<ExaminatorService> _logger;

    public ExaminatorService(UserManager<User> userManager, ILogger<ExaminatorService> logger)
    {
        _userManager = userManager;
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
                    Role = "Examinator"
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
            Role = "Examinator"
        };
    }

    public async Task<CreateExaminatorResult> CreateExaminatorAsync(string email)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        var generatedPassword = GenerateSecurePassword();

        var examinator = new User
        {
            UserName = email,
            Email = email,
            Role = UserRole.Examinator
        };

        var result = await _userManager.CreateAsync(examinator, generatedPassword);
        
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to create examinator: {errors}");
        }

        await _userManager.AddToRoleAsync(examinator, UserRole.Examinator.ToString());
        await _userManager.UpdateAsync(examinator);

        _logger.LogInformation("Examinator created: {Email}", examinator.Email);

        return new CreateExaminatorResult
        {
            Id = examinator.Id.ToString(),
            Email = examinator.Email ?? string.Empty,
            UserName = examinator.UserName ?? string.Empty,
            Role = examinator.Role.ToString(),
            TemporaryPassword = generatedPassword,
            Message = "Examinator created successfully. Please share this temporary password with the user securely."
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