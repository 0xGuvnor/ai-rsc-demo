"use client";

import { KeyboardEvent, useRef } from "react";

export default function useEnterSubmit() {
  const formRef = useRef<HTMLFormElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();

      formRef.current?.requestSubmit();
    }
  }

  return { formRef, onKeyDown };
}
