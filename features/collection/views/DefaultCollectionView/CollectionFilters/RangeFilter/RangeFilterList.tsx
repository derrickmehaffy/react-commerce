import { Checkbox, Radio, Text, VStack } from '@chakra-ui/react';
import {
   FacetValueState,
   ListFilter,
   useFacetFilterList,
   useFacetValues,
} from '@lib/algolia';
import * as React from 'react';
import { useRangeFilterContext, useRegisterFacet } from './context';

export type RangeFilterListProps = {
   facetName: string;
   type?: ListFilter['type'];
   multiple?: boolean;
   sortItems?(a: FacetValueState, b: FacetValueState): number;
   renderItem?(
      item: FacetValueState,
      index: number,
      list: FacetValueState[]
   ): React.ReactNode;
};

export function RangeFilterList({
   facetName,
   type = 'or',
   multiple = false,
   renderItem,
   sortItems = defaultSortItems,
}: RangeFilterListProps) {
   const { getFacetNames } = useRangeFilterContext();
   const { isLoaded, values } = useFacetValues(facetName);
   const { selectedValueIds, toggle, set } = useFacetFilterList(facetName, {
      filterType: type,
   });
   useRegisterFacet(facetName);

   const items = React.useMemo(() => {
      return values.slice().sort(sortItems);
   }, [sortItems, values]);

   if (!isLoaded) {
      return null;
   }
   return (
      <VStack align="flex-start">
         {items.map((item, index) => {
            if (multiple) {
               return (
                  <Checkbox
                     key={index}
                     isChecked={selectedValueIds.includes(item.id)}
                     onChange={() => {
                        const facetNames = getFacetNames();
                        const facetToBeCleared = facetNames.filter(
                           (name) => name !== facetName
                        );
                        toggle(item.id, { clearFacets: facetToBeCleared });
                     }}
                  >
                     <Text fontSize="sm">
                        {renderItem
                           ? renderItem(item, index, values)
                           : item.value}
                     </Text>
                  </Checkbox>
               );
            }
            return (
               <Radio
                  key={index}
                  value={item.value}
                  isChecked={selectedValueIds.includes(item.id)}
                  onChange={() => {
                     const facetNames = getFacetNames();
                     const facetToBeCleared = facetNames.filter(
                        (name) => name !== facetName
                     );
                     set(item.id, { clearFacets: facetToBeCleared });
                  }}
               >
                  <Text fontSize="sm">
                     {renderItem ? renderItem(item, index, values) : item.value}
                  </Text>
               </Radio>
            );
         })}
      </VStack>
   );
}

function defaultSortItems(a: FacetValueState, b: FacetValueState): number {
   return a.value.localeCompare(b.value);
}
