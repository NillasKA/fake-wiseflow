using MongoDB.Bson.Serialization.Attributes;

namespace fake_wiseflow_be.Models;

public class Exam
{
    [BsonId]
    public Guid id { get; set; } = Guid.NewGuid();
    
    public List<Guid> submissionIds { get; set; } = [];
    
    public Guid InstitutionId { get; set; }
    public string title { get; set; }
    
    public DateTime date { get; set; }
    
    public string description { get; set; }
    
    public string type { get; set; }
}