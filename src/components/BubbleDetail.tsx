import getColor from "../utils/getColor";
import styles from "./BubbleDetail.module.scss";
import Image from "next/image";

type BubbleDetailProps = {
	name: string;
	avatar: string;
	text: string;
};

export default function BubbleDetail({ name, avatar, text }: BubbleDetailProps) {
	return (
		<div className={styles.x}>
			<div className={styles.y}>
				<div
					className={styles.blob}
					style={{
						// eslint-disable-next-line @typescript-eslint/no-unsafe-call
						backgroundColor: getColor(),
					}}
				>
					<section className={styles.postContainer}>
						<header
							className={styles.userInfo}
							style={{
								// eslint-disable-next-line @typescript-eslint/no-unsafe-call
								backgroundColor: getColor(),
							}}
						>
							<div className={styles.poster}>
								<Image className={styles.icon} src={avatar} width={50} height={50} alt="Avatar" />
								<h3 className={styles.username}>{name}</h3>
							</div>
						</header>
						<main>
							<div className={styles.textbox}>
								<p>{text}</p>
							</div>
						</main>
					</section>
				</div>
			</div>
		</div>
	);
}
