const http = require('http');
const https = require('https');
const PORT = process.env.PORT || 8080;
const url = 'https://time.com';

const server = http.createServer(async (req, res) => {

    //get time stories route
    if (req.url === "/getTimeStories" && req.method === "GET") {
        https.get(url, (response) => {
            const data = [];
            response.on('data', (d) => {
                data.push(d);
            });

            response.on('end', () => {
                // convert buffer to string and remove line breaks
                const htmlString = data.toString().replace(/(\r\n|\n|\r)/gm, ""); 

                // get the stories li element
                const stories = htmlString && htmlString.match(/(?<=class="latest-stories__item">)(.*?)(?=<\/li>)/g);

                const resultJSON = stories && stories.map(item => {
                    // get the links from each stories
                    const link = item.match(/(?<=href=")(.*?)(?=">)/g);

                    // get the title from each stories
                    const title = item.match(/(?<=class="latest-stories__item-headline">)(.*?)(?=<\/h3>)/g);
                    
                    return {title: title[0], link: `${url}${link[0]}`};
                })
                console.log('resultJSON: ---- ', resultJSON);

                //response headers
                res.writeHead(200, { "Content-Type": "application/json" });
                //set the response
                res.write(JSON.stringify(resultJSON));
                //end the response
                res.end();
            });

        }).on('error', (e) => {
            console.error(e);
        });
    }

    // If no route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});
