define(['jsdom'], function(jsdom) {
	return {
		window: jsdom.jsdom().createWindow(),
		document: new (jsdom.level(1, "core").Document)()
	}
});