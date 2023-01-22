import styles from "./BubbleDetail.module.scss";

export default function BubbleDetail() {
	return (
		<div className={styles.x}>
			<div className={styles.y}>
				<div className={styles.blob}>
					<section id={styles.postContainer}>
						<header id={styles.userInfo}>
							<div id={styles.poster}>
								<img id="icon" src="../../public/imgs/rubber-duck.png" width="40px" height="40px"></img>
								<h3 id="username">username</h3>
							</div>
						</header>
						<main>
							<div id={styles.textbox}>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
									labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
									laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
									voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
									non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor
									sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore. sed do
									eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
									nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
									dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
									sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
									laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
									incididunt ut labore.
								</p>
							</div>
						</main>
					</section>
				</div>
			</div>		
		</div>
	);
}
