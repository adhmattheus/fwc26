import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { ASSETS, SIZES } from "@/lib/constants";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function PageHeader() {
  return (
    <header className="mb-8">
      <div className="flex justify-end mt-2">
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="cursor-pointer"
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </form>
      </div>
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
