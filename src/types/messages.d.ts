type Message = {
	username: string;
	avatar: string;
	roles?: string[];
	channel: {
		name: string;
		description: string;
	};
	text: string;
	timestamp: string;
	summary: string;
}
