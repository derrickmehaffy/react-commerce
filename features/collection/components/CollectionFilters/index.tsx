import { Box, chakra, Divider, HStack, Stack } from '@chakra-ui/react';
import { formatFacetName } from '@features/collection/utils';
import { Facet, FacetValueState, useFacets } from '@lib/algolia';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList, VariableSizeListProps } from 'react-window';
import { ClearButton } from './ClearButton';
import { ListFilter } from './ListFilter';
import {
   MeasuredContentProvider,
   useMeasureContent,
   useMeasuredContentContext,
} from './MeasuredContent';
import { RangeFilter, RangeFilterInput, RangeFilterList } from './RangeFilter';

interface CollectionFiltersProps {
   className?: string;
}

const FACET_BLOCKLIST = [
   'tags',
   'vendor',
   'collections',
   'option_names',
   'collection_ids',
   'named_tags_names',
   'named_tags.worksin',
   'price',
   'inventory_management',
];

const Sizer = chakra(AutoSizer);

export const CollectionFilters = chakra(
   ({ className }: CollectionFiltersProps) => {
      const facets = useFacets();
      const sortedFacets = React.useMemo(() => {
         return facets.slice().sort((a, b) => a.name.localeCompare(b.name));
      }, [facets]);
      const filteredFacets = React.useMemo(() => {
         return sortedFacets.filter(filterFacet);
      }, [sortedFacets]);
      const [expandedSections, setExpandedSections] = React.useState<string[]>(
         []
      );

      return (
         <MeasuredContentProvider>
            <Sizer className={className}>
               {({ height, width }) => {
                  return (
                     <FilterList
                        height={height}
                        itemCount={filteredFacets.length}
                        estimatedItemSize={40}
                        width={width}
                        itemData={filteredFacets}
                     >
                        {({ data, index, style }) => {
                           const facet = data[index];
                           return (
                              <Box style={style} px="6">
                                 <ListItem
                                    facet={facet}
                                    index={index}
                                    isExpanded={expandedSections.includes(
                                       facet.name
                                    )}
                                    onToggle={() => {
                                       setExpandedSections((current) => {
                                          if (current.includes(facet.name)) {
                                             return current.filter(
                                                (f) => f !== facet.name
                                             );
                                          }
                                          return [...current, facet.name];
                                       });
                                    }}
                                 />
                              </Box>
                           );
                        }}
                     </FilterList>
                  );
               }}
            </Sizer>
         </MeasuredContentProvider>
      );
   }
);

function FilterList(props: Omit<VariableSizeListProps, 'itemSize'>) {
   const { listRef, getSize } = useMeasuredContentContext();

   return <VariableSizeList ref={listRef} {...props} itemSize={getSize} />;
}

function filterFacet(facet: Facet): boolean {
   return (
      !FACET_BLOCKLIST.includes(facet.name) &&
      facet.values.length > 1 &&
      facet.values.some((value) => value.filteredHitCount > 0)
   );
}

function parseRange(value: string): [number, number] {
   const [min, max] = value.split(':');
   return [parseFloat(min), parseFloat(max)];
}

function sortByPriceRange(a: FacetValueState, b: FacetValueState): number {
   const [aMin] = parseRange(a.value);
   const [bMin] = parseRange(b.value);
   return aMin - bMin;
}

interface ListItemProps {
   facet: Facet;
   index: number;
   isExpanded: boolean;
   onToggle(): void;
}

function ListItem({ facet, index, isExpanded, onToggle }: ListItemProps) {
   const name = formatFacetName(facet.name);
   const { ref, reset } = useMeasureContent<HTMLDivElement>(index);

   React.useEffect(() => {
      reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isExpanded]);

   return (
      <Stack ref={ref} spacing="2">
         <Box>
            <HStack
               as="button"
               fontWeight="semibold"
               onClick={onToggle}
               py="2"
               w="full"
            >
               <Box flex="1" textAlign="left">
                  {name}
               </Box>
               <Box
                  style={{ transform: `rotate(${isExpanded ? '45' : '0'}deg)` }}
               >
                  +
               </Box>
            </HStack>
            <Divider />
         </Box>
         {isExpanded && (
            <Box pb="4">
               {facet.name === 'price_range' ? (
                  <>
                     <RangeFilter>
                        <RangeFilterList
                           facetName={facet.name}
                           multiple
                           sortItems={sortByPriceRange}
                           renderItem={(item, index, list) => {
                              const [min, max] = parseRange(item.value);
                              if (index === 0) {
                                 return `Under $${max}`;
                              }
                              if (index === list.length - 1) {
                                 return `$${min} +`;
                              }
                              return `$${min} - $${max}`;
                           }}
                        />
                        <RangeFilterInput
                           facetName="price"
                           minFieldPrefix="$"
                           minFieldPlaceholder="Min"
                           maxFieldPrefix="$"
                           maxFieldPlaceholder="Max"
                        />
                     </RangeFilter>
                     <ClearButton onlyFacetNames={['price', 'price_range']}>
                        clear
                     </ClearButton>
                  </>
               ) : (
                  <>
                     <ListFilter
                        key={facet.name}
                        facetName={facet.name}
                        multiple
                     />
                     <ClearButton onlyFacetNames={facet.name}>
                        clear
                     </ClearButton>
                  </>
               )}
            </Box>
         )}
      </Stack>
   );
}

interface WindowSize {
   width: number;
   height: number;
}

function useWindowSize() {
   const [size, setSize] = React.useState<WindowSize>({ width: 0, height: 0 });
   React.useEffect(() => {
      setSize({
         width: window.innerWidth,
         height: window.innerHeight,
      });
   }, []);
   return size;
}
