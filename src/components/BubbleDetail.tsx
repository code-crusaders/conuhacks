import generateHue from "../utils/generateHue";
import styles from "./BubbleDetail.module.scss";
import { useEffect, useMemo, useState } from "react";

type BubbleDetailProps = {
	name: string;
	avatar: string;
	text: string;
};

export default function BubbleDetail({ name, avatar, text }: BubbleDetailProps) {
	const [hue, setHue] = useState(0);

	useEffect(() => {
		setHue(generateHue());
	}, []);

	const animationProperties = useMemo(
		() =>
			new Array(3).fill(0).map(
				(_, i) =>
					({
						animationTimingFunction: `cubic-bezier(${new Array(4)
							.fill(0)
							.map(() => Math.random() * 0.2 + 0.9)
							.join(", ")}})`,
						animationDuration: `${Math.random() * 2000 + 5000}ms`,
						animationDelay: `${Math.random() * 5000 * i - 5000}ms`,
					} as React.CSSProperties),
			),
		[],
	);

	return (
		<div className={styles.x} style={animationProperties[0]}>
			<div className={styles.y} style={animationProperties[1]}>
				<div
					className={styles.blob}
					style={{
						backgroundColor: `hsl(${hue}, 50%, 50%)`,
						...animationProperties[2],
					}}
				>
					<section className={styles.postContainer}>
						<header
							className={styles.userInfo}
							style={{
								backgroundColor: `hsl(${hue}, 40%, 60%)`,
							}}
						>
							<div className={styles.poster}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img className={styles.icon} src={avatar} alt="Avatar" />
								<h3 className={styles.username}>{name}</h3>
							</div>
						</header>
						<main
							className={styles.textbox}
							style={{
								backgroundColor: `hsl(${hue}, 40%, 80%)`,
							}}
						>
							{text}
						</main>
					</section>
				</div>
			</div>
		</div>
	);
}
