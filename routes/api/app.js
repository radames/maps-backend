var keystone = require('keystone');
var Post = keystone.list('Post');
var Category = keystone.list('Category');
var async = require('async');
var fetch = require("node-fetch");

/**
 * get all posts approved
 */


 exports.getSocialData = function(req, res) {

 	var q = Post.model.find();
 	q.sort('sortOrder');
 	q.exec(function(err, results) {
 		if (err) return res.apiError('database error - searching tasks', err);

		var social = {
			instagram: [],
			twitter: ["Twitter Users: "]
		};
 		results.forEach(post => {
	 			if (post.hasTwitter) {
	 				social.twitter.push("@" + post.twitterURL.split('/')[3]);
				}
		});
		res.set('Content-Type', 'text/plain');
 		res.end(social.twitter.join("\n"));

 	}).catch(error => {
 		res.apiError('Error loading handles', err);
 	});
 }

exports.twitter = function(req, res) {
	var user = req.params.user;
	var url = `https://twitter.com/${user}/profile_image?size=bigger`;

	fetch(url)
  .then(response => {
			res.writeHead(302, {location: response.url });
			res.end();
  })
  .catch(error => {
		res.apiError('Error getting twitter profile', error);
  });
}

exports.posts = function(req, res) {
	console.log(req.params);
	var bshowAll = (req.params.pshowAll == 'all');

	var data = {
		posts: [],
		categories: []
	};

	//load Categories data
	Category.model.find().sort('name').exec(function(err, results) {
		if (err) return res.apiError('database error - searching tasks', err);

		results.forEach(category =>{
			data.categories.push({
				key: category.key,
				title: category.name,
				body: category.categoryContent
			});
		});
		// Load the posts
		var q = Post.model.find();

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
				data.posts.push({
					slug: post.slug,
					title: post.title,
					description: post.description,
					category: post.category ? post.category.key : null,
					date: post.date,
					geo: post.location,
					social: social
				});
			});
			res.apiResponse(data);

		}).catch(error => {
			res.apiError('database error - loanding posts filter', err);
		});

	}).catch(error => {
		res.apiError('database error - loanding categores', err);
	});

}
