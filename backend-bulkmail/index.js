const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose')

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://Madhavan:1234@cluster0.pzv3i.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  console.log('Conected to DB')
})
  .catch(() => {
    console.log('Failed to connect')
  })
const credential = mongoose.model("credential", {}, "bulkmail")


app.post('/sendmail', (req, res) => {
  const message = req.body.msg;
  const emailList = req.body.emailList;


  credential.find().then((data) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    new Promise(async (resolve, reject) => {
      try {
        for (let i = 0; i < emailList.length; i++) {
          await transporter.sendMail({
            from: 'maddygr08032001@gmail.com',
            to: emailList[i],
            subject: 'Bulkmail Task',
            text: message,
          });
          console.log(`Email sent to ${emailList[i]}`);
        }
        resolve('Success');
      } catch (error) {
        console.error('Failed to send email');
        reject('Failed');
      }
    })
      .then(() => {
        res.send(true); // Email sending successful
      })
      .catch(() => {
        res.send(false); // Email sending failed
      });

  })
    .catch((error) => {
      console.log(error)
    })

});


app.listen(5000, () => {
  console.log('Server started on port 5000...');
});