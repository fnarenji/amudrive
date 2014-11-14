using System;
using System.Collections.Generic;
using System.Linq;
using Nancy;
using Nancy.Testing;
using Newtonsoft.Json;
using Xunit;
using SharpDrift.Utilities;
using SharpDrift.DataModel;

namespace SharpDrift.Testing
{
    public class Tests
    {
        private Browser Browser()
        {
            return new Browser(
                with =>
                {
                    with.Assembly("SharpDrift.exe");
                    with.AllDiscoveredModules();
                },
                with =>
                {
                    with.HttpRequest();
                    with.UserHostAddress("62.62.49.49");
                });
        }

        [Fact]
        public string Login()
        {
            var browser = Browser();

            BrowserResponse response = browser.Post("/auth", with =>
                                                        {
                                                            with.FormValue("username", "aze");
                                                            with.FormValue("password_sha512", "a48c25f7ec82996486b5a8387cc4e147c628c1f48ae8c868561474fbc5eaf4bec44af63f002681aa8dd32f0dfde1bac24b44d7d6014b73fd26025d94e8f58d3b");
                                                        });

            var t = response.Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(t, new
                                                                {
                                                                    success = false,
                                                                    authToken = String.Empty
                                                                });

            Assert.True(response.Cookies.Any(c => c.Name == "authToken" && c.Expires.Value.Between(DateTime.UtcNow.AddDays(1.99), DateTime.UtcNow.AddDays(2.01))));
            Assert.True(json.success);
            Assert.NotNull(json.authToken);
            Assert.NotEmpty(json.authToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            return json.authToken;
        }

        [Fact]
        public void Logout()
        {
            var browser = Browser();
            
            BrowserResponse response = browser.Delete("/auth", with => with.Cookie("authToken", Login()));

            var t = response.Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(t, new
                                                                {
                                                                    success = false,
                                                                    authToken = "OKLM_SHOULD_BE_EMPTY_LEL"
                                                                });

            Assert.True(response.Cookies.Any(c => c.Name == "authToken" && c.Expires.Value.Between(DateTime.UtcNow.AddDays(-2.01), DateTime.UtcNow.AddDays(-1.99))));
            Assert.True(json.success);
            Assert.NotNull(json.authToken);
            Assert.Empty(json.authToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public void FailedLogin()
        {
            var browser = Browser();

            BrowserResponse response = browser.Post("/auth", with =>
                                                        {
                                                            with.FormValue("username", "aze");
                                                            with.FormValue("password_sha512", "invalid_sha512_key_lol_87cc4e147c628c1f48ae8c868561474fbc5eaf4bec44af63f002681aa8dd32f0dfde1bac24b44d7d6014b73fd26025d94e8f58d3b");
                                                        });

            var t = response.Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(t, new
                                                                {
                                                                    success = true,
                                                                    authToken = "OKLM_SHOULD_BE_EMPTY_LEL"
                                                                });

            Assert.True(response.Cookies.Any(c => c.Name == "authToken" && c.Expires.Value.Between(DateTime.UtcNow.AddDays(-2.01), DateTime.UtcNow.AddDays(-1.99))));
            Assert.False(json.success);
            Assert.NotNull(json.authToken);
            Assert.Empty(json.authToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public void GetClient()
        {
            var browser = Browser();

            var response = browser.Get("/client", with => with.Cookie("authToken", Login())).Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(response, new
                                                                        {
                                                                            success = false,
                                                                            client = null as Client
                                                                        });

            Assert.True(json.success);

            var cRef = new Client
            {
                IdClient            = 1,
                UserName            = "aze",
                FirstName           = "mdr",
                LastName            = "ptdr",
                Address             = "swag",
                Mail                = "lel@oklm.kom",
                RegistrationTime    = DateTime.Parse("2014-11-09 17:54:28.847"),
                MessagingParameters = 2,
                CentersOfInterest   = "lesgroessesqueues",
                PhoneNumber         = "1337133749",
                MailNotifications   = true,
                PhoneNotifications  = true,
                Newsletter          = true
            };

            Assert.Equal(cRef.IdClient,            json.client.IdClient);
            Assert.Equal(cRef.UserName,            json.client.UserName);
            Assert.Equal(cRef.FirstName,           json.client.FirstName);
            Assert.Equal(cRef.LastName,            json.client.LastName);
            Assert.Equal(cRef.Address,             json.client.Address);
            Assert.Equal(cRef.Mail,                json.client.Mail);
            Assert.Equal(cRef.RegistrationTime,    json.client.RegistrationTime);
            Assert.Equal(cRef.MessagingParameters, json.client.MessagingParameters);
            Assert.Equal(cRef.CentersOfInterest,   json.client.CentersOfInterest);
            Assert.Equal(cRef.PhoneNumber,         json.client.PhoneNumber);
            Assert.Equal(cRef.MailNotifications,   json.client.MailNotifications);
            Assert.Equal(cRef.PhoneNotifications,  json.client.PhoneNotifications);
            Assert.Equal(cRef.Newsletter,          json.client.Newsletter);
        }

        [Fact]
        public void UpdateClient()
        {
            var browser = Browser();
            var login = Login();

            var c = new Client
            {
                IdClient = 1,
                UserName = "aze",
                FirstName = "FAKE_FIRSTNAME",
                LastName = "ptdr",
                Address = "swag",
                Mail = "lel@oklm.kom",
                RegistrationTime = DateTime.Parse("2014-11-09 17:54:28.847"),
                MessagingParameters = 2,
                CentersOfInterest = "lesgroessesqueues",
                PhoneNumber = "1337133749",
                MailNotifications = true,
                PhoneNotifications = true,
                Newsletter = true
            };

            var response = browser.Put("/client", with =>
                                                    {
                                                        with.Cookie("authToken", login);
                                                        with.JsonBody(c);
                                                    }).Body.AsString();

            var json = JsonConvert.DeserializeAnonymousType(response, new
                                                                        {
                                                                            success = false,
                                                                            client = null as Client
                                                                        });

            Assert.True(json.success);
            Assert.Equal("FAKE_FIRSTNAME", json.client.FirstName);

            c.FirstName = "mdr";

            browser.Put("/client", with =>
                                    {
                                        with.Cookie("authToken", login);
                                        with.JsonBody(c);
                                    }).Body.AsString();

            response = browser.Get("/client", with => with.Cookie("authToken", login)).Body.AsString();

            json = JsonConvert.DeserializeAnonymousType(response, new
                                                                    {
                                                                        success = false,
                                                                        client = null as Client
                                                                    });

            Assert.True(json.success);
            Assert.NotNull(json.client);
            Assert.Equal("mdr", json.client.FirstName);
        }

        [Fact]
        public void GetCampuses()
        {
            var browser = Browser();
            var login = Login();

            var response = browser.Get("/campuses", with => with.Cookie("authToken", login)).Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(response, new
                                                                        {
                                                                            success = false,
                                                                            campuses = null as IList<Campus>
                                                                        });
            
            Assert.True(json.success);
            Assert.NotNull(json.campuses);
            Assert.NotEmpty(json.campuses);
            Assert.True(json.campuses.Any(c => 1 == c.IdCampus && "IUT Aix-en-Provence" == c.Name));
        }
        
        [Fact]
        public void GetVehicles()
        {
            var browser = Browser();
            var login = Login();

            var response = browser.Get("/vehicles", with => with.Cookie("authToken", login)).Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(response, new
                                                                        {
                                                                            success = false,
                                                                            vehicle = null as IList<Vehicle>
                                                                        });

            Assert.True(json.success);
            Assert.NotNull(json.vehicle);
            Assert.True(json.vehicle.Count > 0);

            var v = new Vehicle
                        {
                            IdClient = 1,
                            Animals = true,
                            Eat = false,
                            IdVehicle = 1,
                            BV = BV.BVM,
                            Name = "Lambo",
                            Smoking = false
                        };

            var a = json.vehicle.First();

            Assert.Equal(v.IdClient , a.IdClient);
            Assert.Equal(v.IdVehicle, a.IdVehicle);
            Assert.Equal(v.Name,a.Name);
            Assert.Equal(v.Smoking,a.Smoking);
            Assert.Equal(v.Eat,a.Eat);
            Assert.Equal(v.Animals,a.Animals);
        }

        [Fact]
        public void UpdateVehicle()
        {
            var browser = Browser();
            var login = Login();

            var v = new Vehicle
                        {
                            IdClient = 1,
                            Animals = false,
                            Eat = true,
                            BV = BV.BVM,
                            IdVehicle = 1,
                            Name = "206_IZY",
                            Smoking = false
                        };

            var response = browser.Patch("/vehicles", with =>
                                                            {
                                                                with.Cookie("authToken", login);
                                                                with.JsonBody(v);
                                                            }).Body.AsString();

            var json = JsonConvert.DeserializeAnonymousType(response, new
                                                                        {
                                                                            success = false,
                                                                            client = null as Vehicle
                                                                        });

            Assert.True(json.success);
            Assert.Equal(json.client.Name,"206_IZY");
            
        }
    }
}
