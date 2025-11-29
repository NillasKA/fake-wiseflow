using fake_wiseflow_be.Models.DTOs;
namespace fake_wiseflow_be.Services;
using System.Security.Cryptography;
using System.Text;

public class PasswordGeneratorService : IPasswordGeneratorService
{
    private const string Uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const string Lowercase = "abcdefghijklmnopqrstuvwxyz";
    private const string Digits = "0123456789";
    private const string SpecialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    public Task<string> GenerateSecurePassword(int length = 12)
    {
        if (length < 8)
            throw new ArgumentException("Password length must be at least 8 characters", nameof(length));

        const string lowercase = "abcdefghijklmnopqrstuvwxyz";
        const string uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string digits = "0123456789";
        const string special = "!@#$%^&*";
        const string allChars = lowercase + uppercase + digits + special;

        using var rng = RandomNumberGenerator.Create();
        var password = new StringBuilder();

        password.Append(GetRandomChar(lowercase, rng));
        password.Append(GetRandomChar(uppercase, rng));
        password.Append(GetRandomChar(digits, rng));
        password.Append(GetRandomChar(special, rng));

        for (int i = 4; i < length; i++)
        {
            password.Append(GetRandomChar(allChars, rng));
        }

        return Task.FromResult(Shuffle(password.ToString(), rng));
    }

    private static char GetRandomChar(string chars, RandomNumberGenerator rng)
    {
        var buffer = new byte[1];
        rng.GetBytes(buffer);
        return chars[buffer[0] % chars.Length];
    }

    private static string Shuffle(string str, RandomNumberGenerator rng)
    {
        var array = str.ToCharArray();
        for (int i = array.Length - 1; i > 0; i--)
        {
            var buffer = new byte[1];
            rng.GetBytes(buffer);
            int j = buffer[0] % (i + 1);
            (array[i], array[j]) = (array[j], array[i]);
        }
        return new string(array);
    }
}