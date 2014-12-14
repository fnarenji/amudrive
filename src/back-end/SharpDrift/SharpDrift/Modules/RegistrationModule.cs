using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading;
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
                using (DbConnection conn = DAL.Conn)
                {
                    var c = this.Bind<Client>();
                    c.RegistrationTime = DateTime.UtcNow;

                    var reasons = new List<string>();

                    if (string.IsNullOrEmpty(c.UserName)
                        || string.IsNullOrEmpty(c.UserName)
                        || string.IsNullOrEmpty(c.FirstName)
                        || string.IsNullOrEmpty(c.LastName)
                        || string.IsNullOrEmpty(c.Address)
                        || Math.Abs(c.Lat) < 0.001
                        || Math.Abs(c.Long) < 0.001
                        || string.IsNullOrEmpty(c.Mail)
                        || string.IsNullOrEmpty(c.Address)
                        || string.IsNullOrEmpty(c.Password)
                        || string.IsNullOrEmpty(c.PhoneNumber))
                        reasons.Add("Tous les champs doivent être remplis.");

                    if (c.Mail != null && !new MailAddress(c.Mail).Host.EndsWith("univ-amu.fr"))
                        reasons.Add("Votre adresse email doit être une adresse de l'université Aix-Marseille (de domaine univ-amu.fr)");

                    if (reasons.Any())
                    {
                        return new
                        {
                            success = false,
                            reasons = reasons,
                        }.ToJson();
                    }

                    try
                    {
                        c = await conn.InsertSqlAsync(string.Join(" ",
                            "INSERT INTO CLIENT VALUES (DEFAULT,",
                            "@UserName,",
                            "@FirstName,",
                            "@LastName,",
                            "@Address,",
                            "@Long,",
                            "@Lat,",
                            "@Mail,",
                            "@Password,",
                            "DEFAULT,",
                            "@MessagingParameters,",
                            "@CentersOfInterest,",
                            "@PhoneNumber,",
                            "@MailNotifications,",
                            "@PhoneNotifications,",
                            "@Newsletter,",
                            "@FavoriteCampus) RETURNING *"), c);
                    }
                    catch (AggregateException aggregate)
                    {
                        reasons.Add(aggregate.InnerException.InnerException.ToString().Contains("mail_unique")
                            ? "Cette adresse mail est déjà utilisée."
                            : "Une erreur de données est survenue." + aggregate.ToString()); // @todo REMOVE EXCEPTION DUMPING TO CLIENT. FOR DEBUG PURPOSE ONLY
                    }

                    if (reasons.Any())
                    {
                        return new
                        {
                            success = false,
                            reasons = reasons,
                        }.ToJson();
                    }

                    var validationKey = Path.GetRandomFileName() + Path.GetRandomFileName() + Path.GetRandomFileName();

                    await conn.ExecuteSqlAsync("INSERT INTO clientMailValidation VALUES (@IdClient, @ValidationKey)",
                                                new { IdClient = c.IdClient, ValidationKey = validationKey });

                    Task.Run(
                        async delegate
                        {
                            await
                                Mail.Send(string.Join(" ", c.FirstName, c.LastName), c.Mail,
                                    "Activez votre compte AMUDrive !", "http://localhost/validate/" + validationKey);
                        });

                    return new
                    {
                        success = true,
                        client = c
                    }.ToJson();
                }
            };

            Get["/validate/{validation_key}", true] = async (x, ctx) =>
            {
                using (var conn = DAL.Conn)
                {
                    await conn.ExecuteSqlAsync("DELETE FROM clientMailValidation WHERE validationKey = @ValidationKey", new { ValidationKey = x.validation_key });

                    return "Mail validé."; // Redirection ?
                }
            };
        }
    }
}