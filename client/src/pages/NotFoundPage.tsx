import React from "react";
import BaseLayout from "./BaseLayout";

const NotFoundPage = () => {
  return (
    <BaseLayout title={<h1>Page not found</h1>}>
      <div>404</div>
    </BaseLayout>
  );
};

export default NotFoundPage;
