"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";

function Watcher({ onChange }: { onChange: (pathname: string) => void }) {
  const pathname = usePathname();
  useEffect(() => {
    onChange(pathname);
  }, [pathname, onChange]);
  return null;
}

/**
 * Calls `onChange` whenever the route changes. Isolated in its own Suspense
 * boundary so reading the URL never blocks prerendering of the page itself
 * (required under Cache Components).
 */
export function RouteWatcher({ onChange }: { onChange: (pathname: string) => void }) {
  return (
    <Suspense fallback={null}>
      <Watcher onChange={onChange} />
    </Suspense>
  );
}
