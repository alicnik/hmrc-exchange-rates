import * as React from 'react';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { useToast } from './ui/use-toast';

type CopyToClipboardProps = {
  text: string;
};

export function CopyToClipboard({ text }: CopyToClipboardProps) {
  const { toast } = useToast();

  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) {
      return;
    }

    setTimeout(() => setHasCopied(false), 1000);
  }, [hasCopied]);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    toast({ description: 'Explanatory note copied to clipboard' });
    setHasCopied(true);
  }

  return hasCopied ? (
    <ClipboardCheck
      className="h-3 w-3 hover:cursor-pointer"
      onClick={handleCopy}
    />
  ) : (
    <Clipboard className="h-3 w-3 hover:cursor-pointer" onClick={handleCopy} />
  );
}
