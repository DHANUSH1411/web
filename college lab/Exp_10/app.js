const http = require('http');
const fs = require('fs');
const {URLSearchParams} = require('url');

const mongoose = require('mongoose');
const { type } = require('os');
mongoose.connect('mongodb://127.0.0.1:27017/ex10')
    .then(function(){
        console.log('Db connected')
    })  
const studentSchema = new mongoose.Schema({name:String, password:String});
const studentmodel= mongoose.model('students',studentSchema);

const server = http.createServer(function(req,res){
        if(req.url === '/'){
            res.writeHead('200',{'content-type': 'text/html'});
            fs.createReadStream('form.html').pipe(res);
        }
        else if(req.url === '/signup' && req.method === 'POST'){
            var rawdata = ' ';
            req.on('data',function(data){
                rawdata += data;
            })
            req.on('end',function(){
                var formdata = new URLSearchParams(rawdata);
                res.writeHead('200',{'content-type': 'text/html'});
                studentmodel.create({name:formdata.get('name'),
                                     password:formdata.get('password')
                                    })
                res.write('displayed sucesfully')
                res.end();
            })
        }
})
server.listen('8080', function(){
    console.log('server started at port http://127.0.0.1:8080');

})