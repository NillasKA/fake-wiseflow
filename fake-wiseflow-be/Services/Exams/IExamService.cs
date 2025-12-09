using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Services;

public interface IExamService
{
    
    Task<List<Guid>> GetSubmissionIdsAsync(Guid examId);

    Task AddSubmissionAsync(Guid examId, Submission submission);

    Task BulkAddSubmissionsAsync(Guid examId, List<Submission> submissions);
}