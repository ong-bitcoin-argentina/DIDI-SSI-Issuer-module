import React from "react";

import Messages from "./Messages";
import { Edit, Delete, AssignmentTurnedIn, Visibility, AssignmentLate } from "@material-ui/icons";

const { LAST_NAME, NAME } = Messages.LIST.TABLE;
const { EMMIT, DELETE, EDIT, VIEW, REVOKE } = Messages.LIST.BUTTONS;

export const PENDING_ACTIONS = ({ cert, onEmmit, onEdit, onDelete, enabled }) => [
	{
		className: "EditAction",
		action: () => onEdit(cert._id),
		label: VIEW,
		enabled: enabled,
		iconComponent: <Visibility fontSize="medium" />
	},
	{
		className: "EmmitAction",
		action: () => onEmmit(cert._id),
		label: EMMIT,
		enabled: !enabled,
		iconComponent: <AssignmentTurnedIn fontSize="medium" />
	},
	{
		className: "EditAction",
		action: () => onEdit(cert._id),
		label: EDIT,
		enabled: !enabled,
		iconComponent: <Edit fontSize="medium" />
	},
	{
		className: "DeleteAction",
		action: () => onDelete(cert._id),
		label: DELETE,
		enabled: !enabled,
		iconComponent: <Delete fontSize="medium" />
	}
];

export const EMMITED_ACTIONS = ({ cert, onView, onRevoke, enabled }) => [
	{
		className: "EditAction",
		action: () => onView(cert._id),
		iconComponent: <Visibility fontSize="medium" />,
		label: VIEW,
		enabled: enabled
	},
	{
		className: "EditAction",
		action: () => onView(cert._id),
		iconComponent: <Visibility fontSize="medium" />,
		label: VIEW,
		enabled: !enabled
	},
	{
		className: "DeleteAction",
		action: () => onRevoke(cert),
		iconComponent: <AssignmentLate fontSize="medium" />,
		label: REVOKE,
		enabled: !enabled
	}
];

export const REVOKED_ACTIONS = ({ cert, onView }) => [
	{
		className: "EditAction",
		action: () => onView(cert._id),
		iconComponent: <Visibility fontSize="medium" />,
		label: VIEW
	}
];

export const BASE_COLUMNS = [
	{
		label: LAST_NAME,
		accessor: "lastName"
	},
	{
		label: NAME,
		accessor: "firstName"
	}
];

export const EMMITED_COLUMNS = ({ onLastNameFilterChange, onFirstNameFilterChange }) => [
	{
		label: LAST_NAME,
		action: e => onLastNameFilterChange(e),
		accessor: "lastName"
	},
	{
		label: NAME,
		action: e => onFirstNameFilterChange(e),
		accessor: "firstName"
	}
];

export const REVOCATION_REASONS_PLAIN = {
	EXPIRATION: "Expiración",
	UNLINKING: "Desvinculación",
	DATA_MODIFICATION: "Modificación de datos",
	REPLACEMENT: "Reemplazo",
	OTHER: "Otro"
};

export const REVOCATION_REASONS = Object.keys(REVOCATION_REASONS_PLAIN).map(key => ({
	label: REVOCATION_REASONS_PLAIN[key],
	value: key
}));
