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
import { createStyles } from "@mantine/emotion";
import { useViewportSize } from "@mantine/hooks";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { BsChevronDown, BsSearch } from "react-icons/bs";
import CardGridFooter from "./CardGridFooter";
import CardGridItemSkeletonGroup from "./skeleton/CardGridItemSkeletonGroup";
import Dictionary from "../../constants/dictionary";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.primaryColor === "dark"
        ? theme.colors.pink[5]
        : theme.colors.indigo[1],
  },

  headerCardSection: {
    backgroundColor:
      theme.primaryColor === "dark"
        ? theme.colors.dark[5]
        : theme.colors.indigo[1],
  },
}));

/** Scroll to next için scrollHeight - scrollTop === clientHeight hesaplamasında mouse wheel ile kaydırıldığında hesaplama bazen doğru
 * çalışmadığı için === yerine <= kullanılıp - 25 verilerek en aşağıya gelmeden bir scrolledToBottom'un true olmasına yardımcı oluyor.
 */
const SCROLL_EXTRA_HEIGHT = 25;

const CARD_GRID_SCROLL_AREA_HEIGHT = 350;

const CARD_GRID_SCROLL_AREA_HEIGHT_WITH_ADDITIONAL = 390;

interface CardGridProps {
  /** Card'ın sol üst tarafında gösterilecek title */
  title: string;
  /** Card'ın ortasında scrollable olacak şekilde sıralanacak künyeler */
  cards: JSX.Element[];
  /** Card'da buton fonksiyonu gerektiği durumda buton child component olarak
   * verildiğinde sağ yukarı eklenecek olan buton.
   */
  addButton?: React.ReactElement;
  /** Card Grid search bar için kullanılacak setState değeri */
  searchInput: string;
  /** Card Grid search bar için kullanılacak setState değerinin SetStateAction'ı */
  setSearchInput: Dispatch<SetStateAction<string>>;
  /** Card Grid'de listenilecek toplam item sayısı */
  totalItemCount: number;
  /** Card Grid'de şu an görüntülenen item sayısı */
  currentItemCount: number;
  /** True olduğunda Card Grid içinde skeleton item gösterir */
  isLoading: boolean;
  /** Eklendiğinde sağ aşağıdaki butona tıklandığında çağrılacak fonksiyon */
  refreshData?(): void;
  /** True olduğunda Card Grid'in footer kısmındaki refresh özelliğini kaldırır */
  disableRefresh?: boolean;
  /** Card Grid scroll area içinde en aşağıya scroll atıldığında eğer var ise bir sonraki
   * item'ları fetchler.
   */
  fetchNextPage(): void;
  /** Arama yapıldığında servisten cevap döneseye kadar sağ tarafta loading bar çıkmasını sağlar. */
  isSearching?: boolean;
  /** True olduğu durumda filtreleme butonu ekler. */
  showFilter?: boolean;
  /** True ve false (isActive) şeklinde çalışacak olan filtre durumu  */
  filterStatus?: boolean;
  /** Filtre değerini toggle edecek fonksiyon */
  filterFunction?(): void;
  additionalSearchChildren?: React.ReactNode | React.ReactNode[];
  searchPlaceHolder?: string;
}

function CardGrid({
  title,
  cards,
  addButton,
  filterFunction,
  filterStatus,
  searchInput,
  setSearchInput,
  totalItemCount,
  currentItemCount,
  refreshData,
  isLoading,
  fetchNextPage,
  disableRefresh = false,
  isSearching = false,
  showFilter = true,
  additionalSearchChildren,
  searchPlaceHolder = Dictionary.CardGrid.SEARCH_INPUT,
}: CardGridProps) {
  const { t } = useTranslation();
  const { classes } = useStyles();
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

  /** Scroll değeri değiştiği zaman hesaplama yaparak isScrolledToBottom
   * boolean değerini günceller.
   */
  const isScrolledToBottom = useMemo(
    () => calculateIfScrolledToBottom(),
    [
      scrollBarViewportRef.current?.scrollHeight,
      scrollBarViewportRef.current?.scrollTop,
    ]
  );

  /** Eğer isScrolledToBottom boolean değeri true ise bir sonraki
   * datayı fetch eder.
   */
  const handleScrollToBottomFetching = useCallback(() => {
    /** ScrolledToBottom sayfa açılışında, refresh durumunda veya filtreleme
     * kısımlarında sağlıklı çalışmayabiliyor, o yüzden scrollPosition y ekseninde
     * 0'sada sonraki sayfaya GET edilmesi engelleniyor.
     */
    if (isScrolledToBottom === false || scrollPosition.y === 0) return;
    fetchNextPage();
  }, [isScrolledToBottom]);

  const handleFilterClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!filterFunction) return;

      filterFunction();
    },
    [filterFunction]
  );

  useEffect(() => {
    handleScrollToBottomFetching();
  }, [isScrolledToBottom]);

  return (
    <Card
      style={{ height: height - 130 }}
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
            {title}
          </Text>
          {addButton}
        </Group>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <TextInput
          value={searchInput}
          onChange={(event) => setSearchInput(event.currentTarget.value)}
          placeholder={`${t(searchPlaceHolder)}`}
          rightSection={isSearching && <Loader size="xs" />}
          radius="lg"
          leftSection={<BsSearch size="0.8rem" />}
        />
        {additionalSearchChildren}
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="apart">
          <Text fz="sm" color="dimmed">
            {t(Dictionary.CardGrid.RESULTS)}
          </Text>
          {showFilter && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group>
                    <Text fz="sm" color="dimmed" pr={-5} mr={-10}>
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

      <Card.Section
        color="dimmed"
        style={{ color: "gray" }}
        inheritPadding
        py="xs"
      >
        <ScrollArea
          h={
            !additionalSearchChildren
              ? height - CARD_GRID_SCROLL_AREA_HEIGHT
              : height - CARD_GRID_SCROLL_AREA_HEIGHT_WITH_ADDITIONAL
          }
          type="scroll"
          offsetScrollbars
          px={2}
          scrollbarSize={8}
          onScrollPositionChange={onScrollPositionChange}
          viewportRef={scrollBarViewportRef}
        >
          {!isLoading ? cards : <CardGridItemSkeletonGroup />}
        </ScrollArea>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <CardGridFooter
          totalItemCount={totalItemCount}
          currentItemCount={currentItemCount}
          refreshData={refreshData}
          disableRefresh={disableRefresh}
        />
      </Card.Section>
    </Card>
  );
}

export default CardGrid;
