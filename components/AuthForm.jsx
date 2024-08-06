"use client";

import { auth } from "@/actions/auth-actions";
import { LOGIN_MODE, SIGNUP_MODE } from "@/utils/constants";
import Link from "next/link";
import { useFormState } from "react-dom";

export default function AuthForm({ mode }) {
  const [formState, formAction] = useFormState(auth.bind(null, mode), {});

  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {formState.errors && (
        <ul id="form-errors">
          {Object.keys(formState.errors).map((error) => (
            <li key={error}>{formState.errors[error]}</li>
          ))}
        </ul>
      )}
      <p>
        <button type="submit">
          {mode === LOGIN_MODE ? "Login" : "Create account"}
        </button>
      </p>
      <p>
        {mode === LOGIN_MODE && (
          <Link href="/?mode=signup">Create a new account!</Link>
        )}
        {mode === SIGNUP_MODE && (
          <Link href="/?mode=login">Account already exists? Login here.</Link>
        )}
      </p>
    </form>
  );
}
