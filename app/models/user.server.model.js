'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * Job Schema
 */
var JobSchema = new Schema({
	company: {
		type: String,
		trim: true
	},
	start: {
		type: String,
		trim: true
	},
	end: {
		type: String,
		trim: true
	},
	role: {
		type: String,
		trim: true
	},
	description: {
		type: String,
		trim: true
	}
});

var CreditCardSchema = new Schema({
	number: {
		type: String,
		trim: true,
		required: 'Please fill in a card number'
	},
	experation: {
		type: String,
		trim: true
	},
	security: {
		type: String,
		trim: true
	},
	billing: {
		type: String,
		trim: true
	}
});

var AddressSchema = new Schema({
	street: {
		type: String,
		trim: true
	},
	cityAndZip: {
		type: String,
		trim: true
	}
});


/**
 * User Schema
 */
var UserSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your name']
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in a username',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	avatar: {
		type: String,
		trim: true
	},
	coverPhoto: {
		type: String,
		trim: true
	},
	bio: {
		type: String,
		trim: true
	},
	facebook: {
		type: String,
		trim: true
	},
	twitter: {
		type: String,
		trim: true
	},
	linkedIn: {
		type: String,
		trim: true
	},
	addresses: [{
		street: {
			type: String,
			trim: true
		},
		city: {
			type: String,
			trim: true
		},
		state: {
			type: String,
			trim: true
		},
		zip: {
			type: String,
			trim: true
		}
	}],
	cards: [CreditCardSchema],
	phones: [{
		number: {
			type: String,
			required: 'Please fill in a phone number'
		},
		type: {
			type: Number
		}
	}],
	jobs: [JobSchema],
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);