// src/components/Navbar.tsx
import React from "react";
import Link from "next/link";

interface NavbarProps {
  links: { name: string; href: string }[];
}

export default function Navbar({ links }: NavbarProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Example click handler
    console.log("Clicked link", event.currentTarget.href);
  };

  return (
    <nav>
      <ul className="flex gap-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} onClick={handleClick}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
