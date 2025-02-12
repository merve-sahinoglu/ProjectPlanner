import { Card, createStyles } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import CardDetailScrollArea from './CardDetailScrollArea';

interface GridDetailProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

function CardGridDetail({ children }: GridDetailProps) {
  const { height, width } = useViewportSize();

  const useStyles = createStyles(theme => ({
    card: {
      height: height - 130,
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      wordBreak: 'break-word',
    },
  }));

  const { classes, theme } = useStyles();

  // eslint-disable-next-line react/no-unstable-nested-components, react/display-name

  return (
    <Card className={classes.card} shadow="md" radius="md" withBorder>
      <CardDetailScrollArea>
        {/* <ScrollArea.Autosize mah={height - 150} mx="auto"> */}
        {children}
        {/* </ScrollArea.Autosize> */}
      </CardDetailScrollArea>
    </Card>
  );
}

export default CardGridDetail;
