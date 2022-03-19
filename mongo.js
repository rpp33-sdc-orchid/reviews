const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

let reviewSchema = mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  product_id: Number,
  rating: Number,
  summary: String,
  recommended: Boolean,
  body: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
  email: String,
  response: String,
  recommended: ,
  reported: Boolean,
  photos: {
    id: {
      type: Number,
      unique: true
    },
    review_id: Number,
    url: String
  },
  characteristics: {
    id: {
      type: Number,
      unique: true
    },
    review_id: Number,
    characteristic: String,
    values: String
  }
});

let metadataSchema = mongoose.Schema({ // be within reviewSchema or?
  id: {
    type: Number,
    unique: true,
  },
  product_id: Number,
  rating: Number,
  recommended: Boolean
});

let Review = mongoose.model('Review', reviewSchema);
let Metadata = mongoose.model('Metadata', metadataSchema);

// algo code for data sort or ETL

// module.exports.whatever = whatever;