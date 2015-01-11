using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using Insight.Database;
using Nancy;
using Nancy.Extensions;
using Nancy.ModelBinding;
using Npgsql;
using SharpDrift.DataModel;
using SharpDrift.Utilities;
using SharpDrift.Utilities.Data;
using SharpDrift.Utilities.Security;

namespace SharpDrift.Modules
{
    public class CarPoolingModule : NancyModule
    {
        public CarPoolingModule()
        {
            this.RequiresAuthentication();

            Get["/carPoolings", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    return new
                    {
                        success = true,
                        joinedCarPoolings = await conn.QuerySqlAsync<CarPooling>(
                            "SELECT * FROM carPooling WHERE idCarPooling IN (SELECT idCarPooling FROM carPoolingJoin  WHERE idClient = @IdClient AND accept = TRUE)",
                            new { IdClient = int.Parse(Context.CurrentUser.UserName) }),
                        waitingCarPoolings = await conn.QuerySqlAsync<CarPooling>(
                            "SELECT * FROM carPooling WHERE idCarPooling IN (SELECT idCarPooling FROM carPoolingJoin  WHERE idClient = @IdClient AND accept = FALSE)",
                            new { IdClient = int.Parse(Context.CurrentUser.UserName) }),
                        offeredCarPoolings =
                            await conn.QuerySqlAsync<CarPooling>("SELECT * FROM carPooling WHERE idClient = @IdClient",
                                new { IdClient = int.Parse(Context.CurrentUser.UserName) }),
                        joinCarPoolings =
                             await conn.QuerySqlAsync<CarPoolingJoin>("SELECT * FROM carPoolingJoin as C WHERE C.idCarPooling IN (SELECT idCarPooling FROM carPooling  WHERE idClient = @IdClient)",
                                    new { IdClient = int.Parse(Context.CurrentUser.UserName) }),
                        pendingPCarPoolings =
                            await conn.QuerySqlAsync<Client>("SELECT C.IdClient,C.userName FROM client as C WHERE C.idClient IN (SELECT idClient FROM carPoolingjoin  WHERE idcarpooling IN ( SELECT idCarPooling FROM carPooling WHERE  idClient = @IdClient ) AND accept = FALSE)",
                                new { IdClient = int.Parse(Context.CurrentUser.UserName) }),

                        validPCarPoolings =
                         await conn.QuerySqlAsync<Client>("SELECT C.IdClient,C.userName FROM client as C WHERE C.idClient IN (SELECT idClient FROM carPoolingjoin  WHERE idcarpooling IN ( SELECT idCarPooling FROM carPooling WHERE  idClient = @IdClient ) AND accept = TRUE)",
                                new { IdClient = int.Parse(Context.CurrentUser.UserName) })


                    }.ToJson();
                }
            };

            Post["/carPoolings", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var carPooling = this.Bind<CarPooling>();
                    carPooling.IdClient = Int32.Parse(Context.CurrentUser.UserName);

                    await conn.ExecuteSqlAsync("INSERT INTO carPooling VALUES (DEFAULT, @Address, @Long, @Lat, @IdCampus, @IdClient, @IdVehicle, @CampusToAddress, @Room, @Luggage, @Talks, @Radio, @MeetTime, @Price)", carPooling);

                    return new
                    {
                        success = true,
                        carPooling = carPooling
                    }.ToJson();
                }
            };

