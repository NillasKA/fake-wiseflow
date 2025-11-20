using MongoDB.Bson.Serialization.Attributes;

namespace fake_wiseflow_be.Models;

public class Institution
{
    [BsonId]
    public Guid id { get; set; } = Guid.NewGuid();
    public string name { get; set; }
}

