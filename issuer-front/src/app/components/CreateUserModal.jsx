import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import PropTypes from "prop-types";
import ProfileService from "../../services/ProfileService";
import Cookie from "js-cookie";
import { CERT_FIELD_MANDATORY } from "../../constants/Constants";
import ModalTitle from "../utils/modal-title";

const TITLE = "Usuario";

const CreateUserModal = ({ open, close, onSubmit, userData, title }) => {
	const [newUser, setNewUser] = useState(userData);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [profiles, setProfiles] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		getProfilesData();
		setNewUser(userData);
	}, [userData]);

	const getProfilesData = async () => {
		const token = Cookie.get("token");
		const profiles = await ProfileService.getAll()(token);

		setProfiles(profiles);
	};

	const INPUTS = [
		{
			name: "name",
			placeholder: "Nombre",
			type: "text"
		},
		{
			name: "password",
			placeholder: "Contraseña",
			type: showPassword ? "text" : "password"
		},
		{
			name: "repeatPassword",
			placeholder: "Repetir Contraseña",
			type: showPassword ? "text" : "password"
		}
	];

	const resetState = () => {
		if (title === "Editar") {
			setNewUser(userData);
		} else {
			setNewUser({});
		}
		setShowPassword(false);
	};

	const handleSubmit = (event, values) => {
		event.preventDefault();
		try {
			setError("");
			if (newUser.password === newUser.repeatPassword) {
				if (!newUser.profileId) {
					setError("Seleccione un perfil.");
					return;
				}
				setLoading(true);
				onSubmit(newUser);
				resetState();
				event.target.reset();
				close();
			} else {
				setError("Las contraseñas no coinciden.");
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};

	const handleCancel = event => {
		event.preventDefault();
		event.target.reset();
		resetState();
		close();
	};

	const handleChange = event => {
		const { name, value } = event.target;
		setNewUser(user => ({ ...user, [name]: value }));
	};

	return (
		<Dialog open={open}>
			<form onSubmit={handleSubmit} onReset={handleCancel}>
				<DialogTitle id="form-dialog-title">
					<ModalTitle title={`${title} ${TITLE}`} />
				</DialogTitle>
				<DialogContent style={{ margin: "0px 0 25px" }}>
					<Grid container item xs={12} justify="center">
						<Grid item xs={9}>
							{INPUTS.map(({ name, placeholder, type }, index) => (
								<TextField
									key={index}
									style={{ marginBottom: "25px" }}
									id={`"user-${name}-input"`}
									label={placeholder}
									name={name}
									type={type}
									onChange={handleChange}
									defaultValue={newUser[name]}
									inputProps={{ minlength: name === "password" ? 6 : 1 }}
									required
									fullWidth
									InputProps={{
										endAdornment: name === "password" && (
											<IconButton style={{ padding: 0 }} onClick={() => setShowPassword(pw => !pw)}>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										)
									}}
								/>
							))}
							<FormControl fullWidth>
								<InputLabel id="simple-select-label">Perfil</InputLabel>
								<Select
									labelId="simple-select-label"
									id="simple-select"
									placeholder="Perfiles"
									name="profileId"
									defaultValue={newUser.profileId}
									onChange={handleChange}
								>
									{profiles.map(({ _id, name }) => (
										<MenuItem value={_id}>{name}</MenuItem>
									))}
								</Select>
							</FormControl>
							{error && <div className="errMsg">{error}</div>}
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button color="secondary" type="reset" disabled={loading}>
						Cancelar
					</Button>
					<Button color="primary" variant="contained" type="submit" disabled={loading}>
						{loading ? <CircularProgress size={20} color="white" /> : title}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

CreateUserModal.propTypes = {
	userData: PropTypes.object,
	open: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired
};

CreateUserModal.defaultProps = {
	userData: {}
};

export default CreateUserModal;
