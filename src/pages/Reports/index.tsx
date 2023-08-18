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
import SaveIcon from "@mui/icons-material/Save";

import { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { LoadingContext } from "../../contexts/LoadingContext";
import { UserContext } from "../../contexts/UserContext";
import api from "../../services/axios";
import {
  rootTimeToShort,
  sumTimeByCreatedAtAtDayWork,
} from "../../utils/dateTime";

export interface IClock {
  id: number;
  clock: string;
  createdAt: string;
}

interface IReportResponse {
  clocks: IClock[];
}

const Reports = () => {
  const [employeeClocksData, setEmpolyeeClocksData] =
    useState<IReportResponse>();

  const toast = useToast();

  const [selectedClock, setSelectedClock] = useState<IClock>();

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

  const updateClock = async () => {
    setLoading(true);

    try {
      const response = await api.put(`employee-clocks/${selectedClock?.id}`, {
        data: {
          clock: selectedClock?.clock,
          user: user?.id,
        },
      });

      if (response.status === 200) {
        toast({
          title: "Ponto atualizado com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        setEmpolyeeClocksData(response.data);
        setSelectedClock(undefined);

        getClocks();
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

  const shortTimeToLong = (time: string) => {
    return `${time}:00.000`;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeDuplicates = () => {
    return Array.from(
      new Set(
        employeeClocksData?.clocks?.map((item) =>
          Intl.DateTimeFormat("pt-BR").format(new Date(item.createdAt))
        )
      )
    );
  };

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
              </Tr>
            </Thead>
            <Tbody border="1px solid #eaeaea">
              {removeDuplicates().map((day) => {
                return (
                  <Tr key={day}>
                    <Td border="1px solid #eaeaea">{day}</Td>

                    <Td border="1px solid #eaeaea">
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
                        .map((clock, index) => {
                          return index % 2 === 0 &&
                            clock.clock &&
                            day ===
                              Intl.DateTimeFormat("pt-BR").format(
                                new Date(clock.createdAt)
                              ) ? (
                            selectedClock?.id === clock.id ? (
                              <Flex padding="12px" gap="16px" key={clock.id}>
                                <Input
                                  type="time"
                                  value={
                                    rootTimeToShort(selectedClock.clock) || ""
                                  }
                                  onChange={(e) => {
                                    setSelectedClock({
                                      ...selectedClock,
                                      clock: shortTimeToLong(e.target.value),
                                    });
                                  }}
                                />

                                <IconButton
                                  aria-label="save"
                                  icon={<SaveIcon />}
                                  onClick={() => {
                                    updateClock();
                                  }}
                                />
                              </Flex>
                            ) : (
                              <Flex padding="12px">
                                <Tooltip label="Editar">
                                  <Tr
                                    cursor="pointer"
                                    key={clock.id}
                                    onClick={() => {
                                      setSelectedClock(clock);
                                    }}
                                  >
                                    {rootTimeToShort(clock.clock)}
                                  </Tr>
                                </Tooltip>
                              </Flex>
                            )
                          ) : null;
                        })}
                    </Td>

                    <Td border="1px solid #eaeaea">
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
                          index % 2 !== 0 &&
                          clock.clock &&
                          day ===
                            Intl.DateTimeFormat("pt-BR").format(
                              new Date(clock.createdAt)
                            ) ? (
                            selectedClock?.id === clock.id ? (
                              <Flex padding="12px" gap="16px" key={clock.id}>
                                <Input
                                  type="time"
                                  value={
                                    rootTimeToShort(selectedClock.clock) || ""
                                  }
                                  onChange={(e) => {
                                    setSelectedClock({
                                      ...selectedClock,
                                      clock: shortTimeToLong(e.target.value),
                                    });
                                  }}
                                />

                                <IconButton
                                  aria-label="save"
                                  icon={<SaveIcon />}
                                  onClick={() => {
                                    updateClock();
                                  }}
                                />
                              </Flex>
                            ) : (
                              <Flex padding="12px">
                                <Tooltip label="Editar">
                                  <Tr
                                    cursor="pointer"
                                    key={clock.id}
                                    onClick={() => {
                                      setSelectedClock(clock);
                                    }}
                                  >
                                    {rootTimeToShort(clock.clock)}
                                  </Tr>
                                </Tooltip>
                              </Flex>
                            )
                          ) : null
                        )}
                    </Td>

                    <Td>
                      {sumTimeByCreatedAtAtDayWork(
                        employeeClocksData?.clocks,
                        day
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Reports;
