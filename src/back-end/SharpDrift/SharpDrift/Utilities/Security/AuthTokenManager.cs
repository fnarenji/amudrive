using System;
using System.Collections.Concurrent;

namespace SharpDrift.Utilities.Security
{
    internal static class AuthTokenManager
    {
        private static readonly ConcurrentDictionary<int, string> AuthTokens = new ConcurrentDictionary<int, string>();

        public static string CreateAuthToken(int userId, string userIP)
        {
            string authenticationstring = string.Format("{0}:{1}:{2}",
                userId,
                DateTime.UtcNow.ToBinary(),
                userIP);

            AuthTokens.TryAdd(authenticationstring.GetHashCode(), authenticationstring);
            return authenticationstring;
        }

        public static void DeleteAuthToken(string authToken)
        {
            AuthTokens.TryRemove(authToken.GetHashCode(), out authToken);
        }

        public static bool ValidateAuthToken(string authToken, string userIP)
        {
            string[] authTokenPieces = authToken.Split(new[] {':'}, 3);
            string userId = authTokenPieces[0];
            DateTime tokenCreationDate = DateTime.FromBinary(Int64.Parse(authTokenPieces[1]));
            string remoteIp = authTokenPieces[2];

            Console.WriteLine("Validating authentication token for {0} from {1} since {2}.", userId, remoteIp,
                tokenCreationDate);

            if (AuthTokens.ContainsKey(authToken.GetHashCode()))
            {
                if (remoteIp == userIP && DateTime.UtcNow.Subtract(tokenCreationDate).TotalHours < 48)
                {
                    Console.WriteLine("Valid authentication token for {0} from {1} since {2}.", userId, remoteIp,
                        tokenCreationDate);
                    return true;
                }
                AuthTokens.TryRemove(authToken.GetHashCode(), out authToken);
                    // Token exists, but invalid IP or too old.
            }

            Console.WriteLine("Invalid authentication token for {0} from {1} since {2}.", userId, remoteIp,
                tokenCreationDate);
            return false;
        }

        public static string ParseUserId(string authToken)
        {
            return authToken.Split(new[] {':'}, 3)[0];
        }
    }
}