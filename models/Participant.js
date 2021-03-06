/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const Encryption = require('./utils/Encryption');

/**
 * Informacion de participantes, aqui se almacena la informacion de certificados
 * o campos que se pide a usuarios de didi se utiliza para carga automatica de datos
 * al generar certificados (tanto carga por qr como por pedido de certificado)
 */

const dataElement = {
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
};

const ParticipantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  did: {
    type: String,
    required: true,
  },
  data: [dataElement],
  templateId: String,
  requestCode: String,
  new: {
    type: Boolean,
    default: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

ParticipantSchema.index({ name: 1, templateId: 1, deleted: 1 });

// encriptar info
const _doEncryptData = async function _doEncryptData(data) {
  for (const dataElem of data) {
    await Encryption.setEncryptedData(dataElem, 'name', dataElem.name);
    await Encryption.setEncryptedData(dataElem, 'value', dataElem.value);
  }
};

// desencriptar info
const _doDecryptData = async function _doDecryptData(data) {
  for (const dataElem of data) {
    dataElem.name = await Encryption.decript(dataElem.name);
    dataElem.value = await Encryption.decript(dataElem.value);
  }
};

// encriptar valor
ParticipantSchema.methods.encryptData = async function encryptData() {
  await _doEncryptData(this.data);
};

// desencriptar valor
ParticipantSchema.methods.decryptData = async function decryptData() {
  await _doDecryptData(this.data);
};

// combina la info de participante con la recibida en "other" eliminando los duplicados
ParticipantSchema.methods.mergeData = function mergeData(other) {
  const acum = {};
  this.data.forEach((elem) => {
    acum[elem.name] = elem.value;
  });
  other.forEach((elem) => {
    acum[elem.name] = elem.value;
  });

  const result = [];
  for (const key of Object.keys(acum)) {
    result.push({ name: key, value: acum[key] });
  }

  this.data = result;
};

// modifica la info de participante
ParticipantSchema.methods.edit = async function edit(name, data) {
  await _doEncryptData(data);
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: {
      name,
      data,
    },
  };
  try {
    const participant = await Participant.findOneAndUpdate(updateQuery, updateAction);
    return Promise.resolve(participant);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// marca la info de participante como borrada
// eslint-disable-next-line func-names
ParticipantSchema.methods.delete = async function () {
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: { deleted: true },
  };

  try {
    await Participant.findOneAndUpdate(updateQuery, updateAction);
    this.deleted = true;
    return Promise.resolve(this);
  } catch (err) {
    return Promise.reject(err);
  }
};

const Participant = mongoose.model('Participant', ParticipantSchema);
module.exports = Participant;

/**
 * uarda nueva info de participante
 * o modifica el existente de ya existir uno con el mismo modelo de certificado (templateId)
 */
Participant.generate = async function generate(name, did, data, templateId, code) {
  let participant;
  try {
    const query = { did, templateId, deleted: false };
    participant = await Participant.findOne(query);

    if (!participant) {
      participant = new Participant();
      participant.did = did;
      participant.new = data.length === 0;
      participant.requestCode = code;
      participant.name = name;
      participant.templateId = templateId;
      participant.createdOn = new Date();
      participant.deleted = false;

      await _doEncryptData(data);
      participant.data = data;
    } else {
      participant.requestCode = code;
      participant.new = participant.data.length === 0;

      await participant.decryptData();
      participant.mergeData(data);
      await participant.encryptData();
    }

    participant = await participant.save();
    return Promise.resolve(participant);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * obtiene la info de participante por numero de pedido
 * (para hacer pulling en qr)
 */
Participant.getByRequestCode = async function getByRequestCode(requestCode) {
  try {
    const query = { requestCode, new: false, deleted: false };
    const participants = await Participant.find(query);
    if (participants.length) {
      const participant = participants[0];
      await participant.decryptData();
      return Promise.resolve(participant);
    }
    return Promise.resolve(undefined);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * retorna un objeto con todos los dids sobre los que se tiene info
 * y los nombres de los usuarios asociados a los mismos
 */
Participant.getAllDids = async function getAllDids() {
  const query = { deleted: false };
  const participants = await Participant.find(query);

  const result = {};
  participants.forEach((part) => {
    result[part.did] = part.name;
  });
  return Promise.resolve(result);
};

/**
 *  retorna la data de participantes global, la referida a certificados conocidos
 *  (tel, mail, info personal y dirección)
 */
Participant.getGlobalParticipants = async function getGlobalParticipants() {
  const queryGlobal = { templateId: { $exists: false }, deleted: false };
  const globalParticipants = await Participant.find(queryGlobal);
  for (const part of globalParticipants) {
    await part.decryptData();
  }
  return Promise.resolve(globalParticipants);
};

// retorna la data de participantes referida a un modelo de certificados particular
Participant.getAllByTemplateId = async function getAllByTemplateId(templateId) {
  try {
    const query = {
      templateId: ObjectId(templateId),
      /* "data.0": { $exists: true }, */
      deleted: false,
    };
    const participants = await Participant.find(query);
    for (const part of participants) {
      await part.decryptData();
    }

    const queryGlobal = {
      templateId: { $exists: false },
      /* "data.0": { $exists: true }, */
      deleted: false,
    };
    const globalParticipants = await Participant.find(queryGlobal);
    for (const part of globalParticipants) {
      await part.decryptData();
    }

    for (const globalPart of globalParticipants) {
      for (const part of participants) {
        if (global.did === part.did) globalPart.mergeData(part.data);
      }
    }

    participants.forEach((part) => {
      if (!globalParticipants.find((globalPart) => globalPart.did === part.did)) globalParticipants.push(part);
    });

    return Promise.resolve(globalParticipants);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// retorna la data de participante a partir de su did
Participant.getByDid = async function getByDid(did) {
  try {
    const query = { did, deleted: false };
    const participants = await Participant.find(query);
    if (participants.length === 0) return Promise.resolve([]);

    if (participants.length === 1) {
      const part = participants[0];
      await part.decryptData();
      return Promise.resolve(part);
    }

    const result = participants[0];
    await result.decryptData();
    for (let i = 1; i < participants.length; i++) {
      const part = participants[i];
      await part.decryptData();
      result.mergeData(participants[i].data);
    }

    return Promise.resolve(result);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// retorna la data de participante a partir del id
Participant.getById = async function getById(id) {
  try {
    const query = { _id: ObjectId(id), deleted: false };
    const participant = await Participant.findOne(query);
    await participant.decryptData();
    return Promise.resolve(participant);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
