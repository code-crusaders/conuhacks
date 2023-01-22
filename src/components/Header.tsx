import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
    const { data: sessionData } = useSession();
    return (
        <>
            <nav>
			    <h1 id="nav">Company Name</h1> 

				<button onClick={() => (sessionData ? void signOut() : void signIn())}>
					{sessionData ? "Sign out" : "Sign in"}
				</button>

				<img id="placeholder" src="../../public/rubber-duckie.png" height="50" width="50"></img>
			</nav>
        </>
    )
}