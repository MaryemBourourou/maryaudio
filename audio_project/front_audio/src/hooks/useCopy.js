import { useState } from "react";

/**
 * useCopy — retourne [copied, copyFn]
 * copied: boolean — true pendant 2s après la copie
 * copyFn: (text: string) => void
 */
const useCopy = () => {
  const [copied, setCopied] = useState(false);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return [copied, copy];
};

export default useCopy;