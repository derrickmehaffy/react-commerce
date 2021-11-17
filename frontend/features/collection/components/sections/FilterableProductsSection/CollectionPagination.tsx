import { useBreakpointValue } from '@chakra-ui/react';
import {
   Pagination,
   PaginationItem,
   PaginationLink,
} from '@ifixit/react-components';
import { usePagination } from '@lib/algolia';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import * as React from 'react';
import {
   HiChevronDoubleLeft,
   HiChevronDoubleRight,
   HiChevronLeft,
   HiChevronRight,
} from 'react-icons/hi';

export function CollectionPagination() {
   const getCollectionPageUrl = useGetCollectionPageUrl();
   const visibleNumberOfPages = useBreakpointValue({ base: 3, sm: 5, lg: 7 });
   const { page, setPage, numberOfPages = 0 } = usePagination();

   if (numberOfPages <= 1) {
      return null;
   }
   return (
      <Pagination
         numberOfPages={numberOfPages}
         page={page}
         onChange={setPage}
         pt={12}
         pb={8}
         visibleNumberOfPages={visibleNumberOfPages}
      >
         {(pagination) => (
            <>
               <PaginationItem>
                  <PaginationLink
                     href={getCollectionPageUrl(1)}
                     aria-label="Go to first page"
                     page="first"
                     icon={HiChevronDoubleLeft}
                     onClick={(event) => {
                        event.preventDefault();
                        pagination.first();
                     }}
                  />
               </PaginationItem>
               <PaginationItem>
                  <PaginationLink
                     aria-label="Go to previous page"
                     href={
                        pagination.hasPrevious
                           ? getCollectionPageUrl(pagination.currentPage - 1)
                           : undefined
                     }
                     page="previous"
                     icon={HiChevronLeft}
                     onClick={(event) => {
                        event.preventDefault();
                        pagination.previous();
                     }}
                  />
               </PaginationItem>
               {pagination.pages.map((page) => (
                  <PaginationItem key={page}>
                     <PaginationLink
                        aria-label={
                           pagination.currentPage === page
                              ? 'current page'
                              : `go to page ${page}`
                        }
                        page={page}
                        href={getCollectionPageUrl(page)}
                        onClick={(event) => {
                           event.preventDefault();
                           pagination.goto(page);
                        }}
                     />
                  </PaginationItem>
               ))}
               <PaginationItem>
                  <PaginationLink
                     aria-label="Go to next page"
                     page="next"
                     href={
                        pagination.hasNext
                           ? getCollectionPageUrl(pagination.currentPage + 1)
                           : undefined
                     }
                     icon={HiChevronRight}
                     onClick={(event) => {
                        event.preventDefault();
                        pagination.next();
                     }}
                  />
               </PaginationItem>
               <PaginationItem>
                  <PaginationLink
                     aria-label="Go to last page"
                     page="last"
                     href={getCollectionPageUrl(pagination.numberOfPages)}
                     icon={HiChevronDoubleRight}
                     onClick={(event) => {
                        event.preventDefault();
                        pagination.last();
                     }}
                  />
               </PaginationItem>
            </>
         )}
      </Pagination>
   );
}

function useGetCollectionPageUrl() {
   const router = useRouter();
   const { handle, p, ...other } = router.query;
   return (page: number) => {
      let query;
      if (page > 1) {
         query = queryString.stringify({ ...other, p: page });
      } else {
         query = queryString.stringify({ ...other });
      }
      return `/collections/${handle}${query.length > 0 ? `?${query}` : ''}`;
   };
}