using fake_wiseflow_be.Models.DTOs;

namespace fake_wiseflow_be.Services;

public interface IPasswordGeneratorService
{
    Task<string> GenerateSecurePassword(int length = 12);
}