import { string } from "zod";
import styles from "./BubbleDetail.module.scss";
import getColor from "../utils/getColor";

type  BubbleDetailProps = {
	name: string;
	avatar : string;
	text : string;
}

export default function BubbleDetail({ name, avatar, text }: BubbleDetailProps) {
	return (
		<div className={styles.x}>
			<div className={styles.y}>
				<div className={styles.blob} style={{
					backgroundColor: getColor(),
				}}>
					<section className={styles.postContainer}>
						<header className={styles.userInfo} style={{
							backgroundColor: getColor(),
						}}>
							<div className={styles.poster}>
								<img className={styles.icon} src={ avatar } width="40px" height="40px"></img>
								<h3 className={styles.username}>{ name }</h3>
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
