using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Nancy;
using Nancy.Testing;
using Newtonsoft.Json;
using SharpDrift.DataModel;
using SharpDrift.Utilities;
using Xunit;

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

        [Theory]
        [InlineData("aze", "a48c25f7ec82996486b5a8387cc4e147c628c1f48ae8c868561474fbc5eaf4bec44af63f002681aa8dd32f0dfde1bac24b44d7d6014b73fd26025d94e8f58d3b")]
        public string Login(string username = "aze", string password = "a48c25f7ec82996486b5a8387cc4e147c628c1f48ae8c868561474fbc5eaf4bec44af63f002681aa8dd32f0dfde1bac24b44d7d6014b73fd26025d94e8f58d3b")
        {
            Browser browser = Browser();

            BrowserResponse response = browser.Post("/auth", with =>
            {
                with.FormValue("username", username);
                with.FormValue("password_sha512", password);
            });

            string t = response.Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(t, new
            {
                success = false,
                authToken = string.Empty
            });

            Assert.True(
                response.Cookies.Any(
                    c =>
                        c.Name == "authToken" &&
                        c.Expires.Value.Between(DateTime.UtcNow.AddDays(1.99), DateTime.UtcNow.AddDays(2.01))));

            Assert.True(json.success);
            Assert.NotNull(json.authToken);
            Assert.NotEmpty(json.authToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            return json.authToken;
        }

        [Fact]
        public void Logout()
        {
            Browser browser = Browser();

            BrowserResponse response = browser.Delete("/auth", with => with.Cookie("authToken", Login()));

            string t = response.Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(t, new
            {
                success = false,
                authToken = "OKLM_SHOULD_BE_EMPTY_LEL"
            });

            Assert.True(
                response.Cookies.Any(
                    c =>
                        c.Name == "authToken" &&
                        c.Expires.Value.Between(DateTime.UtcNow.AddDays(-2.01), DateTime.UtcNow.AddDays(-1.99))));

            Assert.True(json.success);
            Assert.NotNull(json.authToken);
            Assert.Empty(json.authToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public void FailedLogin()
        {
            Browser browser = Browser();

            BrowserResponse response = browser.Post("/auth", with =>
            {
                with.FormValue("username", "aze");
                with.FormValue("password_sha512",
                    "invalid_sha512_key_lol_87cc4e147c628c1f48ae8c868561474fbc5eaf4bec44af63f002681aa8dd32f0dfde1bac24b44d7d6014b73fd26025d94e8f58d3b");
            });

            string t = response.Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(t, new
            {
                success = true,
                authToken = "OKLM_SHOULD_BE_EMPTY_LEL"
            });

            Assert.True(
                response.Cookies.Any(
                    c =>
                        c.Name == "authToken" &&
                        c.Expires.Value.Between(DateTime.UtcNow.AddDays(-2.01), DateTime.UtcNow.AddDays(-1.99))));

            Assert.False(json.success);
            Assert.NotNull(json.authToken);
            Assert.Empty(json.authToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public void GetClient()
        {
            Browser browser = Browser();

            string response = browser.Get("/client", with => with.Cookie("authToken", Login())).Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                client = null as Client
            });

            Assert.True(json.success);

            var cRef = new Client
            {
                IdClient = 1,
                UserName = "aze",
                FirstName = "mdr",
                LastName = "ptdr",
                Address = "swag",
                Mail = "lel@oklm.kom",
                Password = string.Empty,
                RegistrationTime = DateTime.Parse("2014-11-09 17:54:28.847"),
                MessagingParameters = 2,
                CentersOfInterest = "lesgroessesqueues",
                PhoneNumber = "1337133749",
                MailNotifications = true,
                PhoneNotifications = true,
                Newsletter = true
            };

            Assert.Equal(cRef.IdClient, json.client.IdClient);
            Assert.Equal(cRef.UserName, json.client.UserName);
            Assert.Equal(cRef.FirstName, json.client.FirstName);
            Assert.Equal(cRef.LastName, json.client.LastName);
            Assert.Equal(cRef.Address, json.client.Address);
            Assert.Equal(cRef.Mail, json.client.Mail);
            Assert.Null(json.client.Password);
            Assert.Equal(cRef.RegistrationTime, json.client.RegistrationTime);
            Assert.Equal(cRef.MessagingParameters, json.client.MessagingParameters);
            Assert.Equal(cRef.CentersOfInterest, json.client.CentersOfInterest);
            Assert.Equal(cRef.PhoneNumber, json.client.PhoneNumber);
            Assert.Equal(cRef.MailNotifications, json.client.MailNotifications);
            Assert.Equal(cRef.PhoneNotifications, json.client.PhoneNotifications);
            Assert.Equal(cRef.Newsletter, json.client.Newsletter);
        }

        [Fact]
        public void UpdateClient()
        {
            Browser browser = Browser();
            string login = Login();

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

            string response = browser.Put("/client", with =>
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
            Browser browser = Browser();
            string login = Login();

            string response = browser.Get("/campuses", with => with.Cookie("authToken", login)).Body.AsString();
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
        public void CarPoolingsSearch()
        {
            Browser browser = Browser();
            string login = Login();

            string response = browser.Get("/carPoolings/search", with =>
            {
                with.Cookie("authToken", login);
                with.Body(JsonConvert.SerializeObject(new
                {
                    @long = 30.0,
                    lat = 30.0,
                    radius = 20.0,
                    idCampus = 1,
                    campusToAddress = true,
                    minMeetTime = new DateTime(2014, 12, 12, 7, 55, 0),
                    maxMeetTime = new DateTime(2014, 12, 12, 8, 05, 0)
                }));
            }).Body.AsString();

            var json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                carPoolings = null as IList<CarPooling>
            });

            Assert.True(json.success);
            Assert.NotNull(json.carPoolings);
            Assert.NotEmpty(json.carPoolings);
            Assert.True(json.carPoolings.Any(c => 1 == c.IdCarPooling && "Gare Saint Charles, Marseille" == c.Address));
        }

        [Fact]
        public void CarPoolingJoin()
        {
            Browser browser = Browser();
            string login = Login();

            var j = new CarPoolingJoin
            {
                IdCarPooling = 1,
                IdClient = 2,
                Accepted = false
            };

            string response = browser.Post("/carPoolings/join", with =>
            {
                with.Cookie("authToken", login);
                with.JsonBody(j);
            }).Body.AsString();

            var json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                carPoolingJoin = null as CarPoolingJoin
            });

            Assert.True(json.success);
            Assert.Equal(json.carPoolingJoin.IdCarPooling, 1);

            response = browser.Delete("/carPoolings/join", with =>
            {
                with.Cookie("authToken", login);
                with.JsonBody(j);
            }).Body.AsString();

            json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                carPoolingJoin = null as CarPoolingJoin
            });

            Assert.True(json.success);
            Assert.Equal(json.carPoolingJoin.IdCarPooling, 1);
        }

        [Fact]
        public void UpdateJoin()
        {
            Browser browser = Browser();
            string login = Login();

            var j = new CarPoolingJoin
            {
                IdCarPooling = 1,
                IdClient = 1,
                Accepted = true
            };

            string response = browser.Put("/carPooling/join", with =>
            {
                with.Cookie("authToken", login);
                with.JsonBody(j);
            }).Body.AsString();

            var json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                carPoolingJoin = null as CarPoolingJoin
            });

            Assert.True(json.success);
            Assert.True(json.carPoolingJoin.Accepted);

            j.Accepted = false;

            response = browser.Put("/carPooling/join", with =>
            {
                with.Cookie("authToken", login);
                with.JsonBody(j);
            }).Body.AsString();

            json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                carPoolingJoin = null as CarPoolingJoin
            });

            Assert.True(json.success);
            Assert.False(json.carPoolingJoin.Accepted);
        }

        [Fact]
        public void GetVehicles()
        {
            Browser browser = Browser();
            string login = Login();

            string response = browser.Get("/vehicles", with => with.Cookie("authToken", login)).Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                vehicles = null as IList<Vehicle>
            });

            Assert.True(json.success);
            Assert.NotNull(json.vehicles);
            Assert.True(json.vehicles.Count > 0);

            var v = new Vehicle
            {
                IdClient = 1,
                Animals = false,
                Eat = false,
                IdVehicle = 1,
                BV = BV.M,
                Name = "RENAULT CLIO V12 TWIN TURBO OKLM",
                Smoking = false
            };

            Vehicle a = json.vehicles.First();

            Assert.Equal(v.IdClient, a.IdClient);
            Assert.Equal(v.IdVehicle, a.IdVehicle);
            Assert.Equal(v.Name, a.Name);
            Assert.Equal(v.Smoking, a.Smoking);
            Assert.Equal(v.Eat, a.Eat);
            Assert.Equal(v.Animals, a.Animals);
        }

        [Fact]
        public void UpdateVehicle()
        {
            Browser browser = Browser();
            string login = Login();

            var v = new Vehicle
            {
                IdClient = 1,
                BV = BV.M,
                IdVehicle = 1,
                Name = "RENAULT CLIO V1 TWIN EN PANNE LEL",
                Smoking = false,
                Animals = false,
                Eat = false
            };

            string response = browser.Put("/vehicles", with =>
            {
                with.Cookie("authToken", login);
                with.JsonBody(v);
            }).Body.AsString();

            var json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                vehicle = null as Vehicle
            });

            Assert.True(json.success);
            Assert.Equal(json.vehicle.Name, "RENAULT CLIO V1 TWIN EN PANNE LEL");

            v.Name = "RENAULT CLIO V12 TWIN TURBO OKLM";

            response = browser.Put("/vehicles", with =>
            {
                with.Cookie("authToken", login);
                with.JsonBody(v);
            }).Body.AsString();

            json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                vehicle = null as Vehicle
            });

            Assert.True(json.success);
            Assert.Equal(json.vehicle.Name, "RENAULT CLIO V12 TWIN TURBO OKLM");
        }

        [Fact]
        public void Register()
        {
            Browser browser = Browser();

            string username = Path.GetRandomFileName(),
                password = string.Join("",
                    new SHA512CryptoServiceProvider().ComputeHash(Encoding.UTF8.GetBytes(username))
                        .Select(b => b.ToString("x2")));

            var client = new Client
            {
                UserName = username,
                FirstName = "RANDOM",
                LastName = "MODNAR",
                Address = "HERE AND THERE",
                Mail = username + "@AZEMAIL.MAIL",
                Password = password,
                RegistrationTime = DateTime.UtcNow,
                MessagingParameters = 1,
                CentersOfInterest = "EtudC",
                PhoneNumber = "0606060606",
                MailNotifications = true,
                PhoneNotifications = false,
                Newsletter = true
            };

            var response = browser.Post("/register", with => with.JsonBody(client)).Body.AsString();
            var json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                client = null as Client
            });

            Assert.True(json.success);
            Assert.Equal(username, json.client.UserName);

            
        }

        [Fact]
        public void Comment()
        {
            Browser browser = Browser();
            string login = Login();

             var a = new CarPoolingJoin
            {
                IdCarPooling = 1,
                IdClient = 2,
                Accepted = false
            };

            string res = browser.Post("/carPoolings/join", with =>
            {
                with.Cookie("authToken", login);
                with.JsonBody(a);
            }).Body.AsString();


            var j = new Comment
                            {
                                IdCarPooling = 1,
                                IdClient = 1,
                                IdComment = 1,
                                Message = "Op ce carpool",
                                PoolingMark = 4,
                                DriverMark = 4
                            };

            string response = browser.Post("/carPooling/comment", with =>
            {
                with.Cookie("authToken", login);
                with.JsonBody(j);
            }).Body.AsString();

            var json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                Comment = null as Comment
            });

            Assert.True(json.success);
            Assert.Equal(json.Comment.IdComment,1);
            Assert.Equal(json.Comment.Message,j.Message);

            response = browser.Delete("/carPooling/comment", with =>
            {
                with.Cookie("authToken", login);
                with.JsonBody(j);
            }).Body.AsString();

            json = JsonConvert.DeserializeAnonymousType(response, new
            {
                success = false,
                Comment = null as Comment
            });

            Assert.True(json.success);

            res = browser.Delete("/carPoolings/join", with =>
            {
                with.Cookie("authToken", login);
                with.JsonBody(a);
            }).Body.AsString();

        }
    }
}