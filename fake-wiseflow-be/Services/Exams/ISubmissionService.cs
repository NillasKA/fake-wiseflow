using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Services;

public interface ISubmissionService
{
    Task<List<Submission>> GetAllAsync();

    Task<Submission?> GetByIdAsync(Guid id);
    
    Task<List<Submission>> GetByIdsAsync(List<Guid> ids);

    Task CreateAsync(Submission newSubmission);

    Task CreateBulkAsync(List<Submission> newSubmissions);

    Task UpdateAsync(Guid id, Submission updatedSubmission);

    Task RemoveAsync(Guid id);
}