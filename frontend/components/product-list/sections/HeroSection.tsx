import {
   AspectRatio,
   Box,
   BoxProps,
   Button,
   chakra,
   Collapse,
   Flex,
   forwardRef,
   Heading,
   HStack,
   Text,
   VStack,
} from '@chakra-ui/react';
import { useSearchParams } from '@lib/algolia';
import { useIsMounted } from '@lib/hooks';
import { ProductList } from '@models/product-list';
import Image from 'next/image';
import * as React from 'react';
import snarkdown from 'snarkdown';

export interface HeroSectionProps {
   productList: ProductList;
}

export function HeroSection({ productList }: HeroSectionProps) {
   const searchParams = useSearchParams();
   const hasDescription =
      productList.description != null &&
      productList.description.length > 0 &&
      searchParams.page === 1;
   return (
      <HStack align="flex-start" spacing="10">
         <VStack flex={1} align="flex-start">
            {!hasDescription &&
            productList.image != null &&
            searchParams.page === 1 ? (
               <HeroBackgroundImage src={productList.image.url}>
                  <VStack>
                     <HeroTitle color="white">{productList.title}</HeroTitle>
                     {productList.tagline && productList.tagline.length > 0 && (
                        <Text
                           fontWeight="bold"
                           fontSize="xl"
                           color="gray.50"
                           px={{ base: 6, sm: 0 }}
                        >
                           {productList.tagline}
                        </Text>
                     )}
                  </VStack>
               </HeroBackgroundImage>
            ) : (
               <>
                  <HeroTitle>
                     {productList.title}
                     {searchParams.page > 1
                        ? ` - Page ${searchParams.page}`
                        : ''}
                  </HeroTitle>
                  {productList.tagline &&
                     productList.tagline.length > 0 &&
                     searchParams.page === 1 && (
                        <Text
                           fontWeight="bold"
                           fontSize="xl"
                           px={{ base: 6, sm: 0 }}
                        >
                           {productList.tagline}
                        </Text>
                     )}
               </>
            )}
            {hasDescription && (
               <HeroDescription>{productList.description}</HeroDescription>
            )}
         </VStack>
         {productList.image && hasDescription && (
            <HeroImage
               src={productList.image.url}
               alt={productList.image.alternativeText || undefined}
            />
         )}
      </HStack>
   );
}

const HeroTitle = chakra(
   ({
      children,
      className,
   }: React.PropsWithChildren<{ className?: string }>) => {
      return (
         <Heading
            as="h1"
            className={className}
            size="xl"
            fontFamily="Archivo Black"
            px={{ base: 6, sm: 0 }}
         >
            {children}
         </Heading>
      );
   }
);

const NUMBER_OF_LINES = 4;
const LINE_HEIGHT = 25;
const VISIBLE_HEIGHT = NUMBER_OF_LINES * LINE_HEIGHT;

type HeroDescriptionProps = {
   children: string;
};

function HeroDescription({ children }: HeroDescriptionProps) {
   const [state, setState] = React.useState({
      isOpen: false,
      shouldDisplayShowMore: false,
   });

   const onToggle = React.useCallback(() => {
      setState((current) => {
         return {
            ...current,
            isOpen: !current.isOpen,
         };
      });
   }, []);

   const textRef = React.useRef<HTMLParagraphElement | null>(null);

   React.useEffect(() => {
      if (textRef.current) {
         const height = textRef.current.getBoundingClientRect().height;
         if (height > VISIBLE_HEIGHT) {
            setState((current) => ({
               ...current,
               shouldDisplayShowMore: true,
            }));
         }
      }
   }, []);

   const isMounted = useIsMounted();

   return (
      <Box px={{ base: 6, sm: 0 }}>
         {isMounted ? (
            <Collapse
               ref={textRef}
               startingHeight={VISIBLE_HEIGHT}
               in={state.isOpen}
            >
               <DescriptionRichText>{children}</DescriptionRichText>
            </Collapse>
         ) : (
            <Box maxH={VISIBLE_HEIGHT} overflow="hidden">
               <DescriptionRichText ref={textRef}>
                  {children}
               </DescriptionRichText>
            </Box>
         )}
         {state.shouldDisplayShowMore && (
            <Button
               variant="link"
               color="gray.800"
               size="sm"
               onClick={onToggle}
               mt="1"
               pl="2"
               pr="2"
               py="1"
               ml="-8px"
               display="block"
            >
               {state.isOpen ? 'Show less' : 'Show more'}
            </Button>
         )}
      </Box>
   );
}

type DescriptionRichTextProps = Omit<BoxProps, 'children'> & {
   children: string;
};

const DescriptionRichText = forwardRef<DescriptionRichTextProps, 'div'>(
   ({ children, ...other }, ref) => {
      const html = React.useMemo(() => {
         return snarkdown(children);
      }, [children]);

      return (
         <Box
            sx={{
               a: {
                  color: 'brand.500',
                  transition: 'color 300ms',
                  '&:hover': {
                     color: 'brand.600',
                  },
               },
            }}
            ref={ref}
            dangerouslySetInnerHTML={{ __html: html }}
            {...other}
         />
      );
   }
);

interface HeroImageProps {
   className?: string;
   src: string;
   alt?: string;
}

const HeroImage = chakra(({ className, src, alt }: HeroImageProps) => {
   return (
      <AspectRatio
         className={className}
         flex={1}
         maxW="450px"
         ratio={4 / 3}
         display={{
            base: 'none',
            md: 'block',
         }}
         borderRadius="lg"
         overflow="hidden"
         boxShadow="base"
      >
         <Image src={src} alt={alt} layout="fill" priority sizes="50vw" />
      </AspectRatio>
   );
});

type HeroBackgroundImageProps = React.PropsWithChildren<{
   src: string;
}>;

const HeroBackgroundImage = chakra(
   ({ children, src }: HeroBackgroundImageProps) => {
      return (
         <Box
            w="full"
            backgroundImage={`url("${src}")`}
            backgroundSize="cover"
            borderRadius={{
               base: 0,
               sm: 'xl',
            }}
            overflow="hidden"
         >
            <Flex
               grow={1}
               bgColor="blackAlpha.800"
               align="center"
               justify="center"
               py={20}
            >
               {children}
            </Flex>
         </Box>
      );
   }
);