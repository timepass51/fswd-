const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/lmsDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Course name is required"],
        minlength: [3, "Minimum 3 characters required"]
    },
    instructor: {
        type: String,
        required: [true, "Instructor name is required"]
    }
});

const Course = mongoose.model("Course", courseSchema);


app.get("/courses", async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

app.post("/courses", async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.json({ message: "Course added" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/courses/:id", async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } 
        );

        if (!updatedCourse) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.json({ message: "Course updated successfully" });

    } catch (err) {
        console.log(err); 
        res.status(400).json({ error: err.message });
    }
});

app.delete("/courses/:id", async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
