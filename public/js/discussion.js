  // $(document).on("submit", "#submit-new-discussion", handleNewDiscussionSubmit);
/*$(document).on("submit", "#submit-new-discussion", handleNewDiscussionSubmit);*/

/*Create Post button on click event*/

// Initialize collapse button
  $(".button-collapse").sideNav({
     edge: 'right'
  });
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  $('.collapsible').collapsible();



//Click event on the new discussion "Submit" button
$("#submit-new-discussion").on("click",function(){
     event.preventDefault();

    //get the user web token and user id from local storage
    var localToken = localStorage.getItem("token");
    var userId = localStorage.getItem("userId");
    
    if($("#new-discussion-title").val() === ""){

      
      $("#modal-header").text("Title Required!");
      $("#modal-p").text("Please enter a title for your discussion");
       $('.modal').modal({
          dismissible: false, // Modal can be dismissed by clicking outside of the modal
          opacity: .5, // Opacity of modal background
          inDuration: 300, // Transition in duration
          outDuration: 200, // Transition out duration
          startingTop: '4%', // Starting top style attribute
          endingTop: '10%', // Ending top style attribute
          complete: function() {$("#new-discussion-title").focus(); } // Callback for Modal close
        });

       

    }else if($("#new-discussion").val() === ""){

      //Modal header text
      $("#modal-header").text("Content Required!");
      //Modal body text
      $("#modal-p").text("Please enter content for your discussion");

      //Display Modal
       $('.modal').modal({
          dismissible: false, // Modal can be dismissed by clicking outside of the modal
          opacity: .5, // Opacity of modal background
          inDuration: 300, // Transition in duration
          outDuration: 200, // Transition out duration
          startingTop: '4%', // Starting top style attribute
          endingTop: '10%', // Ending top style attribute
          complete: function() {$("#new-discussion").focus(); } // Callback for Modal close
        });
    }else{

      console.log("localstorage userId   = " + userId);

      //If no token when trying to submit a discussion
      //let the user know and show side nav so they use can log in
     

        //JSON obejct that stores the data that is used to pass to the
        // api/posts route.
        var post = {
          token: localToken,
          title: $("#new-discussion-title").val(),
          discussion: $("#new-discussion").val(),
          userId: userId
        }

        //If the new discussion testarea element has an entry
        //then send the JSON object post to the /api/posts route
        
         $.post("/api/posts", post, function(res){
            
          console.log("returned res = " + JSON.stringify(res));
          if(res === "" || localToken === null){
            var tokenValue = JSON.stringify(res.token);

             
             Materialize.toast('Must login first before submitting a discusion!', 3000)
             $('.button-collapse').sideNav('show');
            console.log("post res token = " + JSON.stringify(res.token));            
            
          }else{
            //Prepend the most current submitted discussion to the discussion board and load
           
            addToDiscustionBorad(res.id, res.title, res.body); 
            console.log("post successful res = " + JSON.stringify(res.body));
          }
         
        });  
      
    }
});

function getSelectedDiscussion(postedId){

  console.log("postedId = " + postedId);
  if(postedId !== null){
    var postId = {
      postId: postedId
    } 

    console.log("postedId object = " + postId.postId);
     $.get("/api/selectedPost",postId, function(res) {
        $("#selected-discussion-title").val(res.title);
        $("#selected-discussion").val(res.body);
        console.log("get res value = " + JSON.stringify(res.title,null,2));
    });
  }
}


function addToDiscustionBorad(postId,postTitle,postBody){
  
   $('.discussions-all').prepend(
        "<li>" + 
          "<div class='card'>" +
            
            "<div class='discussion-card-title-all z-depth-4postBody'>" + 
                "<span class='card-title all-discussion-card-title' data-post-id='" + postId + "'>" + postTitle+ "</span>" +
                // "<div>Posted by: " + userid + "</div>"+
            "</div>" +           
         
          "<div class='card-content card-body'>" +
              "<p>" + postBody + "</p>" +
          "</div>" +
           "</div>" +
        "</li>"
      );
}
//Load the Discussion Bord with all discussion
function loadDiscussionCards(){
   $.get("/api/posts", function(res) {
      
      var resLenght = res.length;
      //Dynamically create cards and preappend to unorderd list
      for(var i = 0; i < resLenght; i++){

          $('.discussions-all').prepend(
            "<li>" + 
              "<div class='card'>" +
                
                "<div class='discussion-card-title-all z-depth-4'>" + 
                    "<span class='card-title all-discussion-card-title' data-post-id='" + res[i].id + "'>" + res[i].title + "</span>" +
                    "<div>Posted by: " + res[i].User.userId + "</div>"+
                "</div>" +           
             
              "<div class='card-content card-body truncate'>" +
                  "<p>" + res[i].body + "</p>" +
              "</div>" +
               "</div>" +
            "</li>"
          ); 
      }
   });
}


getSelectedDiscussion(localStorage.getItem("postId"));
loadDiscussionCards();