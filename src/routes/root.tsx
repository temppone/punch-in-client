import { Avatar, Box, Flex, Link, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

import LogoutIcon from "@mui/icons-material/Logout";

const Root = () => {
  const navigate = useNavigate();
  const { user, avatar } = useContext(UserContext);

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="center"
        p={4}
        bg="#21254e"
        color="white"
        width="100vw"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="70%"
        >
          <Box display="flex" gap="10">
            <Link
              href="/home"
              _hover={{ textDecoration: "none", color: "white" }}
              _focus={{ outline: "none" }}
            >
              Home
            </Link>

            <Link
              href="/relatorios"
              _hover={{ textDecoration: "none", color: "white" }}
              _focus={{ outline: "none" }}
            >
              Relatórios
            </Link>
          </Box>

          <Box display="flex" gap="2" alignItems="center">
            <Text>{user?.username}</Text>

            <Avatar
              size="sm"
              color="#21254e"
              bg="white"
              name={user?.username}
              src={avatar}
            />

            <Text
              as="button"
              display="flex"
              alignItems="center"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("avatar");
                navigate("/sign-in");
              }}
            >
              <LogoutIcon />
            </Text>
          </Box>
        </Box>
      </Flex>

      <Outlet />
    </>
  );
};

export default Root;
