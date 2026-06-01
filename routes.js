const fs=require('fs');
const requestHandler=(req,res)=>{
    if(req.url==='/' && req.method==='GET'){
        fs.readFile('user.txt','utf8',(err,data)=>{
            if(err){
                data= '';
            }

            res.setHeader('Content-Type','text/html');
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Message App</title>
                </head>
                <body>

                    <h2>${data}</h2>

                    <form action="/submit" method="POST">
                        <input type="text" name="name">
                        <button type="submit">Send</button>
                         </form>

                </body>
                </html>
                `);
        });
        return;
    }


    if(req.url==='/submit' && req.method==='POST'){
        const body=[];

        req.on('data',(chunk)=>{
            body.push(chunk);
        });
        req.on('end',()=>{
            const parsedBody=Buffer.concat(body).toString();
            const name=decodeURIComponent(parsedBody.split('=')[1]);

            fs.writeFile('user.txt',name,(err)=>{
                if(err){
                    console.log(err);
                }

                res.statusCode=302;
                res.setHeader('Location','/');
                res.end();
            });
        });
        return;

    }
}

module.exports=requestHandler;