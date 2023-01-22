import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { trpc } from "../utils/api";
import styles from "./header.module.scss";

export default function Header() {
	const { data: sessionData } = useSession();

	const image = trpc.user.getImage.useQuery({ id: sessionData?.user?.id ?? "" }).data;

	return (
		<nav className={styles.nav}>
			<Image className={styles.logo} src="/logo.svg" alt="Logo" width={40} height={40} />

			<button className={styles.button} onClick={() => (sessionData ? void signOut() : void signIn())}>
				{sessionData ? "Sign out" : "Sign in"}
			</button>

			{image && <Image className={styles.profile} src={image} alt="Profile" width={40} height={40} />}
		</nav>
	);
}
