import { ASSETS, SIZES } from "@/lib/constants";
import Image from "next/image";

export function PageHeader() {
  return (
    <header className="mb-8">
      <div className="flex flex-col items-center gap-4 mb-4">
        <div
          className="relative"
          style={{
            width: SIZES.BADGE.EXTRA_LARGE.width * 8,
            height: SIZES.BADGE.EXTRA_LARGE.height * 8,
          }}
        >
          <Image
            src={ASSETS.STICKERLAB_URL}
            alt="StickerLab"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>

      <p className="text-muted-foreground text-center">
        Analyze your sticker collection with StickerLab!
      </p>
    </header>
  );
}
