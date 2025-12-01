using fake_wiseflow_be.Models;
using Microsoft.AspNetCore.Identity;

namespace fake_wiseflow_be.Services;

public class SubmissionExamCoordinatorService : ISubmissionExamCoordinatorService
{
    private readonly ISubmissionService _submissionService;
    private readonly IExamService _examService;
    private readonly UserManager<User> _userManager;

    public SubmissionExamCoordinatorService(ISubmissionService submissionService, IExamService examService, UserManager<User> userManager)
    {
        _submissionService = submissionService;
        _examService = examService;
        _userManager = userManager;
    }
    
    
    public async Task<List<Submission>> GetSubmissionsAsync(Guid examId)
    {
        var ids = await _examService.GetSubmissionIdsAsync(examId);
        var submissions = await _submissionService.GetByIdsAsync(ids);

        return submissions;
    }
    
    
    public async Task CreateSubmissionAsync(Guid examId, Submission newSubmission)
    {
        var user = await _userManager.FindByIdAsync(newSubmission.userId.ToString());
        
        if (user == null || !user.Roles.Contains("Student"))
        {
            throw new Exception("User not found, or user is not a student.");
        }
        
        await _submissionService.CreateAsync(newSubmission);
        
        await _examService.AddSubmissionAsync(examId, newSubmission);
    }

    public async Task CreateSubmissionsInBulkAsync(Guid examId, List<Submission> newSubmissions)
    {
        await _submissionService.CreateBulkAsync(newSubmissions);
        
        await _examService.BulkAddSubmissionsAsync(examId, newSubmissions);
    }
}