"use server";

import { createUserSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { LOGIN_MODE, SQLITE_CONSTRAINT_UNIQUE } from "@/utils/constants";
import { redirect } from "next/navigation";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address!";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be atleast 8 characters long!";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const hashedPassword = hashUserPassword(password);
  try {
    const userId = createUser(email, hashedPassword);
    await createUserSession(userId);
    redirect("/training");
  } catch (err) {
    if (err.code === SQLITE_CONSTRAINT_UNIQUE) {
      return {
        errors: {
          email: "Email already exists!",
        },
      };
    }
    throw err;
  }
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = getUserByEmail(email);
  if (!existingUser) {
    return {
      errors: {
        email: "Invalid credentials!",
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);
  if (!isValidPassword) {
    return {
      errors: {
        password: "Invalid credentials!",
      },
    };
  }

  await createUserSession(existingUser.id);
  redirect("/training");
}

export async function auth(mode, prevState, formData) {
  if (mode === LOGIN_MODE) {
    return login(prevState, formData);
  }

  return signup(prevState, formData);
}

export async function logout() {
  await destroySession();
  redirect("/");
}
