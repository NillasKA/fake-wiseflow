using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Repositories;

public interface IInstitutionRepository
{
    Task<List<Institution>> GetAsync();
    Task<Institution?> GetAsync(Guid id);
    Task CreateAsync(Institution newInstitution);
    Task UpdateAsync(Guid id, Institution updatedInstitution);
    Task RemoveAsync(Guid id);
}