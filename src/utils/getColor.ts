import "./../pages/index.tsx";

const map = new Map([
	[0, "#F94144"],
	[1, "#F3722C"],
	[2, "#F8961E"],
	[3, "#90BE6D"],
	[4, "#43AA8B"],
] as const);

export default function getColor() {
	const randomint = getRandomInt();
	return map.get(randomint);
}

function getRandomInt() {
	return Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4;
}
