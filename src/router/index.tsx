import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface RouterContextType {
  pathname: string;
  search: string;
  query: Record<string, string>;
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

export const parseQuery = (searchStr: string): Record<string, string> => {
  const params = new URLSearchParams(searchStr);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === "undefined") return "/";
    return window.location.pathname || "/";
  });

  const [currentSearch, setCurrentSearch] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.location.search || "";
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
      setCurrentSearch(window.location.search || "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const push = useCallback((href: string) => {
    const url = new URL(href, window.location.origin);
    window.history.pushState({}, "", url.pathname + url.search);
    setCurrentPath(url.pathname);
    setCurrentSearch(url.search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const replace = useCallback((href: string) => {
    const url = new URL(href, window.location.origin);
    window.history.replaceState({}, "", url.pathname + url.search);
    setCurrentPath(url.pathname);
    setCurrentSearch(url.search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const back = useCallback(() => {
    window.history.back();
  }, []);

  const query = parseQuery(currentSearch);

  return (
    <RouterContext.Provider
      value={{
        pathname: currentPath,
        search: currentSearch,
        query,
        push,
        replace,
        back,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({
  href,
  className,
  children,
  onClick,
  ...rest
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (
      !e.defaultPrevented &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};
