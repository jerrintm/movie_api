const express = require('express');
fs = require('fs');
morgan = require('morgan');
path = require('path');

const app = express();
const uuid = require('uuid');

//app.use(bodyParser.json());

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });



let movies = [
    {
        title: 'The Godfather',
        Director: 'Francis Ford Coppola'
    },
    {
        title: 'Avatar',
        Director: 'James Cameron'
    },
    {
        title: 'Jurassic World',
        Director: 'Colin Trevorrow'
    },
    {
        title: 'The Dark Knight',
        Director: 'Christopher Nolan'
    },
    {
        title: 'Forest Gump',
        Director: 'Robert Zemeckis'
    },
    {
        title: 'Titanic',
        Director: 'James Cameron'
    },
    {
        title: 'The Shawshank Redemption',
        Director: 'Frank Darabont'
    },
    {
        title: 'Inception',
        Director: 'Christopher Nolan'
    },
    {
        title: 'The Lion King',
        Director: 'Rob Minkoff'
    },
    {
        title: 'Black Panther',
        Director: 'Ryan Coogler'
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
        DOB: '02/10/1970'
    },
    {
        name: 'Mat Dav',
        userid: 'mdav',
        password: 'xyz1',
        email: 'mdav@gmail.com',
        DOB: '02/10/1970'
    },
    {
        name: 'Colin Neal',
        userid: 'cneal',
        password: 'xyz2',
        email: 'cneal@gmail.com',
        DOB: '02/10/1970'
    }
];


// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

//Below function automatically routes all requests for static files to their corresponding files within a certain folder on the server (in this case, the “public” folder).
//express.static is used to access static page, here the documentation page from the public folder
//app.use('/documentation', express.static(public));


//get list of all movies
app.get('/movies', (req, res) => {
    //  console.log("Movie List");
    res.json(movies);
});

//get list of all directors
app.get('/directors', (req, res) => {
    res.json(directors);
});

//get list of all users
app.get('/users', (req, res) => {
    res.json(users);
});

//get all details of a specific movie title
app.get('/movies/:title', (req, res) => {
    console.log("Movie Title");
    res.json(movies.find((movie) => { return movie.title === req.params.title }));
});

//get all details of a specific director
app.get('/directors/:name', (req, res) => {
    console.log("Movie Title");
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


// Adds data for a new user to our list of users.
app.post('/users', (req, res) => {
    let newuser = req.body;

    if (!newuser.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else {
        newuser.id = uuid.v4();
        users.push(newuser);
        res.status(201).send(newuser);
    }
});

// Update the "username" of a user
app.put('/users/:name/:username', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });

    if (user) {
        user.userid[req.params.userid] = parseInt(req.params.userid);
        res.status(201).send('user ' + req.params.name + ' has the userid updated to ' + req.params.userid);
    } else {
        res.status(404).send('User with the name' + req.params.name + ' was not found.');
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