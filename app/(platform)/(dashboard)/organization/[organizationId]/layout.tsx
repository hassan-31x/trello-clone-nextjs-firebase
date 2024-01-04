import OrganizationControl from "./_components/organizationControl";

const OrganizationSlugLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <OrganizationControl />
      {children}
    </>
  );
};

export default OrganizationSlugLayout;
