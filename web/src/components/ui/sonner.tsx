"use client";

import { Icon } from "@iconify/react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      richColors
      className="toaster group"
      icons={{
        success: <Icon icon="lucide:circle-check" className="size-4" />,
        info: <Icon icon="lucide:info" className="size-4" />,
        warning: <Icon icon="lucide:triangle-alert" className="size-4" />,
        error: <Icon icon="lucide:octagon-x" className="size-4" />,
        loading: (
          <Icon icon="lucide:loader-circle" className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          // Rich colors mapped to the status tokens (DESIGN.md → Status).
          "--success-bg":
            "color-mix(in srgb, var(--success) 8%, var(--popover))",
          "--success-border":
            "color-mix(in srgb, var(--success) 25%, var(--popover))",
          "--success-text": "var(--success)",
          "--error-bg":
            "color-mix(in srgb, var(--destructive) 8%, var(--popover))",
          "--error-border":
            "color-mix(in srgb, var(--destructive) 25%, var(--popover))",
          "--error-text": "var(--destructive)",
          "--warning-bg":
            "color-mix(in srgb, var(--warning) 8%, var(--popover))",
          "--warning-border":
            "color-mix(in srgb, var(--warning) 25%, var(--popover))",
          "--warning-text": "var(--warning)",
          "--info-bg": "color-mix(in srgb, var(--link) 8%, var(--popover))",
          "--info-border":
            "color-mix(in srgb, var(--link) 25%, var(--popover))",
          "--info-text": "var(--link)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
