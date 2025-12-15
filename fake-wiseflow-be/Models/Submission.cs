using MongoDB.Bson.Serialization.Attributes;

namespace fake_wiseflow_be.Models;

public class Submission
{
    [BsonId]
    public Guid id { get; set; } = Guid.NewGuid();
    
    public Guid? evaluationId { get; set; }
    
    public Guid userId { get; set; }
    
    public string? filePath { get; set; }
    
    public DateTime? uploadDate { get; set; }
    
    public SubmissionStatus status { get; set; } = SubmissionStatus.Pending;

    public byte[]? FileData { get; set; }
    public string? FileName { get; set; }
    public string? ContentType { get; set; }
}

public enum SubmissionStatus
{
    Pending,
    Graded,
    Returned
}
    