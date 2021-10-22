export const commands = [
	{
		regex: /\/drops(.*)/,
		command: require("./drops"),
	},
	{
		regex: /\/alert (.+)/,
		command: require("./alert"),
	},
];
