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

Frontend dataproxy returns collections/models
Backend dataproxy returns flat object


View Query Language:
--------------------

{
	AND...
}

[
	OR...
]

- Schema name is always singular, capitalized
- DB should store copy of schema. When DB scheme and App schema don't match, update structure accordingly

Post Schema
{
	author: {
		type: 'Author'
	},
	text: {
		type: 'string',
		
	},
	categories: {
		type: 'Category',
		arity: 'many'
	},
	subcategories: {
		type: 'Category',
		arity: 'many'
	}
}

Category Schema
{

}

Author Schema 
{
	name: {
		type: 'string'
	}	
}

Example: last 5 posts by an author who's name starts 'Jo' AND (has at least 20 likes OR has at least 5 comments)
{
	schema: 'Post',
	where: {
		author: {
			name: ['starts-with','Jo']
		},
		[
			{

			}
		]
	},
	select: {
		by: 'date',
		order: 'ASC',
		last: 5
	}
}


Data Set Object

{
	query: {
		...
	},
	collection: 
}





