'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	console.log(req.user);
	res.render('index', {
		user: req.user || null,
		request: req
	});
};