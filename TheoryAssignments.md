# Theory Assignments
You should complete these only after you have completed the practical assignments.

The business goal of the game database is to provide an internal service to get data for all apps from all app stores.  
Many other applications at Voodoo will use consume this API.

#### Question 1:
We are planning to put this project in production. According to you, what are the missing pieces to make this project production ready? 
Please elaborate an action plan.
#### Answer 1:
We need the following to make the project production Ready:
1. The folder structure needs to be more refined.for example the structure can be something like Routes -> Controller -> Service(Business Logic goes here) and similary the tests need to be moved in respective folders.

2. Integrate with Some Logging Mechanism like Datadog to ensure metrics are being properly captured.

3. Make sure Sequelize Pool Configuration has been adjusted for Production Setup.

4. Need to have Unit tests with Edge Scenarios rather than just happy paths.

5. Need to have Depdendency Manager like yarn to make it easier to manage.

6. Need to have Swagger Documentation and Versioning for the Endpoints
 


#### Question 2:
Let's pretend our data team is now delivering new files every day into the S3 bucket, and our service needs to ingest those files
every day through the populate API. Could you describe a suitable solution to automate this? Feel free to propose architectural changes.
#### Answer 2:

#### Approach 1:
We can run a cron job that runs within the App and calls Business Logic to Populate Games. we would not require the endpoint to be hit in that case.

games-routes | games-controller | games-service

The cron job would just call games-service where the actual logic lies and populate data.

#### Approach 2:
we can run a cron job in app that calls the endpoint over http using some library like request to make the api call to /api/games/populate



#### Question 3:
Both the current database schema and the files dropped in the S3 bucket are not optimal.
Can you find ways to improve them?

#### Answer 3:
The s3 bucket schema is as follows:
[
    [{}, {}],
    [{}, {}],
]

we can improve the same by changing the format to 
[{}, {}] in s3 bucket

In terms of being optimal, we can say that we are skipping a lot fields available in s3bucket in our Game Modal, maybe we can consider adding relevant fields aswell in Game Modal.


Also we can consider splitting the structure of Game Modal into combining all common fields like name and have a single entry in db for game with Platform Modal containing the platform specific details.

so  Game Modal(common game specific details) and PlatformModal(platform specific details), this will prevent us from having multiple games with same name conflict for different platforms and also allow to scale the platform over time with performance.