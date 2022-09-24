# README #

### How do I get set up? ###

1. Make sure to have Node 12+, PostgreSQL and Yarn installed
2. Run `yarn install` inside the `client` and `server` folders
3. Create a database called `mirza` on PostgresSQL and set the password as `Postgres1`
4. Start the server with `yarn start:dev` inside the `server` folder
5. Run the scripts inside the `server/scripts` folder with `npx ts-node scriptname` in the following order: `importRoles.ts`, `importFirstPracticeManagement.ts`, `importFirstAdmin.ts` and then all the other scripts in any order
6. Start the frontend with `yarn start` inside the `client` folder.
7. The admin dashboard is available at `http://localhost:3000/admin/login`. Username: `cleomir.gomes@trustalchemy.com`, password: `#Password1`
8. All the documented routes are available at `http://localhost:5000/api/`
9. Make sure to be connected to our VPN if you're outside the US when creating applications through `http://localhost:3000/apply` 

### Contribution guidelines ###

* Pull the code from the main branch at least once a day
* Create a branch for each ticket you work on
* Only merge stable code into staging

### Who do I talk to? ###

* Cleo
* Bob
