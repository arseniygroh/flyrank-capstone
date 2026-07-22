"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleSubmit(e: Event) {
        e.preventDefault();
        const dataRaw = FormData(e.target);
        const data = Object.fromEntries(dataRaw);

        console.log(data);
    }

    return (
        <div>
            <form method="post" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" required id="email" name="email" />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" required id="password" name="password" />
                </div>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}