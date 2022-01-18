import {
   Avatar,
   Flex,
   Icon,
   IconProps,
   Link,
   Menu,
   MenuButton,
   MenuDivider,
   MenuGroup,
   MenuItem,
   MenuList,
   Text,
   VStack,
} from '@chakra-ui/react';
import { IFIXIT_ORIGIN } from '@config/env';
import { useAuthenticatedUser } from '@lib/api';
import * as React from 'react';

const ANIMATION_DURATION = '300ms';

export function UserMenu() {
   const { user } = useAuthenticatedUser();

   return (
      <Flex>
         {user ? (
            <Menu>
               <MenuButton
                  aria-label="Open user menu"
                  borderRadius="full"
                  _focus={{
                     boxShadow: 'outline',
                     outline: 'none',
                  }}
               >
                  <Avatar
                     name={user.username}
                     src={user.thumbnail || undefined}
                     size="sm"
                  />
               </MenuButton>
               <MenuList color="black">
                  <VStack align="flex-start" px="0.8rem" py="0.4rem">
                     <Text color="trueGray.900" fontWeight="semibold">
                        {user.username}
                     </Text>
                     <Text color="trueGray.700">@{user.handle}</Text>
                  </VStack>
                  <MenuDivider />
                  <MenuGroup>
                     <MenuItem
                        as="a"
                        href={`${IFIXIT_ORIGIN}/User/Notifications/${user.id}/${user.username}`}
                        fontSize="sm"
                     >
                        Notifications
                     </MenuItem>
                     <MenuItem
                        as="a"
                        fontSize="sm"
                        href={`${IFIXIT_ORIGIN}/User/${user.id}/${user.username}`}
                     >
                        View Profile
                     </MenuItem>
                     <MenuItem
                        as="a"
                        fontSize="sm"
                        href={`${IFIXIT_ORIGIN}/User/Orders`}
                     >
                        Orders
                     </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup>
                     <MenuItem
                        as="a"
                        fontSize="sm"
                        href={`${IFIXIT_ORIGIN}/Guide/logout`}
                     >
                        Log Out
                     </MenuItem>
                  </MenuGroup>
               </MenuList>
            </Menu>
         ) : (
            <Link
               borderRadius="full"
               href={`${IFIXIT_ORIGIN}/login`}
               display="flex"
               alignItems="center"
            >
               <NoUserIcon
                  transition={`color ${ANIMATION_DURATION}`}
                  _hover={{
                     color: 'brand.300',
                  }}
               />
            </Link>
         )}
      </Flex>
   );
}

export const NoUserIcon = ({ color = 'white', ...otherProps }: IconProps) => (
   <Icon
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      w="33px"
      h="33px"
      color={color}
      {...otherProps}
   >
      <path
         d="M16.2571 32.5C25.0936 32.5 32.2571 25.3366 32.2571 16.5C32.2571 7.66344 25.0936 0.5 16.2571 0.5C7.42052 0.5 0.25708 7.66344 0.25708 16.5C0.25708 25.3366 7.42052 32.5 16.2571 32.5Z"
         fill="currentColor"
         fillOpacity="0.14"
      />
      <path
         d="M24 25V23C24 21.9391 23.5786 20.9217 22.8284 20.1716C22.0783 19.4214 21.0609 19 20 19H12C10.9391 19 9.92172 19.4214 9.17157 20.1716C8.42143 20.9217 8 21.9391 8 23V25"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M16 15C18.2091 15 20 13.2091 20 11C20 8.79086 18.2091 7 16 7C13.7909 7 12 8.79086 12 11C12 13.2091 13.7909 15 16 15Z"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </Icon>
);