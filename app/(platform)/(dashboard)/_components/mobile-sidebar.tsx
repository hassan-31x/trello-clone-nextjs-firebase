"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (value?: boolean) => {
    setIsOpen((prevState: boolean) => (value ? value : !prevState));
  };

  const pathname = usePathname();

  useEffect(() => {
    //? prevent hydration error in using modal & sheets
    setIsMounted(true);
  }, []);

  useEffect(() => {
    toggleOpen(false);
  }, [pathname]);

  if (!isMounted) return null;

  return (
    <>
      <Button
        onClick={() => toggleOpen(true)}
        className="block md:hidden mr-2"
        variant="ghost"
        size="sm"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={() => toggleOpen(false)}>
        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar storageKey="t-mobile-sidebar-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
