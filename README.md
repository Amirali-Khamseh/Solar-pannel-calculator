# Solar Panel Management Application
## Overview
The Solar Panel Management Application is a comprehensive tool designed to assist users in efficiently managing their solar panels. It provides monitoring and performance analysis by considering various factors such as location, weather conditions, panel type, size, angle of positioning, and orientation. The application offers real-time calculations tailored to each panel's specific characteristics, allowing users to calculate the output of individual panels or entire projects.

For users who have not yet acquired solar panels, the application includes a simulation feature. Users can input panel specifications, and the program generates accurate energy generation reports for any desired location. These reports can be accessed conveniently through email or within the application, presenting visual representations and intuitive graphs for easy interpretation of daily energy generation patterns.
## Architecture
The Solar Panel Management Application follows the Model-View-Controller (MVC) design pattern using Express.js as the web application framework. The MVC pattern ensures a clear separation of responsibilities, leading to modular and organized code structure. The Model handles data and business logic, the View manages the presentation layer, and the Controller acts as an intermediary, managing data flow and user interactions.

The use of the MVC pattern in this large-scale application allows for code maintainability, scalability, and reusability. Each part of the application has its own separated code, making debugging easier and enabling isolation of specific functionalities for troubleshooting.

## Front-end Technologies

The front-end of the application is built using HTML, CSS, JavaScript (JS), Bootstrap, and EJS (Embedded JavaScript) as the template engine. HTML provides the structure, CSS and Bootstrap enhance the visual appeal, and JS enables dynamic behavior such as interactive maps. AJAX is used for seamless communication with the back-end without page refresh. EJS is employed to render back-end data and logic within the HTML structure.

The Leaflet map is used as the provider of the map interface, allowing users to interact with and visualize the map.

To access weather conditions, the application uses UV rates data provided by the 'https://www.weatherbit.io/' API.

## Back-end  Technologies
The application utilizes MongoDB as the database management system. MongoDB offers flexibility in storing unstructured data and enables easy interaction with JavaScript systems due to its similarity to JavaScript Objects. MongoDB's efficient queries and ability to handle complex data manipulation make it suitable for this application. The cloud version, MongoDB Atlas, is used for advanced functionality and real-time performance reports.
## Models and Relationships
The application uses four models: User, Project, Product, and DailyReport. Each model represents a specific aspect of the application and defines the structure, validation rules, and behavior of the data. Relationships between these models are established based on one-to-many connections to efficiently organize and store information.
## Views
Views are responsible for providing the user interface of the application. EJS is utilized for server-side rendering of dynamic pages, enabling data presentation from the database to the user and vice versa. The application also incorporates reusable components in the "partials" folder to enhance modularity and code reusability.
## Controllers and Their Functionalities
Controllers handle the application's logic and are invoked based on the specific routes. Three main controllers exist: AuthController, ProjectController, and ProductController. They manage user interactions, project and product creation, updates, deletions, and report generation based on user input and database operations.

## Implementation 
To run the program, ensure that your operating system has Node.JS installed. This application was developed using version 18.15.0. If you encounter issues starting the application, try changing the version to the one it was tested on and confirm that you have node package manager (npm) available.
Once you have cloned or downloaded the project, follow these steps:
- Run the following commands for installing the package manager and adding the dependencies:
```
npm init -y
npm install
```
- Create a new file in the project directory called .env (if it doesn't already exist).
- Create the same type of collections as available in folder 'models' in MongoDB database.

- Open the .env file and add the your connection string as an environment variable.

- Get your own API key  from 'https://www.weatherbit.io/' and replace it into .env file.
- Place your application key obtained from google in the .env as an application key .
- in the product controller , change the sender of the gmail to the gmail you have  included the key .
- to start the application , open command prompt in the directory of project and run :
```
node server.js
```
