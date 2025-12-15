using Microsoft.AspNetCore.Http;

namespace fake_wiseflow_be.Models.DTOs;

public class BulkSubmissionRequest
{
    public Guid ExamId { get; set; }
    public List<Submission> Submissions { get; set; }
}

public class SubmissionRequest
{
    public Guid ExamId { get; set; }
    public Submission Submission { get; set; }
}

public class SubmissionUploadRequest
{
    public Guid ExamId { get; set; }
    public IFormFile File { get; set; }
}