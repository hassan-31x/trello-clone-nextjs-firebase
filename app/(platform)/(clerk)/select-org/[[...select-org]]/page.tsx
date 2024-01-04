//? we have added the dynamic page to utilise catch-all-routes so all the /create-org/ routes followed by anything else will be handled by this page

import { OrganizationList } from "@clerk/nextjs";

const CreateOrganizationPage = () => {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl='/organization/:id' //? id is the dynamic organization id we want to redirect to. Use :slug for redirect using organization slug
      afterCreateOrganizationUrl='/organization/:id' //? id is the dynamic organization id we want to redirect to. Use :slug for redirect using organization slug
    />
  );
};

export default CreateOrganizationPage;
