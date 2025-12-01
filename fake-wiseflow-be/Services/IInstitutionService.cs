using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Services;

public interface IInstitutionService
{
    Task<List<Institution>> GetAllAsync();

    Task<Institution?> GetByIdAsync(Guid id);

    Task CreateAsync(Institution newInstitution);

    Task UpdateAsync(Guid id, Institution newInstitution);

    Task RemoveAsync(Guid id);
}