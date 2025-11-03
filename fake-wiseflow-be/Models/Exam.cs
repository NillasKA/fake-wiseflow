namespace fake_wiseflow_be.Models;

public class Exam
{
    public int id { get; set; }
    public string title { get; set; }
    public DateTime date { get; set; }
    public string description { get; set; }
    public string type { get; set; }
    public List<Submission> submissions { get; set; }
}