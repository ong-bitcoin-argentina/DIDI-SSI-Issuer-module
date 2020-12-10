import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Visibility from "@material-ui/icons/Visibility";

import Messages from "../../../constants/Messages";

import Constants from "../../../constants/Constants";
import { validateAccess } from "../../../constants/Roles";

const { Write_Templates, Delete_Templates } = Constants.ROLES;

class TemplateTableHelpers {
	// genera las columnas de la tabla de modelos de credenciales
	static getTemplateData(template, onEdit, onDelete, isLoading) {
		return {
			_id: template._id,
			name: template.name,
			blockchain: <div style={{ textTransform: "uppercase", textAlign: "center" }}>{template.blockchain ?? "-"}</div>,
			actions: (
				<div className="Actions">
					<div
						className="EditAction"
						onClick={() => {
							if (!isLoading()) onEdit(template._id);
						}}
					>
						{!validateAccess(Write_Templates) ? <Visibility fontSize="medium" /> : <EditIcon fontSize="medium" />}
					</div>
					{validateAccess(Delete_Templates) && (
						<div
							className="DeleteAction"
							onClick={() => {
								if (!isLoading()) onDelete(template._id);
							}}
						>
							<DeleteIcon fontSize="medium" />
							{/* {Messages.LIST.BUTTONS.DELETE} */}
						</div>
					)}
				</div>
			)
		};
	}

	// genera los headers para las columnas de la tabla de modelos de credenciales
	static getTemplateColumns() {
		return [
			{
				Header: Messages.LIST.TABLE.TEMPLATE,
				accessor: "name"
			},
			{
				Header: "Blockchain",
				accessor: "blockchain"
			},
			{
				Header: "",
				accessor: "actions"
			}
		];
	}
}

export default TemplateTableHelpers;
