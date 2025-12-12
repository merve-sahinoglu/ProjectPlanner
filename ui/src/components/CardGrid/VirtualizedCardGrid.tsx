import React, { useRef, useState } from "react";

import { Card, Flex, Loader, ScrollArea, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "framer-motion";

import CardGridFooter from "@components/CardGrid/components/CardGridFooter";
import CardGridHeader from "@components/CardGrid/components/CardGridHeader";
import CardGridItemSkeletonGroup from "@components/CardGrid/skeleton/CardGridItemSkeletonGroup";
import Dictionary from "@helpers/translation/dictionary/dictionary";
// eslint-disable-next-line import/order
import classes from "./CardGrid.module.css";

const CARD_GRID_SCROLL_AREA_HEIGHT = 330;

const SCROLL_EXTRA_HEIGHT = 25;

const CARD_GRID_SCROLL_AREA_HEIGHT_WITH_ADDITIONAL = 370;

interface Entity {
  id: string;
}

interface VirtualizedCardGridProps<T extends Entity> {
  headerTitle: string;
  /** Optional action button/element in the header (e.g., Add button) */
  headerRightComponent?: React.ReactNode;

  // Search & Filtering
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** Additional components below search for filtering */
  additionalSearchComponents?: React.ReactNode;
  showFilterMenu?: boolean;
  /** Current state of the main filter (isActive) */
  filterStatus?: boolean;
  /** Callback to toggle the main filter */
  onFilterToggle?(): void;

  // Data Management
  data: T[];
  /** Function to render each data item */
  renderItem: (item: T) => React.ReactNode;

  // Loading States
  /** True when loading initial data (shows skeleton) */
  isInitialLoading: boolean;
  /** True when fetching additional pages (shows "Loading more...") */
  isFetching: boolean;

  // Pagination
  hasMoreData: boolean;
  onLoadMore(): Promise<unknown>;
  /** Card Grid'de listenilecek toplam item sayısı */
  totalCount: number;

  // Actions
  /** Optional callback to refresh all data */
  onRefresh?(): Promise<unknown>;
  disableRefresh?: boolean;

  // Virtualization
  /** Estimated height of each card item */
  estimatedCardHeight?: number;
}

function VirtualizedCardGrid<T extends Entity>({
  headerTitle,
  headerRightComponent,
  onFilterToggle,
  filterStatus,
  searchQuery,
  onSearchChange,
  totalCount,
  onRefresh,
  isInitialLoading,
  onLoadMore,
  disableRefresh = false,
  showFilterMenu = true,
  additionalSearchComponents,
  searchPlaceholder = Dictionary.CardGrid.SEARCH_INPUT,
  hasMoreData,
  data,
  renderItem,
  estimatedCardHeight = 120,
  isFetching,
}: VirtualizedCardGridProps<T>) {
  const { height } = useViewportSize();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: hasMoreData ? data.length + 1 : data.length,
    getScrollElement: () => scrollAreaRef.current,
    estimateSize: (index) => {
      if (index >= data.length) {
        return 60;
      }
      return estimatedCardHeight;
    },
    overscan: 0,
    paddingStart: 0,
    paddingEnd: 0,
    gap: 15,
    enabled: data.length > 0,
  });

  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });

  const refreshAndScrollToTop = async () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
    if (onRefresh) {
      await onRefresh();
    }
  };

  const calculateIfScrolledToBottom = (): boolean => {
    if (!scrollAreaRef.current) return false;

    return (
      scrollAreaRef.current.scrollHeight -
        scrollAreaRef.current.scrollTop -
        SCROLL_EXTRA_HEIGHT <=
      scrollAreaRef.current.clientHeight
    );
  };

  const handleScrollToBottomFetching = async () => {
    /** ScrolledToBottom sayfa açılışında, refresh durumunda veya filtreleme
     * kısımlarında sağlıklı çalışmayabiliyor, o yüzden scrollPosition y ekseninde
     * 0'sada sonraki sayfaya GET edilmesi engelleniyor.
     */

    if (isFetching || isInitialLoading) return;

    const isScrolledToBottom = calculateIfScrolledToBottom();

    if (!isScrolledToBottom || scrollPosition.y === 0) return;

    await onLoadMore();
  };

  return (
    <Card
      style={{ height: height - 110 }}
      className={classes.card}
      shadow="sm"
      radius="md"
      withBorder
    >
      <CardGridHeader
        headerTitle={headerTitle}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        scrollAreaRef={scrollAreaRef}
        additionalSearchComponents={additionalSearchComponents}
        onFilterToggle={onFilterToggle}
        filterStatus={filterStatus}
        showFilterMenu={showFilterMenu}
        isFetching={isFetching}
        headerRightComponent={headerRightComponent}
      />
      <Card.Section c="dimmed" withBorder style={{ color: "gray" }} py="xs">
        <ScrollArea
          viewportRef={scrollAreaRef}
          w={"100%"}
          onScrollPositionChange={onScrollPositionChange}
          scrollbars={"y"}
          onBottomReached={handleScrollToBottomFetching}
          h={
            !additionalSearchComponents
              ? height - CARD_GRID_SCROLL_AREA_HEIGHT
              : height - CARD_GRID_SCROLL_AREA_HEIGHT_WITH_ADDITIONAL
          }
          style={{ contain: "strict" }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {isInitialLoading ? (
              <CardGridItemSkeletonGroup />
            ) : (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const isLoaderRow = virtualRow.index > data.length - 1;
                const entity = data[virtualRow.index];

                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      padding: "0 10px 0 10px",
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {isLoaderRow ? (
                      hasMoreData ? (
                        <Flex
                          direction="row"
                          align="center"
                          justify="center"
                          h="100%"
                          gap="xs"
                        >
                          <Loader size={"sm"} color={"gray"} />
                          <Text size={"sm"} c={"dimmed"}>
                            Loading more...
                          </Text>
                        </Flex>
                      ) : (
                        "No more data"
                      )
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 1 }}
                        style={{ height: "100%" }}
                      >
                        {renderItem(entity)}
                      </motion.div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </Card.Section>
      <CardGridFooter
        totalItemCount={totalCount}
        currentItemCount={data.length}
        refreshData={refreshAndScrollToTop}
        disableRefresh={disableRefresh}
      />
    </Card>
  );
}

export default VirtualizedCardGrid;
