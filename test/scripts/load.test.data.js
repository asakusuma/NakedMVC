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

    // Views
    db.save('_design/boards', {
      all: {
        map: function(doc) {
          if(doc.type == 'Board') emit(doc._id, doc);
        }
      }
    });

    db.save('_design/cards', {
      all: {
        map: function(doc) {
          if(doc.type == 'Card') emit(doc._id, doc);
        }
      }
    });


    // Sample board 1
    db.save('b1', {
      type: 'Board',
      owner: 'Seth',
      title: 'A nice board',
      cards: ['c1', 'c2']
    });

    // Sample board 2
    db.save('b2', {
      type: 'Board',
      owner: 'Asa',
      title: 'This is my board',
      cards: ['2']
    });

    // Card
    db.save('c1', {
      type: 'Card',
      title: 'Rochester Institute of technology',
      subtitle: 'School',
      comments: [
        {
          text: 'Wow, what a nice idea.'
        }
      ]
    });

    // Card 2
    db.save('c2', {
      type: 'Card',
      title: 'Harvard',
      subtitle: 'School',
      comments: [
        {
          text: 'I want to go here.'
        }
      ]
    });

  });
});



console.log('Populating DB with test data...');
