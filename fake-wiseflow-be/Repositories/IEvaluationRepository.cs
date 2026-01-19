using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Repositories;

public interface IEvaluationRepository
{
    Task<List<Evaluation>> GetAsync();
    Task<Evaluation?> GetAsync(Guid id);
    Task CreateAsync(Evaluation newEvaluation);
    Task UpdateAsync(Guid id, Evaluation updatedEvaluation);
    Task RemoveAsync(Guid id);
}