/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";

import { Edit } from "@mui/icons-material/";

import { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { LoadingContext } from "../../contexts/LoadingContext";
import { UserContext } from "../../contexts/UserContext";
import api from "../../services/axios";

interface IClock {
  id: number;
  clock: string;
  createdAt: string;
}

interface IReportResponse {
  clocks: IClock[];
}

interface ISelectedDate {
  day: string;
  clocks: IClock[] | undefined;
}

const Reports = () => {
  const [employeeClocksData, setEmpolyeeClocksData] =
    useState<IReportResponse>();
  const [selectedDate, setSelectedDate] = useState<ISelectedDate>({
    day: "",
    clocks: [],
  });

  const toast = useToast();

  const [isOpen, setIsOpen] = useState<number | undefined>();

  const { user } = useContext(UserContext);
  const { loading, setLoading } = useContext(LoadingContext);

  const getClocks = async () => {
    setLoading(true);

    try {
      const response = await api.get<IReportResponse>(
        `/users/${user?.id}?populate=*`
      );

      if (response.status === 200) {
        setEmpolyeeClocksData(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateClocks = async () => {
    setLoading(true);

    try {
      const response = await api.put(`employee-clocks/${user.id}`, {
        clocks: selectedDate.clocks,
      });

      if (response.status === 200) {
        toast({
          title: "Ponto atualizado com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        setEmpolyeeClocksData(response.data);
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar o ponto",
        description: "Tente novamente mais tarde",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClocks();
  }, []);

  const rootTimeToShort = (time: string) => {
    return Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(new Date(`2000-01-01T${time}`)));
  };

  const shortTimeToLong = (time: string) => {
    return `${time}:00.000`;
  };

  const days = Array.from(
    new Set(
      employeeClocksData?.clocks.map((item) =>
        Intl.DateTimeFormat("pt-BR").format(new Date(item.createdAt))
      )
    )
  );

  return (
    <Box display="flex" marginTop="40px" justifyContent="center" width="100vw">
      {loading ? (
        <Loading />
      ) : (
        <TableContainer width="80vh" height="90vh">
          <Table border="1px solid #eaeaea" variant="simple">
            <Thead>
              <Tr border="1px solid #eaeaea">
                <Th fontWeight="extrabold" fontSize="md">
                  Data
                </Th>
                <Th fontWeight="extrabold" fontSize="md">
                  Entrada
                </Th>
                <Th fontWeight="extrabold" fontSize="md">
                  Saída
                </Th>
                <Th fontWeight="extrabold" fontSize="md">
                  Total
                </Th>

                <Th fontWeight="extrabold" fontSize="md">
                  Ações
                </Th>
              </Tr>
            </Thead>
            <Tbody border="1px solid #eaeaea">
              {days.map((day) => {
                return (
                  <Tr key={day}>
                    <Td border="1px solid #eaeaea">{day}</Td>

                    <Td>
                      {employeeClocksData?.clocks
                        .sort((a, b) => {
                          if (a > b) {
                            return 1;
                          }
                          if (a < b) {
                            return -1;
                          }
                          return 0;
                        })
                        .map((clock, index) =>
                          index % 2 !== 0 && clock.clock ? (
                            isOpen === clock.id ? (
                              <Input
                                type="time"
                                value={rootTimeToShort(clock.clock)}
                                onChange={(e) => {
                                  setSelectedDate({
                                    ...selectedDate,
                                    clocks: selectedDate.clocks?.map(
                                      (itemToChange) => {
                                        return itemToChange.id === clock.id
                                          ? {
                                              id: itemToChange.id,
                                              clock: shortTimeToLong(
                                                e.target.value
                                              ),
                                              createdAt: itemToChange.createdAt,
                                            }
                                          : itemToChange;
                                      }
                                    ),
                                  });
                                }}
                              />
                            ) : (
                              <Tr
                                key={clock.id}
                                onClick={() => {
                                  setIsOpen(clock.id);
                                }}
                              >
                                {rootTimeToShort(clock.clock)}
                              </Tr>
                            )
                          ) : null
                        )}
                    </Td>

                    <Td border="1px solid #eaeaea">
                      {employeeClocksData?.clocks.map((item, index) => (
                        <Tr key={item.id}>
                          {index % 2 === 0 && item.clock === day
                            ? item.clock
                            : null}
                        </Tr>
                      ))}
                    </Td>

                    <Td>
                      <Flex gap="16px">10:00</Flex>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      {/* <Input
        type="time"
        value={rootTimeToShort(item.clock) || ""}
        onChange={(e) => {
          setSelectedDate({
            ...selectedDate,
            clocks: selectedDate.clocks?.map((itemToChange) => {
              return itemToChange.id === item.id
                ? {
                    id: itemToChange.id,
                    clock: shortTimeToLong(e.target.value),
                    createdAt: itemToChange.createdAt,
                  }
                : itemToChange;
            }),
          });
        }}
      /> */}
    </Box>
  );
};

export default Reports;
