import { cn } from '@/lib/utils';

interface CountryFlagProps {
  flagUrl: string | null;
  flagEmoji: string | null;
  name: string;
  imgClassName?: string;
  emojiClassName?: string;
}

export function CountryFlag({
  flagUrl,
  flagEmoji,
  name,
  imgClassName,
  emojiClassName,
}: CountryFlagProps) {
  if (flagUrl) {
    return (
      <img
        src={flagUrl}
        alt={`Drapeau ${name}`}
        className={cn('rounded border border-border object-cover', imgClassName)}
      />
    );
  }

  return <span className={cn(emojiClassName)}>{flagEmoji}</span>;
}
