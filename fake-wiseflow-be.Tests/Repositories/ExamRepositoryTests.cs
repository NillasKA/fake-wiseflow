using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Extensions.Options;
using Moq;
using MongoDB.Driver;
using fake_wiseflow_be.Repositories;
using fake_wiseflow_be.Models;
using fake_wiseflow_be.Data;

namespace fake_wiseflow_be.Tests.Repositories
{
    [TestClass]
    public class ExamRepositoryTests
    {
        private Mock<IMongoCollection<Exam>> _mockCollection;
        private Mock<IOptions<DatabaseSettings>> _mockSettings;
        private ExamRepository _repository;

        [TestInitialize]
        public void Setup()
        {
            _mockCollection = new Mock<IMongoCollection<Exam>>();
            _mockSettings = new Mock<IOptions<DatabaseSettings>>();
            
            var settings = new DatabaseSettings
            {
                ConnectionString = "mongodb://localhost:27017",
                DatabaseName = "TestDatabase"
            };
            _mockSettings.Setup(s => s.Value).Returns(settings);

            // Note: You'll need to mock the MongoDB client and database as well
        }

        [TestMethod]
        public async Task GetAsync_ReturnsAllExams()
        {
            // Arrange
            var exams = new List<Exam>
            {
                new Exam { id = Guid.NewGuid(), title = "Exam 1" },
                new Exam { id = Guid.NewGuid(), title = "Exam 2" }
            };

            // Mock MongoDB cursor behavior
            var mockCursor = new Mock<IAsyncCursor<Exam>>();
            mockCursor.Setup(c => c.Current).Returns(exams);
            mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<CancellationToken>()))
                .Returns(true)
                .Returns(false);

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Exam>>(),
                It.IsAny<FindOptions<Exam>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockCursor.Object);

            // Act & Assert would follow similar pattern
        }
    }
}