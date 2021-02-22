const express = require('express');
const path = require('path');
// init app
const app = express();

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))


// home route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html', {
        title: 'articles',
        articles: articles
    });
});

// add route
// app.get('/articles/add', function(req, res) {
//     res.render('add_article', {
//         title: 'add article'
//     });
// })

// start server
app.listen(3000, function() {
    console.log('server started on port 3k...');
});