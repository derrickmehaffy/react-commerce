import {
   Box,
   Button,
   Collapse,
   Divider,
   Flex,
   HStack,
   Tag,
   TagCloseButton,
   TagLabel,
   VStack,
   Wrap,
   WrapItem,
} from '@chakra-ui/react';
import { Card } from '@components/Card';
import {
   CollectionFilters,
   CollectionPagination,
   CollectionProducts,
   CollectionToolbar,
   ProductViewType,
} from '@features/collection/components';
import {
   AtomicFilter,
   useAtomicFilters,
   useClearFilter,
   useSearchStateContext,
} from '@lib/algolia';
import { assertNever } from '@lib/utils';
import * as React from 'react';

export const FilterableProductView = React.memo(() => {
   const [productViewType, setProductViewType] = React.useState(
      ProductViewType.List
   );
   return (
      <VStack align="stretch" mb="4" spacing="4">
         <CollectionToolbar
            productViewType={productViewType}
            onProductViewTypeChange={setProductViewType}
         />
         <HStack align="flex-start" spacing={{ base: 0, md: 4 }}>
            <FilterCard>
               <AppliedFilterSection />
               <CollectionFilters />
            </FilterCard>
            <Card
               flex={1}
               alignItems="center"
               borderRadius={{ base: 'none', sm: 'lg' }}
            >
               <CollectionProducts viewType={productViewType} />
               <CollectionPagination />
            </Card>
         </HStack>
      </VStack>
   );
});

const FilterCard = ({ children }: React.PropsWithChildren<unknown>) => {
   return (
      <Card
         py="6"
         width="250px"
         display={{ base: 'none', md: 'block' }}
         position="sticky"
         top="4"
         h="calc(100vh - var(--chakra-space-4) * 2)"
      >
         {children}
      </Card>
   );
};

const AppliedFilterSection = () => {
   const atomicFilters = useAtomicFilters();
   const clear = useClearFilter();
   const clearAllFilters = React.useCallback(() => {
      clear();
   }, [clear]);
   return (
      <Collapse in={atomicFilters.length > 0} animateOpacity>
         <VStack align="flex-start" px="6" spacing="4">
            <Flex justify="space-between" w="full">
               <Box fontWeight="semibold">Applied filters</Box>
               <Button variant="link" onClick={clearAllFilters}>
                  Clear all
               </Button>
            </Flex>
            <Wrap w="full">
               {atomicFilters.map((filter) => {
                  return (
                     <WrapItem key={filter.id}>
                        <FilterTag filter={filter} />
                     </WrapItem>
                  );
               })}
            </Wrap>
            <Divider />
         </VStack>
      </Collapse>
   );
};

interface FilterTagProps {
   filter: AtomicFilter;
}

const FilterTag = ({ filter }: FilterTagProps) => {
   const state = useSearchStateContext();
   const clear = useClearFilter();
   const valuesById = state.facetValues.byId;

   const value = React.useMemo(() => {
      switch (filter.type) {
         case 'basic': {
            return valuesById[filter.valueId].value;
         }
         case 'numeric-comparison': {
            return `${filter.operator} ${filter.value}`;
         }
         case 'numeric-range': {
            return `${filter.range.min} - ${filter.range.max}`;
         }
         default:
            return assertNever(filter);
      }
   }, [filter, valuesById]);

   const clearFilter = React.useCallback(() => {
      clear(filter.id);
   }, [clear, filter.id]);

   return (
      <Tag size="sm" borderRadius="full" variant="subtle" colorScheme="gray">
         <TagLabel>{value}</TagLabel>
         <TagCloseButton onClick={clearFilter} />
      </Tag>
   );
};
