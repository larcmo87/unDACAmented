// SETUP VARIABLES
// ==========================================================

// This variable will be pre-programmed with our authentication key
// (the one we received when we registered)
var authKey = "b9f91d369ff59547cd47b931d8cbc56b:0:74623931";

// These variables will hold the results we get from the user's inputs via HTML
var searchTerm = "";
var numResults = 0;
var startYear = 0;
var endYear = 0;
var numArticles = 10;
var alreadyLoggedIn = false;

var beingDate = new Date();

var newUserId = $("#new-user-id");
var newPassword = $("#new-password");
var signinUserId = $("#user_id");
var signinUserPW = $("#password");

var global_userId = {
  user_id: ""
}

  // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
  var url = window.location.search;
  var postId;
  
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In '?post_id=1', postId is 1
  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId, "post");
  }

beingDate = moment(beingDate).format("YYYYMMDD");

console.log("beginDate" + moment(beingDate).format("YYYYMMDD"));

// queryURLBase is the start of our API endpoint. The searchTerm will be appended to this when
// the user hits the search button

// var  queryURLBase = "https://newsapi.org/v1/articles?source=cnn&articles=DACA&apiKey=" + authKey;
var queryURLBase ="https://api.nytimes.com/svc/search/v2/articlesearch.json";
queryURLBase += '?' + $.param({
  'api-key': authKey,
  'q': "DACA",
  'page': 0
  // 'begin_date': beingDate
});

/*var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
  authKey + "&q=" + "DACA";
*/

 
// Counter to keep track of article numbers as they come in
var articleCounter = 0;

// FUNCTIONS
// ==========================================================

// This runQuery function expects two parameters:
// (the number of articles to show and the final URL to download data from)
function runQuery(numArticles, queryURLBase) {

  // The AJAX function uses the queryURL and GETS the JSON data associated with it.
  // The data then gets stored in the variable called: "NYTData"

  $.ajax({
    url: queryURLBase,
    method: "GET"
  }).done(function(NYTData) {

    // Logging the URL so we have access to it for troubleshooting
    console.log("------------------------------------");
    console.log("URL: " + queryURLBase);
    console.log("------------------------------------");

    // Log the NYTData to console, where it will show up as an object
    console.log(NYTData);

    console.log(JSON.stringify(numArticles));
    console.log("------------------------------------");

    console.log("HeadLine = " + NYTData.response.docs[0].headline.main);

    for(var i = 0; i < NYTData.response.docs.length; i++){
        // var imageSource = "https://www.nytimes.com/" + NYTData.response.docs[i].multimedia[0].url;
        var imageCount = i + 1;
      console.log(i);
      $('.slides').append(
        "<li>" + 
          "<a href='" + NYTData.response.docs[i].web_url + "' style='text-decoration:none;color:black'>" +
            "<div class='row' style='height:100%'>" +
                "<div class='col s12 m6'>" +
                  "<div class='card  z-depth-4' style='height:390px'>" +                     
                    "<div class='card-image'>" + 
                      "<img src='images/daca" + imageCount + ".jpg' class='responsive-img' style='height:250px'>" +
                     
                    "</div>" +
                    "<div class='card-content'>" +
                       "<span class='card-title'>" + NYTData.response.docs[i].headline.main + "</span>" +
                      "<p>" + NYTData.response.docs[i].snippet + "</p>" +
                    "</div>" +
                  "</div>" +
               "</div>" + 
            "</div>" +
          "</a>" + 
        "</li>");        
    }


         $('.slider').slider({full_width: true});
        
  });

 
}

function loadDiscussionCards(){
   $.get("/api/posts", function(res) {
      console.log("get res value = " + JSON.stringify(res,null,2));
      console.log("res id  " + res[0].title);
      var resLenght = res.length;

      if(resLenght > 5){
        for(var i = 0; i < 5; i++){
          $("#card-" + [i + 1] + "-title").text(res[i].title); 
          $("#card-" + [i + 1] + "-title-poster").text("Posted by: " + res[i].User.userId);
           $("#card-" + [i + 1] + "-a").attr("name",res[i].id);         
          $("#card-" + [i + 1] + "-paragraph").text(res[i].body);
        }
      }else{
        for(var i = 0; i < resLenght; i++){
          $("#card-" + [i + 1] + "-title").text(res[i].title);
          $("#card-" + [i + 1] + "-a").attr("name",res[i].id);  
          $("#card-" + [i + 1] + "-paragraph").text(res[i].body);
        }
      }
   });
}

