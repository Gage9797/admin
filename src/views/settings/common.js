export const noContentInEditorStr = '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>';

export const isNoContentInEditor = function (str) {
	console.log(str);
	return str === null || (str.trim() === '') || (str === noContentInEditorStr);
};
