export const generateZodModelName = (name: string) => {
	return `${name.toLowerCase()}Model`;
};

export const generateZodEnumName = (name: string) => {
	return `${name.toLowerCase()}Enum`;
};

export const generateRouterFilename = (name: string) => {
	return `${name.toLowerCase()}-router`;
};

export const generateModelFilename = (name: string) => {
	return `${name.toLowerCase()}-model`;
};

export const generateEnumFilename = (name: string) => {
	return `${name.toLowerCase()}-enum`;
};
