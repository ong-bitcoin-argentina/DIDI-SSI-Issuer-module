import React, { Component } from "react";

import Messages from "../../../constants/Messages";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import "./_Style.scss";
import "../../../styles/GeneralStyles.scss";
import { FormControl, Grid, InputLabel, Menu, MenuItem, Select } from "@material-ui/core";

export default class InputDialog extends Component {
	constructor(props) {
		super(props);

		const fields = {};
		this.props.fieldNames.forEach(fieldName => (fields[fieldName] = ""));

		this.state = {
			isOpen: false,
			fields: fields
		};
	}

	// generar referencia para abrirlo desde el padre
	componentDidMount() {
		this.props.onRef(this);
	}

	// borrar referencia
	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	// limpiar campos completados por el usuario
	cleanData = () => {
		const fields = this.state.fields;
		for (let key of Object.keys(this.state.fields)) {
			fields[key] = "";
		}

		this.setState({
			fields: fields
		});
	};

	// abrir dialogo
	open = () => {
		this.cleanData();
		this.setState({
			isOpen: true
		});
	};

	// cerrar dialogo
	close = () => {
		this.cleanData();
		this.setState({
			isOpen: false
		});
	};

	// actualiza campo
	updateField = (name, value) => {
		const fields = this.state.fields;
		fields[name] = value;
		this.setState({ fields: fields });
	};

	// retorna dialogo
	render = () => {
		const title = this.props.title;
		const onAccept = this.props.onAccept;
		const fieldNames = this.props.fieldNames;
		const selectNames = this.props.selectNames || [];
		const t = this.props.selectNames || [];
		return (
			<Dialog className="dialogBox" open={this.state.isOpen} onClose={this.close} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{title}</DialogTitle>
				<DialogContent>
					{fieldNames.length &&
						fieldNames.map((name, key) => {
							return (
								<TextField
									key={"field-" + key}
									autoFocus
									margin="dense"
									id={name}
									label={name}
									type="text"
									onChange={event => {
										this.updateField(name, event.target.value);
									}}
									fullWidth
								/>
							);
						})}
					{selectNames.length &&
						selectNames.map(({ name, label, options }, key) => {
							return (
								<Grid style={{ marginTop: "25px" }}>
									<InputLabel id={`${label}-select-label`}>{label}</InputLabel>
									<Select
										labelId={`${label}-select-label`}
										key={"select-" + key}
										id={name}
										name={name}
										defaultValue={options ? options[0] : undefined}
										label={label}
										onChange={event => {
											this.updateField(name, event.target.value);
										}}
										fullWidth
									>
										{options?.length &&
											options.map(({ name, _id }) => (
												<MenuItem key={_id} value={_id}>
													{name}
												</MenuItem>
											))}
									</Select>
								</Grid>
							);
						})}
				</DialogContent>
				<DialogActions>
					<Button className="CloseButton" onClick={this.close} color="primary">
						{Messages.LIST.DIALOG.CANCEL}
					</Button>
					<Button
						className="CreateModalButton"
						onClick={() => {
							onAccept(this.state.fields);
							this.close();
						}}
						disabled={Object.values(this.state.fields).indexOf("") >= 0}
						color="primary"
					>
						{Messages.LIST.DIALOG.CREATE}
					</Button>
				</DialogActions>
			</Dialog>
		);
	};
}
