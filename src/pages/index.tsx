import { type NextPage } from "next";
import Head from "next/head";
import BubbleDetail from "../components/BubbleDetail";
import Header from "../components/Header";
import styles from "../styles/Home.module.css";
import { trpc } from "../utils/api";

const Home: NextPage = () => {
	const messages =
		trpc.messages.get.useQuery(undefined, {
			refetchInterval: 10000,
		}).data ?? [];

	return (
		<>
			<Head>
				<title>Simmer</title>
				<meta name="description" content="Simmer down and connect" />
				<link rel="favicon icon" href="/favicon.svg" type="image/svg+xml" />
			</Head>
			<Header />
			<main className={styles.background}>
				{messages.map((message, i) => (
					<BubbleDetail
						key={i}
						name={message.username}
						avatar={message.avatar}
						text={message.summary ?? message.text}
					/>
				))}
			</main>
		</>
	);
};

export default Home;
