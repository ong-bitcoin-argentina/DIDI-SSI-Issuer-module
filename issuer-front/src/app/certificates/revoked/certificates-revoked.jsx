import React, { useState, useEffect } from "react";
// import "./_style.scss";
import Messages from "../../../constants/Messages";
import Constants from "../../../constants/Constants";
import ReactTable from "react-table-6";
import { Grid, CircularProgress } from "@material-ui/core";
import CertificateTableHelper from "../list/CertificateTableHelper";
import CertificateService from "../../../services/CertificateService";
import Cookie from "js-cookie";
import { filter } from "../../../services/utils";

const { PREV, NEXT } = Messages.LIST.TABLE;
const { MIN_ROWS, PAGE_SIZE } = Constants.CERTIFICATES.TABLE;

const CertificatesRevoked = () => {
	const [columns, setColumns] = useState([]);
	const [data, setData] = useState([]);
	const [filters, setFilters] = useState({});
	const [filteredData, setFilteredData] = useState([]);

	const onFilterChange = (e, key) => {
		const val = e.target.value;
		setFilters(prev => ({ ...prev, [key]: val }));
	};

	const handleView = id => {
		console.log(id);
	};

	useEffect(() => {
		if (data.length) {
			const localColumns = CertificateTableHelper.getCertRevokedColumns(data, onFilterChange);
			setColumns(localColumns);
		}
		setFilteredData(data);
	}, [data]);

	useEffect(() => {
		const getData = async () => {
			// TODO: unccomment when api is ready
			const token = Cookie.get("token");
			let certificates = await CertificateService.getRevoked(token);
			setData(
				certificates.map(item => {
					return CertificateTableHelper.getCertificatesRevokedData(item, handleView);
				})
			);
		};
		getData();
	}, []);

	useEffect(() => {
		const { firstName, lastName, certName } = filters;
		const result = data.filter(
			row =>
				filter(row, "firstName", firstName) && filter(row, "lastName", lastName) && filter(row, "certName", certName)
		);
		setFilteredData(result);
	}, [filters]);

	return (
		<>
			<Grid container spacing={3} className="flex-end" style={{ marginBottom: 10 }}>
				<Grid item xs={12} style={{ textAlign: "center" }}>
					{filteredData ? (
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
		</>
	);
};

export default CertificatesRevoked;
