"use client";

import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";
import { ApiAlert } from "./api-alert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

export const Apilist = ({ entityName, entityIdName }: ApiListProps) => {
  const { storeId } = useParams();
  const origin = useOrigin(); // http://localhost:3000/

  const baseUrl = `${origin}/api/${storeId}`;

  return (
    <div className="space-y-4">
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </div>
  );
};
