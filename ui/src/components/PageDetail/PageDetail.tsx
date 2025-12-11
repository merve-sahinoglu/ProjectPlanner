import React from "react";

import { Card, ScrollArea } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

import classes from "./PageDetail.module.css";

interface PageDetailProps {
  children: React.ReactNode;
}

function PageDetail({ children }: PageDetailProps) {
  const { height } = useViewportSize();

  return (
    <Card
      className={classes.detail}
      style={{ height: height - 110 }}
      shadow="md"
      radius="md"
      withBorder
    >
      <Card.Section
        style={{ paddingTop: "var(--card-padding)" }}
        h="100%"
        inheritPadding
      >
        <ScrollArea
          offsetScrollbars="present"
          type="always"
          scrollbars="y"
          h="100%"
        >
          {children}
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}

export default PageDetail;
