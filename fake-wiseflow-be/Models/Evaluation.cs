using MongoDB.Bson.Serialization.Attributes;

namespace fake_wiseflow_be.Models;

public class Evaluation
{
    [BsonId]
    public Guid id { get; set; } = Guid.NewGuid();
    public int grade { get; set; }
    public string feedback { get; set; }
    public DateTime date { get; set; }
}