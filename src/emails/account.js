const sgMail = require('@sendgrid/mail')

sgMail.setApiKey

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'abhirupmandal860@gmail.com',
        subject:'hello bro',
        text:'dfkerjejfi fgiefj ierieo'
    })
}

const sendCancelationEmail = (email,name)=>{
  sgMail.send({
      to:email,
      form:'abhirupmandal860@gmail.com',
      subjet:'Goodbye',
      text:'ay yooo what up!!!'
  })
}
module.exports={sendWelcomeEmail,sendCancellationEmail}