            Put["/carPoolings", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var carPooling = this.Bind<CarPooling>();
                    carPooling.IdClient = Int32.Parse(Context.CurrentUser.UserName);

                    await conn.ExecuteSqlAsync("UPDATE carPooling SET room = @Room , Luggage = @Luggage WHERE idCarPooling = @idCarPooling", carPooling);

                    return new
                    {
                        success = true,
                        carPooling = carPooling
                    }.ToJson();
                }
            };

            Delete["/carPoolings", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var carPooling = this.Bind<CarPooling>();
                    carPooling.IdClient = Int32.Parse(Context.CurrentUser.UserName);

                    await conn.ExecuteSqlAsync("DELETE FROM carPooling WHERE idCarPooling = @IdCarPooling AND idClient = @IdClient", carPooling);

                    return new
                    {
                        success = true,
                        carPooling = carPooling
                    }.ToJson();
                }
            };


            Post["/carPoolings/search", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var data = this.BindAnonymous(new
                    {
                        @long = .0,
                        lat = .0,
                        radius = .0,
                        idCampus = 0,
                        campusToAddress = false,
                        minMeetTime = new DateTime(),
                        maxMeetTime = new DateTime()
                    });

                    return new
                    {
                        success = true,
                        carPoolings = await conn.QuerySqlAsync(string.Join(" ",
                            "SELECT carPooling.*, bv, animals, smoking, eat",
                            "FROM carPooling",
                            "JOIN vehicle ON carPooling.idVehicle = vehicle.idVehicle AND carPooling.idClient = vehicle.idClient",
                            "WHERE pow(@long - long, 2) + pow(@lat - lat, 2) < pow(" + data.radius + ", 2)",
                            "AND idCampus = @idCampus",
                            "AND campusToAddress = @campusToAddress",
                            "AND meetTime BETWEEN @minMeetTime AND @maxMeetTime"), data)
                    }.ToJson();
                }
            };

            Post["/carPoolings/join", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var c = this.Bind<CarPoolingJoin>();
                    c.IdClient = Int32.Parse(Context.CurrentUser.UserName);
                    
                    var reasons = new List<string>();
                    
                    try
                    {
                        await
                            conn.ExecuteSqlAsync(
                                "INSERT INTO carPoolingJoin VALUES (@IdCarPooling, @IdClient, @Accepted)", c);
                    }
                    catch (AggregateException aggregate)
                    {
                        reasons.Add(aggregate.InnerException.InnerException.ToString().Contains("carpoolingjoin_pkey")
                            ? "Vous avez déjà rejoint ce covoiturage."
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
                    
                    return new
                    {
                        success = true,
                        carPoolingJoin = c
                    }.ToJson();
                }
            };

            Delete["/carPoolings/join", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var j = this.Bind<CarPoolingJoin>();
                    j.IdClient = Int32.Parse(Context.CurrentUser.UserName);

                    await
                        conn.ExecuteSqlAsync(
                            "DELETE FROM carPoolingJoin WHERE idCarPooling = @IdCarPooling AND idClient = @IdClient", j);

                    return new
                    {
                        success = true,
                        carPoolingJoin = j
                    }.ToJson();
                }
            };

            Put["/carPooling/join", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    FastExpando j = this.Bind<CarPoolingJoin>().Expand();
                    j.Expand(new { OwnerId = Int32.Parse(Context.CurrentUser.UserName) });

                    await
                        conn.ExecuteSqlAsync(string.Join(" ",
                            "UPDATE carPoolingJoin",
                            "SET accept = @Accepted",
                            "WHERE idCarPooling = @IdCarPooling",
                            "AND idClient = @IdClient",
                            "AND idCarPooling IN (SELECT IdCarPooling FROM carPooling WHERE idClient = @OwnerId)"), j);

                    return new
                    {
                        success = true,
                        carPoolingJoin = j
                    }.ToJson();
                }
            };

            Post["/carPooling/comment", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    FastExpando j = this.Bind<Comment_>().Expand();
                    j.Expand(new { OwnerId = Int32.Parse(Context.CurrentUser.UserName) });

                    await
                        conn.ExecuteSqlAsync("INSERT INTO comment (idClient,idCarPooling,comment,drivermark,poolingmark) VALUES (@OwnerId,@IdCarPooling,@Comment,@DriverMark,@PoolingMark)", j);

                    return new
                    {
                        success = true,
                        Comment = j
                    }.ToJson();
                }
            };

            Delete["/carPooling/comment", true] = async (x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    FastExpando j = this.Bind<Comment_>().Expand();
                    j.Expand(new { OwnerId = Int32.Parse(Context.CurrentUser.UserName) });

                    await
                        conn.ExecuteSqlAsync(
                            string.Join(" ", "DELETE FROM comment WHERE idMessage = @IdComment"),
                            j);

                    return new
                    {
                        success = true,
                        Comment = j
                    }.ToJson();
                }
            };

            Get["/carPooling/comment", true] = async(x, ctx) =>
            {
                using (DbConnection conn = DAL.Conn)
                {
                    var user = new {IdClient = int.Parse(Context.CurrentUser.UserName)};
                    return new
                    {
                        success = true,
                        commentsByMe = await conn.QuerySqlAsync<Comment_>(
                            "SELECT * FROM comment WHERE idClient = @IdClient", user),

                        commentsForMe = await conn.QuerySqlAsync<Comment_>(
                            "SELECT * FROM comment WHERE idcarpooling IN (SELECT idcarpooling FROM carpooling WHERE idclient = @IdClient)", user),

                        idAssoc = await conn.QuerySqlAsync<Client>(
                        "SELECT idclient, username FROM client where idclient IN (SELECT idclient FROM comment WHERE idcarpooling IN (SELECT idcarpooling FROM carpooling" +
                        " WHERE idclient = @IdClient))", user)
                    }.ToJson();
                }
            };
        }
    }
}
