var http = require("http");
var fs = require("fs");
var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/user").then(function () {
  console.log("DB Connected");
});

const schema = new mongoose.Schema({
  name: String,
  password: String,
  age: String,
  mobile: String,
  email: String,
  gender: String,
  state: String,
});

const model = mongoose.model("details", schema);

const server = http.createServer(function (req, res) {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream("./index.html").pipe(res);
  } else if (req.url === "/save" && req.method === "POST") {
    var rawdata = "";
    req.on("data", function (data) {
      rawdata += data;
    });
    req.on("end", function () {
      res.writeHead(200, { "Content-Type": "text/html" });
      var inputData = new URLSearchParams(rawdata);
      model.create({
        name: inputData.get("username"),
        password: inputData.get("password"),
        age: inputData.get("age"),
        mobile: inputData.get("mobile"),
        email:inputData.get("email"),
        gender: inputData.get("gender"),
        state: inputData.get("state"),
      });
      res.write("Done");
      res.end();
    });
  } else if (req.url === "/view") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(
      '<table border="1"><tr><th>Name</th><th>Password</th><th>Age</th><th>Mobile</th><th>Emali</th><th>Gender</th><th>State</th></tr>'
    );
    model.find().then(function (users) {
      users.forEach((user) => {
        res.write("<tr>");
        res.write("<td>" + user.name + "</td>");
        res.write("<td>" + user.password + "</td>");
        res.write("<td>" + user.age+ "</td>");
        res.write("<td>" + user.mobile + "</td>");
        res.write("<td>" + user.email + "</td>");
        res.write("<td>" + user.gender + "</td>");
        res.write("<td>" + user.state + "</td>");
        res.write("</tr>");
      });
    res.end();
    });
  }
});

server.listen(2000);
