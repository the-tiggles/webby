// const http = require('http')
// const fs = require('fs')
// const port = 3000

// const server = http.createServer(function(req, res){
//     res.writeHead(200, { 'Content-Type': 'text/html'})
//     fs.readFile('./src/index.html', function(error, data) {
//         if (error) {
//             res.writeHead(404)
//             res.write('Error: file not found')
//         } else {
//             res.write(data)
//         }
//         res.end()
//     })
// })

// server.listen(port, function(error) {
//     if (error) {
//         console.log('something went wrong', error)
//     } else {
//         console.log('server is listening on port ' + port)
//     }
// })

const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write('hello world');
        res.end();
    }
    if (req.url === '/api/courses') {
        res.write(JSON.stringify([1, 2, 3, 4]))
    }
});
server.on('connection', (socket) => {
    console.log('new connection...');
})
server.listen(3000);
console.log('listening on port 3000...');
