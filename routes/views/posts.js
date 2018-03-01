var keystone = require('keystone');
var Task = keystone.list('Post');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'posts';

	locals.posts = {
		data : [],
	};
	// Load the posts
	view.on('init', function (next) {

		var q = Task.model.find();
		q.sort('postDate')

		q.exec(function (err, results) {
			locals.posts.data = results;
			next(err);
		});
	});
	// Render the view
	view.render('posts');
};
