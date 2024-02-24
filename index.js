
// create two classes

class BlogPost {

    // TODO: Create a class constructor named BlogPost that takes in 'authorName', 'title', 'text', and 'createdOn'.
    constructor(authorName, title, text, createdOn) {
        this.authorName = authorName;
        this.title = title;
        this.text = text;
        this.createdOn = createdOn;


    }

    // TODO: Give BlogPost a property called 'comments' that is set to an empty array.
    comments = [];


    // TODO: Give BlogPost a method called printMetaData() that logs a message saying 'Created by (authorName) on (createdOn)'.
    printMetaData() {
        let comments = '';
        let reaction = '';
        this.comments.forEach(comment => {

            comments += comment.authorName + " " + comment.createdOn + " " + comment.text
            reaction += comment.authorName + " " + comment.createdOn + " " + comment.reaction;
            comment.printMetaData()
        });
        console.log(`Created by ${this.authorName} on ${this.createdOn} have the following comments: ${comments} with the following reaction ${reaction}`);
    }

    // TODO: Give Blog Post a method called addComment() that takes in a comment and adds it to the comments array.
    addComment(newComment) {
        this.comments.push(newComment);
        //console.log(this.comments);
    }

}


// comments class
class Comment {

    // TODO: Create a class constructor called Comment that takes in 'authorName', 'text', 'createdOn', and 'reaction'.
    constructor(authorName, text, createdOn, reaction) {
        this.authorName = authorName;
        //this.title = title;
        this.text = text;
        this.createdOn = createdOn;
        this.reaction = reaction;
    }

    // TODO: Give Comment a method called printMetaData() that logs a message saying 'Created by (authorName) on (createdOn) (reaction)'.


    printMetaData() {
        console.log(`Created by ${this.authorName} on ${this.createdOn} ${this.reaction} }`);
    }



}

// Logic of the application

const fs = require('fs');
const inquirer = require('inquirer');

const blogs = []

// initialize the application ask the two choices 
function initialize() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: "what would you like to do?",
            choices: ['quit', 'continue']
        }

    ]).then(answers => {
        if (answers.option === 'quit') {
            console.log('good bye')
            process.exit() // return
        } else if (answers.option === 'continue') {
            askQuestions();
        }
    })
}


const blogQuestions = [
    { message: "what is the blog author name?", type: "input", name: "authorname" },
    { message: "what is the blog title?", type: "input", name: "title" },
    { message: "what is the blog text?", type: "input", name: "text" },
    { message: "what is the blog date?", type: "input", name: "date" },
    //{message:"what is your comments?",type:"input",name:"comment"},
]

const commentQuestions = [
    { message: "what is the comment author name?", type: "input", name: "authorname" },
    { message: "what is the reaction?", type: "input", name: "reaction" },
    { message: "what is the comment text?", type: "input", name: "text" },
    { message: "what is the comment date?", type: "input", name: "date" },

]

function askQuestions() {
    //ask the blog questions
    inquirer.prompt(blogQuestions
    ).then(answer => {
        console.log(answer)
        //create a new blog
        const newBlogPost = new BlogPost(answer.authorname, answer.title, answer.text, answer.date);
        //ask the comment question
        inquirer.prompt(commentQuestions).then(answer => {
        //create a new comment
            const newComment = new Comment(answer.authorname, answer.text, answer.date, answer.reaction)

            // add the comment to the blog we just created
            newBlogPost.addComment(newComment);

            // push the blog to the array so that we can push more
            blogs.push(newBlogPost);

            // write the html
            fs.writeFileSync('blogs.html', writeHtml(blogs))
            // ask the question again 
            initialize();   
        }
        )
    });
}


function writeHtml(blogs) {

    function createComments(blog) {
        let template = ``
        blog.comments.map(comment => {
            template +=
                `<h3>${comment.text}</h3>
        <h4>${comment.authorName}</h4>
        <h4>${comment.createdOn}</h4>
        <h4>${comment.reaction}</h4>`
        }

        )
        return template
    }



  function createBlogs() {
        let template = ``
        blogs.forEach(blog => {
            template += `
    <h1>${blog.title}</h1>
    <h2>${blog.text}</h2>
        <div>
        ${createComments(blog)}
        </div>
    `})
        return template
    }

return `
    
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<div>
    ${createBlogs()} 
</div>
</body>
</html>
`

}


initialize();