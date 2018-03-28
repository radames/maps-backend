var keystone = require('keystone');
var Types = keystone.Field.Types;

var Category = new keystone.List('Category', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Category',
  singular: 'Category',
	sortable: true,
  plural: 'Categories'
});

Category.add({
	name: { type: String, required: true, initial: true},
	title: { type: String, required: true, initial: false, label:'Chapter Menu Title'},
  categoryContent: { type: Types.Markdown, wysiwyg: true, height: 200 , label:'Category Content'}
});

Category.relationship({ ref: 'Post', refPath: 'category' });
Category.register();
