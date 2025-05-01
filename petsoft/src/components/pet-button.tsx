"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PetForm from "./pet-form";
import { useState } from "react";
import { flushSync } from "react-dom";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean; //V314
};

export default function PetButton({
  actionType,
  disabled, //V314
  onClick,
  children,
}: PetButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (actionType === "add" || actionType === "edit") {
    return (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          {/* to get rid of potential button in button hydration error we mark it asChild so DialogTrigger will not make it's own button again */}
          {actionType === "add" ? (
            <Button size="icon">
              <PlusIcon className="h-6 w-6" />
            </Button>
          ) : (
            <Button variant="secondary">{children}</Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {/* <DialogTitle>Add a new pet</DialogTitle> */}
            <DialogTitle>
              {actionType === "add" ? "Add a new pet" : "Edit pet"}
            </DialogTitle>
          </DialogHeader>

          <PetForm
            actionType={actionType}
            onFormSubmission={() => {
              //V317
              flushSync(() => {
                setIsFormOpen(false);
              }); //V317
              //setIsFormOpen(false); //V317
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }
  // if (actionType === "edit") {
  //   // return <Button variant="secondary">Edit</Button>;
  //   return <Button variant="secondary">{children}</Button>;
  // }

  if (actionType === "checkout") {
    // return <Button variant="secondary">Checkout</Button>;
    return (
      <Button variant="secondary" disabled={disabled} onClick={onClick}>
        {children}
      </Button>
    );
  }

  //return <Button>Checkout</Button>; //we should be able to omit this fallback
}
