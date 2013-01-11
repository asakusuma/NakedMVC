// Dependencies
var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: "public/javascripts/",
    paths: {
      "app": "../../app",
      "schema": "../../app/schema",
      "dataproxy": "../../app/dataproxy"
    }
});

requirejs(['schema', 'cradle'], function(schema, cradle) { 
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

      /*
      console.log(schema.obj);

      for(var name in schema.obj) {
        var s = schema.obj[name];
        console.log(name);
        
      }
      */

      db.save('_design/Message', {
        all: {
          map: function(doc) {
            if(doc.schema == 'Message') emit(doc._id, doc);
          }
        }
      });

      db.save('m1', {
        schema: 'Message',
        content: 'Hello world!'
      });

      db.save('m2', {
        schema: 'Message',
        content: 'You rock.'
      });

      /*

      // Views
      

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
        cards: ['stanford', 'rit']
      });

      // Sample board 2
      db.save('b2', {
        type: 'Board',
        owner: 'Asa',
        title: 'My dream colleges',
        cards: ['upenn', 'stanford']
      });

      // Card
      db.save('rit', {
        type: 'Card',
        title: 'Rochester Institute of technology',
        image: 'http://colleges.usnews.rankingsandreviews.com/img/college-photo_3121._445x280-zmm.JPG',
        subtitle: 'Career-oriented education',
        comments: [
          {
            text: 'Wow, what a nice idea.'
          }
        ]
      });

      // Card 2
      db.save('harvard', {
        type: 'Card',
        title: 'Harvard',
        image: 'http://timenewsfeed.files.wordpress.com/2011/09/harvard.jpg',
        subtitle: 'School',
        comments: [
          {
            text: 'American private Ivy League research university'
          }
        ]
      });

      db.save('stanford', {
        type: 'Card',
        title: 'Stanford',
        image: 'http://www.stanford.edu/group/armyrotc/imgs/stanfordoval.jpg',
        subtitle: 'American private research university',
        comments: [
          {
            text: 'I want to go here.'
          }
        ]
      });

      db.save('upenn', {
        type: 'Card',
        title: 'University of Pennsylvania',
        image: 'http://ionenewsone.files.wordpress.com/2011/04/upenn-church.jpg',
        subtitle: 'Fear the Quakers',
        comments: [
          {
            text: 'I want to go here.'
          }
        ]
      });
  */
      

    });
  });



  console.log('Populating DB with test data...');
});
