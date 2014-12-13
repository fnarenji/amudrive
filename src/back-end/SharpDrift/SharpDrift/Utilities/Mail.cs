using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;

namespace SharpDrift.Utilities
{
    class Mail
    {
        public const bool EnableMails = false;

        public async static Task Send(string toName, string toMail, string subject, string text)
        {
            if (EnableMails)
                using (var client = new SmtpClient())
                {
                    var message = new MimeMessage { Subject = subject, Body = new TextPart("plain") { Text = text } };
                    message.From.Add(new MailboxAddress("AMUDrive", "mail@amudrive.fr"));
                    message.To.Add(new MailboxAddress(toName, toMail));
                
                    await client.ConnectAsync("smtp.gmail.com", 587);
                    await client.AuthenticateAsync("amudrive.mail@gmail.com", "azeazeaze");
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
        }
    }
}
