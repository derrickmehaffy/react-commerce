import {
   Avatar,
   Box,
   Button,
   Flex,
   Grid,
   GridItem,
   Heading,
   HStack,
   Link,
   Progress,
   Stack,
   Tag,
   Text,
   VStack,
} from '@chakra-ui/react';
import { Rating } from '@components/ui';
import { faPenToSquare, faShieldCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppContext } from '@ifixit/app';
import { PageContentWrapper } from '@ifixit/ui';
import type { Product } from '@models/product';
import { ProductVariant } from '@models/product';
import React from 'react';
import { useProductReviews } from '../../hooks/useProductReviews';

const INITIAL_VISIBILE_REVIEWS = 3;

export type ReviewsSectionProps = {
   product: Product;
   selectedVariant: ProductVariant;
};

export function ReviewsSection({
   product,
   selectedVariant,
}: ReviewsSectionProps) {
   const appContext = useAppContext();
   const reviewsQuery = useProductReviews(product);
   const [visibleReviewsCount, setVisibleReviewsCount] = React.useState(
      INITIAL_VISIBILE_REVIEWS
   );

   const reviewsData = reviewsQuery.data;

   console.log('reviewsData', reviewsData);

   const totalReviewsCount = reviewsData?.count ?? 0;

   const reviewCountsByRating = React.useMemo(() => {
      if (reviewsData?.groupedReviews == null) {
         return [];
      }
      const reviewsCount: RatingCount[] = Object.keys(
         reviewsData.groupedReviews
      ).map((current) => {
         const rating = parseInt(current, 10);
         const count = reviewsData?.groupedReviews?.[current] ?? 0;
         return { rating, count };
      });
      reviewsCount.sort((a, b) => b.rating - a.rating);
      return reviewsCount;
   }, [reviewsData?.groupedReviews]);

   const allReviews = reviewsData?.reviews ?? [];
   const visibleReviews = allReviews.slice(0, visibleReviewsCount) ?? [];
   const hasMoreReviews = visibleReviewsCount < allReviews.length;

   const showMoreReviews = () => {
      setVisibleReviewsCount(
         Math.min(allReviews.length, visibleReviewsCount + 20)
      );
   };

   const hasReview =
      reviewsData != null &&
      reviewsData.reviews != null &&
      reviewsData.reviews.length > 0;

   if (!hasReview) {
      // TODO: Add an empty state to allow users to write a review when there are no reviews
      return null;
   }

   return (
      <Box bg="white" px={{ base: 5, sm: 0 }} py="16" fontSize="sm">
         <PageContentWrapper>
            <Heading
               as="h2"
               fontFamily="Archivo Black"
               color="gray.700"
               textAlign="center"
               mb={{
                  base: 8,
                  md: 16,
               }}
            >
               Customer reviews
            </Heading>
            {totalReviewsCount > 0 && (
               <Stack
                  direction={{
                     base: 'column-reverse',
                     md: 'row',
                  }}
                  spacing="8"
                  align="center"
                  justify="center"
               >
                  <Grid
                     templateColumns="auto 200px auto"
                     gap="2.5"
                     alignItems="center"
                  >
                     {reviewCountsByRating.map(({ rating, count }) => {
                        const percentage = (count / totalReviewsCount) * 100;
                        return (
                           <React.Fragment key={rating}>
                              <GridItem mt="-1px">
                                 <Text as="span" fontSize="xs">
                                    {rating}
                                 </Text>
                              </GridItem>
                              <GridItem>
                                 <Progress
                                    w="200px"
                                    value={percentage}
                                    rounded="full"
                                 />
                              </GridItem>
                              <GridItem>
                                 <Tag
                                    justifyContent="center"
                                    w="full"
                                    colorScheme="brand"
                                 >
                                    {count}
                                 </Tag>
                              </GridItem>
                           </React.Fragment>
                        );
                     })}
                  </Grid>
                  <Flex direction="column" align="center">
                     <Text fontSize="5xl">{reviewsData.average}</Text>
                     <Rating value={reviewsData.average ?? 0} />
                     {reviewsData.count && (
                        <Text fontSize="sm">{reviewsData.count} reviews</Text>
                     )}
                  </Flex>
               </Stack>
            )}
            <Flex
               bg="gray.100"
               p="5"
               rounded="md"
               mt={{
                  base: 8,
                  sm: 24,
               }}
            >
               <Button
                  as="a"
                  href={`${appContext.ifixitOrigin}/User/Reviews/${selectedVariant.sku}`}
                  colorScheme="brand"
                  leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                  w={{
                     base: 'full',
                     sm: 'auto',
                  }}
               >
                  Write a review
               </Button>
            </Flex>
            <Box>
               {visibleReviews.map((review) => {
                  return (
                     <Box
                        key={review.reviewid}
                        py="6"
                        borderBottomWidth="1px"
                        borderColor="gray.200"
                     >
                        {review.author && (
                           <HStack>
                              <Avatar
                                 name={review.author.name}
                                 src={review.author.avatar}
                                 showBorder
                                 borderColor="brand.500"
                                 size="md"
                              />
                              <VStack align="flex-start" spacing="0">
                                 <Link
                                    href={review.author.url}
                                    fontWeight="bold"
                                 >
                                    {review.author.name}
                                 </Link>
                                 <HStack spacing="1" color="green.500">
                                    <FontAwesomeIcon
                                       icon={faShieldCheck}
                                       fontSize="1rem"
                                    />
                                    <Text fontWeight="bold" color="green.600">
                                       Verified buyer
                                    </Text>
                                 </HStack>
                              </VStack>
                           </HStack>
                        )}
                        <HStack my="4">
                           <Rating value={review.rating} />
                           {review.created_date && (
                              <Text mt="4" fontWeight="bold" color="gray.500">
                                 {formatReviewDate(review.created_date)}
                              </Text>
                           )}
                        </HStack>
                        <Text fontWeight="bold" my="4">
                           {review.productName} | {review.productVariantName}
                        </Text>
                        {review.body && (
                           <Box
                              dangerouslySetInnerHTML={{
                                 __html: review.body,
                              }}
                           />
                        )}
                     </Box>
                  );
               })}
            </Box>
            {hasMoreReviews && (
               <Box textAlign="center" mt="6">
                  <Button variant="outline" onClick={showMoreReviews}>
                     see more reviews
                  </Button>
               </Box>
            )}
         </PageContentWrapper>
      </Box>
   );
}

type RatingCount = {
   rating: number;
   count: number;
};

function formatReviewDate(timeSeconds: number) {
   const formatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
   const date = new Date(timeSeconds * 1000);
   let duration = (date.getTime() - new Date().getTime()) / 1000;

   for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i];
      if (Math.abs(duration) < division.amount) {
         return formatter.format(Math.round(duration), division.name);
      }
      duration /= division.amount;
   }
}

type Division = {
   amount: number;
   name: Intl.RelativeTimeFormatUnit;
};

const DIVISIONS: Division[] = [
   { amount: 60, name: 'seconds' },
   { amount: 60, name: 'minutes' },
   { amount: 24, name: 'hours' },
   { amount: 7, name: 'days' },
   { amount: 4.34524, name: 'weeks' },
   { amount: 12, name: 'months' },
   { amount: Number.POSITIVE_INFINITY, name: 'years' },
];
