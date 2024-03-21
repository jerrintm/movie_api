const express = require('express');
fs = require('fs');
morgan = require('morgan');
path = require('path');

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

let top10Movies = [
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
]

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

//Below function automatically routes all requests for static files to their corresponding files within a certain folder on the server (in this case, the “public” folder).
//express.static is used to access static page, here the documentation page from the public folder
//app.use('/documentation', express.static(public));
);

app.get('/movies', (req, res) => {
    res.json(top10Movies);
});

app.get('/', (req, res) => {
    res.send('Welcome to Movie Flix homepage')
});

app.use(express.static('public');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});


app.listen(8080, () => {
    console.log('The movie app has loaded and is listening on port 8080');
});