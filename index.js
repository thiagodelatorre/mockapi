const { exception } = require('console');
var http = require('http');

let storage = {};
let nextId = {};

http.createServer(function (req, res) {
    try {
        paths = req.url.split('/')
        collection = paths[1]

        if (!(collection in storage)) {
            storage[collection] = {}
            nextId[collection] = 0
        }


        if (req.method == 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(Object.values(storage[collection])));
        } else if (req.method == 'DELETE') {
            id = +paths[2]

            if (isNaN(id)) {
                throw "id not specified."
            }

            if (!(id in storage[collection])) {
                throw "id doesn't exist."
            }

            delete storage[collection][id];

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(id))
        } else {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string
            });
            req.on('end', () => {
                try {
                    let result = JSON.parse(body)

                    let id = 0;
                    if (req.method == 'POST') {
                        id = nextId[collection]
                        nextId[collection]++;

                    } else if (req.method == 'PUT') {
                        id = +paths[2]

                        if (isNaN(id)) {
                            throw "id not specified."
                        }

                        if (!(id in storage[collection])) {
                            throw "id doesn't exist."
                        }

                    }

                    result.id = id;
                    storage[collection][id] = result

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result))
                } catch (err) {

                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(err))
                }
            });
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(err))
    }
}).listen(8080);