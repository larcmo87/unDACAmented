// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");
//Require jsonwebtoken. Used to validate web tokien sent in POST request
var jwt = require("jsonwebtoken");


// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts
  app.get("/api/posts", function(req, res) {
   /* var query = {};
    if (req.query.author_id) {
      query.AuthorId = req.query.author_id;
    }*/
    db.Post.findAll({
      include: [db.User]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get rotue for retrieving a single post
  app.get("/api/selectedPost", function(req, res) {
    console.log("get id post = " + JSON.stringify(req.query));
    db.Post.findOne({
      where: {
        id: req.query.postId
        
      }
    }).then(function(dbPost) {
      console.log(dbPost);
      res.json(dbPost);
    });
  });

  // POST route for saving a new post
  app.post("/api/posts", function(req, res){
     var token = req.body.token
       console.log(JSON.stringify(req.body));

        //Check if there is a token send in request
     if(token){
        //Verify the json web token
        jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
           //If token is invalid then renturn error 500
            if(err){
                console.log("Err 500");
               return res.send(null);
               
            }else{

              /* db.Post.create(req.body).then(function(dbPost) {
                res.json(dbPost);
              });*/
               //Creat variable to store the new user id and hashed password
              var newDiscussion = {
                title: req.body.title,
                body: req.body.discussion,//hassed user password   
                UserId: req.body.userId       
              };
              //Insert the new user id and password
              db.Post.create(newDiscussion).then(function(dbPost) {
                console.log("the returned dbPost value " + JSON.stringify(dbPost));
                 return res.json(dbPost);
              });
            
            }
        });
     }else{
       //If no token is sent in request return json objec with token attribute of false
       //This will be used in the main.js javascript logic to redirect a user to the sign in page
        return res.json({token: false});
     }    
   
  });

  // DELETE route for deleting posts
  app.delete("/api/posts/:id", function(req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // PUT route for updating posts
  app.put("/api/posts", function(req, res) {
    db.Post.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbPost) {
        res.json(dbPost);
      });
  });
};

