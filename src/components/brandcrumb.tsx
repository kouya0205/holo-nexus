import { FC, Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

type BreadcrumbProps = {
  paths: { label: string; href: string }[];
};

export const BreadCrumb: FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          const isLastItem = index === paths.length - 1;
          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage>{path.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={path.href}>{path.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastItem && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
