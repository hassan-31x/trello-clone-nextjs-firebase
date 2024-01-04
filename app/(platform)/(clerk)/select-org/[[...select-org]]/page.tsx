//? we have added the dynamic page to utilise catch-all-routes so all the /create-org/ routes followed by anything else will be handled by this page

import { OrganizationList } from "@clerk/nextjs";

const CreateOrganizationPage = () => {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl='/organization/:slug' //? slug is the dynamic organization slug used as a slug
      afterCreateOrganizationUrl='/organization/:slug' //? slug is the dynamic organization slug used as a slug
    />
  );
};

export default CreateOrganizationPage;
