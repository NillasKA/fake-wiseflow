using fake_wiseflow_be.Data;
using fake_wiseflow_be.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace fake_wiseflow_be.Repositories;

public class ExamRepository
{
    private readonly IMongoCollection<Exam> _examsCollection;

    public ExamRepository(
        IOptions<DatabaseSettings> bookStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            bookStoreDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            bookStoreDatabaseSettings.Value.DatabaseName);

        _examsCollection = mongoDatabase.GetCollection<Exam>(
            bookStoreDatabaseSettings.Value.ExamsCollectionName);
    }

    public async Task<List<Exam>> GetAsync() =>
        await _examsCollection.Find(_ => true).ToListAsync();

    public async Task<Exam?> GetAsync(Guid id) =>
        await _examsCollection.Find(x => x.id == id).FirstOrDefaultAsync();

    public async Task<List<Exam>> GetByInstitutionIdAsync(Guid institutionId) =>
        await _examsCollection.Find(x => x.InstitutionId == institutionId).ToListAsync();


    public async Task<List<Guid>> GetSubmissionIdsAsync(Guid examId)
    {
        List<Guid> submissionIds = new List<Guid>();
        var exam = await _examsCollection.Find(x => x.id == examId).FirstOrDefaultAsync();
        
        if (exam == null || exam.submissionIds == null)
        {
            return new List<Guid>();
        }
        
        return exam.submissionIds;
    }
    
    public async Task CreateAsync(Exam newExam) =>
        await _examsCollection.InsertOneAsync(newExam);

    public async Task UpdateAsync(Guid id, Exam updatedExam) =>
        await _examsCollection.ReplaceOneAsync(x => x.id == id, updatedExam);

    public async Task RemoveAsync(Guid id) =>
        await _examsCollection.DeleteOneAsync(x => x.id == id);
}