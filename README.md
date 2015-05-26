# Sweet-Movie-Search-App

Welcome to my movie search app!

To set up:

1.) Fork and clone this repository to a local directory.

2.) If you do not already have MongoDB installed, run "brew update", then "brew install mongodb" to install the database.

3.) Run "npm install" in the command line within this directory to install the dependency modules for the app.

4.) Run "node server" to run the server locally once the dependencies are installed.

5.) The app should now be available at localhost:3000 within your browser.

User Guide:

Type a search term into the search box to search the movie database. To save a result to your favorites, click the Favorite button. The result should immediately populate your favorites list on the right side of the screen, and should persist in the database if you refresh the page. To see a full listing of information for any of the movies either in your search results or in your favorites list, click on the title of the movie, and the app will display a full set of information for that film.

Notes

For this challenge I decided I really wanted to teach myself how to use Backbone since I took the back-end course last week, and how to integrate it into Node with an Express server and MongoDB as the database. I was able to achieve that, and loved the extra organization that this gave me with my front-end code, but this project also really showed me how the modular nature of Backbone can be more difficult to organize for students who are new to it. Conceptualizing all of the moving parts of this framework and understanding how they work together definitely creates a learning curve for those who are new to it.

As a future goal for this code, I'd like to look more into further modularizing the code into separate files as I get more familiar with typical Backbone file structures.

I fought a long hard struggle trying to deploy to Heroku! But I'm just not sure yet how to integrate MongoDB with their system, more research is required.

I look forward to your feedback!