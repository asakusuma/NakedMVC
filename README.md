NakedMVC
========

A simple, no-framework MVC app.

## Setup
1. Install CouchDB (RHEL -- `sudo yum install epel`; `sudo yum install couchdb`)
2. Start CouchDB `sudo /etc/init.d/couchdb start`
3. Run NPM install  `npm install` from repo folder
4. Seed DB with test data `npm run-script testData`
5. Start the server `npm start`


Dev Notes
========

BaseViews/BaseControllers vs Views/Controllers - singleton vs instance?


View Query Language:
range: last [#], 