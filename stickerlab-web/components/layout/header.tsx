"use client";

import { logoutAction } from "@/actions/auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type SubItem = {
  label: string;
  description?: string;
  href: string;
};

type NavItem = {
  label: string;
  href?: string;
  children?: SubItem[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Album", href: "/album" },
  {
    label: "Ranking",
    children: [
      {
        label: "StickerLab Accuracy",
        description: "Sticker accuracy ranking",
        href: "/ranking/accuracy",
      },
      {
        label: "Clubs Representation",
        description: "Clubs representation in the album",
        href: "/ranking/clubs",
      },
    ],
  },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href) return pathname === item.href;
  return item.children?.some((sub) => pathname.startsWith(sub.href)) ?? false;
}

export function Header() {
  const { data: user } = useCurrentUser();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-foreground">
            Olá, {user?.name ?? "—"}
          </span>
          <span className="text-xs text-muted-foreground">
            {user?.role ?? "—"} · {user?.email ?? "—"}
          </span>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && handleEnter(item.label)}
              onMouseLeave={() => item.children && handleLeave()}
            >
              {item.children ? (
                <button
                  type="button"
                  className={cn(
                    "relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    openMenu === item.label || isActive(pathname, item)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      openMenu === item.label && "rotate-180",
                    )}
                  />
                  {isActive(pathname, item) && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                    isActive(pathname, item) ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                  {isActive(pathname, item) && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              )}

              {item.children && (
                <div
                  className={cn(
                    "absolute left-0 top-full pt-3 transition-all duration-200",
                    openMenu === item.label
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0",
                  )}
                >
                  <div className="w-72 overflow-hidden rounded-xl border border-border/70 bg-popover/95 p-2 shadow-2xl backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
                    {item.children.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="group/sub flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent"
                      >
                        <span className="flex items-center justify-between text-sm font-medium text-popover-foreground">
                          {sub.label}
                          <span className="size-1.5 rounded-full bg-primary opacity-0 transition-opacity group-hover/sub:opacity-100" />
                        </span>
                        {sub.description && (
                          <span className="text-xs leading-relaxed text-muted-foreground">
                            {sub.description}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </form>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-md border border-border/70 bg-card/60 text-foreground lg:hidden"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl transition-[max-height] duration-300 lg:hidden",
          mobileOpen ? "max-h-[calc(100vh-4rem)]" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex max-h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto px-4 py-4">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="border-b border-border/40 last:border-0"
            >
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileSub((cur) =>
                        cur === item.label ? null : item.label,
                      )
                    }
                    className="flex w-full items-center justify-between py-3 text-sm font-medium text-foreground"
                    aria-expanded={mobileSub === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform duration-200",
                        mobileSub === item.label && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-[max-height] duration-300",
                      mobileSub === item.label ? "max-h-96" : "max-h-0",
                    )}
                  >
                    <div className="flex flex-col gap-0.5 pb-2 pl-3">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="flex flex-col gap-0.5 rounded-lg border-l border-border/60 px-3 py-2 transition-colors hover:bg-accent"
                        >
                          <span className="text-sm text-foreground">
                            {sub.label}
                          </span>
                          {sub.description && (
                            <span className="text-xs text-muted-foreground">
                              {sub.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href!}
                  className="block py-3 text-sm font-medium text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <div className="mt-3">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border/70 px-4 py-2.5 text-sm font-medium text-foreground cursor-pointer"
              >
                <LogOut className="size-4" />
                Sair
              </button>
            </form>
          </div>
        </nav>
      </div>
    </header>
  );
}
