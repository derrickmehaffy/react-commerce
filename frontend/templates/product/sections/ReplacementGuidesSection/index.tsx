import {
   Box,
   Divider,
   Flex,
   forwardRef,
   Heading,
   HStack,
   SimpleGrid,
   TagProps,
   Text,
} from '@chakra-ui/react';
import { IfixitImage } from '@components/ifixit-image';
import { IconBadge } from '@components/ui';
import {
   faClock,
   faGauge,
   faGaugeHigh,
   faGaugeLow,
   faGaugeMax,
   faGaugeMin,
} from '@fortawesome/pro-solid-svg-icons';
import { PageContentWrapper } from '@ifixit/ui';
import { Product } from '@models/product';

export type ReplacementGuidesSectionProps = {
   product: Product;
};

export function ReplacementGuidesSection({
   product,
}: ReplacementGuidesSectionProps) {
   if (product.replacementGuides.length === 0) {
      return null;
   }

   return (
      <Box
         my="16"
         px={{
            base: 5,
            sm: 0,
         }}
      >
         <PageContentWrapper>
            <Heading
               as="h2"
               fontFamily="Archivo Black"
               color="gray.700"
               textAlign="center"
               mb={{
                  base: 6,
                  md: 16,
               }}
               size="lg"
            >
               Replacement Guides
            </Heading>
            <SimpleGrid
               columns={{
                  base: 1,
                  lg: 2,
               }}
               spacing="8"
            >
               {product.replacementGuides.map((guide) => {
                  const hasBadges =
                     isPresent(guide.difficulty) ||
                     isPresent(guide.time_required);
                  return (
                     <Flex
                        key={guide.id}
                        minH={{
                           base: 'auto',
                           md: '150px',
                        }}
                        bg="white"
                        overflow="hidden"
                        borderColor="gray.300"
                        borderWidth="1px"
                        borderRadius="md"
                        // align="center"
                     >
                        {guide.image_url && (
                           <>
                              <Flex
                                 align="center"
                                 justify="center"
                                 width={{
                                    base: '96px',
                                    md: '176px',
                                 }}
                                 height={{
                                    base: '96px',
                                    md: 'full',
                                 }}
                                 my={{
                                    base: 3,
                                    md: 0,
                                 }}
                                 ml={{
                                    base: 3,
                                    md: 0,
                                 }}
                                 borderColor="gray.300"
                                 borderWidth={{
                                    base: '1px',
                                    md: '0',
                                 }}
                                 borderRadius={{
                                    base: 'md',
                                    md: 'none',
                                 }}
                                 overflow="hidden"
                                 flexGrow={0}
                                 flexShrink={0}
                                 position="relative"
                              >
                                 <IfixitImage
                                    src={guide.image_url}
                                    alt=""
                                    objectFit="cover"
                                    layout="fill"
                                    sizes="20vw"
                                    priority
                                 />
                              </Flex>
                              <Divider
                                 orientation="vertical"
                                 display={{
                                    base: 'none',
                                    md: 'block',
                                 }}
                              />
                           </>
                        )}
                        <Flex direction="column" px="3" py="3">
                           <Text
                              as="a"
                              href={guide.guide_url}
                              fontWeight="bold"
                              fontSize="sm"
                              lineHeight="short"
                              noOfLines={3}
                              flexShrink={0}
                           >
                              {guide.title}
                           </Text>
                           {isPresent(guide.summary) && (
                              <Text
                                 fontSize="sm"
                                 mt="1"
                                 flexShrink={0}
                                 flexGrow={0}
                                 noOfLines={1}
                                 display={{
                                    base: 'none',
                                    md: '-webkit-box',
                                 }}
                              >
                                 {guide.summary}
                              </Text>
                           )}
                           {hasBadges && (
                              <HStack mt="3">
                                 {isPresent(guide.time_required) && (
                                    <IconBadge icon={faClock}>
                                       {guide.time_required}
                                    </IconBadge>
                                 )}
                                 {isPresent(guide.difficulty) && (
                                    <DifficultyBadge
                                       difficulty={guide.difficulty}
                                    />
                                 )}
                              </HStack>
                           )}
                        </Flex>
                     </Flex>
                  );
               })}
            </SimpleGrid>
         </PageContentWrapper>
      </Box>
   );
}

function isPresent(text: any): text is string {
   return typeof text === 'string' && text.length > 0;
}

type DifficultyBadgeProps = TagProps & {
   difficulty: string;
};

const DifficultyBadge = forwardRef<DifficultyBadgeProps, 'div'>(
   ({ difficulty, ...props }, ref) => {
      switch (difficulty.toLowerCase()) {
         case 'very easy': {
            return (
               <IconBadge
                  ref={ref}
                  {...props}
                  colorScheme="green"
                  icon={faGaugeMin}
               >
                  {difficulty}
               </IconBadge>
            );
         }
         case 'easy': {
            return (
               <IconBadge
                  ref={ref}
                  {...props}
                  colorScheme="green"
                  icon={faGaugeLow}
               >
                  {difficulty}
               </IconBadge>
            );
         }
         case 'moderate': {
            return (
               <IconBadge
                  ref={ref}
                  {...props}
                  colorScheme="amber"
                  icon={faGauge}
               >
                  {difficulty}
               </IconBadge>
            );
         }
         case 'difficult': {
            return (
               <IconBadge
                  ref={ref}
                  {...props}
                  colorScheme="red"
                  icon={faGaugeHigh}
               >
                  {difficulty}
               </IconBadge>
            );
         }
         case 'very difficult': {
            return (
               <IconBadge
                  ref={ref}
                  {...props}
                  colorScheme="red"
                  icon={faGaugeMax}
               >
                  {difficulty}
               </IconBadge>
            );
         }
         default: {
            return (
               <IconBadge ref={ref} {...props} icon={faGauge}>
                  {difficulty}
               </IconBadge>
            );
         }
      }
   }
);