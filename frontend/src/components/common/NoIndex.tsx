import { useEffect } from "react";

interface NoIndexProps {
  children: React.ReactNode;
}

const NoIndex = ({ children }: NoIndexProps) => {
  useEffect(() => {
    const meta = document.createElement("meta");

    meta.name = "robots";
    meta.content = "noindex, nofollow";

    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return <>{children}</>;
};

export default NoIndex;