// Importăm modulele necesare
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Configurăm variabilele de mediu
dotenv.config();

// Inițializăm aplicația Express
const app = express();
const port = 5000;

// Conectare la MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware pentru a citi datele din body
app.use(bodyParser.json());

// Schema pentru utilizator
const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
});

// Modelul pentru utilizator
const User = mongoose.model('User', userSchema);

// Rutele pentru autentificare și înregistrare

// Înregistrare utilizator
app.post('/register', async (req, res) => {
  const { name, surname, phone, email, password } = req.body;

  // Verificăm dacă utilizatorul există deja
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  // Criptăm parola
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Creăm utilizatorul
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

// Logare utilizator
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Căutăm utilizatorul în baza de date
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('User not found');
  }

  // Comparăm parola
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid password');
  }

  // Creăm un token JWT
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  // Răspundem cu tokenul
  res.json({ token });
});

// Pornim serverul
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
