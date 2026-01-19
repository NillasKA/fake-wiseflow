using fake_wiseflow_be.Models;

namespace fake_wiseflow_be.Services;

public interface ISubmissionExamCoordinatorService
{
    Task<List<Submission>> GetSubmissionsAsync(Guid examId);
    Task<Submission?> GetStudentSubmissionAsync(Guid examId, Guid userId);

    Task CreateSubmissionAsync(Guid examId, Submission newSubmission);

    Task CreateSubmissionsInBulkAsync(Guid examId, List<Submission> newSubmissions);
}