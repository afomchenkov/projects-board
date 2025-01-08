import BaseLayout from "./BaseLayout";
import Board from "../components/board/Board";
import { useFetch } from "../hooks/useFetch";
import { BOARD_COLUMNS_URL, BOARD_ID } from "../constants";

const BoardPage = () => {
  const url = `${BOARD_COLUMNS_URL}?boardId=${BOARD_ID}`;
  const { data, isPending, error } = useFetch(url);

  if (error) {
    return <h1>Failed to fetch board columns</h1>;
  }

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  return (
    <BaseLayout title={<h1>Board Page</h1>}>
      {data?.items && <Board columns={data.items} />}
    </BaseLayout>
  );
};

export default BoardPage;
