var keystone = require('keystone');
var Types = keystone.Field.Types;

/*
Posts model
*/

var Post = new keystone.List('Post', {
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	},
	map: {
		name: 'title'
	},
	sortable: true,
  //defaultSort:'-createdAt', // sorted by createdAt
  label : 'Post',
  singular: 'Post',
  plural: 'Posts'
});

Post.add(
  'Post Basic Info',
  {
    title: { type: String, initial: true, default: '', required: true , label:'Post Title - slug type - unique' ,},
    description: { type: Types.Markdown, wysiwyg: true, height: 200 , label:'Post Description',},
    postDate: { type: Types.Datetime, default: Date.now, label: 'Post event date (HH:MM:SS am/pm)'},
    location: {type: Types.Location, map: true, defaultCenter: { lat: 37.8068101, log: -122.2698373 },height: 400, required: false, initial: false},
    isApproved: { type: Types.Boolean, label: 'Approved Post?' },
  },
  'Image',
  {
    imageURL: {type: Types.Url, label: 'Image URL'},
    imageSource: {type: String, label: 'Image Source'},
    imageSourceURL: {type: Types.Url, label: 'Image Source URL'}
  },
  'Instagram',
  {
    instagramURL: {type: Types.Url, label: 'Instagram URL'},
    instagramEmbed: {type: Types.Html, height: 80, label: 'Instagram HTML Embed'}
  },
  'Twitter',
  {
    twitterURL: {type: Types.Url, label: 'Twitter URL'},
    twitterEmbed: {type: Types.Html, height: 80, label: 'Twitter HTML Embed'}
  },
  'Audio',
  {
    audioURL: {type: Types.Url, label: 'Audio URL'},
    audioEmbed: {type: Types.Html, height: 80, label: 'Audio HTML Embed'}
  },
  'Video',
  {
    videoURL: {type: Types.Url, label: 'Video URL'},
    videoEmbed: {type: Types.Html, height: 80, label: 'Video HTML Embed'}
  }
);

/**
 * Registration
 */

Post.defaultColumns = "title";
Post.register();
