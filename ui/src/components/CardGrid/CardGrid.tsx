import React, { useCallback, useRef, useState } from "react";

import {
  Card,
  Group,
  Loader,
  Menu,
  ScrollArea,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { BsChevronDown, BsSearch } from "react-icons/bs";

import CardGridFooter from "@components/CardGrid/components/CardGridFooter";
import CardGridItemSkeletonGroup from "@components/CardGrid/skeleton/CardGridItemSkeletonGroup";
import Dictionary from "@helpers/translation/dictionary/dictionary";
// eslint-disable-next-line import/order
import classes from "./CardGrid.module.css";

/** Scroll to next için scrollHeight - scrollTop === clientHeight hesaplamasında mouse wheel ile kaydırıldığında hesaplama bazen doğru
 * çalışmadığı için === yerine <= kullanılıp - 25 verilerek en aşağıya gelmeden bir scrolledToBottom'un true olmasına yardımcı oluyor.
 */
const SCROLL_EXTRA_HEIGHT = 25;

const CARD_GRID_SCROLL_AREA_HEIGHT = 330;

const CARD_GRID_SCROLL_AREA_HEIGHT_WITH_ADDITIONAL = 370;

interface CardGridProps {
  /** Card'ın sol üst tarafında gösterilecek headerTitle */
  headerTitle: string;
  /** Card'ın ortasında scrollable olacak şekilde sıralanacak künyeler */
  cards: React.ReactNode[];
  /** Card'da buton fonksiyonu gerektiği durumda buton child component olarak
   * verildiğinde sağ yukarı eklenecek olan buton.
   */
  headerRightComponent?: React.ReactNode;
  /** Card Grid search bar için kullanılacak setState değeri */
  searchQuery: string;
  /** Card Grid search bar için kullanılacak setState değerinin SetStateAction'ı */
  onSearchChange: (value: string) => void;
  /** Card Grid'de listenilecek toplam item sayısı */
  totalCount: number;
  /** Card Grid'de şu an görüntülenen item sayısı */
  currentItemCount: number;
  /** True olduğunda Card Grid içinde skeleton item gösterir */
  isFetching: boolean;
  /** Eklendiğinde sağ aşağıdaki butona tıklandığında çağrılacak fonksiyon */
  onRefresh?(): Promise<unknown>;
  /** True olduğunda Card Grid'in footer kısmındaki refresh özelliğini kaldırır */
  disableRefresh?: boolean;
  /** Card Grid scroll area içinde en aşağıya scroll atıldığında eğer var ise bir sonraki
   * item'ları fetchler.
   */
  onLoadMore?(): Promise<unknown>;
  /** True olduğu durumda filtreleme butonu ekler. */
  showFilterMenu?: boolean;
  /** True ve false (isActive) şeklinde çalışacak olan filtre durumu  */
  filterStatus?: boolean;
  /** Filtre değerini toggle edecek fonksiyon */
  onFilterToggle?(): void;
  additionalSearchComponents?: React.ReactNode;
  searchPlaceholder?: string;
}

function CardGrid({
  headerTitle,
  cards,
  headerRightComponent,
  onFilterToggle,
  filterStatus,
  searchQuery,
  onSearchChange,
  totalCount,
  currentItemCount,
  onRefresh,
  isFetching,
  onLoadMore,
  disableRefresh = false,
  showFilterMenu = true,
  additionalSearchComponents,
  searchPlaceholder = Dictionary.CardGrid.SEARCH_INPUT,
}: CardGridProps) {
  const { t } = useTranslation();
  const { height } = useViewportSize();
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
  const scrollBarViewportRef = useRef<HTMLDivElement>(null);

  /** Scroll Area ref'inden scroll area height ve kullanıcının scroll yaptığı
   * alanın y ekseni üzerinden hesabını yaparak scroll'un sonda olup olmadığına
   * dair boolean değer döner.
   */
  const calculateIfScrolledToBottom = (): boolean => {
    if (!scrollBarViewportRef.current) return false;

    return (
      scrollBarViewportRef.current.scrollHeight -
        scrollBarViewportRef.current.scrollTop -
        SCROLL_EXTRA_HEIGHT <=
      scrollBarViewportRef.current.clientHeight
    );
  };

  const handleScrollToBottomFetching = async () => {
    /** ScrolledToBottom sayfa açılışında, refresh durumunda veya filtreleme
     * kısımlarında sağlıklı çalışmayabiliyor, o yüzden scrollPosition y ekseninde
     * 0'sada sonraki sayfaya GET edilmesi engelleniyor.
     */

    if (isFetching) return;

    const isScrolledToBottom = calculateIfScrolledToBottom();

    if (!isScrolledToBottom || scrollPosition.y === 0) return;

    if (onLoadMore) await onLoadMore();
  };

  const handleFilterClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!onFilterToggle) return;

      onFilterToggle();
    },
    [onFilterToggle]
  );

  return (
    <Card
      style={{ height: height - 110 }}
      className={classes.card}
      shadow="sm"
      radius="md"
      withBorder
    >
      <Card.Section
        className={classes.headerCardSection}
        withBorder
        inheritPadding
        py="xs"
      >
        <Group justify="space-between">
          <Text fw={500} fz={17}>
            {headerTitle}
          </Text>
          {headerRightComponent}
        </Group>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <TextInput
          value={searchQuery}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder={`${t(searchPlaceholder)}`}
          rightSection={isFetching && <Loader size="xs" />}
          radius="lg"
          leftSection={<BsSearch size="13px" />}
        />
        {additionalSearchComponents}
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {t(Dictionary.CardGrid.RESULTS)}
          </Text>
          {showFilterMenu && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group>
                    <Text size="sm" c="dimmed" pr={-5} mr={-10}>
                      {t(Dictionary.CardGrid.FILTER)}
                    </Text>
                    <BsChevronDown />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={(e) => handleFilterClick(e)}>
                  {filterStatus
                    ? `${t(Dictionary.CardGrid.SHOW_ALL)}`
                    : `${t(Dictionary.CardGrid.SHOW_ACTIVES)}`}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Card.Section>
      <Card.Section c="dimmed" withBorder style={{ color: "gray" }} py="xs">
        <ScrollArea
          h={
            !additionalSearchComponents
              ? height - CARD_GRID_SCROLL_AREA_HEIGHT
              : height - CARD_GRID_SCROLL_AREA_HEIGHT_WITH_ADDITIONAL
          }
          type="scroll"
          offsetScrollbars
          scrollbars={"y"}
          px={2}
          onBottomReached={handleScrollToBottomFetching}
          scrollbarSize={8}
          onScrollPositionChange={onScrollPositionChange}
          viewportRef={scrollBarViewportRef}
        >
          {!isFetching ? cards : <CardGridItemSkeletonGroup />}
        </ScrollArea>
      </Card.Section>
      <CardGridFooter
        totalItemCount={totalCount}
        currentItemCount={currentItemCount}
        refreshData={onRefresh}
        disableRefresh={disableRefresh}
      />
    </Card>
  );
}

export default CardGrid;
