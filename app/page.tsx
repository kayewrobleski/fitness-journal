"use client";
import Image from "next/image";
import Link from "next/link";
import { SessionProvider, useSession, signIn,  signOut } from "next-auth/react";

export default function Home() {
  const session = useSession();
  console.log(session);
  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <Image
          width={512}
          height={512}
          src="/logo.png"
          alt="Platforms on Vercel"
          className="w-48 h-48"
        />
        <div className="text-center max-w-screen-sm mb-10">
          <h1 className="text-stone-200 font-bold text-2xl">
            ⚠️ Under Construction ⚠️
          </h1>
          <div className="m-1">
            <h3 className="text-stone-200 font-bold text-xl">
              Fitness Journal App
            </h3>
          </div>
          
          {session.status === "unauthenticated" && 
            <button className="text-stone-400" onClick={() => signIn()}>Sign in</button>
          }
          {session.status === "authenticated" &&
            <p className="text-stone-400 mt-5">
              Signed in as {session?.data?.user?.name}
            </p>
          }
          <p className="text-stone-400 mt-5">
            This is a{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 underline hover:text-stone-200 transition-all"
            >
              Next.js
            </a>{" "}
            web application used for creating workout plans and tracking strength progress
          </p>
        </div>
        <div className="flex space-x-3">
          <a
            href="https://github.com/kayewrobleski/fitness-journal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            GitHub
          </a>
        </div>
        {session.status === "authenticated" &&
          <button className="text-stone-400" onClick={() => signOut()}>Sign out</button>
        }
      </div>
    </div>
  );
}
