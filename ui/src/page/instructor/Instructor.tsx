import { useReducer } from "react";
import InstructorTable from "./component/InstructorTable";
import InstructorEdit from "./component/InstructerEdit";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface Instructor {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  type: "dil terapisi" | "müzik terapisi" | "özel eğitim";
}

const sampleInstructors: Instructor[] = [
  {
    id: crypto.randomUUID(),
    name: "Ali",
    surname: "Yılmaz",
    email: "ali@example.com",
    phone: "123456789",
    type: "dil terapisi",
  },
  {
    id: crypto.randomUUID(),
    name: "Ayşe",
    surname: "Kaya",
    email: "ayse@example.com",
    phone: "987654321",
    type: "müzik terapisi",
  },
];

interface State {
  instructors: Instructor[];
  selectedInstructor: Instructor | null;
}

type Action =
  | { type: "SELECT_INSTRUCTOR"; payload: Instructor }
  | { type: "CLOSE_FORM" }
  | { type: "CREATE_INSTRUCTOR"; payload: Instructor }
  | { type: "EDIT_INSTRUCTOR"; payload: Instructor }
  | { type: "DELETE_INSTRUCTOR"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SELECT_INSTRUCTOR":
      return { ...state, selectedInstructor: action.payload };
    case "CLOSE_FORM":
      return { ...state, selectedInstructor: null };
    case "CREATE_INSTRUCTOR":
      return {
        ...state,
        instructors: [
          ...state.instructors,
          { ...action.payload, id: crypto.randomUUID() },
        ],
      };
    case "EDIT_INSTRUCTOR":
      return {
        ...state,
        instructors: state.instructors.map((inst) =>
          inst.id === action.payload.id ? action.payload : inst
        ),
      };
    case "DELETE_INSTRUCTOR":
      return {
        selectedInstructor: null,
        instructors: state.instructors.filter(
          (inst) => inst.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

function Instructor() {
  const [state, dispatch] = useReducer(reducer, {
    instructors: sampleInstructors,
    selectedInstructor: null,
  });
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      {state.selectedInstructor ? (
        <Modal
          size={"xl"}
          opened={opened}
          onClose={close}
          title="Yeni Randevu"
          centered
        >
          <InstructorEdit
            instructor={state.selectedInstructor}
            onClose={() => {
              close();
              dispatch({ type: "CLOSE_FORM" });
            }}
            onSave={(instructor) => {
              close();
              return instructor.id
                ? dispatch({
                    type: "EDIT_INSTRUCTOR",
                    payload: instructor,
                  })
                : dispatch({
                    type: "CREATE_INSTRUCTOR",
                    payload: instructor,
                  });
            }}
            onDelete={(id) =>
              dispatch({ type: "DELETE_INSTRUCTOR", payload: id })
            }
          />
        </Modal>
      ) : null}
      <InstructorTable
        records={state.instructors}
        isFetching={false}
        onRowClicked={(instructor) => {
          dispatch({ type: "SELECT_INSTRUCTOR", payload: instructor });
          open();
        }}
      />
    </div>
  );
}

export default Instructor;
