/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
// General
const DEBUGG = process.env.DEBUGG_MODE == 'true';
const ENABLE_INSECURE_ENDPOINTS = process.env.ENABLE_INSECURE_ENDPOINTS == 'true';
const {
  VERSION, NAME, ISSUER_API_URL, ADDRESS,
  PORT, FULL_URL, RSA_PRIVATE_KEY, HASH_SALT, DIDI_API,
} = process.env;

if (DEBUGG == null || DEBUGG == '') throw new Error('No esta definida la varibale DEBUGG_MODE');
if (VERSION == null || VERSION == '') throw new Error('No esta definida la varibale VERSION');
if (NAME == null || NAME == '') throw new Error('No esta definida la varibale NAME');
if (ISSUER_API_URL == null || ISSUER_API_URL == '') throw new Error('No esta definida la varibale ISSUER_API_URL');
if (ADDRESS == null || ADDRESS == '') throw new Error('No esta definida la varibale ADDRESS');
if (PORT == null || PORT == '') throw new Error('No esta definida la varibale PORT');
if (FULL_URL == null || FULL_URL == '') throw new Error('No esta definida la varibale FULL_URL');
if (RSA_PRIVATE_KEY == null || RSA_PRIVATE_KEY == '') throw new Error('No esta definida la varibale RSA_PRIVATE_KEY');
if (HASH_SALT == null || HASH_SALT == '') throw new Error('No esta definida la varibale HASH_SALT');
if (DIDI_API == null || DIDI_API == '') throw new Error('No esta definida la varibale DIDI_API');

// Blockchain
const DELEGATE_DURATION = process.env.BLOCK_CHAIN_DELEGATE_DURATION || '1300000';
const SET_ATTRIBUTE = process.env.BLOCK_CHAIN_SET_ATTRIBUTE || '999999999';
const GAS_INCREMENT = process.env.GAS_INCREMENT || '1.1';

const {
  BLOCKCHAIN_URL_MAIN, BLOCKCHAIN_URL_RSK, BLOCKCHAIN_URL_LAC, BLOCKCHAIN_URL_BFA,
  BLOCKCHAIN_CONTRACT_MAIN, BLOCKCHAIN_CONTRACT_RSK, BLOCKCHAIN_CONTRACT_LAC,
  BLOCKCHAIN_CONTRACT_BFA,
} = process.env;

