
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface DialogProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Dialog({ trigger, title, description, children }: DialogProps) {
  return (
    <ShadcnDialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border-terminal-green text-terminal-green">
        <DialogHeader>
          <DialogTitle className="text-terminal-green">{title}</DialogTitle>
          {description && <DialogDescription className="text-terminal-green/80">{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </ShadcnDialog>
  );
}
