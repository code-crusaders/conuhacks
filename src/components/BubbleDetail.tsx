import { string } from "zod";
import styles from "./BubbleDetail.module.scss";

type  BubbleDetailProps = {
	name: string;
	avatar : string;
	text : string;
}

export default function BubbleDetail({ name, avatar, text }: BubbleDetailProps) {
	return (
		<div className={styles.x}>
			<div className={styles.y}>
				<div className={styles.blob}>
					<section className={styles.postContainer}>
						<header className={styles.userInfo}>
							<div className={styles.poster}>
								<img className="icon" src={ avatar } width="40px" height="40px"></img>
								<h3 className="username">{ name }</h3>
							</div>
						</header>
						<main>
							<div className={styles.textbox}>
								<p>
									{ text }
								</p>
							</div>
						</main>
					</section>
				</div>
			</div>
		</div>
	);
}
