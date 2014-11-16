using System;
using System.Data.Common;
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
            Post["/auth", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    int? idClient =
                        await
                            conn.SingleSqlAsync<int?>(
                                "SELECT idclient FROM client WHERE username = @u AND password = @p",
                                new {u = Request.Form.username, p = Request.Form.password_sha512});

                    if (idClient == null || Request.UserHostAddress == null)
                        return new
                        {
                            success = false,
                            authToken = string.Empty
                        }.ToJson()
                            .WithCookie("authToken", string.Empty, DateTime.UtcNow.AddDays(-2));

                    string authenticationstring = AuthTokenManager.CreateAuthToken(idClient.Value,
                        Request.UserHostAddress);

                    string encryptedAuthToken =
                        HttpServerUtility.UrlTokenEncode(await AES.EncryptAsync(authenticationstring));

                    return new
                    {
                        success = true,
                        authToken = encryptedAuthToken
                    }.ToJson()
                        .WithCookie("authToken", encryptedAuthToken, DateTime.UtcNow.AddDays(2));
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
                    .WithCookie("authToken", string.Empty, DateTime.UtcNow.AddDays(-2));
            };
        }
    }
}