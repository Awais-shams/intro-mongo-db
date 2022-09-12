const mongoose = require("mongoose");
const express = require("express");
const data = require("./MOCK_DATA.json");
const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost/test")
  .then(() => console.log("Mongodb connection successful"))
  .catch(() => console.log("Mongodb connection failed"));

const personSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
  },
  { versionKey: false }
);

const Person = mongoose.model("person", personSchema);

const universitySchema = new mongoose.Schema(
  {
    country: String,
    city: String,
    name: String,
    location: {
      coordinates: [Number],
    },
    students: [
      {
        year: Number,
        number: Number,
      },
    ],
  },
  { versionKey: false }
);

const University = mongoose.model("university", universitySchema);

const coursesSchema = new mongoose.Schema(
  {
    university: String,
    name: String,
    level: String,
  },
  { versionKey: false }
);

const Courses = mongoose.model("courses", coursesSchema);

app.post("/api/persons", async (req, res) => {
  const personData = await Person.insertMany(data);
  res.send(personData);
});

app.post("/api/university", async (req, res) => {
  const uni = await University.insertMany([
    {
      country: "Spain",
      city: "Salamanca",
      name: "USAL",
      location: {
        coordinates: [-5.6722512, 17, 40.9607792],
      },
      students: [
        { year: 2014, number: 24774 },
        { year: 2015, number: 23166 },
        { year: 2016, number: 21913 },
        { year: 2017, number: 21715 },
      ],
    },
    {
      country: "Spain",
      city: "Salamanca",
      name: "UPSA",
      location: {
        coordinates: [-5.6691191, 17, 40.9631732],
      },
      students: [
        { year: 2014, number: 4788 },
        { year: 2015, number: 4821 },
        { year: 2016, number: 6550 },
        { year: 2017, number: 6125 },
      ],
    },
  ]);
  res.send(uni);
});

app.post("/api/courses", async (req, res) => {
  const courses = await Courses.insertMany([
    {
      university: "USAL",
      name: "Computer Science",
      level: "Excellent",
    },
    {
      university: "USAL",
      name: "Electronics",
      level: "Intermediate",
    },
    {
      university: "USAL",
      name: "Communication",
      level: "Excellent",
    },
  ]);
  res.send(courses);
});

app.get("/api/aggregations", async (req, res) => {
  const computedData = await Courses.aggregate([
    {
      $lookup: {
        from: "Courses",
        localField: "university",
        foreignField: "university",
        as: "course",
      },
    },
  ]);
  res.send(computedData);
});

app.listen(3000, () => console.log("Listening on port 3000.."));
