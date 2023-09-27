# Blog

## Technology Stack: 

### MEVN:
- Mongo
- Express
- Vue.js -front end templates / scripts
- Node.js

New libraries: 

Dom-Purifier: https://github.com/cure53/DOMPurify
Parses the DOM to stop script tags

Json Web Tokens: https://github.com/auth0/node-jsonwebtoken
Supplies tokens to the client side for user authentication

Endpoints: (all wrapped in the API endpoint for sending json files)

- User: 

Can post and read articles
When profile is clicked, there is some simple analytics that displays page views.
Subscribers tab in the header, when clicked will show subscribers list page
Feed tab in header, displays a feed based on both recommended and subscriber articles.
Admin: 


- Guest: 

Feed tab that creates a “feed” based on cookies and 
Can view articles, but cant post
When profile button is clicked, redirects to sign up

- Index: 
Used for guest fetching

Security and Validation: 

Security libraries and how they will be used in the broader scale of this application


JsonWebTokens: 
 
Each user will have a method to generate a JWT, and while still logged in and active, will refresh with new valid JWT.

JWT will be stored on the client request side in the form of cookies



MVC Architecture: 

Models: 

User: 
Username - String
Password - String
Email - String
Articles - [Model.Article.ID]
Subscribed - [Model.User.ID]
Subscribers - [Model.User.ID]
Saved - [Model.Article.ID]
Liked - [Model.Article.ID]
Disliked - [Model.Article.ID]
Comments - [Model.Comment.ID]

Admin extends User:
UserID - Model.User.ID

Tag: 
Name - String

Article:
Author - Model.User.ID
Content - String
Title - String
Tags - [Model.Tag.ID]
Likes - Number
Dislikes - Number
Comments - [Model.Comment.ID]

Comment:
Article - Model.Article.ID
Author - Model.User.ID
Content - String




# TODO: 

## Urgent 

- Finish API endpoints for subscriber logic

- Finish Article Page, and Article Creation page

- Finish user view page

- finish user profile dashboard page

- finish guest page

- Add user info + edit profile page

- add search and query functionality for users, articles, and tags (look into ways of efficiently querying database, like a query options object)

## Later

- Implement Tag system
- Implement Subscriber system

## Ongoing

- find a good light and dark color scheme(s)
