using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Services;

public interface IInstitutionService
{
    Task<List<Institution>> GetAllAsync();

    Task<Institution?> GetByIdAsync(int id);

    Task CreateAsync(Institution newInstitution);

    Task UpdateAsync(int id, Institution newInstitution);

    Task RemoveAsync(int id);
}