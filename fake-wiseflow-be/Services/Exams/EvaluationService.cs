using fake_wiseflow_be.Models;
using fake_wiseflow_be.Repositories;

namespace fake_wiseflow_be.Services;

public class EvaluationService : IEvaluationService
{
    private readonly IEvaluationRepository _evaluationRepository;

    public EvaluationService(IEvaluationRepository evaluationRepository)
    {
        _evaluationRepository = evaluationRepository;
    }

    public async Task<Evaluation> CreateEvaluationAsync(Evaluation evaluation)
    {
        await _evaluationRepository.CreateAsync(evaluation);
        return evaluation;
    }

    public async Task<Evaluation?> GetEvaluationAsync(Guid id)
    {
        return await _evaluationRepository.GetAsync(id);
    }
}