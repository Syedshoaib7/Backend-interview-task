require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();
app.use(bodyParser.json());

// connecting the MongoDB
mongoose.connect(process.env.MONGO_URI, {

}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

  app.use('/',(req, res) => {
    res.status(200).send({ 
        "name":"syed",
        "email":"shoaibofficial93@gmail.com",
        "password":"qwerty",
    });
  })


app.use('/api', authRoutes);
app.use('/api', profileRoutes);

//running the server in the localhost 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
