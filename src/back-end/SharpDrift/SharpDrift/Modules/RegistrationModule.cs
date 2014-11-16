using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
                using (var conn = DAL.Conn)
                {
                    var c = this.Bind<Client>();

                    c = await conn.InsertSqlAsync(String.Join(" ", "INSERT INTO CLIENT SET  firstName = @FirstName,",
                                                                                            "lastName = @LastName,",
                                                                                            "address = @Address,",
                                                                                            "mail = @Mail,",
                                                                                            "registrationTime = @RegistrationTime,",
                                                                                            "messagingParameters = @MessagingParameters,",
                                                                                            "centersOfInterest = @CentersOfInterest,",
                                                                                            "phoneNumber = @PhoneNumber,",
                                                                                            "mailNotifications = @MailNotifications,",
                                                                                            "phoneNotifications = @PhoneNotifications,",
                                                                                            "newsletter = @Newsletter RETURNING *"), c);

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
