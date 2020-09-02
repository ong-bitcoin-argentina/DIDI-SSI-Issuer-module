const mongoose = require("mongoose");
const ObjectId = mongoose.ObjectId;
const Constants = require("../constants/Constants");

// certificado generado a partir de un modelo, para ser completado y emitido

const dataElement = {
	name: {
		type: String,
		required: true
	},
	value: {
		type: String,
		default: ""
	}
};

const CertSchema = mongoose.Schema({
	data: {
		cert: [dataElement],
		participant: [[dataElement]],
		others: [dataElement]
	},
	templateId: {
		type: ObjectId,
		required: true,
		ref: "Template"
	},
	split: {
		type: Boolean,
		default: false
	},
	microCredentials: [
		{
			title: { type: String },
			names: [{ type: String }]
		}
	],
	deleted: {
		type: Boolean,
		default: false
	},
	emmitedOn: {
		type: Date
	},
	revokedOn: {
		type: Date
	},
	revokeReason: {
		type: String
	},
	jwts: [
		{
			data: {
				type: String
			},
			hash: {
				type: String
			}
		}
	],
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

CertSchema.index({ name: 1 });

// marcar certificado como borrado en bd local
CertSchema.methods.delete = async function () {
	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { deleted: true }
	};

	try {
		await Cert.findOneAndUpdate(updateQuery, updateAction);
		this.deleted = true;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

// marcar certificado como emitido en bd local
CertSchema.methods.emmit = async function (creds) {
	const now = new Date();

	const updateQuery = { _id: this._id };
	const updateAction = {
		$set: { emmitedOn: now, jwts: creds }
	};

	try {
		await Cert.findOneAndUpdate(updateQuery, updateAction);
		this.emmitedOn = now;
		return Promise.resolve(this);
	} catch (err) {
		return Promise.reject(err);
	}
};

// copiar los campos de 'data' al formato requerido por el certificado
var copyData = function (data) {
	return {
		cert: data.cert
			.map(data => {
				if (data.name === Constants.CERT_FIELD_MANDATORY.DID) data.name = data.name.trim();
				return {
					name: data.name,
					value: data.value ? data.value : ""
				};
			})
			.filter(data => data.value !== ""),
		participant: data.participant
			.map(array => {
				return array.map(data => {
					return { name: data.name, value: data.value ? data.value : "" };
				});
			})
			.filter(data => data.value !== ""),
		others: data.others
			.map(data => {
				return { name: data.name, value: data.value ? data.value : "" };
			})
			.filter(data => data.value !== "")
	};
};

// modificar certificado
CertSchema.methods.edit = async function (data, split, microCredentials) {
	this.data = copyData(data);
	this.split = split;
	this.microCredentials = microCredentials;

	try {
		await this.save();
		return Promise.resolve(this);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

const Cert = mongoose.model("Cert", CertSchema);
module.exports = Cert;

// crear certificado a partir de la data y el modelo de certificado
Cert.generate = async function (data, templateId, split, microCredentials) {
	try {
		let cert = new Cert();
		cert.split = split;
		cert.microCredentials = microCredentials;
		cert.data = copyData(data);
		cert.templateId = templateId;
		cert.jwts = [];
		cert.createdOn = new Date();
		cert.deleted = false;

		cert = await cert.save();
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// obtener todos los certificados
Cert.getAll = async function () {
	try {
		const query = { deleted: false };
		const certs = await Cert.find(query).sort({ createdOn: -1 });
		return Promise.resolve(certs);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// obtener todos los certificados emitidos
Cert.getByEmmited = async function (emmited = false) {
	const query = { deleted: false, emmitedOn: { $exists: emmited } };
	return await Cert.find(query).sort({ createdOn: -1 });
};

// obtener certificado por id
Cert.getById = async function (id) {
	try {
		const query = { _id: id, deleted: false };
		const cert = await Cert.findOne(query);
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// revocar certificado por id
Cert.revokeById = async function (_id, revokeReason) {
	const query = { _id };
	const action = { $set: { revokedOn: new Date(), revokeReason } };
	return await Cert.findOneAndUpdate(query, action);
};
