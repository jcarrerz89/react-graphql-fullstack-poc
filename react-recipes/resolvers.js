const Recipe = require("./models/Recipe");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const createToken = (user, secret, expiresIn) => {
      const {username, email} = user;
      return jwt.sign({ username, email}, secret, { expiresIn})
}

exports.resolvers = {
      Query: {
            getAllRecipes: async () => { 
                  const recipes = await Recipe.find(); 
                  return recipes;
            }
      },
      Mutation: { 
            addRecipe: async (root, {name, description,category, instructions, username}, { Recipe }) => { 
                  const newRecipe = await new Recipe({
                        name, 
                        description, category, 
                        instructions,
                        username
                  }).save();
                  return newRecipe;
            },

            signupUser: async (root, { username, email, password}, {User}) => {
                  const user = await User.findOne({username});

                  if (user) { 
                        throw new Error('Useralready exists');
                  }

                  const newUser = await new User({
                        username, email, password
                  }).save();
                  return { token: createToken(newUser, process.env.SECRET, '1hr')}; 
            },

            signinUser: async (root, {username, password}, {User}) => { 
                  const user = await User.findOne({username});

                  if (!user) { 
                        throw new Error('User not found');
                  } 
                  
                  const isValidPassword = await bcrypt.compareSync(password, user.password);

                  if (!isValidPassword) { 
                        throw new Error('Invalid password');
                  }

                  return { token: createToken(user, process.env.SECRET, "1hr")};
            }
      }
}; 