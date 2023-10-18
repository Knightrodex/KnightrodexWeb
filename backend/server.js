const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// const loginRouter = require('./API/Login');

const path = require('path');
const PORT = process.env.PORT || 5000;  

const app = express();
app.use(cors());
app.use(bodyParser.json());


require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

let api = require('./api.js');
api.setApp(app, client);

app.set('port', (process.env.PORT || 5000));
// Use the login API
// app.use('/api', loginRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ` + PORT);
});

// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => 
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}
