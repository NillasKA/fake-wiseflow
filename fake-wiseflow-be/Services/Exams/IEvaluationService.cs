using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Services;

public interface IEvaluationService
{
    Task<Evaluation> CreateEvaluationAsync(Evaluation evaluation);
    Task<Evaluation?> GetEvaluationAsync(Guid id);
}