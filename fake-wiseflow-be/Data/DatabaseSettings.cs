namespace fake_wiseflow_be.Data;

public class DatabaseSettings
{
    public string ConnectionString { get; set; } = default!;

    public string DatabaseName { get; set; } = default!;

    public string ExamsCollectionName { get; set; } = "Exams";
    public string UsersCollectionName { get; set; } = "Users";
}