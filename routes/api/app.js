var keystone = require('keystone');
var Task = keystone.list('Post');
var Category = keystone.list('Category');
var async = require('async');

/**
 * get all posts approved
 */

exports.posts = function(req, res) {
	console.log(req.params);
	var bshowAll = (req.params.pshowAll == 'all');

	var posts = {
		data: [],
		categories: []
	};

	//load Categories data
	Category.model.find().sort('name').exec(function(err, results) {
		if (err) return res.apiError('database error - searching tasks', err);

		results.forEach(category =>{
			posts.categories.push({
				key: category.key,
				title: category.name,
				body: category.categoryContent
			});
		});
		// Load the posts
		var q = Task.model.find();

		if (bshowAll) {
			q.find();
		} else {
			q.find({
				$or: [{
					"isApproved": {
						"$eq": true
					}
				}]
			});
		}

		q.sort('sortOrder');
		q.populate('category').exec(function(err, results) {
			if (err) return res.apiError('database error - searching tasks', err);

			results.forEach(post => {
				var social = [];
				if (post.hasVideo) {
					social.push({
						type: "video",
						embed: post.videoEmbed,
						url: post.videoURL
					});
				}
				if (post.hasAudio) {
					social.push({
						type: "audio",
						embed: post.audioEmbed,
						url: post.audioURL
					});
				}
				if (post.hasTwitter) {
					social.push({
						type: "twitter",
						embed: post.twitterEmbed,
						url: post.twitterURL
					});
				}
				if (post.hasInstagram) {
					social.push({
						type: "instagram",
						embed: post.instagramEmbed,
						url: post.instagramURL
					});
				}
				if (post.hasImage) {
					social.push({
						type: "image",
						embed: post.imageURL,
						url: post.imageURL,
						source: post.imageSourceURL
					});
				}
				posts.data.push({
					slug: post.slug,
					title: post.title,
					description: post.description,
					category: post.category ? post.category.key : null,
					date: post.date,
					geo: post.location,
					social: social
				});
			});
			res.apiResponse(posts);

		}).catch(error => {
			res.apiError('database error - loanding posts filter', err);
		});

	}).catch(error => {
		res.apiError('database error - loanding categores', err);
	});

}
