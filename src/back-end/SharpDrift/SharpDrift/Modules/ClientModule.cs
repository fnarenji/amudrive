using System;
using Insight.Database;
using Nancy;
using Nancy.ModelBinding;
using SharpDrift.DataModel;
using SharpDrift.Utilities;
using SharpDrift.Utilities.Data;
using SharpDrift.Utilities.Security;

namespace SharpDrift.Modules
{
    public class ClientModule : NancyModule
    {
        public ClientModule()
        {
            this.RequiresAuthentication();

            Get["/client", true] = async (x, ctx) =>
            {
                using (var conn = DAL.Conn)
                    return new
                    {
                        success = true,
                        client = await conn.SingleSqlAsync<Client>("SELECT * FROM CLIENT WHERE idClient = @IdClient", new { IdClient = Int32.Parse(Context.CurrentUser.UserName) })
                    }.ToJson();
            };

            Put["/client", true] = async (x, ctx) =>
            {
                using (var conn = DAL.Conn)
                {
                    var c = this.Bind<Client>();
                    c.IdClient = Int32.Parse(Context.CurrentUser.UserName);
                    
                    await conn.ExecuteSqlAsync(String.Join(" ", "UPDATE CLIENT SET  firstName = @FirstName,",
                                                                                    "lastName = @LastName,",
                                                                                    "address = @Address,",
                                                                                    "mail = @Mail,",
                                                                                    "registrationTime = @RegistrationTime,",
                                                                                    "messagingParameters = @MessagingParameters,",
                                                                                    "centersOfInterest = @CentersOfInterest,",
                                                                                    "phoneNumber = @PhoneNumber,",
                                                                                    "mailNotifications = @MailNotifications,",
                                                                                    "phoneNotifications = @PhoneNotifications,",
                                                                                    "newsletter = @Newsletter",
                                                                                    "WHERE idClient = @IdClient"), c);

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
