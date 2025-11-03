namespace fake_wiseflow_be.Models;

public class Submission
{
    public int id { get; set; }
    public string fileName { get; set; }
    public DateTime uploadDate { get; set; }
    public Evaluation evaluation { get; set; }
    public SubmissionStatus status { get; set; }
}

public enum SubmissionStatus
{
    Pending,
    Graded,
    Returned
}
