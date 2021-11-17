import { Awaited, ObjectLiteral } from '@lib/utils';
import { SearchIndex } from 'algoliasearch/lite';

export interface SearchContext<Hit = any> {
   params: SearchParams;
   numberOfPages?: number;
   numberOfHits?: number;
   hits: Entity<Hit>;
   facets: Entity<Facet>;
   error?: string;
}

export interface SearchParams {
   indexName: string;
   query: string;
   page: number;
   limit?: number;
   filters: Entity<Filter> & {
      preset?: string;
   };
}

export type Entity<Type = any, Extension = ObjectLiteral> = {
   byId: Record<string, Type>;
   allIds: string[];
} & Extension;

export interface Facet {
   handle: string;
   name: string;
   algoliaName: string;
   options: Entity<FacetOption>;
}

export interface FacetOption {
   handle: string;
   value: string;
   totalHitCount: number;
   filteredHitCount: number;
}

export type Filter = FacetFilter | RangeFilter;

interface AbstractFilter {
   id: string;
}

export interface FacetFilter extends AbstractFilter {
   type: 'facet';
   selectedOptions: string[];
}

export interface RangeFilter extends AbstractFilter {
   type: 'range';
   min?: number;
   max?: number;
}

export type SearchEvent<Hit = any> =
   | { type: 'INIT' }
   | { type: 'SET_QUERY'; query: string }
   | { type: 'SET_PAGE'; page: number }
   | { type: 'CLEAR_FILTERS'; filterIds?: string[] }
   | { type: 'ADD_FACET_OPTION_FILTER'; filterId: string; optionId: string }
   | { type: 'SET_FACET_OPTION_FILTER'; filterId: string; optionId: string }
   | { type: 'TOGGLE_FACET_OPTION_FILTER'; filterId: string; optionId: string }
   | { type: 'CLEAR_FACET_OPTION_FILTER'; filterId: string; optionId: string }
   | { type: 'SET_RANGE_FILTER'; filterId: string; min?: number; max?: number }
   | { type: 'CLEAR_SEARCH_PARAMS' }
   | { type: 'SEARCH_CONTEXT_UPDATE'; context: SearchContext<Hit> }
   | { type: 'SEARCH_FAILED'; error: string }
   | { type: 'RETRY' };

export type SearchResponse = Awaited<ReturnType<SearchIndex['search']>>;