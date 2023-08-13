import { Box, Button, FormLabel, Heading, Input, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaMicrosoft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { UserContext } from "../../contexts/UserContext";
import api from "../../services/axios";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = () => {
    const authUrl = "http://localhost:1337/api/connect/microsoft";

    window.location.href = authUrl;
  };

  const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (formData: z.infer<typeof signInSchema>) => {
    interface IAuthLocalResponse {
      jwt: string;
      user: {
        id: number;
        username: string;
        avatar: string;
      };
    }

    setIsLoading(true);

    const data = {
      identifier: formData.email,
      password: formData.password,
    };

    try {
      const response = await api.post<IAuthLocalResponse>(
        "/auth/local?populate=*",
        data
      );

      if (response.data.jwt) {
        setUser({
          id: response.data.user.id.toString(),
          username: response.data.user.username,
        });

        localStorage.setItem("user", JSON.stringify(response.data.user));

        localStorage.setItem("access_token", response.data.jwt);

        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
    >
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="#21254e"
      >
        <Heading mb={4} color="white">
          Login
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLabel color="white">Email</FormLabel>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input
                type="email"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                isInvalid={!!errors.email}
              />
            )}
          />

          <Text color="red.500">{errors?.email?.message}</Text>

          <FormLabel color="white" mt={4}>
            Senha
          </FormLabel>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input
                type="password"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                isInvalid={!!errors.password}
              />
            )}
          />

          <Text color="red.500">{errors?.password?.message}</Text>

          <Box display="flex" gap="16px" flexDir="column">
            <Button
              type="submit"
              bg="white"
              color="#21254e"
              _hover={{
                bg: "white.300",
                border: "1px solid #e30613 ",
              }}
              mt={4}
              width="100%"
              isLoading={isLoading}
            >
              Entrar
            </Button>

            <Button
              width="100%"
              colorScheme="blue"
              leftIcon={
                <Box fontSize="24px">
                  <FaMicrosoft />
                </Box>
              }
              onClick={handleLogin}
              size="md"
            >
              Login com Microsoft
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default SignIn;
