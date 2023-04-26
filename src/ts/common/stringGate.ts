export default (str: string) => {
	return str.replaceAll(/[^a-zA-Z0-9-.]/g, '-');
};
