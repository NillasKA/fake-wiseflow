using fake_wiseflow_be.Models.DTOs;

namespace fake_wiseflow_be.Services;

public interface IExaminatorService
{
    Task<List<ExaminatorDto>> GetAllExaminatorsAsync();
    Task<ExaminatorDto?> GetExaminatorByIdAsync(string id);
    Task<CreateExaminatorResult> CreateExaminatorAsync(string email, Guid institutionId);
    Task<List<ExaminatorDto>> GetExaminatorsByInstitutionAsync(Guid institutionId);
    Task<bool> DeleteExaminatorAsync(string id);

}