$(document).on("submit", "#new-user-form", handleNewUserFormSubmit);


// Initialize collapse button
  $(".button-collapse").sideNav({
     edge: 'right'
  });
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  $('.collapsible').collapsible();


 // A function for handling what happens when the form to create a new post is submitted
  function handleNewUserFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body, title, or author
    if (!$("#new-user-id").val().trim()){
       
      $("#new-user-id").focus();
      return Materialize.toast('User Id field is required', 3000, 'rounded');
      
    }

    if(!$("#new-password").val().trim()) {
      $("#new-password").focus();
      return Materialize.toast('Password field is required', 3000, 'rounded');

    }
    // Constructing a newPost object to hand to the database
    var newUser = {
      userId: newUserId
        .val()
        .trim(),
      userPW: newPassword
        .val()
        .trim()
    };

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newPost.id = postId;
      updatePost(newPost);
    }
    else {
      // Clear sessionStorage
      sessionStorage.clear();
      //call submitNewUser function and pass in the newUser object
      submitNewUser(newUser);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitNewUser(post) {
    $.post("/api/users", post, function(res) {
      if(!res){
        console.log("Unable to register new user");
        <!-- data-position can be : bottom, top, left, or right -->
        <!-- data-delay controls delay before tooltip shows (in milliseconds)-->
        
        

       $(".button-collapse").sideNav({
          edge: 'right'
        });
      }else{

        console.log("New user registered");
        $("#new-user-id").val("");
        $("#new-password").val("");
      }
     /* window.location.href = "/";*/
    });
  }


  $("#loggin-form").submit(function(){
     event.preventDefault();

      // Wont submit the post if we are missing a body, title, or author
    if (!$("#user_id").val().trim()){
      
      $("#user_id").focus();
      return Materialize.toast('User Id field is required', 3000, 'rounded');
      
    }

    if(!$("#password").val().trim()) {
      $("#password").focus();
      return Materialize.toast('Password field is required', 3000, 'rounded');

    }

     console.log("In signing btn click");
     console.log(" user id " + signinUserId.val());
     
    // Constructing a newPost object to hand to the database
    var signinUser = {
      userId: signinUserId
        .val()
        .trim(),
      userPW: signinUserPW
        .val()
        .trim()

    };

    $.ajax({
      method: "PUT",
      url: "/api/signin",
      data: signinUser
    })
    .done(function(res) {
      // console.log("res = " + JSON.stringify(res.user_id));

      //Store the web token locally
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.user_id);

      //Login authentication unsuccessfull then
      //clear entries, set focus on Uwer id 
      //and show error in toast
      if(!res.success){
         
        $("#user_id").val("");
        $("#user_id").focus();
        $("#password").val("");
        return Materialize.toast(res.token, 3000, 'rounded');
      
      //If sign in successful then cler entries, display
      //success toast message and redirect to index html
      }else{
        $("#user_id").val("");        
        $("#password").val("");
        Materialize.toast("Sign in successful!", 3000, 'rounded');

        $('.button-collapse').sideNav('hide');

       
      }
      /*window.location.href = "/blog";*/
    });


    // authenticateSignin(signinUser);
    console.log("signinUser = " + JSON.stringify(signinUser));
  
  });

   // Update a given post, bring user to the blog page when done
  function authenticateSignin(post) {
    $.ajax({
      method: "GET",
      url: "/api/signin",
      data: post
    })
    .done(function(res) {
      console.log("res returned = " + res.body);
      /*window.location.href = "/blog";*/
    });
  }

//Click event on selected discussion
$(".open-discussion").on("click",function(){
  

  var discussionCardValue = "";

  //Get the name attribute value (this is the post id from the database table)
  discussionCardValue = $(this).attr("name");
  console.log("dis card value = " + discussionCardValue);
  
  //Store post id in local storage. This will be used to 
  //get the post and render it on the discussions.html page
  localStorage.setItem("postId", discussionCardValue);

  //goto the discusstions.html page
 window.location.href = "discussion.html";

});


//Log off
$("#log-off").on("click",function(){

  //clear all items in localstorage when user logs off
  localStorage.clear();

});
        
runQuery(numArticles, queryURLBase);
loadDiscussionCards();

