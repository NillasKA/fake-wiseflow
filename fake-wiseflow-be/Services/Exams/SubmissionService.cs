using fake_wiseflow_be.Models;
using fake_wiseflow_be.Repositories;
using Microsoft.AspNetCore.Identity;

namespace fake_wiseflow_be.Services;

public class SubmissionService : ISubmissionService
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly ExamRepository _examRepository;

    public SubmissionService(ISubmissionRepository submissionRepository, ExamRepository examRepository)
    {
        _submissionRepository = submissionRepository;
        _examRepository = examRepository;
    }
    
    public async Task<List<Submission>> GetAllAsync()
    {
        return await _submissionRepository.GetAsync();
    }

    public async Task<Submission?> GetByIdAsync(Guid id)
    {
        return await _submissionRepository.GetAsync(id);
    }

    public async Task<List<Submission>> GetByIdsAsync(List<Guid> ids)
    {
        return await _submissionRepository.GetByIdsAsync(ids);
    }

    public async Task<List<Submission>> GetByUserIdAsync(Guid userId)
    {
        var submissions = await _submissionRepository.GetByUserIdAsync(userId);
        foreach (var submission in submissions)
        {
            var exam = await _examRepository.GetExamBySubmissionIdAsync(submission.id);
            if (exam != null)
            {
                submission.examId = exam.id;
            }
        }
        return submissions;
    }

    public async Task CreateAsync(Submission newSubmission)
    {
        await _submissionRepository.CreateAsync(newSubmission);
    }

    public async Task CreateBulkAsync(List<Submission> newSubmissions)
    {
        await _submissionRepository.CreateBulkAsync(newSubmissions);
    }
    
    public async Task UpdateAsync(Guid id, Submission updatedSubmission)
    {
        await _submissionRepository.UpdateAsync(id, updatedSubmission);
    }
    
    public async Task RemoveAsync(Guid id)
    {
        await _submissionRepository.RemoveAsync(id);
    }
}