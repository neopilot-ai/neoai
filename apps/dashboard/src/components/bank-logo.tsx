import { Avatar, AvatarFallback, AvatarImage } from "@neoai/ui/avatar";
import { cn } from "@neoai/ui/cn";
import { useState } from "react";

type Props = {
  src: string | null;
  alt: string;
  size?: number;
};

export function BankLogo({ src, alt, size = 34 }: Props) {
  const [hasError, setHasError] = useState(false);
  const showingFallback = !src || hasError;

  return (
    <Avatar
      style={{ width: size, height: size }}
      className={cn(!showingFallback && "border border-border")}
    >
      {src && !hasError ? (
        <AvatarImage
          src={src}
          alt={alt}
          className="object-contain bg-white"
          onError={() => setHasError(true)}
        />
      ) : (
        <AvatarImage
          src="https://cdn-engine.neoai.khulnasoft.com/default.jpg"
          alt={alt}
          className="object-contain"
        />
      )}
      <AvatarFallback>
        <AvatarImage
          src="https://cdn-engine.neoai.khulnasoft.com/default.jpg"
          alt={alt}
          className="object-contain"
        />
      </AvatarFallback>
    </Avatar>
  );
}
