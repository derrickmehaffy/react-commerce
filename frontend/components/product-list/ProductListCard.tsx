import { Box, Divider, Flex, forwardRef, Heading } from '@chakra-ui/react';
import { IfixitImage } from '@ifixit/ui';

interface ProductListCardProps {
   variant?: 'small' | 'medium';
   productList: {
      title: string;
      description?: string | null;
      imageUrl?: string | null;
   };
}

export const ProductListCard = forwardRef<ProductListCardProps, 'div'>(
   ({ productList, variant = 'small', ...other }, ref) => {
      return (
         <Box
            ref={ref}
            display="block"
            bg="white"
            borderRadius="lg"
            boxShadow="base"
            _hover={{
               boxShadow: 'md',
            }}
            transition="box-shadow 300ms"
            outline="none"
            overflow="hidden"
            h={{
               base: '60px',
               md: variant === 'small' ? '60px' : '120px',
            }}
            _focus={{
               boxShadow: 'outline',
            }}
            {...other}
         >
            <Flex
               h="full"
               direction="row"
               align="center"
               justifyContent="center"
               minH="inherit"
            >
               {productList.imageUrl && (
                  <>
                     <Flex
                        align="center"
                        justify="center"
                        flexBasis={{
                           base: '80px',
                           md: variant === 'small' ? '80px' : '160px',
                        }}
                        h="full"
                        flexGrow={0}
                        flexShrink={0}
                        p={{
                           base: 0,
                           md: variant === 'small' ? 0 : 3,
                        }}
                     >
                        <Box position="relative" h="full" w="full">
                           <IfixitImage
                              src={productList.imageUrl}
                              alt=""
                              objectFit="cover"
                              layout="fill"
                              sizes="20vw"
                              priority
                           />
                        </Box>
                     </Flex>
                     <Divider orientation="vertical" />
                  </>
               )}
               <Flex
                  px="4"
                  py="2"
                  boxSizing="border-box"
                  h="full"
                  justify="center"
                  direction="column"
                  flexGrow={1}
               >
                  <Heading as="span" fontSize="sm">
                     {productList.title}
                  </Heading>
                  {variant === 'medium' && productList.description && (
                     <Box
                        mt="1"
                        display={{ base: 'none', md: 'block' }}
                        color="gray.600"
                        fontSize="sm"
                        dangerouslySetInnerHTML={{
                           __html: productList.description,
                        }}
                     />
                  )}
               </Flex>
            </Flex>
         </Box>
      );
   }
);
