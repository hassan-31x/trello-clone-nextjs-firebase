import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import MobileSidebar from "./mobile-sidebar";

const DashbaordNavbar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>

        <Button
          size="sm" variant="primary"
          className="rounded-sm hidden md:block h-auto py-1.5 px-2"
        >
          Create
        </Button>
        <Button size="sm" variant="primary" className="rounded-sm block md:hidden">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id" //? or :slug for redirect to organization slug
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id" //? or :slug for redirect to organization slug
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                width: 30,
                height: 30,
              },
            },
          }}
        />
      </div>
    </nav>
  );
};

export default DashbaordNavbar;
