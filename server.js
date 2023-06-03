const express = require("express");
const bcrypt = require('bcrypt');


const app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
const axios = require("axios");
app.use(cors());
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);
mongoose.connect("mongodb://127.0.0.1:27017/db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });


app.use(bodyParser.json());
 app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});



app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          return res.status(401).json({ message: 'Authentication failed' });
        }

        res.status(200).json({ message: 'Authentication successful' });
      });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Something went wrong' });
    });
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year :{type:String}
});
console.log(bookSchema)
const Book = mongoose.model("Book", bookSchema);


app.get("/books", (req, res) => {
  Book.find({})
    .then((books) => {
      res.json(books);
      
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

app.post("/books", (req, res) => {
  const book = req.body;
  const newBook = new Book(book);

  newBook
    .save()
    .then((savedBook) => {
      res.json(savedBook);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});



app.put("/books/:id", (req, res) => {
  const id = req.params.id;
 const updatedBook= req.body;
  Book.findByIdAndUpdate(id,updatedBook,{new:true})
  
    .then((updatedBook) => {
      console.log(updatedBook)
      res.json(updatedBook);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

app.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  
  Book.findByIdAndDelete(id)
    .then((deletedBook) => {
      
      res.json(deletedBook);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

app.listen(5000, () => { console.log("Server started on port 5000") })
