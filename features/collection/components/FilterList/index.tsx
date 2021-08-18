import { Box, chakra, Spinner } from '@chakra-ui/react';
import { Facet, useFacets } from '@lib/algolia';
import { assign } from '@xstate/fsm';
import { useMachine } from '@xstate/react/fsm';
import produce from 'immer';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import { FilterRow, ItemData } from './FilterRow';
import { createVirtualAccordionMachine } from './virtualAccordion.machine';
import isEqual from 'react-fast-compare';

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

export const FilterList = chakra(({ className }: CollectionFiltersProps) => {
   const listRef = React.useRef<VariableSizeList>(null);
   const { facets, areRefined } = useFilteredFacets();
   const [state, send] = useMachine(
      createVirtualAccordionMachine<Facet>({
         items: facets,
         areRefined,
         sizeMap: {},
         expandedItemsIds: [],
         toggledItemId: undefined,
         toggledItemDelta: undefined,
      }),
      {
         actions: {
            setItemSize: assign((ctx, event) => {
               return produce(ctx, (draft) => {
                  if (event.type === 'ITEM_SIZE_UPDATED') {
                     const index = draft.items.findIndex(
                        (i) => i.name === event.id
                     );
                     if (index >= 0) {
                        if (event.id === draft.toggledItemId) {
                           draft.toggledItemDelta =
                              draft.sizeMap[event.id] - event.size;
                        }
                        draft.sizeMap[event.id] = event.size;
                        if (listRef.current) {
                           listRef.current.resetAfterIndex(index);
                        }
                     }
                  }
               });
            }),
            setItems: assign((ctx, event) => {
               return produce(ctx, (draft) => {
                  if (event.type === 'ITEMS_CHANGED') {
                     draft.items = event.items;
                  }
               });
            }),
            toggleItem: assign((ctx, event) => {
               return produce(ctx, (draft) => {
                  if (event.type === 'TOGGLE_ITEM') {
                     if (draft.expandedItemsIds.includes(event.id)) {
                        draft.expandedItemsIds = draft.expandedItemsIds.filter(
                           (id) => id !== event.id
                        );
                     } else {
                        draft.expandedItemsIds.push(event.id);
                     }
                     draft.toggledItemId = event.id;
                  }
               });
            }),
         },
      }
   );

   React.useEffect(() => {
      if (state.value === 'toggleItemAnimation') {
         const timeoutId = setTimeout(() => {
            send({
               type: 'TOGGLE_ITEM_ANIMATION_END',
            });
         }, 300);
         return () => {
            clearTimeout(timeoutId);
         };
      }
      if (state.value === 'itemsAnimation') {
         const timeoutId = setTimeout(() => {
            send({
               type: 'ITEMS_ANIMATION_END',
            });
         }, 300);
         return () => {
            clearTimeout(timeoutId);
         };
      }
   }, [send, state.value]);

   React.useEffect(() => {
      if (!isEqual(state.context.items, facets)) {
         console.log('items changed!');
         send({
            type: 'ITEMS_CHANGED',
            items: facets,
            areRefined,
         });
      }
   }, [areRefined, facets, send, state.context.items]);

   // React.useEffect(() => {
   //    console.log({ state });
   // }, [state]);

   const data = React.useMemo<ItemData>(() => {
      return [state, send];
   }, [state, send]);

   const getSize = React.useCallback(
      (index: number): number => {
         return state.context.sizeMap[state.context.items[index].name] || 41;
      },
      [state.context.items, state.context.sizeMap]
   );

   return (
      <Sizer className={className}>
         {({ height, width }) => {
            return (
               <>
                  <Box
                     // opacity={state.value === 'itemsAnimation' ? 0.0 : 1}
                     transition="opacity 100ms"
                  >
                     <VariableSizeList
                        ref={listRef}
                        height={height}
                        itemCount={state.context.items.length}
                        itemKey={itemKey}
                        itemSize={getSize}
                        estimatedItemSize={40}
                        width={width}
                        itemData={data}
                     >
                        {FilterRow}
                     </VariableSizeList>
                  </Box>
                  {/* {state.value === 'itemsAnimation' && (
                     <Box
                        position="absolute"
                        display="block"
                        top="50%"
                        left={width / 2}
                        transform="translateX(-50%)"
                     >
                        <Spinner color="brand.400" />
                     </Box>
                  )} */}
               </>
            );
         }}
      </Sizer>
   );
});

function itemKey(index: number, data: ItemData): string {
   const [state] = data;
   const item = state.context.items[index];
   return item.name;
}

function useFilteredFacets() {
   const facets = useFacets();
   const sortedFacets = React.useMemo(() => {
      return facets.slice().sort((a, b) => a.name.localeCompare(b.name));
   }, [facets]);
   const usefulFacets = React.useMemo(() => {
      return sortedFacets.filter(filterUselessFacet);
   }, [sortedFacets]);
   const refinedFacets = React.useMemo(() => {
      return usefulFacets.filter(filterNoMatchesFacet);
   }, [usefulFacets]);
   const displayedFacets = React.useMemo(() => {
      return refinedFacets.length > 0 ? refinedFacets : usefulFacets;
   }, [usefulFacets, refinedFacets]);
   return { facets: displayedFacets, areRefined: refinedFacets.length > 0 };
}

function filterUselessFacet(facet: Facet): boolean {
   return !FACET_BLOCKLIST.includes(facet.name) && facet.values.length > 1;
}

function filterNoMatchesFacet(facet: Facet): boolean {
   return facet.values.some((value) => value.filteredHitCount > 0);
}
