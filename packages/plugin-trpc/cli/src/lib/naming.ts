export const generateZodModelName = (name: string) => {
	return `${name.toLowerCase()}Model`;
};

export const generateEnumName = (name: string) => {
	return `${name.toLowerCase()}Enum`;
};

export const generateCompleteModelName = (name: string) => {
	return `Complete${name}Model`;
};

export const generateZodEnumName = (name: string) => {
	return `${name.toLowerCase()}EnumModel`;
};

export const generateRouterFilename = (name: string) => {
	return `${name.toLowerCase()}-router`;
};

export const generateModelFilename = (name: string) => {
	return `${name.toLowerCase()}`;
};

export const generateEnumFilename = (name: string) => {
	return `${name.toLowerCase()}`;
};
