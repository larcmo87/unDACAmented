var db = require("../models");
var bcrypt = require("bcrypt");

module.exports = function(app) {
 
  app.get("/api/users/:id", function(req, res) {
   
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Post]
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });



  app.post("/api/users", function(req, res) {
    // res.send({type:"Post"});
    /*console.log(req.body);*/

    //Enycrypt the users password
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.userPW, salt, function(err, hash) {
        console.log(hash);

        //Creat variable to store the new user id and hashed password
        var newUser = {
          userId: req.body.userId,
          userPW: hash //hassed user password          
        };
        //Insert the new user id and password
        db.User.create(newUser).then(function(dbUser) {
           return res.json(dbUser);
        });
      });
    });

    
  });

  app.delete("/api/Users/:id", function(req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

};
