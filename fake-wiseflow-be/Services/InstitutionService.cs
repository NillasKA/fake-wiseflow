using fake_wiseflow_be.Models;
using fake_wiseflow_be.Repositories;

namespace fake_wiseflow_be.Services;

public class InstitutionService : IInstitutionService
{
    private readonly IInstitutionRepository _institutionRepository;

    public InstitutionService(IInstitutionRepository institutionRepository)
    {
        _institutionRepository = institutionRepository;
    }

    public async Task<List<Institution>> GetAllAsync() =>
        await _institutionRepository.GetAsync();

    public async Task<Institution?> GetByIdAsync(Guid id) =>
        await _institutionRepository.GetAsync(id);

    public async Task CreateAsync(Institution newInstitution) =>
        await _institutionRepository.CreateAsync(newInstitution);

    public async Task UpdateAsync(Guid id, Institution updatedInstitution) =>
        await _institutionRepository.UpdateAsync(id, updatedInstitution);

    public async Task RemoveAsync(Guid id) =>
        await _institutionRepository.RemoveAsync(id);
}