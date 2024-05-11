import * as React from 'react';
import { Clipboard, Check } from 'lucide-react';
import { useToast } from './ui/use-toast';

type CopyToClipboardProps = {
  text: string;
};

let id: Timer;

export function CopyToClipboard({ text }: CopyToClipboardProps) {
  const { toast } = useToast();

  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    return () => {
      clearTimeout(id);
    };
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    toast({ description: 'Explanatory note copied to clipboard' });
    setHasCopied(true);
    if (id) {
      clearTimeout(id);
    }
    id = setTimeout(() => setHasCopied(false), 1000);
  }

  return hasCopied ? (
    <Check className="h-3 w-3 hover:cursor-pointer" onClick={handleCopy} />
  ) : (
    <Clipboard className="h-3 w-3 hover:cursor-pointer" onClick={handleCopy} />
  );
}
