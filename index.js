var http = require('http');

let storage = {};

http.createServer(function (req, res) {
    paths = req.url.split('/')
    collection = paths[1]

    if (!(collection in storage)) {
        storage[collection] = {}
    }


    res.writeHead(200, { 'Content-Type': 'application/json' });

    if (req.method == 'GET') {
        res.end(JSON.stringify(Object.values(storage[collection])));
    } else if (req.method == 'DELETE') {
        id = +paths[2]

        delete storage[collection][id];

        res.end(JSON.stringify(id))
    } else {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            let result = JSON.parse(body)

            let id = 0;
            if (req.method == 'POST') {
                id = Object.keys(storage[collection]).length
            } else if (req.method == 'PUT') {
                id = +paths[2]
            }

            result.id = id;
            storage[collection][id] = result

            res.end(JSON.stringify(result))
        });
    }
}).listen(8080);