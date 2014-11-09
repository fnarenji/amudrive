using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SharpDrift.Utilities.Security
{
    static class AES
    {
        private static readonly AesCryptoServiceProvider AESProvider = new AesCryptoServiceProvider();

        static AES()
        {
            AESProvider.GenerateIV();
            AESProvider.GenerateKey();
        }

        public static Task<byte[]> EncryptAsync(String str)
        {
            var inputBuffer = Encoding.UTF8.GetBytes(str);
            return Task.Run(() => AESProvider.CreateEncryptor().TransformFinalBlock(inputBuffer, 0, inputBuffer.Length));
        }

        public static Task<string> DecryptAsync(byte[] array)
        {
            return Task.Run(() => Decrypt(array));
        }

        public static string Decrypt(byte[] array)
        {
            return Encoding.UTF8.GetString(AESProvider.CreateDecryptor().TransformFinalBlock(array, 0, array.Length));
        }
    }
}
