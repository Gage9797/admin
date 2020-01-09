import XLSX from 'xlsx';

function auto_width (ws, data) {
	/* set worksheet max width per col */
	const colWidth = data.map(row => row.map(val => {
		/* if null/undefined */
		if (val == null) {
			return {'wch': 10};
		}
		/* if chinese */
		else if (val.toString().charCodeAt(0) > 255) {
			return {'wch': val.toString().length * 2};
		} else {
			return {'wch': val.toString().length};
		}
	}));
	/* start in the first row */
	let result = colWidth[0];
	for (let i = 1; i < colWidth.length; i++) {
		for (let j = 0; j < colWidth[i].length; j++) {
			if (result[j]['wch'] < colWidth[i][j]['wch']) {
				result[j]['wch'] = colWidth[i][j]['wch'];
			}
		}
	}
	ws['!cols'] = result;
}

function json_to_array (key, jsonData) {
	return jsonData.map(v => key.map(j => v[j]));
}

export const exportTableToExcell = ({key, data, title, filename, autoWidth}) => {
	const wb = XLSX.utils.book_new();
	const arr = json_to_array(key, data);
	arr.unshift(title);
	const ws = XLSX.utils.aoa_to_sheet(arr);
	if (autoWidth) {
		auto_width(ws, arr);
	}
	XLSX.utils.book_append_sheet(wb, ws, filename);
	XLSX.writeFile(wb, filename + '.xlsx');
};
