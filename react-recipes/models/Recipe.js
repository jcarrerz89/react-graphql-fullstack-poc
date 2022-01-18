const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const bcrypt = require('bcrypt-nodejs');

const RecipeSchema = new Schema({
      name: {
            type: String,
            required: true
      },
      category: {
            type: String,
            required: true
      },
      description:{
            
      },
      instructions: {
            type: String,
            required: true
      },
      createdDate: {
            type: Date,
            default: Date.now
      },
      likes: {
            type: Number, 
            default: 0
      },
      // username: {
         
      // }
});

module.exports = mongoose.model('Recipe', RecipeSchema);