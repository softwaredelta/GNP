// (c) Delta Software 2023, rights reserved.
import ListGroup from "../components/groups/ListGroup";
import Wrapper from "../containers/Wrapper";

export default function Groups(): JSX.Element {
  return (
    <Wrapper>
      <div>
        <h1>Groups</h1>

        <div className=" grid grid-cols-3 place-items-center gap-10">
          <ListGroup
            groups={[
              {
                id: "1",
                name: "Group 1",
                progress: 50,
                image: "https://picsum.photos/200",
              },
              {
                id: "2",
                name: "Group 2",
                progress: 80,
                image: "https://picsum.photos/300",
              },
            ]}
          />
        </div>
      </div>
    </Wrapper>
  );
}
