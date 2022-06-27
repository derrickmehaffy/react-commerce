import {
   Box,
   Button,
   CloseButton,
   Divider,
   Fade,
   Flex,
   HStack,
   Icon,
   IconButton,
   Portal,
   Text,
   useSafeLayoutEffect,
   VStack,
} from '@chakra-ui/react';
import { formatFacetName } from '@helpers/algolia-helpers';
import { WikiInfoEntry } from '@models/product-list/types';
import * as React from 'react';
import { HiArrowLeft, HiChevronRight } from 'react-icons/hi';
import {
   useClearRefinements,
   useRefinementList,
} from 'react-instantsearch-hooks-web';
import { RefinementList } from './RefinementList';
import { useCountRefinements } from './useCountRefinements';
import { useFilteredFacets } from './useFacets';

type FacetsDrawerProps = {
   isOpen: boolean;
   onClose: () => void;
   wikiInfo: WikiInfoEntry[];
};

export function FacetsDrawer({ isOpen, onClose, wikiInfo }: FacetsDrawerProps) {
   const facets = useFilteredFacets(wikiInfo);
   const [currentFacet, setCurrentFacet] = React.useState<string | null>(null);
   const countRefinements = useCountRefinements();

   useLockBodyScroll(isOpen);

   return (
      <Portal>
         <Fade in={isOpen} unmountOnExit>
            <Box
               position="fixed"
               bg="blackAlpha.600"
               top="0"
               w="100vw"
               h="100vh"
               zIndex="modal"
            />
         </Fade>
         <Flex
            position="fixed"
            top="0"
            w="100vw"
            zIndex="100000"
            transition="all 300ms"
            transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
         >
            <Flex
               bg="white"
               h="100vh"
               w="96"
               position="relative"
               direction="column"
            >
               <Flex align="center" justify="flex-end" p="2.5">
                  <Flex order={2} flexGrow={1} overflow="hidden">
                     <Text
                        width="full"
                        flexShrink={0}
                        fontWeight="semibold"
                        textAlign="center"
                        transition="all 0.2s ease-in-out"
                        transform={
                           currentFacet == null
                              ? 'translateX(0)'
                              : 'translateX(-100%)'
                        }
                     >
                        Filters
                     </Text>
                     <Text
                        w="full"
                        flexShrink={0}
                        fontWeight="semibold"
                        flexGrow={1}
                        textAlign="center"
                        transition="all 0.2s ease-in-out"
                        transform={
                           currentFacet == null
                              ? 'translateX(0)'
                              : 'translateX(-100%)'
                        }
                     >
                        {formatFacetName(currentFacet ?? '')}
                     </Text>
                  </Flex>
                  <Fade in={currentFacet != null}>
                     <IconButton
                        order={1}
                        aria-label="go back"
                        variant="ghost"
                        icon={
                           <Icon
                              as={HiArrowLeft}
                              boxSize="5"
                              color="gray.600"
                           />
                        }
                        onClick={() => setCurrentFacet(null)}
                     />
                  </Fade>
                  <CloseButton order={3} onClick={onClose} boxSize="10" />
               </Flex>
               <Divider borderColor="gray.300" />
               <Box
                  flexGrow={1}
                  overflowY="scroll"
                  overflowX="hidden"
                  position="relative"
               >
                  <Box>
                     {facets.map((facet) => {
                        const refinedCount = countRefinements([facet]);
                        return (
                           <FacetListItem
                              key={facet}
                              attribute={facet}
                              onSelect={setCurrentFacet}
                              refinedCount={refinedCount}
                           />
                        );
                     })}
                     {facets.map((facet) => {
                        return (
                           <FacetPanel
                              key={facet}
                              attribute={facet}
                              isOpen={facet === currentFacet}
                           />
                        );
                     })}
                  </Box>
               </Box>
               <Box>
                  <Divider borderColor="gray.300" />
                  <HStack p="2">
                     {facets.map((facet) => {
                        return (
                           <ClearFacetButton
                              key={facet}
                              attribute={facet}
                              isVisible={facet === currentFacet}
                           />
                        );
                     })}
                     <ClearAllButton isVisible={currentFacet == null} />
                     <Button
                        w="50%"
                        colorScheme="blue"
                        onClick={() => {
                           if (currentFacet == null) {
                              onClose();
                           } else {
                              setCurrentFacet(null);
                           }
                        }}
                     >
                        Apply
                     </Button>
                  </HStack>
               </Box>
            </Flex>
            <Box flexGrow={1} h="100vh" onClick={onClose} />
         </Flex>
      </Portal>
   );
}

type ClearFacetButtonProps = {
   attribute: string;
   isVisible: boolean;
};

function ClearFacetButton({ attribute, isVisible }: ClearFacetButtonProps) {
   const { items } = useRefinementList({ attribute });
   const { refine } = useClearRefinements({
      includedAttributes: [attribute],
   });
   const refinedCount = items.filter((item) => item.isRefined).length;
   if (!isVisible) {
      return null;
   }
   return (
      <Button
         w="50%"
         variant="outline"
         fontWeight="normal"
         disabled={refinedCount === 0}
         onClick={() => refine()}
      >
         {refinedCount > 1
            ? `Clear ${refinedCount} filters`
            : refinedCount === 1
            ? `Clear ${refinedCount} filter`
            : 'Clear'}
      </Button>
   );
}

type ClearAllButtonProps = {
   isVisible: boolean;
};

function ClearAllButton({ isVisible }: ClearAllButtonProps) {
   const { refine } = useClearRefinements();
   if (!isVisible) {
      return null;
   }
   return (
      <Button w="50%" variant="outline" onClick={() => refine()}>
         Clear all
      </Button>
   );
}

type FacetListItemProps = {
   attribute: string;
   refinedCount: number;
   onSelect: (attribute: string) => void;
};

function FacetListItem({
   attribute,
   refinedCount,
   onSelect,
}: FacetListItemProps) {
   const { items } = useRefinementList({ attribute });

   if (items.length === 0) {
      return null;
   }

   return (
      <Box pl="4" onClick={() => onSelect(attribute)}>
         <Flex py="4" pl="1.5" justify="space-between" align="center" pr="4">
            <Text fontSize="sm" color="gray.700">
               {formatFacetName(attribute)}
            </Text>
            <HStack>
               {refinedCount > 0 && (
                  <Text
                     rounded="full"
                     bg="gray.600"
                     color="white"
                     px="1.5"
                     fontSize="xs"
                  >
                     {refinedCount}
                  </Text>
               )}
               <Icon as={HiChevronRight} color="gray.500" boxSize="5" />
            </HStack>
         </Flex>
         <Divider />
      </Box>
   );
}

type FacetPanelProps = {
   attribute: string;
   isOpen: boolean;
};

function FacetPanel({ attribute, isOpen }: FacetPanelProps) {
   return (
      <Box
         position="absolute"
         transition="all 300ms"
         transform={isOpen ? 'translateX(0)' : 'translateX(100%)'}
         top="0"
         left="0"
         right="0"
         minH="full"
         bg="white"
         shadow={isOpen ? 'lg' : 'none'}
         p="5"
      >
         <VStack align="stretch" spacing="3">
            <RefinementList
               attribute={attribute}
               showMore
               showMoreLimit={200}
            />
         </VStack>
      </Box>
   );
}

function useLockBodyScroll(lock: boolean) {
   useSafeLayoutEffect(() => {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      if (lock) {
         document.body.style.overflow = 'hidden';
      }
      return () => {
         document.body.style.overflow = originalStyle;
      };
   }, [lock]);
}