export const generateZodModelName = (name: string) => {
	return `${name.toLowerCase()}Model`;
};

export const generateZodEnumName = (name: string) => {
	return `${name.toLowerCase()}Enum`;
};

export const generateRouterFilename = (name: string) => {
	return `${name.toLowerCase()}-router`;
};
