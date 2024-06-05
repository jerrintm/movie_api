const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); /* To import hashing(password) module into models.js file */

let movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: {
        name: String,
        subgenre: String
    },
    director: {
        Name: String,
        Bio: String,
        Birth: Date,
        Death: Date
    },
    //Actors: [String],
    //ImagePath: String,
    imageUrl: String,
    featured: Boolean
});

let userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthday: Date,
    favorite_movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/* below code ensures the password is hashed */
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
/* below code compares the submitted hashed passwords with the hashed passwords in the database */
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
