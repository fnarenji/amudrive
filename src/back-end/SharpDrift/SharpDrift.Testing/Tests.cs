using System;
using System.Linq;
using Nancy;
using Nancy.Testing;
using Newtonsoft.Json.Linq;
using Xunit;
using SharpDrift.Utilities;
using SharpDrift.Utilities.Data;
using SharpDrift.DataModel;

namespace SharpDrift.Testing
{
    public class Tests
    {
        private Browser Browser()
        {
            return new Browser(new DefaultNancyBootstrapper(), with =>
                                                                {
                                                                    with.HttpRequest();
                                                                    with.UserHostAddress("62.62.49.49");
                                                                });
        }

        [Fact]
        public string Login()
        {
            var browser = Browser();

            var response = browser.Post("/auth/login", with =>
                                                        {
                                                            with.FormValue("username", "aze");
                                                            with.FormValue("password_sha512", "a48c25f7ec82996486b5a8387cc4e147c628c1f48ae8c868561474fbc5eaf4bec44af63f002681aa8dd32f0dfde1bac24b44d7d6014b73fd26025d94e8f58d3b");
                                                        });

            var json = Json.Deserialize(response.Body.AsString());

            Assert.True(response.Cookies.Any(c => c.Name == "authToken" && c.Expires.Value.Between(DateTime.UtcNow.AddDays(1.99), DateTime.UtcNow.AddDays(2.01))));
            Assert.True((bool) json.success);
            Assert.NotNull(json.authToken);
            Assert.NotEmpty((String) json.authToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            return json.authToken;
        }

        [Fact]
        public void Logout()
        {
            var browser = Browser();
            
            var response = browser.Get("/auth/logout", with => with.Cookie("authToken", Login()));
            var json = Json.Deserialize(response.Body.AsString());

            Assert.True(response.Cookies.Any(c => c.Name == "authToken" && c.Expires.Value.Between(DateTime.UtcNow.AddDays(-2.01), DateTime.UtcNow.AddDays(-1.99))));
            Assert.True((bool) json.success);
            Assert.NotNull(json.authToken);
            Assert.Empty((String) json.authToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public void FailedLogin()
        {
            var browser = Browser();

            var response = browser.Post("/auth/login", with =>
                                                        {
                                                            with.FormValue("username", "aze");
                                                            with.FormValue("password_sha512", "invalid_sha512_key_lol_87cc4e147c628c1f48ae8c868561474fbc5eaf4bec44af63f002681aa8dd32f0dfde1bac24b44d7d6014b73fd26025d94e8f58d3b");
                                                        });

            var json = Json.Deserialize(response.Body.AsString());

            Assert.True(response.Cookies.Any(c => c.Name == "authToken" && c.Expires.Value.Between(DateTime.UtcNow.AddDays(-2.01), DateTime.UtcNow.AddDays(-1.99))));
            Assert.False((bool)json.success);
            Assert.NotNull(json.authToken);
            Assert.Empty((String) json.authToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public void GetClient()
        {
            var browser = Browser();

            var response = browser.Get("/client", with => with.Cookie("authToken", Login()));

            var t = response.Body.AsString();
            var j = Json.Deserialize(t);
            Assert.True((bool) j.success);
            var c = ((JObject)j.client).ToObject<Client>();

            var cRef = new Client
            {
                IdClient = 1,
                UserName = "aze",
                FirstName = "mdr",
                LastName = "ptdr",
                Address = "swag",
                Mail = "lel@oklm.kom",
                RegistrationTime = DateTime.Parse("2014-11-09 17:54:28.847"),
                MessagingParameters = 2,
                CentersOfInterest = "lesgroessesqueues",
                PhoneNumber = "1337133749",
                MailNotifications = true,
                PhoneNotifications = true,
                Newsletter = true,
            };

            Assert.Equal(cRef.IdClient, c.IdClient);
            Assert.Equal(cRef.UserName, c.UserName);
            Assert.Equal(cRef.FirstName, c.FirstName);
            Assert.Equal(cRef.LastName, c.LastName);
            Assert.Equal(cRef.Address, c.Address);
            Assert.Equal(cRef.Mail, c.Mail);
            Assert.Equal(cRef.RegistrationTime, c.RegistrationTime);
            Assert.Equal(cRef.MessagingParameters, c.MessagingParameters);
            Assert.Equal(cRef.CentersOfInterest, c.CentersOfInterest);
            Assert.Equal(cRef.PhoneNumber, c.PhoneNumber);
            Assert.Equal(cRef.MailNotifications, c.MailNotifications);
            Assert.Equal(cRef.PhoneNotifications, c.PhoneNotifications);
            Assert.Equal(cRef.Newsletter, c.Newsletter);
        }
    }
}
