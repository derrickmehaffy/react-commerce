import { Box, Flex } from '@chakra-ui/react';
import { GlobalSettings } from '@models/global-settings';
import { Store, StoreListItem } from '@models/store';
import Head from 'next/head';
import * as React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

export interface LayoutProps {
   title: string;
   stores: StoreListItem[];
   currentStore: Store;
   globalSettings: GlobalSettings;
}

export function Layout({
   title,
   stores,
   currentStore,
   globalSettings,
   children,
}: React.PropsWithChildren<LayoutProps>) {
   return (
      <Box>
         <Head>
            <title>{title}</title>
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <Flex direction="column">
            <Header menu={currentStore.header.menu} />
            {children}
            <Footer
               currentStore={currentStore}
               stores={stores}
               globalSettings={globalSettings}
            />
         </Flex>
      </Box>
   );
}