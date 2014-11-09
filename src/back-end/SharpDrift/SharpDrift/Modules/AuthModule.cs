using System;
using System.Web;
using Insight.Database;
using Nancy;
using SharpDrift.Utilities;
using SharpDrift.Utilities.Data;
using SharpDrift.Utilities.Security;

namespace SharpDrift.Modules
{
    public class AuthModule : NancyModule
    {
        public AuthModule()
        {
            // TODO: Add length to password_sha512 field
            Post["/auth/login", true] = async (x, ctx) =>
            {
                using (var conn = DAL.Conn)
                {
                    var idClient = await conn.SingleSqlAsync<int?>("SELECT idclient FROM client WHERE username = @u AND password = @p",
                                                                    new { u = Request.Form.username, p = Request.Form.password_sha512 });

                    if (idClient == null || Request.UserHostAddress == null)
                        return new
                                {
                                    success = false,
                                    authToken = String.Empty
                                }.ToJson()
                                 .WithCookie("authToken", String.Empty, DateTime.UtcNow.AddDays(-2));

                    var authenticationString = AuthTokenManager.CreateAuthToken(idClient.Value, Request.UserHostAddress);

                    var encryptedAuthToken = HttpServerUtility.UrlTokenEncode(await AES.EncryptAsync(authenticationString));

                    return new
                            {
                                success = true,
                                authToken = encryptedAuthToken
                            }.ToJson()
                             .WithCookie("authToken", encryptedAuthToken, DateTime.UtcNow.AddDays(2));
                }
            };

            Get["/auth/logout"] = x =>
            {
                if (Request.Cookies.ContainsKey("authToken"))
                    AuthTokenManager.DeleteAuthToken(Request.Cookies["authToken"]);

                return new
                        {
                            success = true,
                            authToken = String.Empty
                        }.ToJson()
                         .WithCookie("authToken", String.Empty, DateTime.UtcNow.AddDays(-2));
            };
        }
    }
}
