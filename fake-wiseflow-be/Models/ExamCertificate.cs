namespace fake_wiseflow_be.Models;

public class ExamCertificate
{
    public int id { get; set; }
    public string studentName { get; set; }
    public string courseName { get; set; }
    public Exam exam { get; set; }
    public DateTime dateIssued { get; set; }
}