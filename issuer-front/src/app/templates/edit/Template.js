import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Template.scss";

import Cookie from "js-cookie";
import MaterialIcon from "material-icons-react";

import DataRenderer from "../../utils/DataRenderer";

import TemplateService from "../../../services/TemplateService";
import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

class Template extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			typingTimeout: 0,
			typing: false,
			isDialogOpen: false,
			radioValue: 1,
			previewFields: [],
			options: [],
			dataType: Constants.TEMPLATES.TYPES.TEXT
		};
	}

	// cargar template
	componentDidMount() {
		const splitPath = this.props.history.location.pathname.split("/");
		const id = splitPath[splitPath.length - 1];
		const token = Cookie.get("token");

		const self = this;
		this.setState({ loading: true });
		TemplateService.get(
			token,
			id,
			async function(template) {
				self.setState({
					id: id,
					isDialogOpen: false,
					template: template,
					radioValue: template.previewType,
					previewFields: template.previewData,
					loading: false
				});
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

	// volver a listado de certificados
	onBack = () => {
		this.props.history.push(Constants.ROUTES.TEMPLATES);
	};

	// volver a login
	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	// agregar campo al template con la info proveniente del dialogo
	createField = () => {
		const token = Cookie.get("token");
		const self = this;
		const id = this.state.id;
		const type = this.state.type;
		const data = {
			name: this.state.name,
			type: this.state.dataType,
			required: this.state.required,
			options: this.state.options.length ? this.state.options : []
		};

		this.setState({ loading: true });
		TemplateService.createField(
			token,
			id,
			data,
			type,
			async function(template) {
				self.setState({ template: template, loading: false, isDialogOpen: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// marcar campo como requerido / no requerido
	toggleRequired = (data, type) => {
		const id = this.state.id;
		const token = Cookie.get("token");
		const self = this;

		this.setState({ loading: true });
		TemplateService.toggleRequired(
			token,
			id,
			data,
			type,
			async function(template) {
				self.setState({ template: template, loading: false, error: undefined });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// arrancar un timer y cambiar valor por defecto del campo cuando se cumpla el mismo
	// (dar tiempo a que el usuario cambie su input)
	defaultValueChanged = (data, defaultValue, type) => {
		const self = this;
		if (self.state.typingTimeout) {
			clearTimeout(self.state.typingTimeout);
		}

		data.defaultValue = defaultValue;

		self.setState({
			typing: false,
			typingTimeout: setTimeout(function() {
				self.setDefaultValue(data, defaultValue, type);
			}, Constants.TEMPLATES.EDIT.TYPING_TIMEOUT)
		});
	};

	// cambiar valor por defecto del campo
	setDefaultValue = (data, defaultValue, type) => {
		const id = this.state.id;
		const token = Cookie.get("token");
		const self = this;

		TemplateService.setDefaultField(
			token,
			id,
			data,
			defaultValue,
			type,
			async function(template) {
				self.setState({ template: template, isDialogOpen: false, error: undefined });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// seleccionar los campos a mostrarse por defecto en el certificado
	setPreviewFields = (previewElems, type) => {
		const id = this.state.id;
		const token = Cookie.get("token");
		const self = this;

		TemplateService.setPreviewFields(
			token,
			id,
			previewElems,
			type,
			async function(template) {
				self.setState({ template: template });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	onPreviewFieldsSelected = event => {
		const previewElems = event.target.value;

		if (previewElems.length === Constants.TEMPLATES.PREVIEW_ELEMS_LENGTH[this.state.radioValue])
			this.setPreviewFields(previewElems, this.state.radioValue);

		this.setState({ previewFields: previewElems });
	};

	// borrar campo
	deleteField = (data, type) => {
		const id = this.state.id;
		const token = Cookie.get("token");
		const self = this;

		this.setState({ loading: true });
		TemplateService.deleteField(
			token,
			id,
			data,
			type,
			async function(template) {
				self.setState({ template: template, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// abrir dialogo para insercion de campo en el template
	onDialogOpen = type =>
		this.setState({
			isDialogOpen: true,
			name: "",
			type: type,
			dataType: Constants.TEMPLATES.TYPES.TEXT,
			options: [],
			required: false
		});

	// cerrar dialogo para insercion de campo en el template
	onDialogClose = () => this.setState({ isDialogOpen: false });

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}
		const loading = this.state.loading;
		return (
			<div className="Template">
				{this.renderDialog()}
				{!loading && this.renderTemplateType()}
				{!loading && this.renderTemplate()}
				{this.renderButtons()}
				<div className="errMsg">{this.state.error && this.state.error.message}</div>
			</div>
		);
	}

	renderDialog = () => {
		const isCheckbox = this.state.dataType === Constants.TEMPLATES.TYPES.CHECKBOX;
		return (
			<Dialog open={this.state.isDialogOpen} onClose={this.onDialogClose} aria-labelledby="form-dialog-title">
				<DialogTitle className="DialogTitle">{Messages.EDIT.DIALOG.TITLE}</DialogTitle>
				<DialogContent>
					{this.renderDialogName()}
					{isCheckbox && this.renderDialogCheckbox()}
					{this.renderDialogTypes()}
					{this.renderDialogRequired()}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={this.createField}
						disabled={
							!this.state.name ||
							(this.state.dataType === Constants.TEMPLATES.TYPES.CHECKBOX && !this.state.options.length)
						}
						color="primary"
					>
						{Messages.EDIT.DIALOG.CREATE}
					</Button>
					<Button onClick={this.onDialogClose} color="primary">
						{Messages.EDIT.DIALOG.CLOSE}
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	renderDialogName = () => {
		return (
			<TextField
				autoFocus
				margin="dense"
				id="name"
				label={Messages.EDIT.DIALOG.NAME}
				type="text"
				onChange={event => this.setState({ name: event.target.value })}
				fullWidth
			/>
		);
	};

	renderDialogRequired = () => {
		return (
			<div id="Required">
				<input
					className="RequiredInput"
					type="checkbox"
					onChange={event => {
						this.setState({ required: event.target.checked });
					}}
				></input>
				<div className="RequiredText">{Messages.EDIT.DIALOG.REQUIRED}</div>
			</div>
		);
	};

	renderDialogTypes = () => {
		return (
			<div id="Types">
				<InputLabel>{Messages.EDIT.DIALOG.TYPES}</InputLabel>
				<Select
					className={"DialogTypeDropdown"}
					autoFocus
					value={this.state.dataType}
					onChange={event => {
						this.setState({ dataType: event.target.value });
					}}
				>
					{Object.values(Constants.TEMPLATES.TYPES).map((type, key) => {
						return (
							<MenuItem value={type} key={"type-" + key}>
								{type}
							</MenuItem>
						);
					})}
				</Select>
			</div>
		);
	};

	renderDialogCheckbox = () => {
		return (
			<div>
				<div id="Options">
					<TextField
						autoFocus
						margin="dense"
						id="option"
						label={Messages.EDIT.DIALOG.OPTION}
						type="text"
						onChange={event => this.setState({ option: event.target.value })}
						fullWidth
					/>

					<div
						id="OptionAdd"
						onClick={() => {
							this.state.options.push(this.state.option);
							this.setState({ options: this.state.options, option: "" });
						}}
					>
						<MaterialIcon id="AddOptionIcon" icon={Constants.TEMPLATES.EDIT.ICONS.ADD_OPTION} color={"#3f51b5"} />
					</div>
				</div>

				{this.state.options.map((op, key) => {
					return (
						<div key={"opt-" + key}>
							{op}

							<MaterialIcon
								id="DeleteIcon"
								icon={Constants.TEMPLATES.EDIT.ICONS.REMOVE_OPTION}
								color={"rgb(235, 70, 70)"}
								onClick={() => {
									this.state.options.splice(key, 1);
									this.setState({ options: this.state.options, option: "" });
								}}
							/>
						</div>
					);
				})}
			</div>
		);
	};

	renderTemplateType = () => {
		const template = this.state.template;
		const templateElements = template.data.cert
			.concat(template.data.others)
			.concat(template.data.participant)
			.filter(elemData => elemData.required)
			.map(elementData => elementData.name);

		const missing = Constants.TEMPLATES.PREVIEW_ELEMS_LENGTH[this.state.radioValue] - this.state.previewFields.length;
		const radioValue = this.state.radioValue;

		return (
			<div className="Template-Type">
				<h2 className="DataTitle">{"CAMPOS A PREVISUALIZAR"}</h2>

				<RadioGroup
					className="PreviewFieldTypePicker"
					aria-label="gender"
					name="gender1"
					value={this.state.radioValue}
					onChange={event => {
						this.setState({ radioValue: event.target.value });
					}}
				>
					<div className="PreviewFieldItem">
						<FormControlLabel value="1" checked={radioValue === "1"} control={<Radio />} />
						<img src={require("./Preview/1.png")} className="PreviewFieldTypeImage" alt="type 1" />
					</div>

					<div className="PreviewFieldItem">
						<FormControlLabel value="2" checked={radioValue === "2"} control={<Radio />} />
						<img src={require("./Preview/2.png")} className="PreviewFieldTypeImage" alt="type 2" />
					</div>

					<div className="PreviewFieldItem">
						<FormControlLabel value="3" checked={radioValue === "3"} control={<Radio />} />
						<img src={require("./Preview/3.png")} className="PreviewFieldTypeImage" alt="type 3" />
					</div>

					<div className="PreviewFieldItem">
						<FormControlLabel value="4" checked={radioValue === "4"} control={<Radio />} />
						<img src={require("./Preview/1.png")} className="PreviewFieldTypeImage" alt="type 4" />
					</div>

					<div className="PreviewFieldItem">
						<FormControlLabel value="5" checked={radioValue === "5"} control={<Radio />} />
						<img src={require("./Preview/2.png")} className="PreviewFieldTypeImage" alt="type 5" />
					</div>

					<div className="PreviewFieldItem">
						<FormControlLabel value="6" checked={radioValue === "6"} control={<Radio />} />
						<img src={require("./Preview/3.png")} className="PreviewFieldTypeImage" alt="type 6" />
					</div>
				</RadioGroup>

				<Select
					className="PreviewFieldsSelect"
					multiple
					displayEmpty
					value={this.state.previewFields}
					onChange={this.onPreviewFieldsSelected}
					renderValue={selected => selected.join(", ")}
				>
					{templateElements.map((elem, key) => {
						return (
							<MenuItem key={"PreviewFields-" + key} value={elem}>
								<Checkbox checked={this.state.previewFields.indexOf(elem) > -1} />
								<ListItemText primary={elem} />
							</MenuItem>
						);
					})}
				</Select>

				{missing > 0 && <div>Seleccione {missing} mas</div>}
				{missing < 0 && <div>Agrego de mas, quite {-1 * missing}</div>}
			</div>
		);
	};

	renderTemplate = () => {
		const template = this.state.template;
		return (
			<div className="Template-Content">
				{this.renderSection(Messages.EDIT.DATA.CERT, template.data.cert, Constants.TEMPLATES.DATA_TYPES.CERT)}
				{this.renderSection(
					Messages.EDIT.DATA.PART,
					template.data.participant,
					Constants.TEMPLATES.DATA_TYPES.PARTICIPANT
				)}
				{this.renderSection(Messages.EDIT.DATA.OTHER, template.data.others, Constants.TEMPLATES.DATA_TYPES.OTHERS)}
			</div>
		);
	};

	renderSection = (title, data, type) => {
		return (
			<div className="TemplateSectionContent">
				<h2 className="DataTitle">{title}</h2>
				{data.map((dataElem, index) => {
					return (
						<div className="Data" key={"template-elem-" + index}>
							<div className="DataName">{dataElem.name}</div>
							<div className="DataElem">
								{DataRenderer.renderData(dataElem, type, true, this.defaultValueChanged)}
								{DataRenderer.renderRequired(dataElem, type, this.toggleRequired)}
								{DataRenderer.renderDelete(dataElem, type, this.deleteField)}
							</div>
						</div>
					);
				})}
				{this.renderSectionButtons(type)}
			</div>
		);
	};

	renderSectionButtons = type => {
		return (
			<button
				className="AddButton"
				onClick={() => {
					this.onDialogOpen(type);
				}}
			>
				<div className="AddButton">
					<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
					<div className="AddButtonText">{Messages.EDIT.BUTTONS.CREATE}</div>
				</div>
			</button>
		);
	};

	renderButtons = () => {
		return (
			<div className="TemplateButtons">
				<button className="BackButton" onClick={this.onBack}>
					{Messages.EDIT.BUTTONS.BACK}
				</button>
				<button className="LogoutButton" onClick={this.onLogout}>
					{Messages.EDIT.BUTTONS.EXIT}
				</button>
			</div>
		);
	};
}

export default withRouter(Template);
