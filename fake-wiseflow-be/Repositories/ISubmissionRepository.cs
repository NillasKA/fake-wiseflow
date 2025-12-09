using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Repositories;

public interface ISubmissionRepository
{
    Task<List<Submission>> GetAsync();
    Task<Submission?> GetAsync(Guid id);
    Task<List<Submission>> GetByIdsAsync(List<Guid> ids);
    Task CreateAsync(Submission newSubmission);
    Task CreateBulkAsync(List<Submission> submissions);
    Task UpdateAsync(Guid id, Submission updatedSubmission);
    Task RemoveAsync(Guid id);
}