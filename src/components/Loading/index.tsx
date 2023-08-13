import { CircularProgress } from "@chakra-ui/react";
import * as S from "./styles";

const Loading = () => {
  return (
    <S.Container>
      <CircularProgress />
    </S.Container>
  );
};

export default Loading;
