import React, { useState, useEffect } from "react";
import "./_style.scss";
import { Grid, CircularProgress } from "@material-ui/core";
import ReactTable from "react-table-6";
import Messages from "../../../constants/Messages";
import Constants from "../../../constants/Constants";
import CertificateTableHelper from "../list/CertificateTableHelper";
import CertificateService from "../../../services/CertificateService";
import Cookie from "js-cookie";
import { useHistory } from "react-router-dom";
import { filter, filterByDates } from "../../../services/utils";
import Notification from "../../components/Notification";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import RevocationSingleModal from "../../components/RevocationSingleModal";
import RevocationAllModal from "../../components/RevocationAllModal";
import { validateAccess } from "../../../constants/Roles";
import DefaultButton from "../../setting/default-button";

const { PREV, NEXT } = Messages.LIST.TABLE;
const { MIN_ROWS, PAGE_SIZE } = Constants.CERTIFICATES.TABLE;

const CertificatesEmmited = () => {
	const [columns, setColumns] = useState([]);
	const [data, setData] = useState([]);
	const [filters, setFilters] = useState({});
	const [selected, setSelected] = useState({});
	const [allSelected, setAllSelected] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [filteredData, setFilteredData] = useState([]);
	const [activeCert, setActiveCert] = useState({});
	const [certsToRevoke, setCertsToRevoke] = useState([]);
	const [modalRevokeAllOpen, setModalRevokeAllOpen] = useState(false);
	const [revokeSuccess, setRevokeSuccess] = useState(false);
	const [revokeFail, setRevokeFail] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState({});
	const history = useHistory();

	useEffect(() => {
		if (data.length) {
			updateColumns(selected);
			setFilteredData(data);
			setLoading(false);
		}
	}, [data]);

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		updateFilterData(filteredData, selected);
	}, [selected]);

	useEffect(() => {
		const { firstName, lastName, certName, start, end, blockchain } = filters;
		const result = data.filter(
			row =>
				filter(row, "firstName", firstName) &&
				filter(row, "lastName", lastName) &&
				filter(row, "certName", certName) &&
				filter(row, "blockchain", blockchain) &&
				filterByDates(row, start, end)
		);
		updateFilterData(result, selected);
	}, [filters]);

	useEffect(() => {
		const generated = {};
		filteredData.forEach(item => (generated[item._id] = allSelected));
		setSelected(generated);
	}, [allSelected]);

	useEffect(() => {
		if (revokeSuccess || revokeFail) {
			setActiveCert(null);
			setCertsToRevoke([]);
			setModalOpen(false);
			setModalRevokeAllOpen(false);
		}
	}, [revokeSuccess, revokeFail]);

	const getData = async () => {
		setLoading(true);
		try {
			const token = Cookie.get("token");
			const certificates = await CertificateService.getEmmited(token);
			updateCertificates(certificates, selected, setData);
		} catch (error) {
			setError(error.data);
		}
		setLoading(false);
	};

	const onFilterChange = (e, key) => {
		const val = e.target.value;
		setFilters(prev => ({ ...prev, [key]: val }));
	};

	const onDateRangeFilterChange = ({ start, end }) => {
		setFilters(prev => ({ ...prev, start, end }));
	};

	const handleSelectOne = (id, checked) => {
		setSelected(selected => ({ ...selected, [id]: checked }));
	};

	const updateFilterData = (certs, selectedCerts) => {
		updateCertificates(certs, selectedCerts, setFilteredData);
		updateColumns(selectedCerts);
	};

	const updateColumns = selectedCerts => {
		const localColumns = CertificateTableHelper.getCertEmmitedColumns(
			data,
			selectedCerts,
			allSelected,
			handleSelectAllToggle,
			onFilterChange,
			onDateRangeFilterChange
		);
		setColumns(localColumns);
	};

	const updateCertificates = (certs, selectedCerts, updateState) => {
		const data_ = certs.map(item => {
			return CertificateTableHelper.getCertificatesEmmitedData(
				{ ...item, name: item.certName || item.name, emmitedOn: item.createdOn, blockchain: item.blockchain },
				selectedCerts,
				handleSelectOne,
				handleView,
				handleRevokeOne
			);
		});
		updateState(data_);
	};

	const handleView = id => {
		history.push(Constants.ROUTES.EDIT_CERT + id);
	};

	const handleRevokeOne = cert => {
		setActiveCert(cert);
		setModalOpen(true);
	};

	const onRevokeSuccess = () => {
		setRevokeSuccess(true);
		getData();
		setFilters({});
	};

	const catchError = async (previousFunction, handleFail) => {
		try {
			await previousFunction();
		} catch (error) {
			handleFail();
			onRevokeFail();
			setError(error);
		}
	};

	const handleSubmit = (revokeReason, onSuccess, handleFail) =>
		catchError(async () => {
			const token = Cookie.get("token");
			await CertificateService.revoke(activeCert._id, revokeReason)(token);
			setActiveCert({});
			onSuccess();
		}, handleFail);

	const handleSubmitAll = (revokeReason, onSuccess, handleFail) =>
		catchError(async () => {
			const token = Cookie.get("token");
			for (const cert of certsToRevoke) {
				await CertificateService.revoke(cert._id, revokeReason)(token);
				const certsRemoved = certsToRevoke.map(c => {
					if (c._id === cert._id) {
						c.revoked = true;
					}
					return c;
				});
				setCertsToRevoke(certsRemoved);
			}
			setCertsToRevoke([]);
			setSelected({});
			onSuccess();
			onRevokeSuccess();
		}, handleFail);

	const onRevokeFail = errorData => {
		setRevokeFail(true);
	};

	const onCloseRevokeSuccess = (e, reason) => {
		if (reason !== "clickaway") {
			setRevokeSuccess(false);
		}
	};

	const onCloseRevokeFail = (e, reason) => {
		if (reason !== "clickaway") {
			setRevokeFail(false);
		}
	};

	const handleRevokeSelected = () => {
		const keysToRevoke = Object.keys(selected).filter(key => selected[key]);
		if (keysToRevoke.length === 0) return;

		const certsToRevoke = data.filter(t => keysToRevoke.indexOf(t._id) > -1);
		setCertsToRevoke(certsToRevoke);
		setModalRevokeAllOpen(true);
	};

	const handleSelectAllToggle = val => {
		setAllSelected(val);
	};

	return (
		<>
			<Grid container spacing={3} className="flex-end" style={{ marginBottom: 10 }}>
				{validateAccess(Constants.ROLES.Delete_Certs) && (
					<Grid item xs={12} className="flex-end">
						<DefaultButton
							name="Revocar Credenciales Seleccionadas"
							otherClass="DangerButton"
							funct={handleRevokeSelected}
							disabled={!Object.keys(selected).filter(key => selected[key])[0]}
						>
							<RemoveCircleIcon fontSize="small" style={{ marginRight: 6 }} />
						</DefaultButton>
					</Grid>
				)}
				{error.message && <div className="errMsg">{error.message}</div>}
				<Grid item xs={12} style={{ textAlign: "center" }}>
					{!loading ? (
						<ReactTable
							sortable={false}
							previousText={PREV}
							nextText={NEXT}
							data={filteredData}
							columns={columns}
							defaultPageSize={PAGE_SIZE}
							minRows={MIN_ROWS}
						/>
					) : (
						<CircularProgress />
					)}
				</Grid>
			</Grid>

			<RevocationSingleModal
				activeCert={activeCert}
				onSuccess={onRevokeSuccess}
				open={modalOpen}
				handleSubmit={handleSubmit}
				toggleModal={() => setModalOpen(false)}
			/>

			<RevocationAllModal
				certs={certsToRevoke}
				open={modalRevokeAllOpen}
				handleSubmit={handleSubmitAll}
				toggleModal={() => setModalRevokeAllOpen(false)}
			/>

			<Notification open={revokeSuccess} message="La credencial se revocó con éxito." onClose={onCloseRevokeSuccess} />

			<Notification
				open={revokeFail}
				severity="error"
				message={error.message}
				time={3500}
				onClose={onCloseRevokeFail}
			/>
		</>
	);
};

export default CertificatesEmmited;
