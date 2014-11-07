using System;
using System.Collections.Generic;
using ImpromptuInterface;
using Nancy.Security;

namespace SharpDrift.Utilities
{
    static class AuthTokenManager
    {
        private static readonly HashSet<String> AuthTokens = new HashSet<string>();

        public static String CreateAuthToken(int userId, string userIP)
        {
            var authenticationString = String.Format("{0}:{1}:{2}",
                                                        userId,
                                                        DateTime.UtcNow.ToBinary(),
                                                        userIP);
            AuthTokens.Add(authenticationString);
            return authenticationString;
        }

        public static bool ValidateAuthToken(String authToken, string userIP)
        {
            var authTokenPieces = authToken.Split(new[] { ':' }, 3);
            var userId = authTokenPieces[0];
            var tokenCreationDate = DateTime.FromBinary(Int64.Parse(authTokenPieces[1]));
            var remoteIp = authTokenPieces[2];

            Console.WriteLine("Validating authentication token for {0} from {1} since {2}.", userId, remoteIp, tokenCreationDate);

            if (AuthTokens.Contains(authToken))
            {
                if (remoteIp == userIP && DateTime.UtcNow.Subtract(tokenCreationDate).TotalHours < 48)
                {
                    Console.WriteLine("Valid authentication token for {0} from {1} since {2}.", userId, remoteIp,
                        tokenCreationDate);
                    return true;
                }
                AuthTokens.Remove(authToken); // Token exists, but invalid IP or too old.
            }

            Console.WriteLine("Invalid authentication token for {0} from {1} since {2}.", userId, remoteIp);
            return false;
        }

        public static String ParseUserId(string authToken)
        {
            return authToken.Split(new[] { ':' }, 3)[0];
        }
    }
}
