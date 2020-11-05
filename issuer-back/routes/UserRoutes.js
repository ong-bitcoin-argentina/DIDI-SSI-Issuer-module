const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const UserService = require("../services/UserService");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");

/**
 *	Genera un usuario para el issuer
 *	(inseguro: cualquiera puede llamarlo, se recomienda eliminarlo en la version final)
 */
router.post(
	"/",
	Validator.validate([
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		},
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		},
		{
			name: "type",
			validate: [Constants.VALIDATION_TYPES.IS_STRING]
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		if (!process.env.ENABLE_INSECURE_ENDPOINTS) {
			return ResponseHandler.sendErrWithStatus(res, new Error("Disabled endpoint"), 404);
		}
		const name = req.body.name;
		const password = req.body.password;
		const type = req.body.type;
		try {
			await UserService.create(name, password, type);
			return ResponseHandler.sendRes(res, {});
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

/**
 *	Valida que la contraseña se corresponda con la del usuario,
 *	no genera ningún token ni información útil.
 */
router.post(
	"/login",
	Validator.validate([
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function (req, res) {
		const name = req.body.name;
		const password = req.body.password;
		try {
			const user = await UserService.login(name, password);
			return ResponseHandler.sendRes(res, user);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
