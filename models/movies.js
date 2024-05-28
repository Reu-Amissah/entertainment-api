const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const movieSchema = new Schema({
  _id: Number,
  title: String,
  thumbnail: {
    trending: {
      small: String,
      large: String,
    },
    regular: {
      small: String,
      medium: String,
      large: String,
    },
  },
  year: number,
  category: String,
  rating: String,
  isBookmarked: Boolean,
  isTrending: Boolean,
});
