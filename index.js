const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User; mongoose.connect('mongodb://localhost:27017/cfdb', { useNewUrlParser: true, useUnifiedTopology: true });



const express = require('express');
bodyParser = require('body-parser');
uuid = require('uuid');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




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


//////get list of all movies
//app.get('/movies', (req, res) => {
//    //  console.log("Movie List");
//    res.json(movies);
//});

app.get('/movies', async (req, res) => {
    await Mpvies.find()
        .then((users) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});



//get list of all directors
app.get('/directors', (req, res) => {
    res.json(directors);
});

//////get list of all users
//app.get('/users', (req, res) => {
//    res.json(users);
//});

app.get('/users', async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//get all details of a specific movie title
//app.get('/movies/:title', (req, res) => {
//    res.json(movies.find((movie) => { return movie.title === req.params.title }));
//});
app.get('/movies/:title', async (req, res) => {
    await Users.findOne({ Username: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//get all details of a specific director
app.get('/directors/:name', (req, res) => {
    res.json(directors.find((director) => { return director.name === req.params.name }));
});

// Adds data for a new movie to our list of movies.
app.post('/movies', (req, res) => {
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


////// Adds data for a new user to our list of users.
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
app.post('/users', async (req, res) => {
    await users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users
                    .create({
                        username: req.body.Username,
                        password: req.body.Password,
                        email: req.body.Email,
                        birthday: req.body.Birthday
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
app.get('/users/:Username', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});



// Update the "username" of a user
app.put('/users/:userid', (req, res) => {
    let user = users.find((user) => { return user.userid === req.params.userid });

    if (user) {
        user.name = req.body.name;
        res.status(201).send('Name of userid ' + user.userid + ' has been updated to ' + user.name);
    } else {
        res.status(404).send('User with the userid ' + req.params.userid + ' was not found.');
    }
});

// User adds a movie to their favorite list

app.put('/users/:name/:FavoriteMovieTitle', (req, res) => {
    let user = users.find((user) => { return user.userid === req.params.name });
    const movie = movies.find((movie) => { return movie.title === req.params.FavoriteMovieTitle });


    if (user && movie) {
        user.FavoriteMovies.push(movie);

        res.status(201).send('user ' + req.params.name + ' has added movie to favorite list');
    } else {
        res.status(404).send('Movie couldnt be added to the favorite list');
    }
});

//User removes a movie from favorie list
app.delete('/users/:name/:FavoriteMovie', (req, res) => {
    let user = users.find((user) => { return user.userid === req.params.name });


    if (user) {
        user.FavoriteMovies = user.FavoriteMovies.filter((movie) => { return movie.title !== req.params.FavoriteMovie });
        res.status(201).send('user ' + req.params.name + ' has removed a movie from favorite list');
    } else {
        res.status(404).send('Movie couldnt be removed from the favorite list');
    }
});

// Deletes a user from our list by ID
app.delete('/users/:userid', (req, res) => {
    let user = users.find((user) => { return user.id === req.params.id });

    if (user) {
        users = users.filter((obj) => { return obj.id !== req.params.id });
        res.status(201).send('User ' + req.params.userid + ' was deleted.');
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to Movie Flix homepage')
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});


app.listen(8080, () => {
    console.log('The movie app has loaded and is listening on port 8080');
});