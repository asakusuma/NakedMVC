define(['lib/underscore', 'dustjs-linkedin', 'base/view'],function (_,dust,BaseView) {
	return BaseView.extend({
		queries: [
			{
	        	schema: 'Message'
	      	}
		]
	});
});