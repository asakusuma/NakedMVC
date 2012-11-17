// Dependencies
var cradle = require('cradle');

// Locals
var db, host, port, dbName = 'app';

host = process.argv[2];
port = process.argv[3];

cradle.setup({
  cache: true,
  raw: false,
  host: host || '127.0.0.1',
  port: port || 5984
});

db = new cradle.Connection().database(dbName);

db.destroy(function() {
  db.create(function() {

    // Sample board 1
    db.save({
      type: 'Board',
      owner: 'Seth',
      title: 'A nice board',
      cards: [
        {
          title: 'Rochester Institute of technology',
          subtitle: 'School',
          comments: [
            {
              text: 'Wow, what a nice idea.'
            }
          ]
        }
      ]
    });

    // Sample board 2
    db.save({
      type: 'Board',
      owner: 'Asa',
      title: 'This is my board',
      cards: [
        {
          title: 'Harvard',
          subtitle: 'School',
          comments: [
            {
              text: 'I want to go here.'
            }
          ]
        }
      ]
    });
  });
});



console.log('Populating DB with test data...');
