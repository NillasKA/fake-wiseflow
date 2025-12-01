using fake_wiseflow_be.Models;
using fake_wiseflow_be.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;

namespace fake_wiseflow_be.Services;

public class ExamService : IExamService
{
    private readonly ExamRepository _examRepository;

    public ExamService(ExamRepository examRepository)
    {
        _examRepository = examRepository;
    }

    public async Task<List<Guid>> GetSubmissionIdsAsync(Guid examId)
    {
        return await _examRepository.GetSubmissionIdsAsync(examId);
    }

    public async Task AddSubmissionAsync(Guid examId, Submission submission)
    {
        var exam = await _examRepository.GetAsync(examId);
        if (exam is null)
        {
            throw new Exception("Exam not found");
        }
        
        exam.submissionIds.Add(submission.id);

        await _examRepository.UpdateAsync(examId, exam);
    }

    public async Task BulkAddSubmissionsAsync(Guid examId, List<Submission> submissions)
    {
        var exam = await _examRepository.GetAsync(examId);
        if (exam is null)
        {
            throw new Exception("Exam not found");
        }
        
        exam.submissionIds.AddRange(submissions.Select(s => s.id));
        
        await _examRepository.UpdateAsync(examId, exam);
    }
}