"use client";

import React from 'react'
import { Button } from './ui/button'
import { useFormStatus } from 'react-dom';

type AuthFormButtonProps ={
 type: "logIn" | "signUp"
} //V372

export default function AuthFormButton({type}: AuthFormButtonProps) {
  const { pending } = useFormStatus(); //V372

  return (
    <Button disabled={pending} className="mt-4">
    {type === "logIn" ? "Log In" : "SignUp"}
    </Button>
  )
} //V372
