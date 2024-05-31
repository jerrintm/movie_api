const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// The below 2 lines are used to define where the Database needs to connect. The dburl will either connect to the localhost on the local machine OR if there is a cloud hosted DN server like Mongo on Atlas, it would use that.
const dburl = process.env.DATABASE_URL || 'mongodb://localhost:27017/cfdb'
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });



const express = require('express');
bodyParser = require('body-parser');
uuid = require('uuid');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors'); /* To include CORS within the application */
app.use(cors());              /* This code will allow requests from all origins(CORS) */
let auth = require('./auth')(app);  /* To import auth.js file into this project. The app argument you're passing here, ensures that Express is available in your “auth.js” file as well. */

const passport = require('passport');  /* This and below line is to import the passport.js file into this project */
require('./passport');

const { check, validationResult } = require('express-validator');  /* Library imported for validating user input  */
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
//const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });



/*let movies = [
    {
        title: 'The Godfather',
        Director: 'Francis Ford Coppola',
        genre: 'Crime'
    },
    {
        title: 'Avatar',
        Director: 'James Cameron',
        genre: 'Action'
    },
    {
        title: 'Jurassic World',
        Director: 'Colin Trevorrow',
        genre: 'Action'
    },
    {
        title: 'The Dark Knight',
        Director: 'Christopher Nolan',
        genre: 'Action'
    },
    {
        title: 'Forest Gump',
        Director: 'Robert Zemeckis',
        genre: 'comedy'
    },
    {
        title: 'Titanic',
        Director: 'James Cameron',
        genre: 'romance'
    },
    {
        title: 'The Shawshank Redemption',
        Director: 'Frank Darabont',
        genre: 'Thriller'
    },
    {
        title: 'Inception',
        Director: 'Christopher Nolan',
        genre: 'Action'
    },
    {
        title: 'The Lion King',
        Director: 'Rob Minkoff',
        genre: 'musical'
    },
    {
        title: 'Black Panther',
        Director: 'Ryan Coogler',
        action: 'action'
    }
];

let directors = [
    {
        name: 'Francis Ford Coppola',
        DOB: '02/10/1970',
        DOD: 'NA'
    },
    {
        name: 'James Cameron',
        DOB: '02/10/1970',
        DOD: 'NA'
    },
    {
        name: 'Colin Trevorrow',
        DOB: '02/10/1970',
        DOD: 'NA'
    },
    {
        name: 'Christopher Nolan',
        DOB: '02/10/1970',
        DOD: 'NA'
    },
    {
        name: 'Robert Zemeckis',
        DOB: '02/10/1970',
        DOD: 'NA'
    }
];

let users = [
    {
        name: 'John Doe',
        userid: 'jdoe',
        password: 'xyz',
        email: 'jdoe@gmail.com',
        DOB: '02/10/1970',
        FavoriteMovies: []
    },
    {
        name: 'Mat Dav',
        userid: 'mdav',
        password: 'xyz1',
        email: 'mdav@gmail.com',
        DOB: '02/10/1970',
        FavoriteMovies: []
    },
    {
        name: 'Colin Neal',
        userid: 'cneal',
        password: 'xyz2',
        email: 'cneal@gmail.com',
        DOB: '02/10/1970',
        FavoriteMovies: []
    }
];

*/

// setup the logger
//app.use(morgan('combined', { stream: accessLogStream }));

//Below function automatically routes all requests for static files to their corresponding files within a certain folder on the server (in this case, the “public” folder).
//express.static is used to access static page, here the documentation page from the public folder
//app.use('/documentation', express.static(public));


//////get list of all movies  -----
//app.get('/movies', (req, res) => {
//    //  console.log("Movie List");
//    res.json(movies);
//});

/* app.get('/movies', async (req, res) => { */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});



//////get list of all directors
//app.get('/directors', (req, res) => {
//    res.json(directors);
//});


//////get list of all users
//app.get('/users', (req, res) => {
//    res.json(users);
//});

/*   app.get('/users', async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
*/

app.get('/users', async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting users: ' + error);
    }
});

