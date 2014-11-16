using System;

namespace SharpDrift.DataModel
{
    public class Client
    {
        public int IdClient { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Mail { get; set; }
        public string Password { get; set; }
        public DateTime RegistrationTime { get; set; }
        public int MessagingParameters { get; set; }
        public string CentersOfInterest { get; set; }
        public string PhoneNumber { get; set; }
        public bool MailNotifications { get; set; }
        public bool PhoneNotifications { get; set; }
        public bool Newsletter { get; set; }

        public bool ShouldSerializePassword()
        {
            return false;
        }
    }
}