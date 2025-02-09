import { useReducer, useState } from "react";
import InstructorTable from "./component/InstructorTable";
import InstructorEdit from "./component/InstructerEdit";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Instructor } from "./types/instructer-types";
import PaymentForm from "./component/PaymentForm";

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

interface Payment {
  id: string;
  instructorId: string;
  amount: number;
  date: string;
}

interface State {
  instructors: Instructor[];
  selectedInstructor: Instructor | null;
  payments: Payment[];
}

type Action =
  | { type: "SELECT_INSTRUCTOR"; payload: Instructor }
  | { type: "CLOSE_FORM" }
  | { type: "CREATE_INSTRUCTOR"; payload: Instructor }
  | { type: "EDIT_INSTRUCTOR"; payload: Instructor }
  | { type: "DELETE_INSTRUCTOR"; payload: string }
  | { type: "MAKE_PAYMENT"; payload: Payment }
  | { type: "CANCEL_PAYMENT"; payload: string };

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
    case "MAKE_PAYMENT":
      return {
        ...state,
        payments: [...state.payments, action.payload],
      };
    case "CANCEL_PAYMENT":
      return {
        ...state,
        payments: state.payments.filter(
          (payment) => payment.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

function InstructorOverview() {
  const [state, dispatch] = useReducer(reducer, {
    instructors: sampleInstructors,
    selectedInstructor: null,
    payments: [],
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);

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
      {paymentFormOpen && state.selectedInstructor ? (
        <PaymentForm
          instructorId={state.selectedInstructor.id}
          onSave={(payment) => {
            dispatch({ type: "MAKE_PAYMENT", payload: payment });
            setPaymentFormOpen(false);
          }}
          onCancel={() => setPaymentFormOpen(false)}
        />
      ) : null}
      <InstructorTable
        records={state.instructors}
        isFetching={false}
        onRowClicked={(instructor) => {
          dispatch({ type: "SELECT_INSTRUCTOR", payload: instructor });
          open();
        }}
      />
      <button onClick={() => setPaymentFormOpen(true)}>Make Payment</button>
    </div>
  );
}

export default InstructorOverview;
