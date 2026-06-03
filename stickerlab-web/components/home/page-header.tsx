import { ASSETS, SIZES } from "@/lib/constants";
import Image from "next/image";

export function PageHeader() {
  return (
    <header className="mb-8 text-center">
      <div className="flex flex-col items-center gap-4 mb-4">
        <div
          className="relative"
          style={{
            width: SIZES.BADGE.EXTRA_LARGE.width * 4,
            height: SIZES.BADGE.EXTRA_LARGE.height * 4,
          }}
        >
          <Image
            src={ASSETS.FIFA_BADGE_URL}
            alt="FIFA World Cup 2026"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
        Album FWC 2026
      </h1>
      <p className="text-muted-foreground">
        Analyze your Panini sticker collection for the FIFA World Cup 2026!
      </p>
    </header>
  );
}
