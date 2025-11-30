using Moq;
using fake_wiseflow_be.Services;
using fake_wiseflow_be.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;

namespace fake_wiseflow_be.Tests.Services
{
    [TestClass]
    public class StudentServiceTests
    {
        private Mock<UserManager<User>> _mockUserManager;
        private Mock<IPasswordGeneratorService> _mockPasswordGeneratorService;
        private Mock<ILogger<StudentService>> _mockLogger;
        private StudentService _service;

        [TestInitialize]
        public void Setup()
        {
            var userStoreMock = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(
                userStoreMock.Object, null, null, null, null, null, null, null, null);
            _mockLogger = new Mock<ILogger<StudentService>>();
            _service = new StudentService(_mockUserManager.Object, _mockPasswordGeneratorService.Object, _mockLogger.Object);
        }

        [TestMethod]
        public async Task GetAllStudentsAsync_ReturnsAllStudents()
        {
            // Arrange
            var users = new List<User>
            {
                new User { Id = ObjectId.GenerateNewId(), Email = "student1@test.com", UserName = "student1", Role = UserRole.Student },
                new User { Id = ObjectId.GenerateNewId(), Email = "examinator@test.com", UserName = "examinator1", Role = UserRole.Examinator },
                new User { Id = ObjectId.GenerateNewId(), Email = "student2@test.com", UserName = "student2", Role = UserRole.Student }
            }.AsQueryable();

            _mockUserManager.Setup(um => um.Users).Returns(users);
            _mockUserManager.Setup(um => um.GetRolesAsync(It.Is<User>(u => u.Role == UserRole.Student)))
                .ReturnsAsync(new List<string> { "Student" });
            _mockUserManager.Setup(um => um.GetRolesAsync(It.Is<User>(u => u.Role == UserRole.Examinator)))
                .ReturnsAsync(new List<string> { "Examinator" });

            // Act
            var result = await _service.GetAllStudentsAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
            Assert.IsTrue(result.All(s => s.Role == "Student"));
        }

        [TestMethod]
        public async Task GetStudentsByInstitutionAsync_ReturnsStudentsForInstitution()
        {
            // Arrange
            var institutionId = Guid.NewGuid();
            var users = new List<User>
            {
                new User { Id = ObjectId.GenerateNewId(), Email = "student1@test.com", UserName = "student1", Role = UserRole.Student, InstitutionId = institutionId },
                new User { Id = ObjectId.GenerateNewId(), Email = "student2@test.com", UserName = "student2", Role = UserRole.Student, InstitutionId = Guid.NewGuid() }
            }.AsQueryable();

            _mockUserManager.Setup(um => um.Users).Returns(users);
            _mockUserManager.Setup(um => um.GetRolesAsync(It.IsAny<User>()))
                .ReturnsAsync(new List<string> { "Student" });

            // Act
            var result = await _service.GetStudentsByInstitutionAsync(institutionId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
            Assert.AreEqual(institutionId, result[0].InstitutionId);
        }

        [TestMethod]
        public async Task CreateStudentAsync_ValidData_CreatesSuccessfully()
        {
            // Arrange
            var email = "newstudent@test.com";
            var userName = "newstudent";
            var institutionId = Guid.NewGuid();

            _mockUserManager.Setup(um => um.FindByEmailAsync(email))
                .ReturnsAsync((User)null);
            _mockUserManager.Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(um => um.AddToRoleAsync(It.IsAny<User>(), "Student"))
                .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(um => um.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _service.CreateStudentAsync(email, userName, institutionId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(email, result.Email);
            Assert.AreEqual(userName, result.UserName);
            Assert.IsFalse(string.IsNullOrEmpty(result.TemporaryPassword));
        }

        [TestMethod]
        public async Task DeleteStudentAsync_ValidId_DeletesSuccessfully()
        {
            // Arrange
            var studentId = Guid.NewGuid();
            var objectId = ObjectId.GenerateNewId();
            var student = new User { Id = objectId, Email = "student@test.com", Role = UserRole.Student };
            
            _mockUserManager.Setup(um => um.FindByIdAsync(studentId.ToString()))
                .ReturnsAsync(student);
            _mockUserManager.Setup(um => um.GetRolesAsync(student))
                .ReturnsAsync(new List<string> { "Student" });
            _mockUserManager.Setup(um => um.DeleteAsync(student))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _service.DeleteStudentAsync(studentId);

            // Assert
            Assert.IsTrue(result);
            _mockUserManager.Verify(um => um.DeleteAsync(student), Times.Once);
        }

        [TestMethod]
        public async Task DeleteStudentAsync_StudentNotFound_ReturnsFalse()
        {
            // Arrange
            var studentId = Guid.NewGuid();
            _mockUserManager.Setup(um => um.FindByIdAsync(studentId.ToString()))
                .ReturnsAsync((User)null);

            // Act
            var result = await _service.DeleteStudentAsync(studentId);

            // Assert
            Assert.IsFalse(result);
        }
    }
}