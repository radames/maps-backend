var keystone = require('keystone');
var Task = keystone.list('Post');
var async = require('async');

/**
 * get all posts approved
 */

exports.posts = function(req, res) {

	var posts = {
		data: []
	};
	// Load the posts
	var q = Task.model.find();

	q.find({
		$or: [{
			"isApproved": {
				"$eq": true
			}
		}]
	});

	q.sort('postDate');
	q.exec(function(err, results) {
		if (err) return res.apiError('database error - searching tasks', err);
		posts.data = results;
		res.apiResponse(posts.data);

	}).catch(error => {
		res.apiError('database error - workinggroup filter', err);
	});

}
