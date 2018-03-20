var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	// app.get('/', routes.views.index); 
	app.get('/api/twitter/:user', [keystone.middleware.api], routes.api.app.twitter);
	app.get('/api/posts', [keystone.middleware.api, keystone.middleware.cors], routes.api.app.posts);
	app.get('/api/posts/:pshowAll', [keystone.middleware.api, keystone.middleware.cors], routes.api.app.posts);
	app.get('/posts/', middleware.requireUser, routes.views.posts);
};
