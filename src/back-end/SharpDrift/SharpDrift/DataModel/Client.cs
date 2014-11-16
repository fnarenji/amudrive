using System;

namespace SharpDrift.DataModel
{
    public class Client
    {
        public int IdClient { get; set; }
        public String UserName { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Address { get; set; }
        public String Mail { get; set; }
        public String Password { get; set; }
        public DateTime RegistrationTime { get; set; }
        public int MessagingParameters { get; set; }
        public String CentersOfInterest { get; set; }
        public String PhoneNumber { get; set; }
        public bool MailNotifications { get; set; }
        public bool PhoneNotifications { get; set; }
        public bool Newsletter { get; set; }

        public bool ShouldSerializePassword()
        {
            return false;
        }
    }
    
}