//get all details of a specific movie title ------
//app.get('/movies/:title', (req, res) => {
//    res.json(movies.find((movie) => { return movie.title === req.params.title }));
//});
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    /* below line searches the movies table for a match on 'title' with the value from 'req.params.title'.Here 'req.params.title' contains the value in ':title'  */
    await Movies.findOne({ title: req.params.title })
        /* below 'movie' is a variable that stores the results from the above line of code, which is a movie record found to match the value in req.params.title. Also 'then' would execute once the code above it completes execution */
        .then((movie) => {
            /* below line of code returns the value contained in 'movie' variable */
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//get details about a genre --------
app.get('/genre/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log(req.params);  /* Code can be used to display contents passed from the API call using tools like postman */
    await Movies.findOne({ 'genre.name': req.params.name })
        .then((movie) => {
            res.json(movie.genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});



//get all details of a specific director --------
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log(req.params);
    await Movies.findOne({ 'director.Name': req.params.name })
        .then((movie) => {
            res.json(movie.director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

////// Adds data for a new movie to our list of movies.
//app.post('/movies', (req, res) => {
//    let newmovie = req.body;

//    if (!newmovie.title) {
//        const message = 'Missing name in request body';
//        res.status(400).send(message);
//    } else {
//        newmovie.id = uuid.v4();
//        movies.push(newmovie);
//        res.status(201).send(newmovie);
//    }
//});
app.post('/movies', async (req, res) => {
    let newmovie = req.body;

    if (!newmovie.title) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else {
        newmovie.id = uuid.v4();
        movies.push(newmovie);
        res.status(201).send(newmovie);
    }
});


////// Adds data for a new user to our list of users. ------------
//app.post('/users', (req, res) => {
//    let newuser = req.body;

//    if (!newuser.name) {
//        const message = 'Missing name in request body';
//        res.status(400).send(message);
//    } else {
//        newuser.id = uuid.v4();
//        users.push(newuser);
//        res.status(201).send(newuser);
//    }
//});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users',
    // Validation logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means
    //minimum value of 5 characters are only allowed
    [
        check('username', 'Username is required').isLength({ min: 5 }),
        check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {
        console.log(req.params)
        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let hashedPassword = Users.hashPassword(req.body.password);
        await Users.findOne({ username: req.body.username })
            .then((user) => {
                if (user) {
                    //If the user is found, send a response that it already exists
                    return res.status(400).send(req.body.username + ' already exists');  // Search to see if a user with the requested username already exists
                } else {
                    Users
                        .create({
                            username: req.body.username,
                            /*      password: req.body.password,   */
                            password: hashedPassword,
                            email: req.body.email,
                            birthday: req.body.birthday
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        })
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });


// Get a user by username
app.get('/users/:username', async (req, res) => {
    await Users.findOne({ username: req.params.username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});



////// Update the "username, password,email OR birthday" of a user  -------------------
//app.put('/users/:userid', (req, res) => {
//    let user = users.find((user) => { return user.userid === req.params.userid });

//    if (user) {
//        user.name = req.body.name;
//        res.status(201).send('Name of userid ' + user.userid + ' has been updated to ' + user.name);
//    } else {
//        res.status(404).send('User with the userid ' + req.params.userid + ' was not found.');
//    }
//});
app.put('/users/:username',
    // Validation logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means
    //minimum value of 5 characters are only allowed
    [
        check('username', 'Username is required').isLength({ min: 5 }),
        check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email does not appear to be valid').isEmail()
    ],
    passport.authenticate('jwt', { session: false }), async (req, res) => {

        console.log(req.params);
        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let hashedPassword = Users.hashPassword(req.body.password);

        await Users.findOneAndUpdate({ username: req.params.username }, {
            $set:
            {
                username: req.body.username,
                /* password: req.body.password,  */
                password: hashedPassword,
                email: req.body.email,
                birthday: req.body.birthday
            }
            /* Above code finds the user and updates it with the values passed from API */
        },
            { new: true }) // This line makes sure that the updated document is returned

            .then((updatedUser) => {
                console.log(updatedUser);
                res.json(updatedUser);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })

    });



////// User adds a movie to their favorite list  ----------------

//app.put('/users/:name/:FavoriteMovieTitle', (req, res) => {
//    let user = users.find((user) => { return user.userid === req.params.name });
//    const movie = movies.find((movie) => { return movie.title === req.params.FavoriteMovieTitle });


//    if (user && movie) {
//        user.FavoriteMovies.push(movie);

//        res.status(201).send('user ' + req.params.name + ' has added movie to favorite list');
//    } else {
//        res.status(404).send('Movie couldnt be added to the favorite list');
//    }
//});
app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ username: req.params.username }, {
        $push: { favorite_movies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//User removes a movie from favorie list   -----------------
app.delete('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    /* The findOne function ensures to return only the object details in the array. If simply 'find' was used, it would return the object in an array, and then the below code to access the object attributes wouldn't have been possible */
    /* Also we need to add 'await' below, so that this line of code is executed before moving forward(asynchronous function) */
    let user = await Users.findOne({ username: req.params.username })

    if (user) {
        user.favorite_movies = user.favorite_movies.filter((movie) => { return movie.title !== req.params.MovieID });
        res.status(201).send('user ' + req.params.username + ' has removed a movie from favorite list');
    } else {
        res.status(404).send('Movie couldnt be removed from the favorite list');
    }
});

////// Deletes a user from our list by ID   -------------
//app.delete('/users/:userid', (req, res) => {
//    let user = users.find((user) => { return user.id === req.params.id });

//    if (user) {
//        users = users.filter((obj) => { return obj.id !== req.params.id });
//        res.status(201).send('User ' + req.params.userid + ' was deleted.');
//    }
//});
// Delete a user by username
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {

    await Users.findOneAndDelete({ username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found');
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


app.get('/', (req, res) => {
    res.send('Welcome to Movie Flix homepage')
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});


/* app.listen(8080, () => {
    console.log('The movie app has loaded and is listening on port 8080');
}); */
/* Above code with app.listen would only listen on port 8080 for localhost. With the below code, if nothing is found, it sets the port to a certain port number, which is needed when hosting code in the cloud */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});

