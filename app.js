//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea d ictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/blogpostDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

    const itemsSchema = {
      title : String,
      post: String
     };

     const Item = mongoose.model('Item', itemsSchema);

   
     const newItem = new Item({
         title: 'Sample Title',
         post: 'Sample Detail'
     });

var posts = [];



app.get("/", function(req, res) {
  // Find all items in the database
  Item.find({})
      .then(items => {
          console.log('Items fetched successfully');
          res.render("home", {
              startingcontent: homeStartingContent,
              posts: items
          });
      })
      .catch(err => {
          console.error('Error fetching items:', err);
          res.status(500).send('Error fetching items');
      });
});



app.get("/about" , function(req , res){
  res.render("about" , {about:aboutContent });
})

app.get("/contact" , function(req , res){
  res.render("contact" , {contact:contactContent});
})

app.get("/compose" , function(req , res){
  res.render("compose" , {});
})

app.get("/compose" , function(req , res){
  res.render("button" , {});
})



app.post("/compose", function(req, res) {
  const title = req.body.inputtitle;
  const post = req.body.inputpost;
 
  // Check if entry with the same title already exists
  Item.findOne({ title: title })
    .then(foundItem => {
      if (!foundItem) {
        
        const newItem = new Item({
          title: title,
          post: post
        });

        return newItem.save();
      } else {
        console.log("Item with title '" + title + "' already exists.");
       
        return Promise.reject();
      }
    })
    .then(() => {
      console.log("Item saved successfully!");
      res.redirect("/");
    })
    .catch(err => {
      console.error("Error:", err);
      res.redirect("/compose");
    });
});






// Update the route handler for /posts/:postId
app.get("/posts/:postId", async function(req, res) {
  const requestedPostId = req.params.postId;

  try {
      // Use async/await to wait for the query to complete
      const post = await Item.findOne({ _id: requestedPostId });

      if (!post) {
          // Handle case where post is not found
          return res.status(404).send('Post not found');
      }

      // Render the 'post' view with data from the found post
      res.render("post", {
          title: post.title,
          content: post.post
      });

  } catch (err) {
      // Handle any errors that occur during the query
      console.error(err);
      res.status(500).send('Error retrieving post');
  }
});




app.listen(9000 , function(){
  console.log("server running for blog post")
})











