using MongoDB.Bson.Serialization.Attributes;

namespace fake_wiseflow_be.Models;

public class Submission
{
    [BsonId]
    public Guid id { get; set; } = Guid.NewGuid();
    
    [BsonElement("fileName")]
    public string fileName { get; set; }
    
    [BsonElement("uploadDate")]
    public DateTime uploadDate { get; set; }
    
    [BsonElement("evaluation")]
    public Evaluation? evaluation { get; set; }
    
    [BsonElement("status")]
    public SubmissionStatus status { get; set; }
}

public enum SubmissionStatus
{
    Pending,
    Graded,
    Returned
}
