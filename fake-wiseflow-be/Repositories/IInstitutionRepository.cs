using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Repositories;

public interface IInstitutionRepository
{
    Task<List<Institution>> GetAsync();
    Task<Institution?> GetAsync(int id);
    Task CreateAsync(Institution newInstitution);
    Task UpdateAsync(int id, Institution updatedInstitution);
    Task RemoveAsync(int id);
}