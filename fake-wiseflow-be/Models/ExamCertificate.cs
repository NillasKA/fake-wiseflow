using MongoDB.Bson.Serialization.Attributes;

namespace fake_wiseflow_be.Models;

public class ExamCertificate
{
    [BsonId] 
    public Guid id { get; set; } = Guid.NewGuid();
    public string studentName { get; set; }
    public string courseName { get; set; }
    public Exam exam { get; set; }
    public DateTime dateIssued { get; set; }
}