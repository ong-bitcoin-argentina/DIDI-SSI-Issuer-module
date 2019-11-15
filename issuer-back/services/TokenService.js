const Constants = require("../constants/Constants");
var jwt = require("jsonwebtoken");
const Messages = require("../constants/Messages");

var now = function() {
	return Math.floor(Date.now() / 1000);
};

module.exports.generateToken = function(userId) {
	var token = jwt.sign({ userId: userId, exp: now() + 60 * 60 * 60 }, Constants.SERVER_PRIVATE_KEY);
	return token;
};

module.exports.getTokenData = function(token) {
	var decoded = jwt.verify(token, Constants.SERVER_PRIVATE_KEY);
	if (decoded.exp && decoded.exp > now()) {
		return { userId: decoded.userId };
	} else {
		throw Error(Messages.VALIDATION.INVALID_TOKEN);
	}
};