if (BLOCKCHAIN_URL_MAIN == null || BLOCKCHAIN_URL_MAIN == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_MAIN');
if (BLOCKCHAIN_URL_RSK == null || BLOCKCHAIN_URL_RSK == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_RSK');
if (BLOCKCHAIN_URL_LAC == null || BLOCKCHAIN_URL_LAC == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_LAC');
if (BLOCKCHAIN_URL_BFA == null || BLOCKCHAIN_URL_BFA == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_BFA');

if (BLOCKCHAIN_CONTRACT_MAIN == null || BLOCKCHAIN_CONTRACT_MAIN == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_MAIN');
if (BLOCKCHAIN_CONTRACT_RSK == null || BLOCKCHAIN_CONTRACT_RSK == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_RSK');
if (BLOCKCHAIN_CONTRACT_LAC == null || BLOCKCHAIN_CONTRACT_LAC == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_LAC');
if (BLOCKCHAIN_CONTRACT_BFA == null || BLOCKCHAIN_CONTRACT_BFA == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_BFA');

// MongoDB
const MONGO_USER = process.env.MONGO_USERNAME;
const {
  MONGO_DIR, MONGO_PASSWORD, MONGO_DB, MONGO_PORT, MONGO_URI,
} = process.env;
let MONGO_URL;

if (!MONGO_URI) {
  if (MONGO_DIR == null || MONGO_DIR == '') throw new Error('No esta definida la varibale MONGO_DIR');
  if (MONGO_USER == null || MONGO_USER == '') throw new Error('No esta definida la varibale MONGO_USER');
  if (MONGO_PASSWORD == null || MONGO_PASSWORD == '') throw new Error('No esta definida la varibale MONGO_PASSWORD');
  if (MONGO_DB == null || MONGO_DB == '') throw new Error('No esta definida la varibale MONGO_DB');
  if (MONGO_PORT == null || MONGO_PORT == '') throw new Error('No esta definida la varibale MONGO_PORT');
  const URL = `${MONGO_DIR}:${MONGO_PORT}/${MONGO_DB}`;
  MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${URL}`;
} else {
  MONGO_URL = MONGO_URI;
}

// ETHR
const { ISSUER_SERVER_DID, ISSUER_SERVER_PRIVATE_KEY } = process.env;

if (ISSUER_SERVER_DID == null || ISSUER_SERVER_DID == '') throw new Error('No esta definida la varibale ISSUER_SERVER_DID');
if (ISSUER_SERVER_PRIVATE_KEY == null || ISSUER_SERVER_PRIVATE_KEY == '') throw new Error('No esta definida la varibale ISSUER_SERVER_PRIVATE_KEY');

// Application insigths
const DISABLE_TELEMETRY_CLIENT = process.env.DISABLE_TELEMETRY_CLIENT === 'true';
const { APP_INSIGTHS_IKEY } = process.env;

if (APP_INSIGTHS_IKEY == null || APP_INSIGTHS_IKEY == '') throw new Error('No esta definida la varibale APP_INSIGTHS_IKEY');

const PROVIDER_CONFIG = {
  networks: [
    {
      name: 'mainnet',
      rpcUrl: BLOCKCHAIN_URL_MAIN,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'lacchain',
      rpcUrl: BLOCKCHAIN_URL_LAC,
      registry: BLOCKCHAIN_CONTRACT_LAC,
    },
    {
      name: 'bfa',
      rpcUrl: BLOCKCHAIN_URL_BFA,
      registry: BLOCKCHAIN_CONTRACT_BFA,
    },
    {
      name: 'rsk',
      rpcUrl: BLOCKCHAIN_URL_RSK,
      registry: BLOCKCHAIN_CONTRACT_RSK,
    },
  ],
};

const USER_TYPES = {
  Admin: 'Admin',

  // Permisos para Templates
  Read_Templates: 'Read_Templates',
  Write_Templates: 'Write_Templates',
  Delete_Templates: 'Delete_Templates',

  // Permisos para Certificados
  Read_Certs: 'Read_Certs',
  Write_Certs: 'Write_Certs',
  Delete_Certs: 'Delete_Certs',

  // Permisos para Delegaciones
  Read_Delegates: 'Read_Delegates',
  Write_Delegates: 'Write_Delegates',

  // Permisos para Registro de DIDs
  Read_Dids_Registers: 'Read_Dids_Registers',
  Write_Dids_Registers: 'Write_Dids_Registers',

  // Permisos para Perfiles
  Read_Profiles: 'Read_Profiles',
  Write_Profiles: 'Write_Profiles',
  Delete_Profiles: 'Delete_Profiles',

  // Permisos para Usuarios
  Read_Users: 'Read_Users',
  Write_Users: 'Write_Users',
  Delete_Users: 'Delete_Users',
};

const {
  Admin,
  Read_Templates,
  Write_Templates,
  Delete_Templates,
  Read_Certs,
  Write_Certs,
  Delete_Certs,
  Read_Delegates,
  Write_Delegates,
  Read_Dids_Registers,
  Write_Dids_Registers,
  Read_Profiles,
  Write_Profiles,
  Delete_Profiles,
  Read_Users,
  Write_Users,
  Delete_Users,
} = USER_TYPES;

const ALLOWED_ROLES = {
  Admin: [Admin],

  // Permisos para Templates
  Read_Templates: [Read_Templates, Write_Templates, Delete_Templates, Write_Certs, Read_Certs],
  Write_Templates: [Write_Templates],
  Delete_Templates: [Delete_Templates],

  // Permisos para Certificados
  Read_Certs: [Read_Certs, Write_Certs, Delete_Certs],
  Write_Certs: [Write_Certs],
  Delete_Certs: [Delete_Certs],

  // Permisos para Delegaciones
  Read_Delegates: [Read_Delegates, Write_Delegates],
  Write_Delegates: [Write_Delegates],

  // Permisos para Registro de DIDs
  Read_Dids_Registers: [Read_Dids_Registers, Write_Dids_Registers, Read_Certs, Write_Certs],
  Write_Dids_Registers: [Write_Dids_Registers],

  // Permisos para Perfiles
  Read_Profiles: [Read_Profiles, Write_Profiles, Delete_Profiles, Read_Users, Write_Users],
  Write_Profiles: [Write_Profiles],
  Delete_Profiles: [Delete_Profiles],

  // Permisos para Usuarios
  Read_Users: [Read_Users, Write_Users, Delete_Users],
  Write_Users: [Write_Users],
  Delete_Users: [Delete_Users],
};

const USER_CREATED_TYPES = Object.keys(USER_TYPES).filter((r) => r !== Admin);

const BLOCKCHAIN_MANAGER_MESSAGES = {
  signatureInvalid: 'Signature invalid for JWT',
  invalidEthrDid: 'Not a valid ethr DID',
};

const BLOCKCHAIN_MANAGER_CODES = {
  [BLOCKCHAIN_MANAGER_MESSAGES.signatureInvalid]: 'INVALID_PRIVATE_KEY',
  [BLOCKCHAIN_MANAGER_MESSAGES.invalidEthrDid]: 'INVALID_DID',
};

const CERT_FIELD_TYPES = {
  Text: 'Text',
  Paragraph: 'Paragraph',
  Date: 'Date',
  Number: 'Number',
  Boolean: 'Boolean',
  Checkbox: 'Checkbox',
};

const CERT_CATEGORY_TYPES = ['EDUCACION', 'FINANZAS', 'VIVIENDA', 'IDENTIDAD', 'BENEFICIOS', 'LABORAL'];
const CERT_CATEGORY_MAPPING = {
  EDUCACION: 'education',
  FINANZAS: 'finance',
  VIVIENDA: 'livingPlace',
  IDENTIDAD: 'identity',
  BENEFICIOS: 'benefit',
  LABORAL: 'work',
};

const BLOCKCHAINS = ['rsk', 'lacchain', 'bfa'];

const STATUS = {
  CREATING: 'Creando',
  DONE: 'Creado',
  ERROR: 'Error',
  ERROR_RENEW: 'Error al Renovar',
  REVOKED: 'Revocado',
  REVOKING: 'Revocando',
};

const STATUS_ALLOWED = Object.values(STATUS);

const BLOCK_CHAIN_DEFAULT = 'rsk';

module.exports = {
  VERSION,
  API_VERSION: '1.0',
  DEBUGG,

  VALIDATION_TYPES: {
    TOKEN_MATCHES_USER_ID: 'tokenMatchesUserId',
    IS_ARRAY: 'isArray',
    IS_STRING: 'isString',
    IS_BOOLEAN: 'isBoolean',
    IS_PASSWORD: 'isPassword',
    IS_CERT_DATA: 'isCertData',
    IS_PART_DATA: 'isPartData',
    IS_TEMPLATE_DATA: 'isTemplateData',
    IS_TEMPLATE_DATA_TYPE: 'isTemplateDataType',
    IS_TEMPLATE_DATA_VALUE: 'isTemplateDataValue',
    IS_TEMPLATE_PREVIEW_DATA: 'isTemplatePreviewData',
    IS_CERT_MICRO_CRED_DATA: 'isCertMicroCredData',
    IS_NEW_PARTICIPANTS_DATA: 'isNewParticipantsData',
  },

  DATA_TYPES: {
    CERT: 'cert',
    OTHERS: 'others',
    PARTICIPANT: 'participant',
  },

  TYPE_MAPPING: {
    Email: 'Email',
    Telefono: 'Phone',
    Dni: 'dni',
    Nacionalidad: 'nationality',
    Nombres: 'names',
    Apellidos: 'lastNames',
    Direccion: 'streetAddress',
    Calle: 'numberStreet',
    Piso: 'floor',
    Departamento: 'department',
    'Codigo Zip': 'zipCode',
    // Ciudad: "city",
    // Municipalidad: "municipality",
    // Provincia: "province",
    Pais: 'country',
  },

  COMMON_PASSWORDS: ['123456', 'contraseña', 'password'],
  PASSWORD_MIN_LENGTH: 6,
  SALT_WORK_FACTOR: 16,

  PREVIEW_ELEMS_LENGTH: {
    1: 2,
    2: 4,
    3: 6,
    4: 6,
  },

  USER_TYPES,
  USER_CREATED_TYPES,

  CERT_CATEGORY_MAPPING,
  CERT_CATEGORY_TYPES,

  ALLOWED_ROLES,

  CERT_FIELD_TYPES,
  CERT_FIELD_MANDATORY: {
    DID: 'DID',
    NAME: 'CREDENCIAL',
    FIRST_NAME: 'NOMBRE',
    LAST_NAME: 'APELLIDO',
    EXPIRATION_DATE: 'EXPIRATION DATE',
  },

  CREDENTIALS: {
    TYPES: {
      VERIFIABLE: 'VerifiableCredential',
    },
    CONTEXT: 'https://www.w3.org/2018/credentials/v1',
  },

  BLOCKCHAIN: {
    PROVIDER_CONFIG,
    GAS_INCREMENT,
    URL: BLOCKCHAIN_URL_MAIN,
    CONTRACT: BLOCKCHAIN_CONTRACT_MAIN,
    DELEGATE_DURATION,
    SET_ATTRIBUTE,
  },

  BLOCKCHAINS,
  STATUS,
  STATUS_ALLOWED,
  RSA_PRIVATE_KEY,
  HASH_SALT,

  DIDI_API,

  ISSUER_SERVER_DID,
  ISSUER_SERVER_PRIVATE_KEY,
  NAME,
  ISSUER_API_URL,
  MONGO_URL,
  PORT,
  ADDRESS,
  FULL_URL,

  ENABLE_INSECURE_ENDPOINTS,

  BLOCK_CHAIN_DEFAULT,

  BLOCKCHAIN_MANAGER_MESSAGES,
  BLOCKCHAIN_MANAGER_CODES,

  DISABLE_TELEMETRY_CLIENT,
  APP_INSIGTHS_IKEY,
};
