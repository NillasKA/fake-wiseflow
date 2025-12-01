using Moq;
using fake_wiseflow_be.Services;
using fake_wiseflow_be.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace fake_wiseflow_be.Tests.Services
{
    [TestClass]
    public class ExaminatorServiceTests
    {
        private Mock<UserManager<User>> _mockUserManager;
        private Mock<IPasswordGeneratorService> _mockPasswordGeneratorService;
        private Mock<ILogger<ExaminatorService>> _mockLogger;
        private ExaminatorService _service;

        [TestInitialize]
        public void Setup()
        {
            var userStoreMock = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(userStoreMock.Object, null, null, null, null, null, null, null, null);
            _mockLogger = new Mock<ILogger<ExaminatorService>>();
            _mockPasswordGeneratorService = new Mock<IPasswordGeneratorService>();
            
            _service = new ExaminatorService(_mockUserManager.Object, _mockPasswordGeneratorService.Object, _mockLogger.Object);
        }

        [TestMethod]
        public async Task GetAllExaminatorsAsync_ReturnsAllExaminators()
        {
            // Arrange
            var users = new List<User>
            {
                new User { Id = ObjectId.GenerateNewId(), Email = "exam1@test.com", UserName = "examinator1", Role = UserRole.Examinator },
                new User { Id = ObjectId.GenerateNewId(), Email = "student@test.com", UserName = "student1", Role = UserRole.Student },
                new User { Id = ObjectId.GenerateNewId(), Email = "exam2@test.com", UserName = "examinator2", Role = UserRole.Examinator }
            }.AsQueryable();

            _mockUserManager.Setup(um => um.Users).Returns(users);
            _mockUserManager.Setup(um => um.GetRolesAsync(It.Is<User>(u => u.Role == UserRole.Examinator)))
                .ReturnsAsync(new List<string> { "Examinator" });
            _mockUserManager.Setup(um => um.GetRolesAsync(It.Is<User>(u => u.Role == UserRole.Student)))
                .ReturnsAsync(new List<string> { "Student" });

            // Act
            var result = await _service.GetAllExaminatorsAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
            Assert.IsTrue(result.All(e => e.Role == "Examinator"));
        }

        [TestMethod]
        public async Task GetExaminatorsByInstitutionAsync_ReturnsExaminatorsForInstitution()
        {
            // Arrange
            var institutionId = Guid.NewGuid();
            var users = new List<User>
            {
                new User { Id = ObjectId.GenerateNewId(), Email = "exam1@test.com", UserName = "examinator1", Role = UserRole.Examinator, InstitutionId = institutionId },
                new User { Id = ObjectId.GenerateNewId(), Email = "exam2@test.com", UserName = "examinator2", Role = UserRole.Examinator, InstitutionId = Guid.NewGuid() }
            }.AsQueryable();

            _mockUserManager.Setup(um => um.Users).Returns(users);
            _mockUserManager.Setup(um => um.GetRolesAsync(It.IsAny<User>()))
                .ReturnsAsync(new List<string> { "Examinator" });

            // Act
            var result = await _service.GetExaminatorsByInstitutionAsync(institutionId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
            Assert.AreEqual(institutionId, result[0].InstitutionId);
        }

        [TestMethod]
        public async Task CreateExaminatorAsync_ValidData_CreatesSuccessfully()
        {
            // Arrange
            var email = "newexam@test.com";
            var userName = "newexaminator";
            var institutionId = Guid.NewGuid();

            _mockUserManager.Setup(um => um.FindByEmailAsync(email))
                .ReturnsAsync((User)null);
            _mockUserManager.Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(um => um.AddToRoleAsync(It.IsAny<User>(), "Examinator"))
                .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(um => um.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _service.CreateExaminatorAsync(email, userName, institutionId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(email, result.Email);
            Assert.AreEqual(userName, result.UserName);
            Assert.IsFalse(string.IsNullOrEmpty(result.TemporaryPassword));
        }

        [TestMethod]
        public async Task CreateExaminatorAsync_DuplicateEmail_ThrowsException()
        {
            // Arrange
            var existingUser = new User { Email = "existing@test.com" };
            _mockUserManager.Setup(um => um.FindByEmailAsync("existing@test.com"))
                .ReturnsAsync(existingUser);

            // Act & Assert
            await Assert.ThrowsExceptionAsync<InvalidOperationException>(
                async () => await _service.CreateExaminatorAsync("existing@test.com", "test", Guid.NewGuid()));
        }

        [TestMethod]
        public async Task DeleteExaminatorAsync_ValidId_DeletesSuccessfully()
        {
            // Arrange
            var examinatorId = ObjectId.GenerateNewId().ToString();
            var examinator = new User { Id = ObjectId.GenerateNewId(), Email = "exam@test.com", Role = UserRole.Examinator };
            
            _mockUserManager.Setup(um => um.FindByIdAsync(examinatorId))
                .ReturnsAsync(examinator);
            _mockUserManager.Setup(um => um.GetRolesAsync(examinator))
                .ReturnsAsync(new List<string> { "Examinator" });
            _mockUserManager.Setup(um => um.DeleteAsync(examinator))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _service.DeleteExaminatorAsync(examinatorId);

            // Assert
            Assert.IsTrue(result);
            _mockUserManager.Verify(um => um.DeleteAsync(examinator), Times.Once);
        }
    }
}