import { Radio, Text, VStack } from '@chakra-ui/react';
import { FacetOption, useFacetFilter, useFacet } from '@lib/algolia';
import * as React from 'react';
import { FilterCheckbox } from './FilterCheckbox';

export type FacetFilterProps = {
   facetHandle: string;
   multiple?: boolean;
   showAllValues?: boolean;
   sortItems?(a: FacetOption, b: FacetOption): number;
   renderItem?(
      item: FacetOption,
      index: number,
      list: FacetOption[]
   ): React.ReactNode;
};

export function FacetFilter({
   facetHandle,
   multiple = false,
   showAllValues = false,
   renderItem,
   sortItems = defaultSortItems,
}: FacetFilterProps) {
   const facet = useFacet(facetHandle);
   const { selectedOptions, toggle, set } = useFacetFilter(facetHandle);

   const facetOptions = React.useMemo(() => {
      return Object.keys(facet.optionsByHandle).map(
         (handle) => facet.optionsByHandle[handle]
      );
   }, [facet.optionsByHandle]);

   const filteredOptions = React.useMemo(() => {
      return facetOptions
         .filter((option) => option.filteredHitCount > 0)
         .sort(sortItems);
   }, [facetOptions, sortItems]);

   const visibleOptions = React.useMemo(() => {
      const options = showAllValues
         ? facetOptions.slice()
         : filteredOptions.slice();
      options.sort(sortItems);
      return options;
   }, [facetOptions, filteredOptions, showAllValues, sortItems]);

   const handleChange = React.useCallback(
      (optionHandle: string) => {
         toggle(optionHandle);
      },
      [toggle]
   );

   return (
      <VStack align="flex-start">
         {visibleOptions.map((option, index) => {
            if (multiple) {
               return (
                  <FilterCheckbox
                     key={option.handle}
                     name={option.handle}
                     isChecked={selectedOptions.includes(option.handle)}
                     onChange={handleChange}
                  >
                     {renderItem
                        ? renderItem(option, index, facetOptions)
                        : option.value}
                  </FilterCheckbox>
               );
            }
            return (
               <Radio
                  key={option.handle}
                  value={option.handle}
                  isChecked={selectedOptions.includes(option.handle)}
                  onChange={() => set(option.handle)}
               >
                  <Text fontSize="sm">
                     {renderItem
                        ? renderItem(option, index, facetOptions)
                        : option.value}
                  </Text>
               </Radio>
            );
         })}
      </VStack>
   );
}

function defaultSortItems(a: FacetOption, b: FacetOption): number {
   return a.value.localeCompare(b.value);
}
