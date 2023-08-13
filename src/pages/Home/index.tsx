import { Box, Button, Card, Center, Text } from "@chakra-ui/react";
import lottie from "lottie-web";
import { useEffect, useRef, useState, useContext } from "react";
import lottieSuccess from "../../assets/lotties/success.json";
import { LoadingContext } from "../../contexts/LoadingContext";
import api from "../../services/axios";
import { UserContext } from "../../contexts/UserContext";

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useContext(LoadingContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  const handleRegister = async () => {
    setLoading(true);
    const data = {
      user: user?.id,
      clock: new Date(),
    };

    try {
      const response = await api.post("/employee-clocks", { data: data });

      if (response.status === 200) {
        setIsSuccess(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current && isSuccess) {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData: lottieSuccess,
      });

      return () => {
        animation.destroy();
      };
    }
  }, [isSuccess]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="90vh"
      bg="#f3f4f9"
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        {isSuccess ? (
          <Box display="flex" flexDirection="column">
            <Box ref={containerRef} width="300px" height="300px" />

            <Button
              onClick={() => setIsSuccess(false)}
              colorScheme="blue"
              variant="ghost"
              alignSelf="center"
            >
              Voltar
            </Button>
          </Box>
        ) : isError ? (
          <Text>Erro ao registrar ponto</Text>
        ) : (
          <Center display="flex" flexDirection="column" gap="24px">
            <Text>Registre seu ponto! :)</Text>

            <Card padding="12px 16px">
              <Text fontSize="48px" fontWeight="bold" color="#21254e">
                {date.toLocaleDateString()}
              </Text>
            </Card>

            <Card padding="12px 16px" color="#21254e">
              <Text fontSize="60px" fontWeight="bold">
                {date.toLocaleTimeString()}
              </Text>
            </Card>

            <Button
              onClick={handleRegister}
              _hover={{
                backgroundColor: "#21254e",
                color: "#fff",
                border: "1px solid #21254e",
              }}
              color="#21254e"
              width="100%"
            >
              Registrar
            </Button>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default Home;
