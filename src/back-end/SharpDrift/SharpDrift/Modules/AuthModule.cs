using System;
using System.Web;
using System.Security.Cryptography;
using System.Text;
using Insight.Database;
using Nancy;
using SharpDrift.Utilities;

namespace SharpDrift.Modules
{
    public class AuthModule : NancyModule
    {
        public AuthModule()
        {
            // TODO: Add length to password_sha512 field
            Get["/auth/login/{username}/{password_sha512}", true] = async (x, ctx) =>
                {
                    using (var conn = DAL.Conn)
                    {
                        var idClient = await conn.SingleSqlAsync<int?>("SELECT idclient FROM client WHERE username = @u AND password = @p",
                                                                new { u = x.username, p = x.password_sha512 });

                        if (idClient == null)
                            return "false";

                        var authenticationString = String.Format("{0}:{1}:{2}",
                                                                    idClient,
                                                                    DateTime.UtcNow.ToBinary(),
                                                                    Request.UserHostAddress);

                        var encryptedAuthToken = HttpServerUtility.UrlTokenEncode(await AES.EncryptAsync(authenticationString));
                        return ((Response)"true").WithCookie("authToken", encryptedAuthToken);
                    }
                };
        }
    }
}
