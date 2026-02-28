import mongoose from "mongoose";

const CATEGORY_ENUM = [
  "Design",
  "Sales",
  "Marketing",
  "Finance",
  "Technology",
  "Engineering",
  "Business",
  "Human Resource",
];

const jobSchema = new mongoose.Schema(
  {
    jobName: {
      type: String,
      required: [true, "Please add a job name"],
    },
    category: {
      type: [String],
      required: [true, "Please select at least one category"],
      validate: {
        validator: (v) => v.length > 0 && v.every((c) => CATEGORY_ENUM.includes(c)),
        message: "Please provide valid categories",
      },
    },
    time: {
      type: String,
      required: [true, "Please select a job type"],
      enum: ["Full-Time", "Part-Time", "Intern", "Remote"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    companyName: {
      type: String,
      required: [true, "Please add a company name"],
    },
    logo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
