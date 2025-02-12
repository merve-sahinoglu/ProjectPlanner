import * as ScrollArea from '@radix-ui/react-scroll-area';
import styles from './Card.module.css';

interface CardDetailScrollAreaProps {
  children: React.ReactNode;
}

function CardDetailScrollArea({children}: CardDetailScrollAreaProps) {
  return (
    <ScrollArea.Root className={styles.ScrollAreaRoot}>
      <ScrollArea.Viewport className={styles.ScrollAreaViewport}>{children}</ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={styles.ScrollAreaScrollbar} orientation="vertical">
        <ScrollArea.Thumb className={styles.ScrollAreaThumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className={styles.ScrollAreaCorner} />
    </ScrollArea.Root>
  );
}

export default CardDetailScrollArea;
