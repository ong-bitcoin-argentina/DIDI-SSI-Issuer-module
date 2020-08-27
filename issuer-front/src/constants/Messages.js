module.exports = {
	LOGIN: {
		WELCOME: "Bienvenido al",
		WELCOME_2: "Emisor de Certificados Web",
		BUTTONS: {
			ENTER: "Ingresar"
		}
	},
	EDIT: {
		DATA: {
			PREVIEW: "CAMPOS A PREVISUALIZAR",
			CATEGORIES: "CATEGORIA DEL CERTIFICADO",
			CERT: "DATOS DEL CERTIFICADO",
			PART: "DATOS DEL PARTICIPANTE",
			OTHER: "OTROS DATOS",

			MICRO_CRED_NAME: "NOMBRE DE LA MICRO",
			MICRO_CRED_FIELDS: "CAMPOS DE LA MICRO"
		},
		DIALOG: {
			QR: {
				REQUEST_SENT: "Pedido enviado",
				LOAD_BY_QR: "Cargar participante con código Qr",
				LOADED_BY_QR: name => {
					return "Participante " + name + " cargado.";
				},
				DIDS_TITLE: "DIDS Cargados:"
			},
			PARTICIPANT: {
				TITLE: "Agregar Participante",
				NAME: "Participante",
				CREATE: "Agregar",
				CLOSE: "Cerrar"
			},
			FIELD: {
				TITLE: "Agregar Campo",
				OPTION: "Opcion",
				REQUIRED: "Requerido",
				TYPES: "Tipo",
				NAME: "Nombre",
				CREATE: "Crear",
				CLOSE: "Cerrar"
			}
		},
		BUTTONS: {
			LOAD_DIDS_FROM_CSV: "Cargar Dids por CSV",
			ADD_MICRO_CRED_LABEL: "Agregar Micro",
			REMOVE_MICRO_CRED_LABEL: "Quitar Micro",
			ADD_MICRO_CRED: "+",
			REMOVE_MICRO_CRED: "-",
			REMOVE_PARTICIPANTS: "X",
			SAMPLE_PART_FROM_CSV: "Generar CSV",
			SAMPLE_CERT_FROM_CSV: "Generar CSV",
			LOAD_CERT_FROM_CSV: "Cargar con CSV",
			ADD_PARTICIPANTS: "Nuevo Participante",
			LOAD_PARTICIPANTS: "Cargar Participantes",
			RENAME_ISSUER: "Renombrar Emisor",
			CREATE: "NUEVO CAMPO",
			SEND: "Enviar",
			SAVE: "Guardar",
			CANCEL: "Cancelar",
			CLOSE: "Cerrar",
			BACK: "Volver",
			EXIT: "Salir",
			REQUIRED: "Requerido",
			DELETE: "Borrar"
		}
	},
	LIST: {
		MENU: {
			TITLE: "Menu"
		},
		DIALOG: {
			ISSUER_RENAME_TITLE: name => {
				return "Renombrar emisor (El nombre actual es '" + name + "'):";
			},
			DELETE_CONFIRMATION: "Esta seguro?",
			DELETE_CERT_TITLE: "Borrar Certificado",
			DELETE_TEMPLATE_TITLE: "Borrar Modelo",
			DELETE_DELEGATE_TITLE: "Borrar Delegado",
			REVOKE_CERT_TITLE: "Revocar Certificado",
			REVOKE_CONFIRMATION: "Esta seguro?",
			REVOKE: "Revocar",
			DELETE: "Borrar",
			CREATE_DELEGATE_TITLE: "Crear Delegado",
			CREATE_TEMPLATE_TITLE: "Crear Modelo",
			DID: "Did",
			NAME: "Nombre",
			CREATE: "Crear",
			CANCEL: "Cancelar",
			CLOSE: "Cerrar"
		},
		TABLE: {
			DID: "DID",
			HAS_TEL: "TELEFONO",
			HAS_MAIL: "MAIL",
			HAS_PERSONAL: "DATOS",
			HAS_PERSONAL2: "PERSONALES",
			HAS_ADDRESS: "DOMICILIO",
			TEMPLATE: "Modelo de Certificado",
			CERT: "CERTIFICADO",
			LAST_NAME: "APELLIDO",
			NAME: "NOMBRE",
			PREV: "ANTERIOR",
			NEXT: "SIGUIENTE",
			EMISSION_DATE: "FECHA DE",
			EMISSION_DATE2: "EMISION",
			SELECT: "SELECCIONAR",
			ACTIONS: "ACCIONES"
		},
		BUTTONS: {
			CREATE_DELEGATE: "Crear Delegado",
			DELEGATES: "Delegados",
			TO_QR: "Registrar Participante",
			TO_CERTIFICATES: "Certificados",
			TO_TEMPLATES: "Templates",
			CREATE_TEMPLATE: "Crear Modelo de Certificado",
			CREATE_CERT: "Emitir Certificado",
			EMMIT_SELECTED: "Emitir Seleccionados",
			EMMIT: "Emitir",
			VIEW: "Ver",
			EDIT: "Editar",
			DELETE: "Borrar",
			REVOKE: "Revocar",
			EXIT: "Salir"
		}
	},
	QR: {
		LOAD_SUCCESS: name => {
			return "USUARIO '" + name + "' CARGADO CON ÉXITO";
		},
		DID_SELECT: "DID",
		CERTIFICATE_SELECT: "CERTIFICADO A PEDIR",
		TEMPLATE_SELECT: "MODELO DE CERTIFICADO",
		TEMPLATE_PART_SELECT_MESSAGE: "Elige el usuario a el que se pediran los datos:",
		TEMPLATE_SELECT_MESSAGE: "Elige el modelo de certificado para el que se pediran los datos:",
		QR_MESSAGE_CERT: "O alternativamente ecanea el qr con la aplicacion para cargar los datos:",
		QR_MESSAGE: "Ecanear el qr con la aplicacion para cargar los datos requeridos por el modelo de certificado:",
		QR_PD: "Nota: Los datos obtenidos a partir del Qr seran accessibles solo para el modelo de certificado actual",
		FULL_NAME: "NOMBRE COMPLETO",
		BUTTONS: {
			REQUEST: "Pedir certificados",
			QR_LOAD: "Cargar por Qr",
			GENERATE: "Generar Qr"
		}
	}
};
