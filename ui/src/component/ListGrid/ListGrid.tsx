/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
import { Grid, ScrollArea } from '@mantine/core';
import ListGridCardsSkeleton from './components/Skeleton/ListGridCardsSkeleton';

interface ListGridProps {
  children: React.ReactNode | React.ReactNode[];
  isLoading: boolean;
  hasTopSegment?: boolean;
  /* Liste yüklenirken kullanılacak olan skeleton */
  skeleton?: React.ReactNode;
}

function ListGrid({
  children,
  isLoading,
  hasTopSegment = false,
  skeleton = <ListGridCardsSkeleton />,
}: ListGridProps) {
  return (
    /* Boşaltımda scroll gözüküyordu bu sebeple 690'ı 668 olarak güncelledim. AP-785 */
    <ScrollArea.Autosize mt={5} offsetScrollbars mah={hasTopSegment ? 660 : 668} w="100%">
      <Grid
        grow
        sx={{
          width: '100%',
          height: '100%',
          margin: 0,
          paddingBottom: 10,
        }}>
        {!isLoading ? children : skeleton}
      </Grid>
    </ScrollArea.Autosize>
  );
}

export default ListGrid;
