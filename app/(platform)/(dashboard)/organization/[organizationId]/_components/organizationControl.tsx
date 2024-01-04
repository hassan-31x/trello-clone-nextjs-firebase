"use client"
//? this component changes the organization programmatically in Clerk if the URL changes as this feature is not available as of now in Clerk

import { useOrganizationList } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useEffect } from "react"

const OrganizationControl = () => {
  const params = useParams()
  const { setActive } = useOrganizationList() //? it's a hook as using 'use' keyword so we have to use client component for it

  useEffect(() => {
    if (!setActive) return

    setActive({
      organization: params.organizationId as string,
    })

  }, [setActive, params.organizationId])

  return null
}

export default OrganizationControl