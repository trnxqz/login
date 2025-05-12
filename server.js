
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


dotenv.config();


const app = express();
const port = 5000;


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.use(bodyParser.json());


const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
});


const User = mongoose.model('User', userSchema);




app.post('/register', async (req, res) => {
  const { name, surname, phone, email, password } = req.body;

  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  
  const user = new User({
    name,
    surname,
    phone,
    email,
    password: hashedPassword
  });
  await user.save();

  res.send('User registered');
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

 
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('User not found');
  }

 
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid password');
  }

  
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  
  res.json({ token });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
