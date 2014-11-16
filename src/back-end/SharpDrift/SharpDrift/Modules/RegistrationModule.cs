using System;
using System.Data.Common;
using Insight.Database;
using Nancy;
using Nancy.ModelBinding;
using SharpDrift.DataModel;
using SharpDrift.Utilities;
using SharpDrift.Utilities.Data;

namespace SharpDrift.Modules
{
    public class RegistrationModule : NancyModule
    {
        public RegistrationModule()
        {
            Post["/register", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var c = this.Bind<Client>();

                    c = await conn.InsertSqlAsync(string.Join(" ",
                        "INSERT INTO CLIENT VALUES (DEFAULT,",
                        "@UserName,",
                        "@FirstName,",
                        "@LastName,",
                        "@Address,",
                        "@Mail,",
                        "@Password,",
                        "@RegistrationTime,",
                        "@MessagingParameters,",
                        "@CentersOfInterest,",
                        "@PhoneNumber,",
                        "@MailNotifications,",
                        "@PhoneNotifications,",
                        "@Newsletter) RETURNING *"), c);

                    return new
                    {
                        success = true,
                        client = c
                    }.ToJson();
                }
            };
        }
    }
}