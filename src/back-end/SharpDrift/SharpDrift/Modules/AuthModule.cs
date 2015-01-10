using System;
using System.Data.Common;
using System.Web;
using Insight.Database;
using Nancy;
using Org.BouncyCastle.Utilities.Collections;
using SharpDrift.Utilities;
using SharpDrift.Utilities.Data;
using SharpDrift.Utilities.Security;

namespace SharpDrift.Modules
{
    public class AuthModule : NancyModule
    {
        public AuthModule()
        {
            Post["/auth", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    int? idClient =
                        await
                            conn.SingleSqlAsync<int?>(
                                "SELECT idclient FROM client WHERE username = @u AND password = @p",
                                new {u = Request.Form.username, p = Request.Form.password_sha512});

                    Console.WriteLine(Request.Form.username);
                    Console.WriteLine(Request.Form.password_sha512);

                    if (idClient == null || Request.UserHostAddress == null)
                        return new
                        {
                            success = false,
                            authToken = string.Empty, 
                            Request.Form.username,
                            Request.Form.password_sha512,
                            Request.Form
                        }.ToJson()
                         .WithCookie("authToken", string.Empty, DateTime.UtcNow.AddDays(-7));

                    int? validMail =
                        await
                            conn.SingleSqlAsync<int?>(
                                "SELECT idClient FROM clientMailValidation WHERE idClient = @IdClient",
                                new {IdClient = idClient.Value});

                    if (validMail != null)
                        return new
                        {
                            success = false,
                            reasons = "Merci de valider votre adresse mail.",
                            authToken = string.Empty,
                        }.ToJson()
                         .WithCookie("authToken", string.Empty, DateTime.UtcNow.AddDays(-7));

                    string authenticationstring = AuthTokenManager.CreateAuthToken(idClient.Value,
                        Request.UserHostAddress);

                    string encryptedAuthToken =
                        HttpServerUtility.UrlTokenEncode(await AES.EncryptAsync(authenticationstring));

                    return new
                    {
                        success = true,
                        authToken = encryptedAuthToken
                    }.ToJson()
                     .WithCookie("authToken", encryptedAuthToken, DateTime.UtcNow.AddDays(7));
                }
            };

            Delete["/auth"] = x =>
            {
                if (Request.Cookies.ContainsKey("authToken"))
                    AuthTokenManager.DeleteAuthToken(Request.Cookies["authToken"]);

                return new
                {
                    success = true,
                    authToken = string.Empty
                }.ToJson()
                 .WithCookie("authToken", string.Empty, DateTime.UtcNow.AddDays(-7));
            };
        }
    }
}