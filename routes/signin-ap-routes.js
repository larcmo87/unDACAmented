var db = require("../models");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

module.exports = function(app) {

 

  //PUT route to query database for user record
  app.put("/api/signin", function(req, res,next) {
   
    console.log("req.param = " + JSON.stringify(req.body));
    //find the user by user id
    db.User.findOne({
       where: {
        userId: req.body.userId
      }
    }).then(function(dbPost){
       console.log("db password " + JSON.stringify(dbPost, null, 2));
      if(!dbPost) {
        return res.json({success: false, token: "User Id or Password incorrect!"});
      }else{
       console.log("req bod pswd = " + req.body.userPW);
       console.log("dbPost pswd = " + dbPost.userPW);
          bcrypt.compare(req.body.userPW, dbPost.userPW, function(err, result){
              if(result){
                var user = {
                  userId: req.body.userPW,
                  userPW: dbPost.userPW
                }


                //Sign a token that will expire in 1 hour
                var token = jwt.sign({
                              /*exp: 1300819380,  Math.floor(Date.now() / 1000) 60 * 60,*/
                              expiresIn : 60*60*24,
                              data: user
                            }, process.env.SECRET_KEY);

               //Return JSON object
               return res.json({
                 success: true,
                 token: token,
                 user_id: dbPost.id
                });
                console.log("It worked");

            }else{
                return res.json({success: result, token: "User Id or Password incorrect!"});
            }

          });/* End of bcrypt compare*/
        }
      });  //End of put.then
  }); //End of put    
};
