import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { Card } from '@components/Card';
import {
   ProductCard,
   ProductCardBody,
   ProductCardImage,
   ProductCardPrice,
   ProductCardTitle,
} from '@components/ProductCard';
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '@config/env';
import { ProductHit } from '@features/collection';
import { AlgoliaProvider, useHits } from '@lib/algolia';
import Image from 'next/image';
import NextLink from 'next/link';
import * as React from 'react';

export interface FeaturedCollectionSection {
   handle: string;
   title: string;
   description: string;
   imageSrc?: string;
   imageAlt?: string;
   algoliaIndexName: string;
}

export function FeaturedCollectionSection({
   handle,
   title,
   description,
   imageAlt,
   imageSrc,
   algoliaIndexName,
}: FeaturedCollectionSection) {
   return (
      <Card
         overflow="hidden"
         borderRadius={{
            base: 'none',
            sm: 'lg',
         }}
      >
         <Flex
            direction={{
               base: 'column',
               sm: 'row',
            }}
         >
            <Box
               position="relative"
               flexShrink={0}
               w={{
                  base: 'full',
                  sm: '300px',
                  lg: '400px',
               }}
               maxH={{
                  base: '240px',
                  sm: 'unset',
               }}
               overflow="hidden"
               display="flex"
               alignItems="center"
            >
               {imageSrc && (
                  <Image
                     src={imageSrc}
                     alt={imageAlt}
                     objectFit="contain"
                     layout="fill"
                  />
               )}
               <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="blackAlpha.700"
               ></Box>
               <Box w="full" position="relative" py="10">
                  <VStack
                     px={{
                        base: '5',
                        sm: '7',
                        lg: '14',
                     }}
                     align="flex-start"
                     spacing="4"
                  >
                     <Heading
                        fontSize={{
                           base: title.length > 40 ? 'xl' : '2xl',
                           sm: title.length > 30 ? 'lg' : '2xl',
                           lg: title.length > 40 ? '2xl' : '3xl',
                        }}
                        fontFamily="Archivo Black"
                        color="white"
                        noOfLines={3}
                     >
                        {title}
                     </Heading>
                     <Text color="white" noOfLines={2}>
                        {description}
                     </Text>
                     <NextLink href={`/collections/${handle}`} passHref>
                        <Button
                           as="a"
                           variant="outline"
                           color="white"
                           fontSize="sm"
                           colorScheme="whiteAlpha"
                        >
                           View more
                        </Button>
                     </NextLink>
                  </VStack>
               </Box>
            </Box>
            <Box flexGrow={1}>
               <AlgoliaProvider
                  key={handle}
                  appId={ALGOLIA_APP_ID}
                  apiKey={ALGOLIA_API_KEY}
                  initialIndexName={algoliaIndexName}
                  filtersPreset={`collections:${handle}`}
                  productsPerPage={3}
               >
                  <ProductList />
               </AlgoliaProvider>
            </Box>
         </Flex>
      </Card>
   );
}

function ProductList() {
   const hits = useHits<ProductHit>();
   return (
      <Flex>
         {hits.map((hit) => {
            return <ProductListItem key={hit.handle} product={hit} />;
         })}
      </Flex>
   );
}

interface ProductListItemProps {
   product: ProductHit;
}

function ProductListItem({ product }: ProductListItemProps) {
   return (
      <ProductCard
         w="33%"
         flexGrow={1}
         sx={{
            '&:nth-of-type(n+3)': {
               display: {
                  base: 'none',
                  md: 'block',
               },
            },
         }}
      >
         <ProductCardImage src={product.product_image} alt={product.title} />
         <ProductCardBody>
            <ProductCardTitle>{product.title}</ProductCardTitle>
            <ProductCardPrice price={product.price} />
         </ProductCardBody>
      </ProductCard>
   );
}